import * as types from "../actionTypes/collectionTypes";

export const getCollectionData = (collectionData) => {
  return {
    type: types.GET_COLLECTION_DATA,
    payload: collectionData,
  };
};
export const updateCollectionData = (collectionData) => {
  return {
    type: types.UPDATE_COLLECTION_DATA,
    payload: collectionData,
  };
};
export const updateNotificationWS = (notification) => {
  return {
    type: types.SET_NOTIFICATIONS_WS,
    payload: notification,
  };
};

export const setActiveCollection = (collection) => {
  return {
    type: types.SET_ACTIVE_COLLECTION,
    payload: collection,
  };
};
