import { context } from '../context';
import { api } from "../api";
import { store, storeApi, storeApiListen } from "./index";

const app = context();

const typeNumber = api<number>({
  type: (state) => typeof state === "number",
});

const apiNumber = typeNumber(({ get, set, reset }) => ({
  set: (value: number) => set(value),
  get: () => get(),
  reset: () => reset(),
  inc: (add: number = 1) => set(get() + add),
  dec: (add: number = 1) => set((prev) => prev - add),
}));

const age = apiNumber({ init: 0 });
const percent = apiNumber({ init: 50 });

const appAge = age({ context: app });
const appPercent = percent({ context: app });

const storeAge = store(appAge);
const storePercent = store(appPercent);

storeAge.on(() => {}).off(() => {});
storePercent.on(() => {}).off(() => {});

const storeApiAge = storeApi(appAge);
const storeApiPercent = storeApi(appPercent);

storeApiAge.dec();
storeApiAge.inc();
storeApiPercent.set(10);
storeApiPercent.dec(5);

const storeApiListenAge = storeApiListen(appAge);
const storeApiListenPercent = storeApiListen(appPercent);

storeApiListenAge.dec.on(({ params, result }) => {}).off(() => {});
storeApiListenPercent.reset.on(({ params, result }) => {}).off(() => {});
