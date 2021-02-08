import { storeApi, callback, label, api, listenStore } from "../store";
import { context } from "../context";

const numberApi = storeApi({
  init: 0,
  api: () => ({
    inc: () => 1,
    dec: () => -1,
  }),
});

const age = label(numberApi);

const defaultValues = callback((context) => {
  const number = context(api(age));

  return { test: 1 };
});

const root = context();

const rootDefaultValues = root(defaultValues);

console.log(rootDefaultValues.test);

const serverDefaultValues = callback(() => {}, {
  side: "server",
});

const clientDefaultValues = callback(() => {}, {
  side: "client",
});

const onceDefaultValues = callback(() => {}, {
  once: false,
});
