const { createApp, getters, setters } = require("./index");

test("createApp", () => {
  const app = createApp();

  expect(app).toBeInstanceOf(Object);
  expect(app.createChunk).toBeInstanceOf(Function);
  expect(app.run).toBeInstanceOf(Function);
  expect(app.status).toBeInstanceOf(Function);
  expect(app.getChunk).toBeInstanceOf(Function);
  expect(app.serialize).toBeInstanceOf(Function);
});

test("run", () => {
  const app = createApp();

  expect(app.run()).toStrictEqual(app);
});

describe("createChunk", () => {
  test("before running", () => {
    const app = createApp();

    const setAge = () => {};
    const setName = () => {};
    const setUserAge = () => {};
    const setUserName = () => {};
    const getAge = () => {};
    const getName = () => {};
    const setUser = () => {};

    expect(() => app.createChunk(setAge).createChunk(setName)).not.toThrow();
    expect(() => app.createChunk()).toThrow();
    expect(() => app.createChunk(() => {})).toThrow();
    expect(() =>
      app
        .createChunk(setUserAge)
        .createChunk(setUserName)
        .createChunk(getAge)
        .createChunk(getName)
        .createChunk(setUser)
    ).not.toThrow();
  });

  test("after running", () => {
    const app = createApp();
    const setAge = () => {};

    app.run();
    expect(() => app.createChunk(setAge)).toThrow();
  });
});

test("status", () => {
  const app = createApp();

  expect(app.status()).toBe("initial");
  expect(app.run()).toStrictEqual(app);
  expect(app.status()).toBe("running");
});

describe("getChunk", () => {
  test("before creating", () => {
    const app = createApp();
    const setAge = () => {};

    expect(() => app.getChunk(setAge)).toThrow();
  });

  test("after creating", () => {
    const app = createApp();
    const setAge = () => {};

    app.createChunk(setAge);
    expect(app.getChunk(setAge)).toBeInstanceOf(Function);
  });

  test("run set chunk", async () => {
    const app = createApp();
    const setAge = ([add], prev = 0) => add + prev;

    const cSetAge = app.createChunk(setAge).getChunk(setAge);
    app.run();

    expect(cSetAge(10)).toBeInstanceOf(Promise);
    expect(await cSetAge(2)).toBe(12);
    expect(await cSetAge(1)).toBe(13);
  });

  test("run get chunk", async () => {
    const app = createApp();

    const setAge = ([value]) => value;
    const getAge = ([proc], value) => (proc ? proc(value) : value);

    app.createChunk(setAge).createChunk(getAge);
    app.run();

    expect(await app.getChunk(setAge)(10)).toBe(10);
    expect(await app.getChunk(getAge)()).toBe(10);
    expect(await app.getChunk(getAge)((value) => value.toString())).toBe("10");
  });
});

test("combine chunks", async () => {
  const app = createApp();

  const getAge = (_, value) => value;
  const getName = (_, value) => value;
  const getUser = (_, value) => value;

  app.createChunk(getAge).createChunk(getName).createChunk(getUser);

  const get = getters({ app, chunks: [getAge, getName, getUser] });

  const setAge = ([value]) => value;
  const setName = ([value]) => value;
  const setUser = ([value]) => value;

  app.createChunk(setAge).createChunk(setName).createChunk(setUser);

  const set = setters({ app, chunks: [setAge, setName, setUser] });

  app.run();

  set.age(10);
  set.name("Bob");
  set.user({ age: await get.age(), name: await get.name() });

  expect(await get.age()).toBe(10);
  expect(await get.name()).toBe("Bob");
  expect(await get.user()).toEqual({ age: 10, name: "Bob" });
});

test.todo("getters");

test.todo("setters");

const getAge = (_, value) => value;
const getName = (_, value) => value;
const getUser = (_, value) => value;

const setAge = ([value]) => value;
const setName = ([value]) => value;
const setUser = ([value]) => value;

const initApp = (app) => {
  app
    .createChunk(getAge)
    .createChunk(getName)
    .createChunk(getUser)
    .createChunk(setAge)
    .createChunk(setName)
    .createChunk(setUser)
    .run();

  return {
    set: setters({ app, chunks: [setAge, setName, setUser] }),
    get: getters({ app, chunks: [getAge, getName, getUser] }),
  };
};

test("serialize", async () => {
  const app = createApp();
  const { set, get } = initApp(app);

  set.age(20);
  set.age(18);
  set.name("bob");
  set.name("alise");
  set.user({ age: await get.age(), name: await get.name() });

  expect(await app.serialize()).toEqual({
    age: 18,
    name: "alise",
    user: { age: 18, name: "alise" },
  });
});

describe("deserialize", () => {
  test("before running", async () => {
    const server = createApp();
    const serverApp = initApp(server);

    serverApp.set.age(20);
    serverApp.set.age(18);
    serverApp.set.name("bob");
    serverApp.set.name("alise");
    serverApp.set.user({
      age: await serverApp.get.age(),
      name: await serverApp.get.name(),
    });

    const data = await server.serialize();

    const client = createApp();
    await client.deserialize(data);
    const { get } = initApp(client);

    expect(await get.age()).toBe(18);
    expect(await get.name()).toBe("alise");
    expect(await get.user()).toEqual({ name: "alise", age: 18 });
  });

  test("after running", () => {});
});

test.todo("two apps");
