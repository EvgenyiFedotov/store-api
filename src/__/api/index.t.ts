import { context } from '../context';
import { api } from "./index";

const root = context();
const app = context();

const typeNumber = api<number>({
  type: (state) => typeof state === "number",
});

const apiNumber = typeNumber({
  methods: ({ get, set, reset }) => ({
    set: (value: number) => set(value),
    get: () => get(),
    reset: () => reset(),
    inc: (add: number = 1) => set(get() + add),
    dec: (add: number = 1) => set((prev) => prev - add),
  }),
});

const age = apiNumber({ init: 0 });
const percent = apiNumber({ init: 50 });

const rootAge = age({ context: root });
const rootPercent = percent({ context: root });

const appAge = age({ context: app });
const appPercent = percent({ context: app });

const storeRootAge = rootAge(({ store }) => store());
const storeRootPercent = rootPercent(({ storeApi }) => storeApi());

const storeAppAge = appAge(({ storeApi }) => storeApi());
const storeAppPercent = appPercent(({ storeApiListen }) => storeApiListen());

storeRootAge.on(() => {}).off(() => {});
storeRootPercent.dec(10);

storeAppAge.set(20);
storeAppPercent.set.on(() => {}).off(() => {});

