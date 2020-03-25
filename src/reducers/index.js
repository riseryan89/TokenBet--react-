import { combineReducers } from 'redux';
import auth from './authReducer';
import asset from './assetReducer';
import game from './gameReducer';
import common from './commonReducer';

export default combineReducers({
  auth, asset, game, common
});