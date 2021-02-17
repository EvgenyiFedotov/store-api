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

const storeAge = appAge(store);
const storePercent = appPercent(store);

storeAge.on((value) => {}).off(() => {});
storePercent.on((value) => {}).off(() => {});

const storeApiAge = appAge(storeApi);
const storeApiPercent = appPercent(storeApi);

storeApiAge.dec();
storeApiAge.inc();
storeApiPercent.set(10);
storeApiPercent.dec(5);

const storeApiListenAge = appAge(storeApiListen);
const storeApiListenPercent = appPercent(storeApiListen);

storeApiListenAge.dec.on(({ params, result }) => {}).off(() => {});
storeApiListenPercent.reset.on(({ params, result }) => {}).off(() => {});
