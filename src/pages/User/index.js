import React, { Component } from 'react';
import { NavLink, Switch } from 'react-router-dom';
import { PrivateRoute } from '../../util/router';
import ChangePW from './ChangePW';
import Certi2FA from './Certi2FA';
import MyPage from './MyPage';
import SignIn from './SignIn';
import SignUp from './SignUp';
import ForgotPassword from './ForgotPassword';
import AccountActivation from './AccountActivation';
import OtpAccountActivation from './OtpAccountActivation';
import ChgForgotPw from './ChgForgotPw';
import SendActivationMail from './SendActivationMail';

class User extends Component {
  render() {
    return (
      <div className="bg-contents subpage mysubbg rounded">
        <div className="row justify-content-center">
          <div className='col-md-8 col-sm-12 btn-group mt-5'>
            <NavLink className="col btn btn-funding" to="/my/myPage"><small>MyPage</small></NavLink>
            <NavLink className="col btn btn-funding" to="/my/changePW"><small>Password Change</small></NavLink>
            <NavLink className="col btn btn-funding" to="/my/certi2FA"><small>OTP Enable</small></NavLink>
          </div>
        </div>
        <div className='container-fluid'>
          <Switch>
            <PrivateRoute path='/my/myPage' component={MyPage}/>
            <PrivateRoute path='/my/certi2FA' component={Certi2FA}/>
            <PrivateRoute path='/my/changePW' component={ChangePW}/>
          </Switch>
        </div>
      </div>
    )
  }
}

export default User;
export { SignIn, SignUp, ForgotPassword, AccountActivation, OtpAccountActivation, ChgForgotPw, SendActivationMail };
