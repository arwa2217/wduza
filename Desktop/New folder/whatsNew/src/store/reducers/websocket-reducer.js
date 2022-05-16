import { FETCH_WEBSOCKET_STATUS } from "../actionTypes/websocket-action-types";

let initialState = {
  isWebSocketAvailable: undefined,
};

const websocketReducer = (state = { ...initialState }, action) => {
  switch (action.type) {
    case FETCH_WEBSOCKET_STATUS:
      return {
        ...state,
        isWebSocketAvailable: action.payload.value,
      };
    default:
      return state;
  }
};

export default websocketReducer;
