import { createEmitter } from "./index";

const storeChanged = createEmitter<number>();

storeChanged().on(() => {});
storeChanged().off(() => {});
storeChanged().call(19);
