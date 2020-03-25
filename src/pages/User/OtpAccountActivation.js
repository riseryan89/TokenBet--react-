import React, { Component } from 'react';
import axios from 'axios';
import { doModal } from '../../components/modal'

class OtpAccountActivation extends Component {
  componentDidMount () {
    // console.log(this.props.match.params.token);
    const body = { activationToken: this.props.match.params.token };
    // console.log(body);
    axios.post(`/api/mypage/otp/activation`, body)
    .then(response => {
      // console.log(response);
      doModal.inform('INFORM', 'Successfully activated. Please sign-in', () => this.props.history.push('/signin'));
    })
    .catch(error => {
      console.error('error' + error);
      throw(error);
    });
  }

  render () {
    return (
      <div className="container">
        <h1>Account Activation</h1>
        <a className="btn btn-primary btn-block" href="/signin">Go to Login Page</a>
      </div>
    )
  }
}

export default OtpAccountActivation;
