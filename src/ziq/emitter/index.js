function createEmitter() {
  const callbacks = new Set();
  const result = {
    call: (value) => {
      callbacks.forEach((callback) => callback(value));
      return result;
    },
    subscribe: (callback) => {
      callbacks.add(callback);
      return result;
    },
    unsubscribe: (callback) => {
      callbacks.delete(callback);
      return result;
    },
  };

  Object.freeze(result);

  return result;
}

module.exports = { createEmitter };
