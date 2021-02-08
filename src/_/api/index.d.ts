export function createApi<State, Methods extends MethodShape>(
  getMethods: GetMethods<State, Methods>
): Api<State, Methods>;

export type GetMethods<State, Methods extends MethodShape> = (payload: {
  getState: () => State;
  setState: (payload: State | ((prev: State) => State)) => State;
  reset: () => State;
}) => {
  [Key in keyof Methods]: (...params: Methods[Key]["params"]) => Methods[Key]["result"];
};

export type Api<State, Methods extends MethodShape> = () => ApiPublic<State, Methods>;

export type ApiPublic<State, Methods extends MethodShape> = {
  getMethods: GetMethods<State, Methods>;
};

export type MethodShape = { [key: string]: Method; };

export type Method = { params: Array<any>; result: any };
