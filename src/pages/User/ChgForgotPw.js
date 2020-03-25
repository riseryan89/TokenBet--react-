import React, { Component } from 'react';
import axios from 'axios';
import { doModal } from '../../components/modal'
import { checkUserInput } from '../../util/common';

const jwt_decode = require('jwt-decode');

class ChgForgotPw extends Component {
  constructor(props) {
    super(props);
    this.state = { emailAddr: '' }
  }

  componentDidMount () {
    // console.log(this.props.match.params.token);
    this.token = this.props.match.params.token;
    var decoded = jwt_decode(this.token);
    // console.log(decoded);
    this.emailAddr = decoded.email;
    // console.log(decoded.email);
    this.setState({
      emailAddr: decoded.email
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    if (!checkUserInput.vaildPassword(this.newPassword.value)) {
      doModal.inform('CHECK', 'please input complex password');
      this.newPassword.focus();
      return;
    }
    if (this.newPassword.value !== this.newPassword2.value) {
      doModal.inform('CHECK', 'new passwords are not equal.');
      this.newPassword.focus();
      return;
    }
    this.chgForgotPw(this.token, this.state.emailAddr, this.newPassword.value);
  };

  chgForgotPw(forgotPwToken, emailAddr, password) {
    // console.log('chgForgotPw');
    // console.log(forgotPwToken, emailAddr, password)
    const payload = {
      emailAddr,
      password
    };
    axios.post('/api/users/forgetChgPw', payload, {
      headers: {
        'forgotpwkey': "bearer " + forgotPwToken
      }
    })
    .then(response => {
      // console.log(response);
      doModal.inform('INFORM', 'Successfully changed. Please login', () => this.props.history.push('/signin'));
    })
    .catch(error => {
      console.error('error' + error);
      throw(error);
    });
  }

  render () {
    return (
      <div className="container col-xl-5 col-lg-8 col-md-12">
        <h1>Change Password</h1>
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text" id="basic-addon1">E-MAIL</span>
          </div>
          <input type="text" className="form-control" placeholder="E-MAIL" aria-label="Username" aria-describedby="basic-addon1"
            defaultValue={ this.state.emailAddr } disabled="true"/>
        </div>
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text" id="basic-addon1">New Password</span>
          </div>
          <input type="password" className="form-control" placeholder="Password" ref={ input => this.newPassword = input}/>
        </div>
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text" id="basic-addon1">Confirm Password</span>
          </div>
          <input type="password" className="form-control" placeholder="Password" ref={ input => this.newPassword2 = input}/>
        </div>
        <button className="btn btn-primary btn-block" onClick={this.handleSubmit}>Change</button>
      </div>
    )
  }
}

export default ChgForgotPw;
