import { context } from '../context';
import { api } from "./index";

const root = context();
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

const rootAge = age({ context: root });
const appAge = age({ context: app });

const rootPercent = percent({ context: root });
const appPercent = percent({ context: app });
