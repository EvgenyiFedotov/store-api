function createHandler(payload) {
  if (payload instanceof Object === false) {
    throw new Error("Payload of createHandler isn't object");
  }
  if (payload.main instanceof Function === false) {
    throw new Error("Handler of createHandler isn't function");
  }

  const _prev = async (args) => {
    if (payload.prev) return payload.prev(args);
  };
  const _main = payload.main;
  const _post = async (args, main, prev) => {
    if (payload.post) return payload.post(args, main, prev);
  };

  const _handler = async (...args) => {
    const prev = await _prev(args);
    const main = await _main(args, prev);
    const post = await _post(args, main, prev);
    return { prev, main, post };
  };

  return _handler;
}

module.exports = { createHandler };
