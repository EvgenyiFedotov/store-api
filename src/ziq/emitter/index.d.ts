export function createEmitter<Value>(): Emitter<Value>;

export type Emitter<Value> = {
  call: (value: Value) => Emitter<Value>;
  subscribe: (callback: EmitterCallback<Value>) => Emitter<Value>;
  unsubscribe: (callback: EmitterCallback<Value>) => Emitter<Value>;
};

export type EmitterCallback<Value> = (value: Value) => any;
