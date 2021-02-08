import { createContext } from "../context";
import { age, name } from "../label/index.t";
import { storeApi } from "./index";

const root = createContext();

const ageApi = storeApi({ context: root, label: age });
const nameApi = storeApi({ context: root, label: name });
