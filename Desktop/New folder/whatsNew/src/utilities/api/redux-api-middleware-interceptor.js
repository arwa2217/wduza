import * as reduxAPIMiddelware from "redux-api-middleware";

const isFunction = (func) => typeof func === "function";
const isObject = (obj) => typeof obj === "object";
const throwError = (name, expected) => {
  throw `Expected '${name}' to be ${expected}`;
};

const getHeaders = (headerParams, origHeaders = {}, state) => {
  const headers = isFunction(headerParams)
    ? headerParams(origHeaders, state)
    : headerParams;
  return isObject(headers) ? headers : origHeaders;
};

const getCustomURL = (url, config, state) => {
  if (
    !/^((http|https|ftp):\/\/)/i.test(url) &&
    config.getURL &&
    (isFunction(config.getURL) || throwError("getURL", "Function"))
  ) {
    const customURL = config.getURL(url, state);
    if (!customURL) throwError("return value of getURL", "String");
    return customURL;
  }
  return url;
};

/**
 * configObj = {
 *  headers: Object|Function,
 *  getURL: Function,
 *  onRequestInit: Function,
 *  onRequestSuccess: Function,
 *  onRequestError: Function
 * }
 */
export default (configObj = {}) =>
  ({ getState }) =>
  (next) =>
  (action) => {
    const callApi =
      action[reduxAPIMiddelware.CALL_API] || action[reduxAPIMiddelware.RSAA];
    // Check if this action is a redux-api-middleware action.
    if (callApi) {
      const state = getState();

      // Set headers
      callApi.headers = getHeaders(configObj.headers, callApi.headers, state);

      // GET CUSTOM API URL if getURL func exist in config obj
      callApi.endpoint = getCustomURL(callApi.endpoint, configObj, state);

      // add response interceptor to watch on request calls
      if (
        configObj.onRequestInit &&
        (isFunction(configObj.onRequestInit)
          ? true
          : throwError("onRequestInit", "Function"))
      ) {
        const type = callApi.types[0];
        if (typeof type !== "object") {
          callApi.types[0] = {
            type,
            payload: (dispatchedAction, _state, res) => {
              configObj.onRequestInit(_state);
              return res;
            },
          };
        } else {
          let backup = callApi.types[0].payload;
          callApi.types[0].payload = function (dispatchedAction, _state, res) {
            configObj.onRequestInit(_state);
            return typeof type.payload === typeof "function"
              ? backup(dispatchedAction, _state, res)
              : backup;
          };
        }
      }

      // add response interceptor to watch on success calls
      if (
        configObj.onRequestSuccess &&
        (isFunction(configObj.onRequestSuccess)
          ? true
          : throwError("onRequestSuccess", "Function"))
      ) {
        const type = callApi.types[1];
        if (typeof type !== "object") {
          callApi.types[1] = {
            type,
            payload: (dispatchedAction, _state, res) => {
              const promise = res.json();
              promise.then((json) => {
                configObj.onRequestSuccess(_state, Object.assign({}, json));
              });
              return promise;
            },
          };
        } else {
          let backup = callApi.types[1].payload;
          type.payload = (dispatchedAction, _state, res) => {
            const promise = res.clone().json();
            promise.then((json) => {
              configObj.onRequestSuccess(_state, Object.assign({}, json));
            });
            return typeof backup === "function"
              ? backup(dispatchedAction, _state, res)
              : backup;
          };
        }
      }

      // add response interceptor to watch on error calls
      if (
        configObj.onRequestError &&
        (isFunction(configObj.onRequestError)
          ? true
          : throwError("onRequestError", "Function"))
      ) {
        const type = callApi.types[2];
        if (typeof type !== "object") {
          callApi.types[2] = {
            type,
            payload: (dispatchedAction, _state, res) => {
              const contentType = res.headers.get("content-type");
              if (contentType == null) {
                configObj.onRequestError(
                  _state,
                  Object.assign({ status_code: res.status }, res)
                );
              } else if (contentType.startsWith("text/plain;")) {
                const clonedRes = res.clone();
                res.text().then((text = {}) => {
                  try {
                    configObj.onRequestError(
                      _state,
                      Object.assign(
                        { status_code: res.status },
                        JSON.parse(text)
                      )
                    );
                  } catch (e) {
                    configObj.onRequestError(_state, {
                      status_code: res.status,
                      is_json: false,
                      raw_res: text,
                    });
                  }
                });

                return clonedRes;
              } else if (contentType.startsWith("application/json;")) {
                const promise = res.json();
                promise.then((json) => {
                  configObj.onRequestError(
                    _state,
                    Object.assign({ status_code: res.status }, json)
                  );
                });
                return promise;
              } else {
                configObj.onRequestError(
                  _state,
                  Object.assign(
                    {
                      status_code: res.status,
                      is_json: false,
                      raw_res: res,
                    },
                    res
                  )
                );
              }
              return res;
              {
                /*
              const clonedRes = res.clone();
  
              res.text().then((text = {}) => {
                try {
                  configObj.onRequestError(
                    _state,
                    Object.assign({ status_code: res.status }, JSON.parse(text))
                  );
                } catch (e) {
                  configObj.onRequestError(_state, {
                    status_code: res.status,
                    is_json: false,
                    raw_res: text,
                  });
                }
              });
  
              return clonedRes;
              */
              }
            },
          };
        } else {
          //TODO Need to check in which case it required.
          const backup = callApi.types[2];
          const oldPayload = callApi.types[2].payload
            ? callApi.types[2].payload
            : null;
          type.payload = (dispatchedAction, _state, res) => {
            const clonedRes = res.clone();

            res.text().then((text = {}) => {
              try {
                configObj.onRequestError(
                  _state,
                  Object.assign({ status_code: res.status }, JSON.parse(text))
                );
              } catch (e) {
                configObj.onRequestError(_state, {
                  status_code: res.status,
                  is_json: false,
                  raw_res: text,
                });
              }
            });
            if (oldPayload !== null) {
              return typeof oldPayload === "function"
                ? oldPayload(dispatchedAction, _state, clonedRes)
                : oldPayload;
            }
            return typeof backup === "function"
              ? backup(dispatchedAction, _state, clonedRes)
              : backup;
          };
        }
      }
    }

    // Pass the FSA to the next action.
    return next(action);
  };
