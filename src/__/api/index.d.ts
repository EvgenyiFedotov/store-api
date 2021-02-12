import { Context } from "../context";

export function api<State>(payload: {
  type: (state: State) => boolean;
}): CreateApi<State>;

export type CreateApi<State> = <Methods extends MethodShape>(
  getMethods: (payload: {
    get: () => State;
    set: (payload: State | ((prev: State) => State)) => State;
    reset: () => State;
  }) => Methods
) => CreateLabel<State, Methods>;

export type CreateLabel<State, Methods extends MethodShape> = (payload: {
  init: State;
}) => AttachLabel<State, Methods>;

export type AttachLabel<State, Methods extends MethodShape> = (payload: {
  context: Context;
}) => ContextLabel<State, Methods>;

export type ContextLabel<State, Methods extends MethodShape> = () => void;

export type MethodShape = {
  [Key: string]: Method<any, any>;
};

export type Method<Params extends Array<any>, Result = void> = (
  ...params: Params
) => Result;
