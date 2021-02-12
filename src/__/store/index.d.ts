import { MethodShape, ContextLabel, Method } from "../api";

export function store<State, Methods extends MethodShape>(
  contextLabel: ContextLabel<State, Methods>
): Store<State, Methods>;

export type Store<State, Methods extends MethodShape> = {
  on: (callback: (state: State) => any) => Store<State, Methods>;
  off: (callback: (state: State) => any) => Store<State, Methods>;
};

export function storeApi<Methods extends MethodShape>(
  contextLabel: ContextLabel<any, Methods>
): Methods;

export function storeApiListen<Methods extends MethodShape>(
  contextLabel: ContextLabel<any, Methods>
): StoreApiListen<Methods>;

export type StoreApiListen<Methods extends MethodShape> = {
  [Key in keyof Methods]: StoreApiListenMethod<Methods[Key]>;
}

export type StoreApiListenMethod<M extends Method<any, any>> = {
  on: (callback: (payload: {
    params: Parameters<M>;
    result: ReturnType<M>;
  }) => any) => StoreApiListenMethod<M>;
  off: (callback: (payload: {
    params: Parameters<M>;
    result: ReturnType<M>;
  }) => any) => StoreApiListenMethod<M>;
};
