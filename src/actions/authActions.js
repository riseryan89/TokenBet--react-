import axios from 'axios';
import { SIGNIN, SIGNOUT, REFRESH_ACEESSTOKEN } from './types';
import jwt_decode from 'jwt-decode';
import store from '../store';

export const signIn = ({ emailAddr, password }) => {
  return (dispatch) => {
    const body = { emailAddr, password, lang:'en' };
    // console.log(body);
    return axios.post(`/api/users/login`, body)
    .then(response => response.data)
    .then(data => {
      try {
        if(data.login2FAtoken) {
          const decoded = jwt_decode(data.login2FAtoken);
          return ({
            token: data.login2FAtoken,
            decoded
          })
        } else {
          const decoded = jwt_decode(data.accessToken);
          if (decoded.subject === 'access') {
            // console.log(decoded)
            sessionStorage.setItem('accessToken', data.accessToken);
            sessionStorage.setItem('refreshToken', data.refreshToken);
            dispatch({
              type: SIGNIN,
              payload: {
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
              }
            });
          } else if (decoded.subject === 'login2FA') {
          }
          return ({
            token: data.accessToken,
            decoded
          })
        }
      } catch (error) {
        throw(error);
      }
    })
    .catch(error => {
      console.error('error' + error);
      throw(error);
    });
  };
};

export const tryReloadToken = () => {
  return (dispatch) => {
    const accessToken = sessionStorage.getItem('accessToken');
    const refreshToken = sessionStorage.getItem('refreshToken');
    if (!accessToken) {
      return;
    }
    try {
      dispatch({
        type: SIGNIN,
        payload: {
          accessToken: accessToken,
          refreshToken: refreshToken,
        }
      });
    } catch (error) {
      console.error(error);
    }
  }
}

export const refreshToken = () => {
  console.log('refreshToken');
  const refreshToken = sessionStorage.getItem('refreshToken');
  const body = { refreshToken };
  return axios.post('/api/users/token', body)
  .then(response => response.data)
  .then(data => {
    // console.log(data);
    const decoded = jwt_decode(data.accessToken);
    sessionStorage.setItem('accessToken', data.accessToken);
    store.dispatch({
      type: REFRESH_ACEESSTOKEN,
      payload: {
        accessToken: data.accessToken,
      }
    });
    return ({
      accessToken: data.accessToken,
      decoded
    })
  })
  .catch(error => {
    console.error(error);
  })
}

export const signIn2FA = (tokenLogin2FA, otpCode) => {
  return (dispatch) => {
    const body = { tokenLogin2FA, otpCode };
    // console.log(body);
    return axios.post(`/api/users/login2FA`, body)
    .then(response => response.data)
    .then(data => {
      try {
        var jwt_decode = require('jwt-decode');
        var decoded = jwt_decode(data.accessToken);
        if (decoded.subject === 'access') {
          sessionStorage.setItem('accessToken', data.accessToken);
          sessionStorage.setItem('refreshToken', data.refreshToken);
          dispatch({
            type: SIGNIN,
            payload: {
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
            }
          });
        }
        return {
          token: data.accessToken,
          decoded
        };
      } catch (error) {
        throw(error);
      }
    })
    .catch(error => {
      console.error('error' + error);
      throw(error);
    });
  };
};

export const signOut = () => {
  sessionStorage.removeItem('accessToken');
  sessionStorage.removeItem('refreshToken');
  return (dispatch) => {
    dispatch({
      type: SIGNOUT,
    });
  }
};
