import axios from 'axios';
import { TIMESYNC, GAMECANCELCODES } from './types';

export const getServerTime = () => {
  return (dispatch) => {
    return axios.get(`/api/servertime`)
    .then(response => {return response.data})
    .then(data => {
      return ({
        lastServerTime:data.servertime,
        timeGap:data.servertime - new Date().getTime()
      })
    })
    .then(payload => {
      // console.log(payload);
      dispatch({
        type: TIMESYNC,
        payload
      })
      return payload;
    })
    .catch(error => {
      console.error('error' + error);
      throw(error);
    });
  };
};

export const getCancelCodes = () => {
  return (dispatch) => {
    return axios.get(`/api/game/cancelcodes`)
    .then(response => {return response.data})
    .then(cancelcodes => {
      // console.log(cancelcodes);
      dispatch({
        type: GAMECANCELCODES,
        payload: cancelcodes
      })
    })
    .catch(error => {
      console.error('error' + error);
      throw(error);
    });
  };
};
