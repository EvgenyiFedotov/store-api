import { Api, MethodShape } from "../api";

export function createLabel<State, Methods extends MethodShape>(payload: {
  init: State;
  api: Api<State, Methods>;
  name?: string;
}): Label<State, Methods>;

export type Label<State, Methods extends MethodShape> = () => LabelPublic<State, Methods>;

export type LabelPublic<State, Methods extends MethodShape> = {
  init: State;
  api: Api<State, Methods>;
  name?: string;
};
