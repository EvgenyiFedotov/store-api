const { createEmitter } = require("../emitter");

function createQueue() {
  const _map = new Map();
  const _stack = [];
  let _status = "initial";
  const _emitter = createEmitter();

  const _emitWrap = (event) => (callback) => (...args) => {
    const result = callback(...args);
    _emitter.call(event);
    return result;
  };

  const _setStatusWrapper = _emitWrap({ type: "status-changed" });

  const _setStatus = {
    pending: _setStatusWrapper(() => {
      if (_stack.length) _status = "pending";
      else _setStatus.done;
    }),
    pause: _setStatusWrapper(() => {
      if (_stack.length) _status = "pause";
      else _setStatus.done;
    }),
    done: _setStatusWrapper(() => (_status = "done")),
  };

  const _runNext = (runNextPayload) => {
    const _runNextPayload = runNextPayload || {};
    const _force =
      typeof _runNextPayload.force === "boolean"
        ? _runNextPayload.force
        : false;

    if (_status === "pending" || _force) {
      if (_stack.length) {
        const _next = _stack[0];
        _emitter.call({ type: "initial-callack" });
        _next._callback(..._next._args);
        return _next._promise;
      }

      _setStatus.done();
      return null;
    }
    return null;
  };

  const _queue = {
    add: (callback, args) => {
      try {
        _queue.get(callback);
        return _queue;
      } catch (error) {
        // pass
      }

      const _args = args instanceof Array ? args : [];

      let _resolve, _reject;
      const _promise = new Promise((resolve, reject) => {
        _resolve = resolve;
        _reject = reject;
      });

      const _callback = async (...args) => {
        try {
          const callbackResult = await callback(...args);
          _resolve(callbackResult);
        } catch (error) {
          _reject(error);
        } finally {
          _map.delete(callback);
          _stack.shift();
          _runNext();
        }
      };
      const _data = { _resolve, _reject, _promise, _callback, callback, _args };
      _map.set(callback, _data);
      _stack.push(_data);
      _emitter.call({ type: "callback-added" });
      _queue.start();

      return _queue;
    },
    get: (callback) => {
      if (_map.has(callback)) return _map.get(callback)._promise;
      throw new Error("Callback doesn't exist in queue");
    },
    next: () => _runNext({ force: true }), // ?
    wait: async () => {
      if (_stack.length) {
        await _stack[_stack.length - 1]._promise;
      }
    },
    size: () => {
      _emitter.call({ type: "size-got" });
      return _stack.length;
    },
    status: () => {
      return _status;
    },
    start: () => {
      _setStatus.pending();
      _runNext();
      return _queue;
    },
    pause: () => {
      _status = "pause";
      return _queue;
    },
    subscribe: _emitter.subscribe,
    unsubscribe: _emitter.unsubscribe,
  };

  return _queue;
}

module.exports = { createQueue };
