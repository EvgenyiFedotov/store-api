const { createContext } = require("../context");

describe("label", () => {
  test("check name callback of label", () => {
    const { label } = createContext();

    const LABEL_NAME = () => {};

    expect(label(LABEL_NAME)).toBeInstanceOf(Function);
    expect(() => label(() => {})).toThrow();
    expect(() => label(function () {})).toThrow();
    expect(label(function LABEL_NAME_NEW() {})).toBeInstanceOf(Function);
  });

  test("useApi", () => {
    const { label } = createContext();

    const age = ({ useApi }) => {
      const api = useApi({
        inc: () => {},
        dec: () => {},
      });

      return api;
    };

    const labelAge = label(age);

    expect(labelAge() === labelAge()).toBe(true);
    expect(label(age)() === label(age)()).toBe(true);
    expect(createContext().label(age)() === label(age)()).toBe(false);
    expect(labelAge().inc).toBeInstanceOf(Function);
    expect(labelAge().dec).toBeInstanceOf(Function);
  });

  test("useStore", () => {
    const { label } = createContext();

    const age = ({ useStore, useApi }) => {
      const { get, set, reset } = useStore(0);

      return useApi({
        set: (value) => set(value),
        inc: () => set(get() + 1),
        dec: () => set((prev) => prev - 1),
        get: () => get(),
        reset: () => reset(),
      });
    };

    const labelAge = label(age)();

    expect(labelAge.get()).toBe(0);
    expect(labelAge.inc()).toBe(1);
    expect(labelAge.get()).toBe(1);
    expect(labelAge.dec()).toBe(0);
    expect(labelAge.get()).toBe(0);
    expect(labelAge.set(-10)).toBe(-10);
    expect(labelAge.get()).toBe(-10);
    expect(labelAge.reset()).toBe(0);
    expect(labelAge.get()).toBe(0);

    const store = ({ args, useStore }) => useStore(args[0]);

    const labelStore = label(store)(0);

    expect(labelStore.get()).toBe(0);
    expect(labelStore.set(10)).toBe(10);
    expect(labelStore.reset()).toBe(0);
    expect(labelStore.get()).toBe(0);
  });

  test("useCheckType", () => {
    const { label } = createContext();

    const age = ({ useCheckType, useStore }) => {
      const check1 = useCheckType((value) => typeof value === "number");
      const check2 = useCheckType((value) => typeof value === "string");

      expect(check1 === check2).toBe(true);
      expect(check2("")).toBe(false);

      return useStore(0);
    };

    const labelAge = label(age)();

    expect(labelAge.get()).toBe(0);
    expect(labelAge.set(100)).toBe(100);
    expect(() => labelAge.set("2")).toThrow();
    expect(labelAge.get()).toBe(100);
  });

  test("useListenStore", () => {
    const { label } = createContext();

    const age = ({ useStore, useListenStore }) => {
      const store = useStore(20);
      const listen = useListenStore();

      return { store, listen };
    };

    const lage = label(age);

    expect(lage().listen === lage().listen).toBe(true);
    expect(lage().listen.on).toBeInstanceOf(Function);
    expect(lage().listen.off).toBeInstanceOf(Function);

    const { store, listen } = lage();
    const fn = jest.fn((x) => x);

    expect(listen.on(fn) === listen).toBe(true);
    expect(store.get()).toBe(20);
    expect(store.set((prev) => prev + 30)).toBe(50);
    expect(fn.mock.calls).toHaveLength(1);
    expect(fn.mock.calls[0][0]).toBe(50);
    expect(listen.off(fn) === listen).toBe(true);
    expect(store.set(-10)).toBe(-10);
    expect(fn.mock.calls).toHaveLength(1);
  });

  test("useListenApi", () => {
    const { label } = createContext();

    const age = ({ useApi, useListenApi }) => {
      const api = useApi({
        first: (index) => 1 + index,
        last: (index) => 2 + index,
      });
      const listenApi = useListenApi();

      return { api, listenApi };
    };

    const lage = label(age);

    expect(lage().listenApi === lage().listenApi).toBe(true);

    const { api, listenApi } = lage();
    const firstFn = jest.fn((x) => x);
    const lastFn = jest.fn((x) => x);

    expect(listenApi.first.on).toBeInstanceOf(Function);
    expect(listenApi.first.off).toBeInstanceOf(Function);
    expect(listenApi.last.on).toBeInstanceOf(Function);
    expect(listenApi.last.off).toBeInstanceOf(Function);

    expect(listenApi.first.on(firstFn) === listenApi.first).toBe(true);
    expect(listenApi.last.on(lastFn) === listenApi.last).toBe(true);

    expect(api.first(10)).toBe(11);
    expect(api.last(20)).toBe(22);

    expect(firstFn.mock.calls).toHaveLength(1);
    expect(lastFn.mock.calls).toHaveLength(1);

    expect(firstFn.mock.calls[0][0]).toEqual({ params: [10], result: 11 });
    expect(lastFn.mock.calls[0][0]).toEqual({ params: [20], result: 22 });

    expect(listenApi.first.off(firstFn) === listenApi.first).toBe(true);
    expect(listenApi.last.off(lastFn) === listenApi.last).toBe(true);

    expect(api.first(20)).toBe(21);
    expect(api.last(30)).toBe(32);

    expect(firstFn.mock.calls).toHaveLength(1);
    expect(lastFn.mock.calls).toHaveLength(1);
  });

  test("useMeta", () => {
    const { label } = createContext();

    const age = ({ useMeta, args }) => {
      const [note, setAdded] = useMeta({ note: "note" });

      if (typeof args[0] === "string") {
        return setAdded({ note: args[0] });
      }

      return note;
    };

    const lage = label(age);

    expect(lage()).toEqual({ note: "note" });
    expect(lage() === lage()).toBe(true);
    expect(lage("bob") === lage()).toBe(true);
    expect(lage()).toEqual({ note: "bob" });
  });

  test("separate hooks [by two callbacks]", () => {
    const { label } = createContext();

    const storeAge = label(function age({ useStore, useCheckType }) {
      useCheckType((value) => typeof value === "number");

      return useStore(0);
    })();
    const apiAge = label(function age({ useStore, useApi }) {
      const { get, set } = useStore(0);

      return useApi({
        inc: () => set(get() + 1),
        dec: () => set((prev) => prev - 1),
      });
    })();

    expect(storeAge.get()).toBe(0);
    expect(storeAge === apiAge).toBe(true);
    expect(apiAge.set).toBeInstanceOf(Function);
  });

  test("separate hooks [by one callback, but use args]", () => {
    const { label } = createContext();

    const labelAge = label(function age({
      args,
      useStore,
      useCheckType,
      useApi,
    }) {
      const [type] = args;
      const store = useStore(0);
      const { set, get } = store;

      useCheckType((value) => typeof value === "number");

      return {
        store,
        api: useApi({
          inc: () => set(get() + 1),
          dec: () => set((prev) => prev - 1),
        }),
      }[type];
    });

    expect(labelAge("store").get).toBeInstanceOf(Function);
    expect(labelAge("store").get()).toBe(0);
    expect(labelAge("api").inc).toBeInstanceOf(Function);
    expect(labelAge("api").inc()).toBe(1);
    expect(labelAge("store").get()).toBe(1);
    expect(labelAge("store").reset()).toBe(0);
  });
});
