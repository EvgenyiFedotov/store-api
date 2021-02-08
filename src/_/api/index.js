function createApi(getMethods) {
  const instance = {
    getMethods,
  };
  let instancePublic = null;

  const api = () => {
    if (instancePublic) return instancePublic;
    instancePublic = {
      getMethods: instance.getMethods,
    };
    Object.freeze(instancePublic);
    return instancePublic;
  };

  return api;
}

module.exports = { createApi };
