import React, { PureComponent } from "react";
import { Route, Redirect } from "react-router-dom";
import { getAuthToken } from "../../utilities/app-preference";

/*
 *Component to verify if user logged in
 *Currently local storage, logic need to be added to get state from backend
 */
class PrivateRoute extends PureComponent {
  render() {
    const { component: Component, ...rest } = this.props;
    return (
      <Route
        {...rest}
        render={(props) =>
          getAuthToken() ? (
            <Component {...props} />
          ) : (
            <Redirect
              to={{
                pathname: "/home",
                state: { from: props.location },
              }}
            />
          )
        }
      />
    );
  }
}

export default PrivateRoute;
