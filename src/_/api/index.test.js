const { createApi } = require("./index");

test("create", () => {
  const numberApi = createApi(() => {});

  expect(numberApi).toBeInstanceOf(Function);
  expect(numberApi.name).toBe("api");
  expect(numberApi().getMethods).toBeInstanceOf(Function);
});
