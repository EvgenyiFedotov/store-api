function label(callback) {
  if (callback.name.length) {
    console.log(callback.name);

    let _api = null;

    const payload = {
      args: [],
      useApi: (api) => {
        if (_api) return _api;
        _api = api;
        return _api;
      },
    };

    const _label = (...args) => {
      payload.args = args;

      return callback(payload);
    };

    return _label;
  }

  throw new Error("Label is incorrect");
}

module.exports = { label };
