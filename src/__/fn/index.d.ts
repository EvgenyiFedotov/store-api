import { Context } from "../context";

export function fn<Result = void>(callback: (payload: { currentContext: Context }) => Result): FN<Result>;

export type FN<Result = void> = (payload: { context: Context }) => FNCallback<Result>;

export type FNCallback<Result = void> = () => Result;
