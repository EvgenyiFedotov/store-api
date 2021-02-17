import { Context, ContextLabel, MethodShape, GetMethods, CheckType } from "../context";

export function api<State>(payload: {
  type: CheckType<State>;
}): CreateApi<State>;

export type CreateApi<State> = <Methods extends MethodShape>(payload: {
  methods: GetMethods<State, Methods>
}) => CreateLabel<State, Methods>;

export type CreateLabel<State, Methods extends MethodShape> = (payload: {
  init: State;
}) => AttachLabel<State, Methods>;

export type AttachLabel<State, Methods extends MethodShape> = (payload: {
  context: Context;
}) => ContextLabel<State, Methods>;
