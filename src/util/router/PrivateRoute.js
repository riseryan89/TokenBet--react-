import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import jwt_decode from 'jwt-decode'

const PrivateRoute = ({ component: Component, ...rest }) => {
  let authenticated = false;
  const refreshToken = sessionStorage.getItem('refreshToken');
  if (refreshToken) {
    const decoded = jwt_decode(refreshToken);
    authenticated = decoded.exp * 1000 > new Date().getTime(); 
  }
  return (
    <Route
      {...rest}
      render={props =>
        authenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/signin",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
}

export default PrivateRoute