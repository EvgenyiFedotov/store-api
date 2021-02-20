const { createContext } = require("./index");

test("createContext", () => {
  const ctx = createContext();

  expect(ctx).toBeInstanceOf(Function);
});

test("creaateContext callback payload", () => {
  const ctx = createContext();

  ctx((payload) => {
    expect(payload.type).toBeInstanceOf(Function);
    expect(payload.store).toBeInstanceOf(Function);
  });
});

test("create type", () => {
  const num = (value) => typeof value === "number";
  const str = (value) => typeof value === "string";
  const date = (value) => value instanceof Date;
  const user = (value) => num(value.age) && str(value.name);

  const ctx = createContext();

  const types = ctx(({ type }) => {
    const numtype = type(num);
    const strtype = type(str);
    const datetype = type(date);
    const usertype = type(user);

    expect(numtype.name).toBe("_type");
    expect(numtype(0)).toBe(true);
    expect(numtype("")).toBe(false);
    expect(strtype("")).toBe(true);
    expect(datetype(new Date())).toBe(true);
    expect(usertype({ name: "", age: 0 })).toBe(true);
    expect(usertype({ name: "", age: "" })).toBe(false);
    expect(() => type(user)).toThrow();

    return { num: numtype, str: strtype, date: datetype, user: usertype };
  });

  expect(types.num).toBeInstanceOf(Function);
});

test("create store", () => {
  const num = (value) => typeof value === "number";
  const age = () => {};

  const ctx = createContext();
  const numType = ctx(({ type }) => type(num));
  const ageStore = ctx(({ store }) => store(numType, age));

  expect(ageStore.name).toBe("_store");
  expect(ageStore).toBeInstanceOf(Function);
});
