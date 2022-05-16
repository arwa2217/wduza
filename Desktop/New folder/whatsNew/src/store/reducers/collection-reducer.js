import * as types from "../actionTypes/collectionTypes";
const initialState = {
  collectionData: {},
  activeCollection: {
    name: "ALL",
    id: "ALL",
  },
  notificationIdsWS: {},
};

const CollectionReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_COLLECTION_DATA:
      return {
        ...state,
        collectionData: action.payload,
      };
    case types.UPDATE_COLLECTION_DATA:
      return {
        ...state,
        collectionData: action.payload,
      };
    case types.SET_NOTIFICATIONS_WS:
      return {
        ...state,
        notificationIdsWS: action.payload,
      };
    case types.SET_ACTIVE_COLLECTION:
      return {
        ...state,
        activeCollection: action.payload,
      };
    default:
      return state;
  }
};

export default CollectionReducer;
