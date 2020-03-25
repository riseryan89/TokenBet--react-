import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { doModal } from '../../components/modal'
import { checkUserInput } from '../../util/common';

class SignUp extends Component {
  checkEmpty = (el, message) => {
    if (el.value.length === 0) {
      el.focus();
      doModal.inform('CHECK FORM', message);
      throw Error();
    }
  }

  validEmail = (el, message) => {
    if (!checkUserInput.validEmail(el.value)) {
      el.focus();
      doModal.inform('CHECK FORM', message);
      throw Error();
    }
  }

  vaildPassword = (el, message) => {
    if (!checkUserInput.vaildPassword(el.value)) {
      el.focus();
      doModal.inform('CHECK FORM', message);
      throw Error();
    }
  }

  checkInput = () => {
    this.checkEmpty(this.firstName, 'please fill first name');
    this.checkEmpty(this.lastName, 'please fill last name');
    this.checkEmpty(this.emailAddr, 'please fill email address');
    this.validEmail(this.emailAddr, 'please fill correct email address');
    this.checkEmpty(this.password, 'please fill password');
    this.checkEmpty(this.password2, 'please fill confirm password');
    this.vaildPassword(this.password, 'please fill correct password');
    this.vaildPassword(this.password2, 'please fill correct password');
    if (this.password.value !== this.password2.value) {
      this.password.focus();
      doModal.inform('CHECK FORM', 'please fill same password');
      throw Error();
    }
    if (!this.chTerms.checked) {
      this.password.focus();
      doModal.inform('CHECK FORM', 'please read and agree to the terms of Service');
      throw Error();
    }
  }

  handleSubmit = e => {
    try {
      this.checkInput();
    } catch (error) {
      console.error('errorooroo')
      return;
    }
    e.preventDefault();
    // signUp(this.state);
    this.handleReset();
    const body = {
      emailAddr: this.emailAddr.value,
      password: this.password.value,
      surname:this.lastName.value, 
      givenname:this.firstName.value,
    };
    // console.log(body);
    axios.post(`/api/users/signup`, body)
    .then(response => {
      // console.log(response);
      doModal.inform('INFORM', 'Check you email to activate your account', () => this.props.history.push('/signin'));
    })
    .catch(error => {
      console.error('error' + error);
      throw(error);
    });
  };

  handleReset = () => {
    this.firstName.vaue = null;
    this.lastName.vaue = null;
    this.emailAddr.vaue = null;
    this.password.vaue = null;
    this.password2.vaue = null;
  };

  render () {
    return (
    <div className="row bg-contents subpage mysubbg rounded shadow-lg">
      <div className="container col-xl-5 col-lg-8 col-md-12 mt-5">
        <h1 className="mb-5">Sign Up</h1>
        <div className="input-group mb-3 form-row">
          <div className="col-6">
            <input type="text" className="form-control" placeholder="First name" ref={(input) => { this.firstName = input; }}/>
          </div>
          <div className="col-6">
            <input type="text" className="form-control" placeholder="Last name" ref={(input) => { this.lastName = input; }}/>
          </div>
        </div>

        <form>
         <div className="form-group text-sm-left lead">
          <label className="text-sm-left">ID (Email address)</label>
          <input type="email" className="form-control" placeholder="Enter email" ref={(input) => { this.emailAddr = input; }}/>
         </div>
         <div className="form-group text-sm-left lead">
          <label className="text-sm-left">Password</label>
          <input type="password" className="form-control" placeholder="Password" ref={(input) => { this.password = input; }}/>
         </div>
         <div className="form-group text-sm-left lead">
          <label className="text-sm-left">Confirm Password</label>
          <input type="password" className="form-control" placeholder="Password" ref={(input) => { this.password2 = input; }}/>
         </div>
         <div className="form-group">
          <div className="form-check float-left lead">
            <input className="form-check-input row" type="checkbox" id="gridCheck" ref={(input) => { this.chTerms = input; }}></input>
            <label className="form-check-label text-sm-left mb-2 ml-1 row" for="gridCheck">
             <small>I read and agree to the "Term of Service"</small>
            </label>
          </div>
         </div>
        </form>
        <button className="btn btn-warning btn-block btn-lg" onClick={ this.handleSubmit }>Sign up</button>
        <div className="row">
          <div className="col-6 lead text-left">
            <NavLink exact className="nav-link js-scroll-trigger text-warning" to="/signin"><h6>SignIn</h6></NavLink>
          </div>
          <div className="col-6 lead text-right">
            <NavLink exact className="nav-link js-scroll-trigger text-warning" to="/sendactivationmail"><h6>Send Activation Mail</h6></NavLink>
          </div>
        </div>
      </div>
    </div>
    )
  }
}

export default SignUp;