import { SELECTGAME } from '../actions/types';

export default function gameReducer(state = {}, action) {
  // console.log(action);
  switch (action.type) {
    case SELECTGAME:
      return Object.assign({}, state, {
        selected: action.payload
      });
    default:
      return state;
  }
}