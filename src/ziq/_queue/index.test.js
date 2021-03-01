const { createQueue } = require("./index");

const set = () => new Promise((resolve) => setTimeout(resolve, 500));

test("createQueue", () => {
  const qu = createQueue();

  expect(qu).toBeInstanceOf(Object);
  expect(qu.add).toBeInstanceOf(Function);
  expect(qu.get).toBeInstanceOf(Function);
  expect(qu.wait).toBeInstanceOf(Function);
  expect(qu.size).toBeInstanceOf(Function);
  expect(qu.status).toBeInstanceOf(Function);
  expect(qu.start).toBeInstanceOf(Function);
  expect(qu.subscribe).toBeInstanceOf(Function);
  expect(qu.unsubscribe).toBeInstanceOf(Function);
  expect(qu.add(async () => {})).toStrictEqual(qu);
  expect(qu.wait()).toBeInstanceOf(Promise);
  expect(typeof qu.size()).toBe("number");
});

test("add callback", async () => {
  const qu = createQueue();

  qu.add(set);
  let pSet = qu.add(set);
  expect(qu.size()).toBe(1);
  qu.add(() => set());
  expect(qu.size()).toBe(2);
  await pSet.get(set);
  expect(qu.size()).toBe(1);
  pSet = qu.add(set);
  expect(qu.size()).toBe(2);
  await qu.wait();
  expect(qu.size()).toBe(0);
});

test("pause", async () => {
  const qu = createQueue();
  const set2 = () => set();

  expect(qu.status()).toBe("initial");
  expect(qu.pause()).toStrictEqual(qu);
  expect(qu.status()).toBe("pause");
  expect(qu.add(set)).toStrictEqual(qu);
  expect(qu.add(set2)).toStrictEqual(qu);
  expect(qu.pause()).toStrictEqual(qu);
  expect(qu.size()).toBe(2);
  expect(qu.status()).toBe("pause");
  expect(qu.start()).toStrictEqual(qu);
  await qu.get(set2);
  expect(qu.status()).toBe("done");
  expect(qu.size()).toBe(0);
});

test("status", async () => {
  const qu = createQueue();

  expect(qu.status()).toBe("initial");
  expect(qu.add(() => {})).toStrictEqual(qu);
  expect(qu.status()).toBe("pending");
  expect(await qu.wait()).toBe(undefined);
  expect(qu.status()).toBe("done");
});
