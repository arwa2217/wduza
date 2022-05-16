import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";
import interceptor from "../utilities/api/redux-api-middleware-interceptor";
import { apiMiddleware } from "redux-api-middleware";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./reducers/root-reducer";
import interceptorConfig, {
  applyDispatch,
} from "../utilities/api/interceptors";
import persistState from "./persisToSession";
import initialAppState from "./initialAppState";

import { initMessageRetriever } from "../utilities/messages-retriever";
const loggerMiddleware = createLogger();
const interceptorMiddleware = interceptor(interceptorConfig);

const isDev = false;
const appInitialState = persistState.getInitialState(isDev, initialAppState);

export const store = createStore(
  rootReducer,
  appInitialState,
  composeWithDevTools(
    applyMiddleware(
      thunkMiddleware,
      interceptorMiddleware,
      apiMiddleware
      // loggerMiddleware
    )
  )
);
applyDispatch(store.dispatch);
initMessageRetriever(store.dispatch);
persistState.subscribe(isDev, store);
