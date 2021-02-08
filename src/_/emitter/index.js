function createEmitter() {
  const instance = {
    callbacks: new Set(),
    call: (value) => {
      instance.callbacks.forEach((callback) => callback(value));
      return getEmitterPublic();
    },
    on: (callback) => {
      instance.callbacks.add(callback);
      return getEmitterPublic();
    },
    off: (callback) => {
      instance.callbacks.delete(callback);
      return getEmitterPublic();
    },
  };

  let instancePublic = null;

  const getEmitterPublic = () => {
    if (instancePublic) return instancePublic;
    instancePublic = {
      call: instance.call,
      on: instance.on,
      off: instance.off,
    };
    Object.freeze(instancePublic);
    return instancePublic;
  };

  const emitter = () => getEmitterPublic();

  return emitter;
}

module.exports = { createEmitter };
