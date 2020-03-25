import axios from 'axios';
import jwt_decode from 'jwt-decode';
import store from '../../store';
import * as Actions from '../../actions';

const errorMessage = [
  {
    code: 10001,
    message: 'not authenticated'
  },
  {
    code: 10002,
    message: 'session expired'
  },
  {
    code: 10003,
    message: 'session expired'
  },
];

const getValidAccessToken = () => new Promise(async(resolve, reject) => {
  let accessToken = store.getState().auth.accessToken;
  if (!accessToken) {
    throw errorMessage[0];
  }
  const expiresAccessToken = store.getState().auth.expiresAccessToken;
  if (expiresAccessToken * 1000 < new Date().getTime()) {
    const refreshToken = sessionStorage.getItem('refreshToken');
    const decoded = jwt_decode(refreshToken);
    if (decoded.exp * 1000 < new Date().getTime()) {
      throw errorMessage[1];
    }
    try {
      const data = await Actions.refreshToken();
      // console.log(data);
      accessToken = data.accessToken;
    } catch (error) {
      throw errorMessage[1];
    }
  }
  resolve(accessToken);
});

const get = (url, config = {}) => new Promise(async(resolve, reject) => {
  let accessToken = store.getState().auth.accessToken;
  try {
    accessToken = await getValidAccessToken();
  } catch (error) {
    throw error;
  }
  config['headers'] = { authorization: 'bearer ' + accessToken};
  axios.get(url, config)
  .then(response => {
    resolve(response);
  })
  .catch(error => {
    if (error.response && error.response.status === 434) {
      throw errorMessage[2];
    }
    reject(error.response);
  })
})

const put = (url, body, config = {}) => new Promise(async(resolve, reject) => {
  let accessToken = store.getState().auth.accessToken;
  try {
    accessToken = await getValidAccessToken();
  } catch (error) {
    throw error;
  }
  config['headers'] = { authorization: 'bearer ' + accessToken};
  axios.put(url, body, config)
  .then(response => {
    resolve(response);
  })
  .catch(error => {
    if (error.response && error.response.status === 434) {
      throw errorMessage[2];
    }
    reject(error.response);
  })
})

const post = (url, body, config = {}) => new Promise(async(resolve, reject) => {
  let accessToken = store.getState().auth.accessToken;
  try {
    accessToken = await getValidAccessToken();
  } catch (error) {
    throw error;
  }
  config['headers'] = { authorization: 'bearer ' + accessToken};
  axios.post(url, body, config)
  .then(response => {
    resolve(response);
  })
  .catch(error => {
    if (error.response && error.response.status === 434) {
      throw errorMessage[2];
    }
    reject(error.response);
  })
})

export default {
  get,
  put,
  post,
  errorMessage,
}
