const { createEmitter } = require("../emitter");

function createContext() {
  const labels = new Map();

  const label = (callback) => {
    if (callback.name.length) {
      // console.log(callback.name);

      if (labels.has(callback.name)) {
        return labels.get(callback.name)._label;
      }

      const _config = {
        api: null,
        isInit: false,
        init: undefined,
        state: undefined,
        store: null,
        isCheckType: false,
        checkType: () => true,
        storeEmitter: null,
        storeOnOff: null,
        apiEmitters: null,
        apiOnOff: null,
        meta: null,
        setMeta: null,
      };

      const payload = {
        args: [],
        useApi: (api) => {
          if (_config.api) return _config.api;
          if (typeof api === "object") {
            _config.api = api;
            return _config.api;
          }
          throw new Error("");
        },
        useStore: (state) => {
          if (_config.isInit) return _config.store;
          _config.isInit = true;
          _config.init = state;
          _config.state = state;
          _config.store = {
            get: () => _config.state,
            set: (state) => {
              const prevState = _config.store.get();
              let nextState = prevState;

              if (typeof state === "function") {
                nextState = state(prevState);
              } else {
                nextState = state;
              }

              if (_config.checkType(nextState) === false) {
                throw new Error("Next state is incorrect type");
              }

              if (prevState !== nextState) {
                _config.state = nextState;
                if (_config.storeEmitter) _config.storeEmitter.call(nextState);
                return nextState;
              }

              return prevState;
            },
            reset: () => _config.store.set(_config.init),
          };
          return _config.store;
        },
        useCheckType: (checkType) => {
          if (_config.isCheckType) return _config.checkType;
          if (typeof checkType === "function") {
            _config.isCheckType = true;
            _config.checkType = checkType;
            return _config.checkType;
          }
          throw new Error("CheckType isn't function");
        },
        useListenStore: () => {
          if (_config.storeOnOff) {
            return _config.storeOnOff;
          }
          _config.storeEmitter = createEmitter();
          _config.storeOnOff = {
            on: (cb) => {
              _config.storeEmitter.on(cb);
              return _config.storeOnOff;
            },
            off: (cb) => {
              _config.storeEmitter.off(cb);
              return _config.storeOnOff;
            },
          };
          return _config.storeOnOff;
        },
        useListenApi: () => {
          if (_config.api) {
            if (_config.apiOnOff) {
              return _config.apiOnOff;
            }
            _config.apiEmitters = {};
            _config.apiOnOff = {};
            const apiKeys = Object.keys(_config.api);
            for (let index = 0; index < apiKeys.length; index += 1) {
              const apiKey = apiKeys[index];
              _config.apiEmitters[apiKey] = createEmitter();
              _config.apiOnOff[apiKey] = {
                on: (cb) => {
                  _config.apiEmitters[apiKey].on(cb);
                  return _config.apiOnOff[apiKey];
                },
                off: (cb) => {
                  _config.apiEmitters[apiKey].off(cb);
                  return _config.apiOnOff[apiKey];
                },
              };
              const _apiMethod = _config.api[apiKey];
              _config.api[apiKey] = (...params) => {
                const result = _apiMethod(...params);
                _config.apiEmitters[apiKey].call({ params, result });
                return result;
              };
            }
            return _config.apiOnOff;
          }
          throw new Error("Api doesn't exist");
        },
        useMeta: (meta) => {
          if (_config.setMeta) return [_config.meta, _config.setMeta];
          _config.meta = meta;
          _config.setMeta = (meta) => {
            _config.meta = meta;
            return meta;
          };
          return [_config.meta, _config.setMeta];
        },
      };

      const _label = (...args) => {
        payload.args = args;
        return callback(payload);
      };

      labels.set(callback.name, {
        _config,
        payload,
        _label,
      });

      return _label;
    }

    throw new Error("Label is incorrect");
  };

  return { label };
}

module.exports = { createContext };
