import { createLabel } from "./index";
import { numberApi, stringApi } from "../api/index.t";

export const age = createLabel({ api: numberApi, init: 0 });
export const name = createLabel({ api: stringApi, init: "", name: "user-name" });
