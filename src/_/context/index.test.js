const { createContext } = require("../context");

test("create", () => {
  expect(createContext()).toBeInstanceOf(Function);
});
