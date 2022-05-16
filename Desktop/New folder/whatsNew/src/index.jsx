import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";

import React, { Suspense } from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";

import { store } from "./store/store";
import { App } from "./components/app";
import "./i18n";
/*
 * This is the main entry point of the application, redux and store is defined here.
 */
render(
  <Provider store={store}>
    <Suspense fallback={<div className="loading">&#8230;</div>}>
      <App />
    </Suspense>
  </Provider>,
  document.getElementById("root")
);
