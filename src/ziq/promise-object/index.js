function createPromiseObject() {
  let resolve, reject;
  const instance = new Promise((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });
  return { resolve, reject, instance };
}

module.exports = { createPromiseObject };
