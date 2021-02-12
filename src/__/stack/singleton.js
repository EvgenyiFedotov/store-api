const {} = require("./index");

const _stack = createStackInstance();

function getStack() {
  return _stack;
}

function getCurrent() {
  return getStack().current;
}

function getCurrentWithCheck() {
  const current = getCurrent();

  if (current === null) throw new Error("Context doesn't exist.");

  return current;
}

module.exports = {
  getStack,
  getCurrent,
  getCurrentWithCheck,
};
