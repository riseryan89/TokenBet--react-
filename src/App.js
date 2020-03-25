import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import { HeaderMenu } from './components';
import { ArenaGameMain, Funding } from './pages';
import User, { SignIn, SignUp, ForgotPassword, AccountActivation, OtpAccountActivation, ChgForgotPw, SendActivationMail } from './pages/User';
import { Page404 } from './pages/Error';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ModalContainer } from './components/modal';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <div className="App">
            <HeaderMenu/>
            <div className="App-header container-fluid">
              <Switch>
                <Route exact path='/' component={ArenaGameMain}/>
                <Route path='/fund' component={Funding}/>
                <Route path='/my' component={User}/>

                <Route path='/signin' component={SignIn}/>
                <Route path='/signup' component={SignUp}/>
                <Route path='/forgotpassword' component={ForgotPassword}/>
                <Route path='/sendactivationmail' component={SendActivationMail}/>
                
                <Route path='/activation/:token' component={AccountActivation}/>
                <Route path='/otp/activation/:token' component={OtpAccountActivation}/>
                <Route path='/chgForgotPw/:token' component={ChgForgotPw}/>
                <Route component={Page404} />
              </Switch>
            </div>
          </div>
          <ModalContainer/>
          <ToastContainer autoClose={10000} />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
