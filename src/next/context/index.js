const { stackScope } = require("../stack");

function context() {
  const _contextInstance = {
    stores: new Map(),
  };

  return stackScope(_contextInstance);
}

module.exports = { context };
