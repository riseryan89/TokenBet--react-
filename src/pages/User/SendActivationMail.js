import React, { Component } from 'react';
import axios from 'axios';
import { checkUserInput } from '../../util/common';
import { doModal } from '../../components/modal'

class SendActivationMail extends Component {
  handleSubmit = e => {
    if (!checkUserInput.validEmail(this.emailAddr.value)) {
      doModal.inform('CHECK FORM', 'check your email address');
      return;
    }

    e.preventDefault();
    const body = { emailAddr: this.emailAddr.value };
    // console.log(body);
    axios.post(`/api/users/sendActivationMail`, body)
    .then(response => {
      // console.log(response);
      this.props.history.push('/signup');
    })
    .catch(error => {
      console.error('error' + error);
      throw(error);
    });
  };

  render () {
    return (
    <div className="row bg-contents subpage mysubbg rounded shadow-lg">
      <div className="container col-xl-5 col-lg-8 col-md-12 mt-5">
        <h1 className="mb-5">Send Activation Mail</h1>
        <form>
         <div className="form-group text-sm-left lead">
          <label className="text-sm-left">E-MAIL</label>
          <input type="email" className="form-control" placeholder="Enter email" ref={ input => this.emailAddr = input }/>
         </div>
        </form>
        <button className="btn btn-warning btn-block btn-lg" onClick={this.handleSubmit}><i className="fa fa-envelope-o mr-2" />Send me again</button>
      </div>
    </div>
    )
  }
}

export default SendActivationMail;