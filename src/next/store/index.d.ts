import { ContextScope } from "../context";

type BaseConfigMethods = {
  [key: string]: { params: Array<any>, result: any };
};

type StoreApi<
  State,
  ConfigMethods extends BaseConfigMethods,
> = () => any;

export function storeApi<
  State,
  ConfigMethods extends BaseConfigMethods,
>(payload: {
  init: State;
  api: (payload: {
    getState: () => State;
    setState: (payload: State | ((prev: State) => State)) => State;
    reset: () => State;
  }) => ({
    [Key in keyof ConfigMethods]: (
      ...params: ConfigMethods[Key]["params"]
    ) => ConfigMethods[Key]["result"];
  });
  checkType?: (state: State) => boolean;
}): StoreApi<State, ConfigMethods>;

type Label<
  State,
  ConfigMethods extends BaseConfigMethods,
> = () => any;

export function label<
  State,
  ConfigMethods extends BaseConfigMethods,
>(
  storeApi: StoreApi<State, ConfigMethods>
): Label<State, ConfigMethods>;

type Api<
  State,
  ConfigMethods extends BaseConfigMethods,
> = () => {
  [Key in keyof ConfigMethods]: (
    ...params: ConfigMethods[Key]["params"]
  ) => ConfigMethods[Key]["result"];
};

export function api<
  State,
  ConfigMethods extends BaseConfigMethods,
>(
  label: Label<State, ConfigMethods>
): Api<State, ConfigMethods>;

type Listen<
  State,
  ConfigMethods extends BaseConfigMethods,
> = () => {
  store: {
    on: (callback: (state: State) => void) => void;
    off: (callback: (state: State) => void) => void;
  };
  api: {
    [Key in keyof ConfigMethods]: {
      before: {
        on: (
          callback: (payload: { params: ConfigMethods[Key]["params"]; }) => void
        ) => void;
        off: (
          callback: (payload: {  params: ConfigMethods[Key]["params"]; }) => void
        ) => void;
      };
      after: {
        on: (
          callback: (payload: {
            params: ConfigMethods[Key]["params"];
            result: ConfigMethods[Key]["result"];
          }) => void
        ) => void;
        off: (
          callback: (payload: {
            params: ConfigMethods[Key]["params"];
            result: ConfigMethods[Key]["result"];
          }) => void
        ) => void;
      };
    }
  };
};

export function listen<
  State,
  ConfigMethods extends BaseConfigMethods,
>(
  label: Label<State, ConfigMethods>
): Listen<State, ConfigMethods>;

export function listenStore<
  State,
  ConfigMethods extends BaseConfigMethods,
>(
  label: Label<State, ConfigMethods>
): () => ReturnType<Listen<State, ConfigMethods>>["store"];

export function listenApi<
  State,
  ConfigMethods extends BaseConfigMethods,
>(
  label: Label<State, ConfigMethods>
): () => ReturnType<Listen<State, ConfigMethods>>["api"];

type Full<
  State,
  ConfigMethods extends BaseConfigMethods,
> = () => {
  api: ReturnType<Api<State, ConfigMethods>>;
  listen: ReturnType<Listen<State, ConfigMethods>>;
};

export function full<
  State,
  ConfigMethods extends BaseConfigMethods,
>(
  label: Label<State, ConfigMethods>
): Full<State, ConfigMethods>;

export function attach<
  Source extends { [key: string]: () => any; }
>(payload: {
  context: ContextScope;
  source: Source;
}): {
  [Key in keyof Source]: ReturnType<Source[Key]>;
};

type Callback<Result = void> = () => Result;

export function callback<Result = void>(
  payload: (currentContext: ContextScope) => Result,
  config?: {
    side?: "both" | "server" | "client"; // Default: "both"
    once?: boolean; // Default: true
  }
): Callback<Result>;
