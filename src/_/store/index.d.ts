import { Context } from "../context";
import { Label } from "../label";

export function storeApi(payload: {
  context: Context;
  label: Label<any, any>;
}): StoreApi;

export type StoreApi = void;

export function listenStore(payload: {
  context: Context;
  label: Label<any, any>;
}): ListenStore;

export type ListenStore = void;

export function listenStoreApi(payload: {
  context: Context;
  label: Label<any, any>;
}): ListenStoreApi;

export type ListenStoreApi = void;
