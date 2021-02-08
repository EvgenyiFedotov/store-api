const { createEmitter } = require("./index");

test("create", () => {
  const change = createEmitter();

  expect(change).toBeInstanceOf(Function);
  expect(Object.keys(change())).toEqual(["call", "on", "off"]);
  expect(change().call).toBeInstanceOf(Function);
  expect(change().on).toBeInstanceOf(Function);
  expect(change().off).toBeInstanceOf(Function);
  expect(change() === change()).toBe(true);
});

test("call, on, off", () => {
  const change = createEmitter();
  const cb = jest.fn((x) => x);

  expect(change().on(cb) === change()).toBe(true);
  expect(change().call(10) === change()).toBe(true);
  expect(cb.mock.calls.length).toBe(1);
  expect(cb.mock.calls[0][0]).toBe(10);
  expect(change().off(cb) === change()).toBe(true);
  expect(change().call(20) === change()).toBe(true);
  expect(cb.mock.calls.length).toBe(1);
});
