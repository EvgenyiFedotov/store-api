import { Context } from "../context";

export function fn<Result = void>(payload: {
  callback: (payload: { context: Context }) => Result
}): FN<Result>;

export type FN<Result = void> = (payload: { context: Context }) => ContextFN<Result>;

export type ContextFN<Result = void> = () => Result;
