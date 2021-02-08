export type ContextScope = <Result = void>(
  callback: () => Result
) => Result;

export function context(): ContextScope;
