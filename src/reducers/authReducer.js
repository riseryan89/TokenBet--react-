import jwt_decode from 'jwt-decode';
import { SIGNIN, SIGNOUT, REFRESH_ACEESSTOKEN } from '../actions/types';

const initialState = {
  expiresAccessToken: 1,
  expiresRefreshToken: 1,
}

export default function authReducer(state = initialState, action) {
  // console.log(action);
  switch (action.type) {
    case SIGNIN:
    {
      const { accessToken, refreshToken } = action.payload;
      const decodedAccess = jwt_decode(accessToken);
      const decodedRefresh = jwt_decode(refreshToken);

      const { emailAddr, givenname, surname, twoFactorUse } = decodedAccess;
      const expiresAccessToken = decodedAccess.exp;
      const expiresRefreshToken = decodedRefresh.exp;

      return Object.assign({}, state, {
        accessToken, refreshToken, emailAddr, givenName: givenname, surName: surname, twoFactorUse, expiresAccessToken, expiresRefreshToken
      })
    }
    case SIGNOUT:
      return initialState;
    case REFRESH_ACEESSTOKEN:
    {
      const { accessToken } = action.payload;
      const decodedAccess = jwt_decode(accessToken);
      const { emailAddr, givenname, surname, twoFactorUse } = decodedAccess;
      const expiresAccessToken = decodedAccess.exp;

      return Object.assign({}, state, {
        accessToken, emailAddr, givenName: givenname, surName: surname, twoFactorUse, expiresAccessToken
      })
    }
    default:
      return state;
  }
}