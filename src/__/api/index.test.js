const { context } = require("../context");
const { api } = require("./index");

test("create", () => {
  const app = context();
  const numberType = api({ type: (value) => typeof value === "number" });

  expect(numberType).toBeInstanceOf(Function);

  const numberApi = numberType({ methods: ({}) => ({ set: () => {} }) });

  expect(numberApi).toBeInstanceOf(Function);

  const ageLabel = numberApi({ init: 0 });

  expect(ageLabel).toBeInstanceOf(Function);

  const appAge = ageLabel({ context: app });

  expect(appAge).toBeInstanceOf(Function);
  expect(appAge(() => 0)).toBe(0);
  expect(Object.keys(appAge(({ storeApi }) => storeApi(appAge)))).toEqual([
    "set",
  ]);
});
