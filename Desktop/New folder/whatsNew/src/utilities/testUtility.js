import React from "react";
import { Provider } from "react-redux";
import { mount } from "enzyme";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import initialAppState from "../store/initialAppState";

const mockStore = configureMockStore([thunk]);

const store = mockStore(initialAppState);

export default {
  mount: (Component, props = {}, localState) => {
    let localStore = store;
    if (localState) {
      localStore = mockStore(localState);
    }
    const wrapper = mount(
      <Provider store={localStore}>
        <Component {...props} />
      </Provider>
    );
    return wrapper.find(Component).first();
  },
};
