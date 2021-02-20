function createContext() {
  const types = new Map();
  const stores = new Map();

  const type = (typeCallback) => {
    if (typeCallback.name.length) {
      if (types.has(typeCallback.name) === false) {
        const _type = (value) => {
          const result = typeCallback(value);
          return result;
        };

        types.set(typeCallback.name, _type);

        return _type;
      }
      throw new Error("Type exist already");
    }
    throw new Error("Callback of label is incorrect");
  };

  const store = (_type, storeCallack) => {
    if (_type.name === "_type") {
      if (storeCallack.name.length) {
        console.log(storeCallack.name);

        const _store = () => {};

        stores.set(storeCallack, _store);

        return _store;
      }
      throw new Error("Callack of store is incrorrect");
    }
    throw new Error("Type is incorrrect");
  };

  const contextCallbackPayload = { type, store };

  const _createContext = (createContextCallback) => {
    const createContextCallbackResult = createContextCallback(
      contextCallbackPayload
    );

    return createContextCallbackResult;
  };

  return _createContext;
}

module.exports = { createContext };
