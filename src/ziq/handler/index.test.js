const { createHandler } = require("./index");

test("createHandler", () => {
  expect(() => createHandler()).toThrow();
  expect(() => createHandler({})).toThrow();
  expect(() => createHandler({ main: () => {} })).not.toThrow();
});

test("main handler", async () => {
  const chunk = createHandler({
    main: ([num]) => {
      return new Promise((res) => setTimeout(() => res(num + 1), 500));
    },
  });

  expect(chunk).toBeInstanceOf(Function);
  expect((res = chunk(0))).toBeInstanceOf(Promise);
  expect(await res).toEqual({ main: 1, prev: undefined, post: undefined });
});

test("two chunks", async () => {
  const main1 = () => new Promise((res) => setTimeout(res, 500));
  const main2 = () => new Promise((res) => setTimeout(res, 500));
  const chunk1 = createHandler({ main: main1 });
  const chunk2 = createHandler({ main: main2 });

  chunk1();
  const result2 = chunk2();

  await result2;
});

test("prev handler", async () => {
  const chunk = createHandler({
    prev: ([num]) => {
      if (typeof num === "number") return num + 1;
      throw new Error();
    },
    main: ([num], prev) => num + prev + 1,
  });

  expect(await chunk(0)).toEqual({ main: 2, prev: 1, post: undefined });
  try {
    await chunk("2");
  } catch (error) {
    expect(error).toBeInstanceOf(Error);
  }
});

test("next handler", async () => {
  const chunk = createHandler({
    main: ([num]) => num + 1,
    post: ([num], main) => num + main + 1,
  });

  expect(await chunk(0)).toEqual({ main: 1, post: 2, prev: undefined });
});

test("full handlers", async () => {
  const chunk = createHandler({
    prev: ([num]) => num + 1,
    main: ([num], prev) => num + prev + 1,
    post: ([num], main, prev) => num + main + prev + 1,
  });

  expect(await chunk(10)).toEqual({ prev: 11, main: 22, post: 44 });
});
