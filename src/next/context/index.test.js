const { getStack } = require("../stack");
const { context } = require("../context");

test("create", () => {
  expect(context()).toBeInstanceOf(Function);
});

test("stack length", () => {
  const { stack } = getStack();
  const app = context();
  const innerApp = context();

  expect(stack.length).toBe(0);
  app(() => {
    expect(stack.length).toBe(1);
    innerApp(() => {
      expect(stack.length).toBe(2);
    });
    expect(stack.length).toBe(1);
  });
  expect(stack.length).toBe(0);
});
