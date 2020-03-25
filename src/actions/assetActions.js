import { ASSETFETCH } from './types';
import { authRequest } from '../util/request';

export const updateAsset = () => {
  return (dispatch) => {
    return authRequest.get(`/api/wallet/assets`)
    .then(response => {return response.data})
    .then(data => {
      // console.log(data);
      dispatch({
        type: ASSETFETCH,
        payload: data
      })
    })
    .catch(error => {
      console.error('error' + error);
      throw(error);
    });
  }
}
