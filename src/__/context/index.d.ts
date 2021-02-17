export function context(): Context;

export type Context = {
  // Hide for public
  // attachStoreConfig: <State, Methods extends MethodShape>(
  //   contextLabel:  ContextLabel<State, Methods>,
  //   storeConfig: StoreConfig<State, Methods>
  // ) => StoreConfig<State, Methods>,
  store: <State, Methods extends MethodShape>(
    contextLabel: ContextLabel<State, Methods>
  ) => Store<State, Methods>;
  storeApi: <State, Methods extends MethodShape>(
    contextLabel: ContextLabel<State, Methods>
  ) => Methods;
  storeApiListen: <State, Methods extends MethodShape>(
    contextLabel: ContextLabel<State, Methods>
  ) => StoreApiListen<Methods>;
};

export type ContextLabel<State, Methods extends MethodShape> = <Result = void>(
  callback: (payload: ContextLabelCallbackPayload<State, Methods>) => Result
) => Result;

export type ContextLabelCallbackPayload<State, Methods extends MethodShape> = {
  store: () => Store<State, Methods>;
  storeApi: () => Methods;
  storeApiListen: () => StoreApiListen<Methods>;
};

export type GetMethods<State, Methods extends MethodShape> = (payload: {
  get: () => State;
  set: (payload: State | ((prev: State) => State)) => State;
  reset: () => State;
}) => Methods;

export type CheckType<State> = (state: State) => boolean;

export type StoreConfig<State, Methods extends MethodShape> = {
  init: State;
  methods: GetMethods<State, Methods>;
  type: CheckType<State>;
};

export type MethodShape = {
  [Key: string]: Method<any, any>;
};

export type Method<Params extends Array<any>, Result = void> = (
  ...params: Params
) => Result;

export type Store<State, Methods extends MethodShape> = {
  on: (callback: (state: State) => any) => Store<State, Methods>;
  off: (callback: (state: State) => any) => Store<State, Methods>;
};

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
