function createStackInstance() {
  const instance = {
    stack: [],
    current: null,
    add: (context) => {
      instance.stack.unshift(context);
      instance.current = instance.stack[0];
    },
    remove: (context) => {
      if (context === instance.current) {
        instance.stack.shift();
        instance.current = instance.stack[0] || null;
        return;
      }

      throw new Error(
        "Remove context from stack resolve with error. Selected context isn't current."
      );
    },
  };

  return instance;
}

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

function attachInstance(instance, stack) {
  const _stack = stack || getStack();

  const scope = (callback) => {
    let result;
    _stack.add(instance);
    result = callback();
    _stack.remove(instance);
    return result;
  };

  return scope;
}

module.exports = {
  createStackInstance,
  getStack,
  getCurrent,
  getCurrentWithCheck,
  attachInstance,
};
