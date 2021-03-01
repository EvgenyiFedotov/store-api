const { createQueue } = require("./index");

test("createQueue", () => {
  const qu = createQueue();

  expect(qu.add).toBeInstanceOf(Function);
  expect(qu.get).toBeInstanceOf(Function);
  expect(qu.next).toBeInstanceOf(Function);
  expect(qu.size).toBeInstanceOf(Function);
  expect(qu.wait).toBeInstanceOf(Function);
});

test("add", () => {
  const qu = createQueue();
  const cb = () => {};

  expect(qu.size()).toBe(0);
  expect(qu.add(cb)).toStrictEqual(qu);
  expect(qu.size()).toBe(1);
  expect(qu.add(cb)).toStrictEqual(qu);
  expect(qu.size()).toBe(1);
  expect(qu.add(() => {})).toStrictEqual(qu);
  expect(qu.size()).toBe(2);
});

test("get", () => {
  const qu = createQueue();
  const cb = () => {};

  expect(qu.size()).toBe(0);
  expect(() => qu.get(cb)).toThrow();
  expect(qu.add(cb)).toStrictEqual(qu);
  expect(qu.get(cb)).toBeInstanceOf(Promise);
  expect(qu.size()).toBe(1);
});

test("next", async () => {
  const qu = createQueue();
  const cb1 = () => 1;
  const cb2 = () => 2;

  expect(qu.add(cb1)).toStrictEqual(qu);
  expect(qu.add(cb2)).toStrictEqual(qu);
  expect(qu.size()).toBe(2);
  const next = qu.next();
  expect(next).toBeInstanceOf(Object);
  expect(next.value).toBeInstanceOf(Promise);
  expect(next.done).toBe(false);
  expect(await next.value).toBe(1);
  expect(qu.size()).toBe(1);
  expect(qu.next().done).toBe(false);
  expect(await qu.next().value).toBe(2);
  expect(qu.next().done).toBe(true);
});

test("wait", async () => {
  const qu = createQueue();
  const cb1 = jest.fn(() => 1);
  const cb2 = jest.fn(() => 2);

  expect(qu.add(cb1).add(cb2)).toStrictEqual(qu);
  expect(await qu.wait()).toBe(undefined);
  expect(cb1.mock.calls).toHaveLength(1);
  expect(cb2.mock.calls).toHaveLength(1);
});
