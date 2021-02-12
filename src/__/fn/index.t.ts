import { context } from "../context";
import { api } from "../api";
import { storeApi } from "../store";
import { fn } from "./index";

const app = context();
const form = context();

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

const labelAge = apiNumber({ init: 0 });
const labelPercent = apiNumber({ init: 50 });

const setAge = fn(async ({ currentContext }) => {
  const age = labelAge({ context: currentContext });
  const percent = labelPercent({ context: currentContext });

  const ageApi = storeApi(age);
  const percentApi = storeApi(percent);

  ageApi.set(10);
  percentApi.set(20);

  return { ageApi, percentApi };
});

const appSetAge = setAge({ context: app });
const formSetAge = setAge({ context: form });

appSetAge().then(({ ageApi, percentApi }) => {
  ageApi.set(20);
  percentApi.set(70);
});

formSetAge().then(({ ageApi, percentApi }) => {
  ageApi.set(21);
  percentApi.set(72);
});
