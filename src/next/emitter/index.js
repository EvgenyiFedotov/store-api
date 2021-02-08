function emitter() {
  const _instance = {
    callbacks: new Set(),
    on: (callback) => {
      _instance.callbacks.add(callback);
    },
    off: (callback) => {
      _instance.callbacks.delete(callback);
    },
  };

  const _emitter = () => ({
    callbacks: _instance.callbacks,
    on: _instance.on,
    off: _instance.off,
  });

  return _emitter;
}
