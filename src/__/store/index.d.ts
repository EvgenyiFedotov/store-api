import { Store, StoreApiListen, MethodShape, ContextLabelCallbackPayload } from "../context";

export function store<State, Methods extends MethodShape>(
  payload: ContextLabelCallbackPayload<State, Methods>
): Store<State, Methods>;

export function storeApi<Methods extends MethodShape>(
  payload: ContextLabelCallbackPayload<any, Methods>
): Methods;

export function storeApiListen<Methods extends MethodShape>(
  payload: ContextLabelCallbackPayload<any, Methods>
): StoreApiListen<Methods>;

