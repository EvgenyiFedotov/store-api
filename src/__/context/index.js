const { emitter } = require("../emitter");

function context() {
  const storeConfigs = new Map();
  const stores = new Map();
  const fnConfigs = new Map();
  const fns = new Map();

  const storeState = ({ init, type }) => {
    const _type = type || (() => true);

    if (_type(init) === false) {
      throw new Error("Init state of the store is incorrect");
    }

    const _change = emitter();
    let _state = init;
    const _methods = {
      get: () => {
        return _state;
      },
      set: (state) => {
        const prevState = _methods.get();
        let nextState = prevState;

        if (typeof state === "function") {
          nextState = state(prevState);
        } else {
          nextState = state;
        }

        if (_type(nextState) && prevState !== nextState) {
          _state = nextState;
          _change.call(nextState);
          return nextState;
        }

        return prevState;
      },
      reset: () => {
        return _methods.set(init);
      },
    };

    return { change: _change, methods: _methods };
  };

  const storeApi = (_api) => {
    const _apiKeys = Object.keys(_api);
    const _runAfter = {};
    const _storeApi = {};

    for (let index = 0; index < _apiKeys.length; index += 1) {
      const _apiKey = _apiKeys[index];

      _runAfter[_apiKey] = emitter();
      _storeApi[_apiKey] = (...params) => {
        const result = _api[_apiKey](...params);

        _runAfter[_apiKey].call({ params, result });

        return result;
      };
    }

    return { runAfter: _runAfter, storeApi: _storeApi };
  };

  const store = (contextLabel, publicKey) => {
    let _store = stores.get(contextLabel);

    if (_store && _store.public[publicKey]) {
      return _store.public[publicKey];
    }

    const _storeConfig = storeConfigs.get(contextLabel);

    if (_storeConfig === undefined) {
      throw new Error("Config of the store doesn't exist");
    }

    const _state = storeState({
      init: _storeConfig.init,
      type: _storeConfig.type,
    });
    const _api = _storeConfig.methods(_state.methods);
    const _storeApi = storeApi(_api);

    _store = {
      state: _state,
      api: _api,
      public: {
        store: { on: _state.change.on, off: _state.change.off },
        storeApi: _storeApi.storeApi,
        storeApiListen: _storeApi.runAfter,
      },
    };

    stores.set(contextLabel, _store);

    return _store.public[publicKey] || null;
  };

  const instance = {
    attachStoreConfig: (contextLabel, storeConfig) => {
      const isStoreConfig =
        typeof contextLabel === "function" &&
        typeof storeConfig.type === "function" &&
        typeof storeConfig.methods === "function" &&
        "init" in storeConfig;

      if (isStoreConfig === false) {
        throw new Error("Args is incorrect for attachStoreConfig");
      }

      const _storeConfig = storeConfigs.get(contextLabel);

      if (_storeConfig === undefined) {
        storeConfigs.set(contextLabel, storeConfig);
        return storeConfig;
      }

      if (_storeConfig === storeConfig) {
        return _storeConfig;
      }

      throw new Error("The store does have other config");
    },
    store: (contextLabel) => {
      return store(contextLabel, "store");
    },
    storeApi: (contextLabel) => {
      return store(contextLabel, "storeApi");
    },
    storeApiListen: (contextLabel) => {
      return store(contextLabel, "storeApiListen");
    },

    attachFnConfig: (contextFn, fnConfig) => {
      const isFnConfig =
        typeof contextLabel === "function" &&
        typeof fnConfig.callback === "function";

      if (isFnConfig === false) {
        throw new Error("Args is incorrect for attachStoreConfig");
      }

      const _fnConfig = fnConfigs.get(contextFn);

      if (_fnConfig === undefined) {
        fnConfigs.set(contextFn, fnConfig);
        return fnConfig;
      }

      if (_fnConfig === fnConfig) {
        return _fnConfig;
      }

      throw new Error("The fn does have other config");
    },

    fnCallback: (contextFn) => {
      let _fn = fns.get(contextFn);

      if (_fn) {
        return _fn.callback;
      }

      const _fnConfig = fnConfigs.get(contextFn);

      if (_fnConfig === undefined) {
        throw new Error("Config of the store doesn't exist");
      }

      _fn = {
        status: "initial", // "initial" | "done" | "fail"
        result: undefined,
        error: undefined,
        args: null,
        callback: async (...args) => {
          if (_fn.status === "done") {
            return result;
          }

          try {
            _fn.args = args;

            const result = await _fnConfig.callback({
              context: instance,
              args,
            });

            _fn.status = "done";

            return result;
          } catch (error) {
            _fn.error = error;
            _fn.status = "fail";
          }
        },
      };

      fns.set(contextFn, _fn);

      return _fn.callback;
    },
  };

  return instance;
}

module.exports = { context };
