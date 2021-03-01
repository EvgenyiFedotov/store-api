const { createApp } = require("./index");

test("createApp", () => {
  expect(() => createApp()).toThrow();

  const app = createApp({
    chunks: {
      age: {
        inc: {
          handler: async () => {},
          type: "set",
        },
        dec: {
          handler: async () => {},
          type: "set",
        },
        toStr: {
          handler: async () => {},
          type: "get",
        },
      },
      name: {
        change: {
          handler: async () => {},
          type: "set",
        },
      },
    },
  });

  expect(app).toBeInstanceOf(Object);
});

test.todo("createApp with data");
