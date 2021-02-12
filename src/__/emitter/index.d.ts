export function emitter<Value>(): Emitter<Value>;

export type Emitter<Value> = {
  call: (value: Value) => Emitter<Value>;
  on: (callback: EmitterCallback<Value>) => Emitter<Value>;
  off: (callback: EmitterCallback<Value>) => Emitter<Value>;
};

export type EmitterCallback<Value> = (value: Value) => any;
