// const { createQueue } = require("../queue");
const { createHandler } = require("../handler");

function createApp(payload) {
  const _payload = payload instanceof Object ? payload : {};
  const _data = _payload.data instanceof Object ? _payload.data : {};

  if (_payload.chunks instanceof Object === false) {
    throw new Error("Chunks of app is empty");
  }

  const _chunks = new Map();
  const _slots = new Map();
  // const _queue = createQueue();

  const _chunkKeys = Object.keys(_payload.chunks);
  for (let index = 0; index < _chunkKeys.length; index += 1) {
    const _slotKey = _slotKey[index];
    const _chunkConfig = _payload.chunks[_slotKey];
    const _handler = createHandler({
      prev: () => {},
      main: () => {},
      post: () => {},
    });
  }

  const _app = {};

  return _app;
}

module.exports = { createApp };
