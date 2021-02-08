function createContext() {
  const instance = {
    stores: new Map(),
  };
  let instancePublic = null;

  const context = () => {
    if (instancePublic) return instancePublic;
    instancePublic = {};
    return instancePublic;
  };

  return context;
}

module.exports = { createContext };
