import { context } from "../context";
import { storeApi, listen, listenStore, listenApi, api, label, full, attach } from "./index";

const numberApi = storeApi<number, {
  set: { params: [number], result: number };
  get: { params: [], result: number };
}>({
  init: 0,
  api: ({ getState, setState }) => ({
    set: (value) => setState(value),
    get: () => getState(),
  }),
});

const stringApi = storeApi<string, {
  set: { params: [string], result: string };
  reset: { params: [], result: string };
}>({
  init: "",
  api: () => ({
    set: (value) => value,
    reset: () => "",
  }),
});

type User = { name: string, age: number };

const userApi = storeApi<User, {
  load: { params: [], result: Promise<User> };
  reset: { params: [], result: User };
}>({
  init: { name: "", age: 0 },
  api: ({ setState, reset }) => ({
    load: () => Promise.resolve({ name: "Bob", age: 12 })
      .then(setState),
    reset: () => reset(),
  }),
  checkType: (value) => typeof value === "object",
});

const labels = {
  age: label(numberApi),
  name: label(stringApi),
  user: label(userApi),
};
const apis = {
  age: api(labels.age),
  name: api(labels.name),
  user: api(labels.user),
};
const listeners = {
  age: listen(labels.age),
  name: listen(labels.name),
  user: listen(labels.user),
};

apis.age().set(20);
apis.name().set("bob");
apis.user().load().then((value) => {});

listeners.age().store.on((value) => {});
listeners.name().store.off(() => {});
listeners.user().api.load.before.on((value) => {});
listeners.user().api.load.after.on((value) => {
  value.result.then((user) => {});
});
listeners.user().api.load.after.off(() => {});

const ageFull = full(labels.age);

ageFull().api.set(19);
ageFull().listen.store.on(() => {});
ageFull().listen.api.set.before.on(() => {});

const root = context();
const rootApis = attach({
  context: root,
  source: {
    age: api(labels.age),
    name: api(labels.name),
    user: api(labels.user),
  },
});
const rootListen = attach({
  context: root,
  source: {
    age: listen(labels.age),
    name: listen(labels.name),
    user: listen(labels.user),
  },
});

rootApis.age.set(10);
rootApis.name.set("bob");
rootApis.user.load();

rootListen.age.store.on(() => {});

const rootFull = attach({
  context: root,
  source: {
    age: full(labels.age),
    name: full(labels.name),
    user: full(labels.user),
  },
});

rootFull.age.api.set(19);
rootFull.age.listen.store.on(() => {});
rootFull.age.listen.api.set.before.on(() => {});

const ageListenStore = context()(listenStore(labels.age));

ageListenStore.on(() => {});

const ageListenApi = context()(listenApi(labels.age));

ageListenApi.set.before.on(() => {});

export {};
