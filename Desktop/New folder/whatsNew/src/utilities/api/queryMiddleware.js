import { CALL_API } from "redux-api-middleware";

export default function queryMiddleware() {
  return (next) => (action) => {
    if (
      action.hasOwnProperty(CALL_API) &&
      action[CALL_API].hasOwnProperty("query")
    ) {
      const request = action[CALL_API];
      let params = request.endpoint
        .match(/\{.*?\}/g)
        .map((x) => x.replace(/[{}]/g, ""));
      while (params.length > 0) {
        let paramName = params.pop();
        let paramValue = request.query[paramName];
        if (paramValue !== 0 && !paramValue) {
          paramValue = "";
        }
        request.endpoint = request.endpoint.replace(
          `{${paramName}}`,
          paramValue
        );
      }
      delete request.query;

      return next({ [CALL_API]: request });
    }

    return next(action);
  };
}
