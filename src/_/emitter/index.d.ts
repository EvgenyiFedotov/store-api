export type EmitterCallback<Value> = (value: Value) => any;

export type EmitterPublic<Value> = {
  call: (value: Value) => EmitterPublic<Value>;
  on: (callback: EmitterCallback<Value>) => EmitterPublic<Value>;
  off: (callback: EmitterCallback<Value>) => EmitterPublic<Value>;
};

export type Emitter<Value> = () => EmitterPublic<Value>;

export function createEmitter<Value>(): Emitter<Value>;
