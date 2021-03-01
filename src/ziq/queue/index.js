const { createPromiseObject } = require("../promise-object");

function createQueue() {
  const _map = new Map();
  let _waiting = null;

  const _queue = {
    add: (callback, args) => {
      try {
        _queue.get(callback);
        return _queue;
      } catch (error) {
        // pass
      }

      const _args = args instanceof Array ? args : [];
      const _callbackPromise = createPromiseObject();
      const _callback = async (...args) => {
        try {
          _callbackPromise.resolve(await callback(...args));
        } catch (error) {
          _callbackPromise.reject(error);
        } finally {
          _map.delete(callback);
        }
      };
      _map.set(callback, { _args, _callbackPromise, _callback });

      return _queue;
    },
    get: (callback) => {
      if (_map.has(callback)) {
        return _map.get(callback)._callbackPromise.instance;
      }
      throw new Error("Callback doesn't exist in queue");
    },
    next: () => {
      const _next = _map.entries().next();
      if (_next.done) {
        return { value: undefined, done: true };
      } else {
        const [, { _callback, _callbackPromise, _args }] = _next.value;
        _callback(..._args);
        return { value: _callbackPromise.instance, done: false };
      }
    },
    wait: () => {
      if (_waiting) return _waiting;
      _waiting = new Promise(function _wait(resolve) {
        const next = _queue.next();
        if (next.done) {
          _waiting = null;
          resolve();
        } else {
          next.value.then(() => _wait(resolve));
        }
      });
      return _waiting;
    },
    size: () => {
      return _map.size;
    },
  };

  return _queue;
}

module.exports = { createQueue };
