const { context } = require("../context");
const { storeApi, label, api, listen, full, attach } = require("../store");

test("storeApi", () => {
  const numberApi = storeApi({
    init: 0,
    api: ({ setState, getState }) => ({
      set: (value) => setState(value),
      get: () => getState(),
      inc: () => setState(getState() + 1),
      dec: () => setState((prev) => prev - 1),
    }),
  });

  expect(numberApi).toBeInstanceOf(Function);
});

test("label", () => {
  const numberApi = storeApi({
    init: 0,
    api: ({ setState, getState }) => ({
      set: (value) => setState(value),
      get: () => getState(),
      inc: () => setState(getState() + 1),
      dec: () => setState((prev) => prev - 1),
    }),
  });
  const name = label(numberApi);

  expect(name).toBeInstanceOf(Function);
});

test("api", () => {
  const numberApi = storeApi({
    init: 0,
    api: ({ setState, getState }) => ({
      set: (value) => setState(value),
      get: () => getState(),
      inc: () => setState(getState() + 1),
      dec: () => setState((prev) => prev - 1),
    }),
  });
  const name = label(numberApi);
  const nameApi = api(name);

  expect(nameApi).toBeInstanceOf(Function);
});

test("listen", () => {
  const numberApi = storeApi({
    init: 0,
    api: ({ setState, getState }) => ({
      set: (value) => setState(value),
      get: () => getState(),
      inc: () => setState(getState() + 1),
      dec: () => setState((prev) => prev - 1),
    }),
  });
  const name = label(numberApi);
  const nameListen = api(name);

  expect(nameListen).toBeInstanceOf(Function);
});

test("api attach to context", () => {
  const numberApi = storeApi({
    init: 0,
    api: ({ setState, getState }) => ({
      set: (value) => setState(value),
      get: () => getState(),
      inc: () => setState(getState() + 1),
      dec: () => setState((prev) => prev - 1),
    }),
  });

  const name = label(numberApi);
  const nameApi = api(name);

  const app = context();
  const appName = app(nameApi);

  expect(Object.keys(appName)).toEqual(["set", "get", "inc", "dec"]);
  expect(appName === app(nameApi)).toBe(true);
  expect(appName === context()(nameApi)).toBe(false);
});

test("listen attach to context", () => {
  const numberApi = storeApi({
    init: 0,
    api: ({ setState, getState }) => ({
      set: (value) => setState(value),
      get: () => getState(),
      inc: () => setState(getState() + 1),
      dec: () => setState((prev) => prev - 1),
    }),
  });

  const name = label(numberApi);
  const nameListen = listen(name);

  const app = context();
  const appNameListen = app(nameListen);

  expect(Object.keys(appNameListen)).toEqual(["store", "api"]);
  expect(typeof appNameListen.store === "object").toBe(true);
  expect(typeof appNameListen.api === "object").toBe(true);
  expect(appNameListen.store.on).toBeInstanceOf(Function);
  expect(appNameListen.store.off).toBeInstanceOf(Function);
  expect(appNameListen.api.set.before.on).toBeInstanceOf(Function);
  expect(appNameListen.api.set.before.off).toBeInstanceOf(Function);
  expect(appNameListen.api.set.after.on).toBeInstanceOf(Function);
  expect(appNameListen.api.set.after.off).toBeInstanceOf(Function);
});

test("exec api methods", () => {
  const numberApi = storeApi({
    init: 0,
    api: ({ setState, getState, reset }) => ({
      set: (value) => setState(value),
      get: () => getState(),
      inc: () => setState(getState() + 1),
      dec: () => setState((prev) => prev - 1),
      reset,
    }),
  });

  const age = label(numberApi);
  const userAge = label(numberApi);

  const root = context();
  const rootAge = root(api(age));
  const rootUserAge = root(api(userAge));

  const app = context();
  const appAge = app(api(age));
  const appUserAge = app(api(userAge));

  expect(rootAge.set(10)).toBe(10);

  expect(rootAge.get()).toBe(10);
  expect(rootUserAge.get()).toBe(0);
  expect(appAge.get()).toBe(0);
  expect(appUserAge.get()).toBe(0);

  expect(appAge.set(10)).toBe(10);

  expect(rootAge.get()).toBe(10);
  expect(rootUserAge.get()).toBe(0);
  expect(appAge.get()).toBe(10);
  expect(appUserAge.get()).toBe(0);

  expect(rootUserAge.inc()).toBe(1);

  expect(rootAge.get()).toBe(10);
  expect(rootUserAge.get()).toBe(1);
  expect(appAge.get()).toBe(10);
  expect(appUserAge.get()).toBe(0);

  expect(appUserAge.dec()).toBe(-1);

  expect(rootAge.get()).toBe(10);
  expect(rootUserAge.get()).toBe(1);
  expect(appAge.get()).toBe(10);
  expect(appUserAge.get()).toBe(-1);

  expect(rootAge.reset()).toBe(0);
  expect(rootUserAge.reset()).toBe(0);
  expect(appAge.reset()).toBe(0);
  expect(appUserAge.reset()).toBe(0);

  expect(rootAge.get()).toBe(0);
  expect(rootUserAge.get()).toBe(0);
  expect(appAge.get()).toBe(0);
  expect(appUserAge.get()).toBe(0);
});

test("listen store", () => {
  const numberApi = storeApi({
    init: 0,
    api: ({ setState, getState, reset }) => ({
      set: (value) => setState(value),
      get: () => getState(),
      inc: () => setState(getState() + 1),
      dec: () => setState((prev) => prev - 1),
      reset,
    }),
  });

  const age = label(numberApi);
  const userAge = label(numberApi);

  const root = context();
  const rootApis = root(() => ({
    age: api(age)(),
    userAge: api(userAge)(),
  }));
  const rootListen = root(() => ({
    age: listen(age)(),
    userAge: listen(userAge)(),
  }));
  const fnAge = jest.fn((x) => x);
  const fnUserAge = jest.fn((x) => x);

  rootListen.age.store.on(fnAge);
  rootListen.userAge.store.on(fnUserAge);
  rootApis.age.set(10);
  rootApis.userAge.set(20);

  expect(fnAge.mock.calls[0][0]).toBe(10);
  expect(fnUserAge.mock.calls[0][0]).toBe(20);
  expect(rootApis.age.get()).toBe(10);
  expect(rootApis.userAge.get()).toBe(20);

  rootListen.age.store.off(fnAge);
  rootListen.userAge.store.off(fnUserAge);
  rootApis.age.inc();
  rootApis.userAge.dec();

  expect(fnAge.mock.calls.length).toBe(1);
  expect(fnUserAge.mock.calls.length).toBe(1);
  expect(rootApis.age.get()).toBe(11);
  expect(rootApis.userAge.get()).toBe(19);
});

test("listen api", () => {
  const numberApi = storeApi({
    init: 0,
    api: ({ setState, getState, reset }) => ({
      set: (value) => setState(value),
      get: () => getState(),
      inc: () => setState(getState() + 1),
      dec: () => setState((prev) => prev - 1),
      reset,
    }),
  });

  const root = context();
  const age = label(numberApi);
  const ageApi = root(api(age));
  const ageListen = root(listen(age));

  const fnSetBefore = jest.fn((x) => x);
  const fnSetAfter = jest.fn((x) => x);

  ageListen.api.set.before.on(fnSetBefore);
  ageListen.api.set.after.on(fnSetAfter);

  ageApi.set(10);

  expect(fnSetBefore.mock.calls[0][0]).toEqual({ params: [10] });
  expect(fnSetAfter.mock.calls[0][0]).toEqual({ params: [10], result: 10 });

  ageListen.api.set.before.off(fnSetBefore);
  ageListen.api.set.after.off(fnSetAfter);

  expect(fnSetBefore.mock.calls.length).toBe(1);
  expect(fnSetAfter.mock.calls.length).toBe(1);
});

test("full", () => {
  const numberApi = storeApi({
    init: 0,
    api: ({ setState, getState }) => ({
      set: (value) => setState(value),
      get: () => getState(),
      inc: () => setState(getState() + 1),
      dec: () => setState((prev) => prev - 1),
    }),
  });

  const age = label(numberApi);
  const ageFull = context()(full(age));

  expect(Object.keys(ageFull)).toEqual(["api", "listen"]);
  expect(Object.keys(ageFull.api)).toEqual(["set", "get", "inc", "dec"]);
  expect(Object.keys(ageFull.listen)).toEqual(["store", "api"]);
});

test("attach", () => {
  const numberApi = storeApi({
    init: 0,
    api: ({ setState, getState }) => ({
      set: (value) => setState(value),
      get: () => getState(),
      inc: () => setState(getState() + 1),
      dec: () => setState((prev) => prev - 1),
    }),
  });

  const age = label(numberApi);
  const rootFull = attach({
    context: context(),
    source: {
      age: full(age),
      userAge: full(age),
    },
  });

  expect(Object.keys(rootFull)).toEqual(["age", "userAge"]);
  expect(Object.keys(rootFull.age)).toEqual(["api", "listen"]);
  expect(Object.keys(rootFull.userAge)).toEqual(["api", "listen"]);
  expect(Object.keys(rootFull.age.api)).toEqual(["set", "get", "inc", "dec"]);
  expect(Object.keys(rootFull.userAge.api)).toEqual([
    "set",
    "get",
    "inc",
    "dec",
  ]);
  expect(Object.keys(rootFull.age.listen)).toEqual(["store", "api"]);
  expect(Object.keys(rootFull.userAge.listen)).toEqual(["store", "api"]);
});

test.todo("listenStore");

test.todo("listenApi");
