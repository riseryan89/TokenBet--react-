import { TIMESYNC, GAMECANCELCODES } from '../actions/types';

export default function commonReducer(state = {}, action) {
  // console.log(action);
  switch (action.type) {
    case TIMESYNC:
      state.servertime = action.payload;
      return state
    case GAMECANCELCODES:
      state.gameCancelCodes = action.payload;
      return state
    default:
      return state;
  }
}
