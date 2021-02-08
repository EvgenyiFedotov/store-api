const { getCurrentWithCheck } = require("../stack");

function storeApi(payload) {
  const init = payload.init;
  const getApi = payload.api;
  const checkType = payload.checkType || (() => true);

  if (getApi instanceof Function === false) {
    throw new Error("Api of storeApi is incorrect");
  }

  const _storeApi = () => ({ init, getApi, checkType, _storeApi });

  return _storeApi;
}

function label(storeApi) {
  if (Boolean(storeApi) === false) {
    throw new Error("StoreApi of label is empty");
  }

  if (storeApi.name !== "_storeApi") {
    throw new Error("StoreApi of label is incorrect");
  }

  const _label = () => ({ ...storeApi(), _label });

  return _label;
}

function _attachStore(label) {
  const { init, checkType, getApi, _label } = label();

  if (checkType(init) === false) {
    throw new Error("Init state of store is incorrect type.");
  }

  const context = getCurrentWithCheck();
  let _store = context.stores.get(_label);

  if (_store) return _store;

  _store = {
    _label: _label,
    init: init,
    state: init,
    getApi: getApi,
    checkType: checkType,
    getState: () => {
      return _store.state;
    },
    setState: (state) => {
      const prevState = _store.getState();
      let nextState = prevState;

      if (typeof state === "function") {
        nextState = state(prevState);
      } else {
        nextState = state;
      }

      if (checkType(nextState) === false) {
        throw new Error("Next state of store is incorrect type.");
      }

      if (prevState !== nextState) {
        _store.state = nextState;
        _store._listeners.callbacks.store.forEach((listener) => {
          listener(nextState);
        });
        return nextState;
      }

      return prevState;
    },
    reset: () => {
      return _store.setState(_store.init);
    },
    _listeners: null,
    _api: null,
    _apiWrappers: null,
    api: () => {
      if (_store._apiWrappers) return _store;

      _store._listeners = {
        callbacks: { store: new Set(), api: {} },
        methods: { store: {}, api: {} },
      };
      _store._api = getApi({
        getState: _store.getState,
        setState: _store.setState,
        reset: _store.reset,
      });
      _store._apiWrappers = {};
      _store._listeners.methods.store.on = (callback) => {
        _store._listeners.callbacks.store.add(callback);
      };
      _store._listeners.methods.store.off = (callback) => {
        _store._listeners.callbacks.store.delete(callback);
      };

      const apiKeys = Object.keys(_store._api);

      for (let index = 0; index < apiKeys.length; index += 1) {
        const apiKey = apiKeys[index];

        _store._listeners.callbacks.api[apiKey] = {
          before: new Set(),
          after: new Set(),
        };
        _store._apiWrappers[apiKey] = (...params) => {
          _store._listeners.callbacks.api[apiKey].before.forEach((listener) =>
            listener({ params })
          );

          const result = _store._api[apiKey](...params);

          _store._listeners.callbacks.api[apiKey].after.forEach((listener) =>
            listener({ params, result })
          );

          return result;
        };
        _store._listeners.methods.api[apiKey] = {
          before: {
            on: (callback) => {
              _store._listeners.callbacks.api[apiKey].before.add(callback);
            },
            off: (callback) => {
              _store._listeners.callbacks.api[apiKey].before.delete(callback);
            },
          },
          after: {
            on: (callback) => {
              _store._listeners.callbacks.api[apiKey].after.add(callback);
            },
            off: (callback) => {
              _store._listeners.callbacks.api[apiKey].after.delete(callback);
            },
          },
        };
      }

      return _store;
    },
  };

  context.stores.set(_label, _store);

  return _store;
}

function api(label) {
  if (Boolean(label) === false) {
    throw new Error("Label of api is empty");
  }

  if (label.name !== "_label") {
    throw new Error("Label of api is incorrect");
  }

  const _api = () => _attachStore(label).api()._apiWrappers;

  return _api;
}

function listen(label) {
  if (Boolean(label) === false) {
    throw new Error("Label of listen is empty");
  }

  if (label.name !== "_label") {
    throw new Error("Label of listen is incorrect");
  }

  const _api = () => _attachStore(label).api()._listeners.methods;

  return _api;
}

function full(label) {
  if (Boolean(label) === false) {
    throw new Error("Label of full is empty");
  }

  if (label.name !== "_label") {
    throw new Error("Label of full is incorrect");
  }

  let _cache = null;
  const _full = () => {
    if (_cache) return _cache;

    _cache = {
      api: api(label)(),
      listen: listen(label)(),
    };

    return _cache;
  };

  return _full;
}

function attach({ context, source }) {
  return context(() => {
    const sourceKeys = Object.keys(source);
    const result = {};

    for (let index = 0; index < sourceKeys.length; index += 1) {
      const sourceKey = sourceKeys[index];

      result[sourceKey] = source[sourceKey]();
    }

    return result;
  });
}

function _handlerWrapper(handler) {
  let _resolve, _reject;
  const _result = new Promise((resolve, reject) => {
    _resolve = resolve;
    _reject = reject;
  });

  let isRun = false;

  const _handler = async (...args) => {
    if (isRun) return _result;

    isRun = true;

    try {
      const result = handler(...args);
      _resolve(result);
      return result;
    } catch (error) {
      _reject(error);
    }
  };

  return { result: _result, handlerWrapper: _handler };
}

// function _attachUse({ context, depends, handler, side }) {
//   const toBoth = side === undefined || side === "both";
//   const toServer = side === "server";
//   const toClient = side === "client";

//   const isServer = typeof window === undefined;
//   const isClient = isServer === false;

//   const { result, handlerWrapper } = _handlerWrapper(handler);
//   const _useState = {
//     handler: handlerWrapper,
//     handlerResult: result,
//   };

//   return _useState;
// }

// function use({ depends, handler, side }) {
//   const _use = () => {
//     const context = getCurrentWithCheck();
//     let _useState = context.uses.get(_use);

//     if (_useState) return;

//     _useState = _attachUse({ context, depends, handler, side });
//     context.uses.set(_use, _useState);
//   };

//   return _use;
// }

module.exports = {
  storeApi,
  label,
  api,
  listen,
  full,
  attach,
};
