import React, { Component } from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions';
import authRequest from '../../util/request/authRequest';
import { doModal } from '../../components/modal'
import { checkUserInput } from '../../util/common';

class ChangePW extends Component {
  handleSubmit = e => {
    e.preventDefault();
    if (!checkUserInput.vaildPassword(this.oldPassword.value)) {
      doModal.inform('CHECK', 'password needs strong complexity');
      this.oldPassword.focus();
      return;
    }
    if (!checkUserInput.vaildPassword(this.newPassword.value)) {
      doModal.inform('CHECK', 'password needs strong complexity');
      this.newPassword.focus();
      return;
    }
    if (this.newPassword.value !== this.newPassword2.value) {
      doModal.inform('CHECK', 'new passwords are not equal.');
      this.newPassword.focus();
      return;
    }

    const body = { currentPw: this.oldPassword.value, newPw: this.newPassword.value };
    authRequest.put(`/api/mypage/updtPw`, body)
    .then(() => {
      doModal.inform('INFORM', 'Password is successfully updated. Please login again', () => this.props.history.push('/'));
    })
    .catch(error => {
      console.error('error' + error);
      if (error.code) {
        this.props.Actions.signOut();
        doModal.inform('Information', `${error.message}, Go to signin page`, () => this.props.history.push('/signin'));
      }
      throw(error);
    });
  };

  render () {
    return (
    <div className="bg-contents subpage mysubbg rounded">
      <div className="container col-xl-5 col-lg-8 col-md-12">
        <form>
         <div className="form-group text-sm-left lead">
          <label className="text-sm-left">E-MAIL</label>
          <input type="email" className="form-control" aria-describedby="emailHelp" placeholder="E-MAIL"
            name="emailAddr" defaultValue={ this.props.emailAddr}></input>
         </div>
         <div className="form-group text-sm-left lead">
          <label className="text-sm-left">Current Password</label>
          <input type="password" className="form-control" placeholder="Password" ref={ input => this.oldPassword = input }/>
         </div>
         <div className="form-group text-sm-left lead">
          <label className="text-sm-left">New Password</label>
          <input type="password" className="form-control" placeholder="Password" ref={ input => this.newPassword = input }/>
         </div>
         <div className="form-group text-sm-left lead">
          <label className="text-sm-left">Confirm Password</label>
          <input type="password" className="form-control" placeholder="Password" ref={ input => this.newPassword2 = input }/>
         </div>
        </form>
        <button className="btn btn-warning btn-block btn-lg" onClick={this.handleSubmit}>Change</button>
      </div>
     </div>
    )
  }
}

export default connect(
  state => ({
    emailAddr: state.auth.emailAddr,
  }),
  dispatch => ({
    Actions: bindActionCreators(actions, dispatch),
  })
)(ChangePW);
