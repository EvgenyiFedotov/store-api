function api(apiPayload) {
  const createApi = (createApiPayload) => {
    const createLabel = (createLabelPayload) => {
      const attachLabel = (attachLabelPayload) => {
        let callbackPayload = null;

        const contextLabel = (callback) => {
          if (callbackPayload === null) {
            callbackPayload = {
              store: () => attachLabelPayload.context.store(contextLabel),
              storeApi: () => attachLabelPayload.context.storeApi(contextLabel),
              storeApiListen: () =>
                attachLabelPayload.context.storeApiListen(contextLabel),
            };
          }

          return callback(callbackPayload);
        };

        attachLabelPayload.context.attachStoreConfig(contextLabel, {
          type: apiPayload.type,
          methods: createApiPayload.methods,
          init: createLabelPayload.init,
        });

        return contextLabel;
      };

      return attachLabel;
    };

    return createLabel;
  };

  return createApi;
}

module.exports = { api };
