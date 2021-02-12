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

function attachInstance(instance, stack) {
  const currentStack = stack || getStack();

  const scope = (callback) => {
    let result;
    currentStack.add(instance);
    result = callback();
    currentStack.remove(instance);
    return result;
  };

  return scope;
}

module.exports = {
  createStackInstance,
  attachInstance,
};
