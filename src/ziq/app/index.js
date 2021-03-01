const { snakeCase, paramCase } = require("change-case");

const { createHandler } = require("../handler");
const { createQueue } = require("../queue");

function createApp() {
  const _chunks = new Map();
  const _chunksQueue = createQueue();
  const _slots = new Map();
  let _status = "initial";

  const _setStatus = {
    running: () => (_status = "running"),
  };

  const _isStatus = {
    initial: () => _status === "initial",
    running: () => _status === "running",
  };

  const _createChunk = (payload) => {
    const _type = payload.type;
    const _slotName = payload.slotName;
    const callback = payload.callback;

    const _handler = createHandler({
      prev: (args) => _slots.get(_slotName),
      main: (args, prev) => callback(args, prev),
      post: (args, main, prev) => {
        if (_type === "set" && main !== prev) {
          _slots.set(_slotName, main);
        }
      },
    });

    const _callback = (...args) => {
      if (_isStatus.initial()) throw new Error("App didn't running");
      const _handlerWrapper = async (...args) => (await _handler(...args)).main;
      const _handlerResult = _chunksQueue
        .add(_handlerWrapper, args)
        .get(_handlerWrapper);
      _chunksQueue.wait();
      return _handlerResult;
    };

    _chunks.set(callback, { _type, _slotName, _handler, _callback });
  };

  const _app = {
    createChunk: (callback) => {
      if (_isStatus.initial() === false) throw new Error("App is running");
      if (_chunks.has(callback)) return _app;

      const _chunkMeta = getChunkMeta(callback);
      _createChunk({
        type: _chunkMeta.type,
        slotName: _chunkMeta.slotName,
        callback,
      });

      return _app;
    },
    getChunk: (callback) => {
      if (_chunks.has(callback)) return _chunks.get(callback)._callback;
      throw new Error("Chunk doesn't exist");
    },
    run: () => {
      _setStatus.running();
      return _app;
    },
    status: () => {
      return _status;
    },
    serialize: async () => {
      await _chunksQueue.wait();
      const _result = {};
      Array.from(_slots).forEach(([_slotName, _value]) => {
        _result[_slotName] = _value;
      });
      return _result;
    },
    deserialize: async (data, callback) => {
      if (_isStatus.running()) throw new Error("App is running already");
      const _callback =
        callback instanceof Function ? callback : (value) => value;
      const dataKeys = Object.keys(data);
      for (let index = 0; index < dataKeys.length; index += 1) {
        const dataKey = dataKeys[index];
        _slots.set(dataKey, await _callback(data[dataKey], dataKey));
      }
    },
  };

  return _app;
}

function getChunkMeta(callback) {
  if (typeof callback !== "function") {
    throw new Error("Callback is incorrect");
  }
  if (callback.name.length === 0) {
    throw new Error("Callback has incorrect name");
  }

  const _callbackName = snakeCase(callback.name).split("_");
  if (
    _callbackName.length < 2 ||
    (_callbackName[0] !== "set" && _callbackName[0] !== "get")
  ) {
    throw new Error("Callback has incorrect name");
  }

  const [_type, ..._slotNames] = _callbackName;
  const _slotName = paramCase(_slotNames.join("_"));

  if (_slotName.length === 0) {
    throw new Error("Name of slot is incorrect");
  }

  return { type: _type, slotName: _slotName };
}

function getters(payload) {
  const _app = payload.app;
  const _chunks = payload.chunks;
  const _getters = {};

  _chunks.forEach((callback) => {
    const { type, slotName } = getChunkMeta(callback);
    if (type !== "get") throw new Error("Chunk doesn't have 'get' type");
    _getters[slotName] = _app.getChunk(callback);
  });

  return _getters;
}

function setters(payload) {
  const _app = payload.app;
  const _chunks = payload.chunks;
  const _setters = {};

  _chunks.forEach((callback) => {
    const { type, slotName } = getChunkMeta(callback);
    if (type !== "set") throw new Error("Chunk doesn't have 'set' type");
    _setters[slotName] = _app.getChunk(callback);
  });

  return _setters;
}

module.exports = { createApp, getters, setters };
