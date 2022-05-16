import _ from "lodash";

const persistState = {
  getInitialState: (isDev, initialAppState) => {
    let appInitialState = initialAppState;
    if (isDev) {
      let localState = JSON.parse(sessionStorage.getItem("state"));
      if (localState) {
        appInitialState = localState;
      }
    }
    return appInitialState;
  },
  subscribe: (isDev, store) => {
    if (isDev) {
      var updateToLocalStorage = _.throttle(function () {
        sessionStorage.setItem("state", JSON.stringify(store.getState()));
      }, 1000);
      store.subscribe(() => {
        updateToLocalStorage();
      });
    }
  },
};

export default persistState;
