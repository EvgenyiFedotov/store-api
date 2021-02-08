import { createApi } from "./index";

export const numberApi = createApi<
  number,
  {
    inc: { params: [number], result: number };
    dec: { params: [number], result: number };
  }
>(({ getState, setState }) => ({
  inc: (add = 1) => setState(getState() + add),
  dec: (add = 1) => setState((prev) => prev - add),
}));

export const stringApi = createApi<
  string,
  {
    set: { params: [string], result: string };
    split: { params: [string], result: string[] };
  }
>(({ getState, setState }) => ({
  set: (value) => setState(value),
  split: (seperator = " ") => getState().split(seperator),
}));
