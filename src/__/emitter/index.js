function emitter() {
  const callbacks = new Set();
  const result = {
    call: (value) => {
      callbacks.forEach((callback) => callback(value));
      return result;
    },
    on: (callback) => {
      callbacks.add(callback);
      return result;
    },
    off: (callback) => {
      callbacks.delete(callback);
      return result;
    },
  };

  Object.freeze(result);

  return result;
}

module.exports = { emitter };
