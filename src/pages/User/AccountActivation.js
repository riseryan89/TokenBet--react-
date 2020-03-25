import React, { Component } from 'react';
import axios from 'axios';

class AccountActivation extends Component {
  componentDidMount () {
    // console.log(this.props.match.params.token);
    this.accountActivation(this.props.match.params.token);
  }

  accountActivation(activationToken) {
    // console.log(activationToken)
    const body = { activationToken };
    // console.log(body);
    return axios.post(`/api/users/activation`, body)
      .then(response => {
        // console.log(response);
      })
      .catch(error => {
        console.error('error' + error);
        throw(error);
      });
  }

  render () {
    return (
      <div className="container col-xl-5 col-lg-8 col-md-12">
        <h1>Account Activation</h1>
        <a className="btn btn-primary btn-block" href="/">GotoLoginPage</a>
      </div>
    )
  }
}

export default AccountActivation;