const { createWaiter } = require("./index");

test("createWaiter", () => {
  const waiter = createWaiter();

  expect(waiter.add).toBeInstanceOf(Function);
  expect(waiter.wait).toBeInstanceOf(Function);
  expect(waiter.count).toBeInstanceOf(Function);
});

test("count", () => {
  const waiter = createWaiter();

  expect(waiter.count()).toBe(0);
  expect(waiter.add(() => {})).toBeInstanceOf(Promise);
  expect(waiter.count()).toBe(1);
});

test("add", async () => {
  const waiter = createWaiter();
  const set = () => new Promise((res) => setTimeout(res, 1000));

  const setAdded = waiter.add(set);
  expect(setAdded).toBeInstanceOf(Promise);
  expect(waiter.add(set)).toStrictEqual(setAdded);
  expect(waiter.count()).toBe(1);
});

test("wait", async () => {
  const waiter = createWaiter();
  const set1 = () => new Promise((res) => setTimeout(res, 1000));
  const set2 = () => set1();

  expect(waiter.add(set1)).toBeInstanceOf(Promise);
  expect(waiter.add(set2)).toBeInstanceOf(Promise);
  expect(waiter.count()).toBe(2);
  expect(await waiter.wait()).toBe(undefined);
  expect(waiter.count()).toBe(0);
});
