const { createEmitter } = require("../emitter");

function createWaiter() {
  const _pending = new Map();
  const _emitter = createEmitter();
  const _t = new Set();

  // TODO Without callback, onty promises
  const _waiter = {
    add: async (callback, args) => {
      if (_pending.has(callback)) return _pending.get(callback);
      const _args = args instanceof Array ? args : [];
      const _callbackResult = callback(..._args);
      _pending.set(callback, _callbackResult);
      try {
        return await _callbackResult;
      } catch (error) {
        // pass
      } finally {
        _pending.delete(callback);
        _emitter.call();
      }
    },
    addPromise: (promise) => {},
    count: () => _pending.size,
    wait: () =>
      new Promise((resolve) =>
        _emitter.subscribe(() => {
          if (_pending.size === 0) resolve();
        })
      ),
  };

  return _waiter;
}

module.exports = { createWaiter };
