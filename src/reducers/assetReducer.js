import { ASSETFETCH } from '../actions/types';

export default function assetReducer(state = {}, action) {
  // console.log(action);
  switch (action.type) {
    case ASSETFETCH:
      return action.payload;
    default:
      return state;
  }
}