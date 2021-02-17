const { context } = require("./index");

test("create", () => {
  const app = context();

  expect(app).toBeInstanceOf(Object);
});

test("attachStoreConfig", () => {
  const app = context();
  const storeConfig = { type: () => true, methods: () => ({}), init: 0 };
  const contextLabel = () => {};

  try {
    expect(app.attachStoreConfig("", { ...storeConfig })).toEqual(storeConfig);
  } catch (error) {
    expect(error.message).toBe("Args is incorrect for attachStoreConfig");
  }
  expect(app.attachStoreConfig(contextLabel, storeConfig)).toEqual(storeConfig);
  expect(app.attachStoreConfig(contextLabel, storeConfig)).toEqual(storeConfig);
  try {
    expect(app.attachStoreConfig(contextLabel, { ...storeConfig })).toEqual(
      storeConfig
    );
  } catch (error) {
    expect(error.message).toBe("The store does have other config");
  }
});

test("check type of store", () => {
  const app = context();
  const app2 = context();
  const storeConfig = {
    type: (value) => typeof value === "number",
    methods: () => ({}),
    init: 3,
  };
  const contextLabel = () => {};

  app.attachStoreConfig(contextLabel, storeConfig);
  app2.attachStoreConfig(contextLabel, { ...storeConfig, init: "" });

  expect(app.storeApi(contextLabel)).toBeInstanceOf(Object);
  try {
    app2.storeApi(contextLabel);
  } catch (error) {
    expect(error.message).toBe("Init state of the store is incorrect");
  }
});

test("storeApi", () => {
  const app = context();
  const storeConfig = {
    type: () => true,
    methods: ({ get, set, reset }) => ({
      set: (val) => set(val),
      inc: () => set(get() + 1),
      dec: () => set((prev) => prev - 1),
      reset: () => reset(),
    }),
    init: 3,
  };
  const contextLabel = () => {};

  app.attachStoreConfig(contextLabel, storeConfig);

  const storeApi = app.storeApi(contextLabel);

  expect(Object.keys(storeApi)).toEqual(["set", "inc", "dec", "reset"]);
  expect(storeApi.inc()).toBe(4);
  expect(storeApi.dec()).toBe(3);
  expect(storeApi.set(10)).toBe(10);
  expect(storeApi.reset()).toBe(3);
});

test("store", () => {
  const app = context();
  const storeConfig = {
    type: () => true,
    methods: ({ set }) => ({ set: (val) => set(val) }),
    init: 3,
  };
  const contextLabel = () => {};

  app.attachStoreConfig(contextLabel, storeConfig);

  const storeApi = app.storeApi(contextLabel);
  const store = app.store(contextLabel);
  const fn = jest.fn((x) => x);

  expect(Object.keys(store)).toEqual(["on", "off"]);
  expect(store.on(fn) === store.off(() => {})).toBe(true);
  expect(storeApi.set(19)).toBe(19);
  expect(fn.mock.calls.length).toBe(1);
  expect(fn.mock.calls[0][0]).toBe(19);
  store.off(fn);
  expect(storeApi.set(29)).toBe(29);
  expect(fn.mock.calls.length).toBe(1);
});

test("storeApiListen", () => {
  const app = context();
  const storeConfig = {
    type: () => true,
    methods: ({ set }) => ({ set: (val) => set(val) }),
    init: 3,
  };
  const contextLabel = () => {};

  app.attachStoreConfig(contextLabel, storeConfig);

  const storeApi = app.storeApi(contextLabel);
  const storeApiListen = app.storeApiListen(contextLabel);
  const fn = jest.fn((x) => x);

  expect(Object.keys(storeApiListen)).toEqual(["set"]);
  expect(storeApiListen.set.on(fn) === storeApiListen.set.off(() => {})).toBe(
    true
  );
  expect(storeApi.set(39)).toBe(39);
  expect(fn.mock.calls.length).toBe(1);
  expect(fn.mock.calls[0][0]).toEqual({ params: [39], result: 39 });
  storeApiListen.set.off(fn);
  expect(storeApi.set(49)).toBe(49);
  expect(fn.mock.calls.length).toBe(1);
});
