import React, { Component } from 'react';
import axios from 'axios';
import { doModal } from '../../components/modal'
import { checkUserInput } from '../../util/common';

class ForgotPassword extends Component {
  handleSubmit = e => {
    if (!checkUserInput.validEmail(this.emailAddr.value)) {
      doModal.inform('CHECK FORM', 'invalid email address', () => this.emailAddr.focus());
      return;
    }
    e.preventDefault();
    // forgotPassword(this.state);
    const body = { emailAddr: this.emailAddr.value, langCd: 'en' };
    // console.log(body);
    axios.post(`/api/users/findPw`, body)
    .then(response => {
      // console.log(response);
      doModal.inform('INFORM', 'Check you email to reset your password', () => this.props.history.push('/signin'));
    })
    .catch(error => {
      console.error('error' + error);
      throw(error);
    });
  };

  render () {
    return (
      <div className="row bg-contents subpage mysubbg rounded shadow-lg">
       <div className="container col-xl-4 col-lg-6 col-md-8 mt-5">
        <h1 className="mb-5">Forgot Password</h1>
          <form>
            <div className="form-group text-sm-left lead">
              <label className="text-sm-left">E-mail</label>
              <input type="text" className="form-control" placeholder="E-MAIL" ref={(input) => { this.emailAddr = input; }}/>
            </div>
          </form>
        <button className="btn btn-warning btn-block btn-lg" onClick={this.handleSubmit}>Send me</button>
       </div>
      </div>
    )
  }
}

export default ForgotPassword;