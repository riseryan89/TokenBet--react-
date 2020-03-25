import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReCAPTCHA from "react-google-recaptcha";
import Modal from 'react-modal';
import * as actions from '../../actions';
import { doModal } from '../../components/modal'
import { checkUserInput } from '../../util/common';
import config from '../../config';

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.notARobot = false;
    this.state = {
      emailAddr: 'joung.park@ruby-x.io',
      password: 'Dhwprtm4000!$',
      otpCode: '',
      modalIsOpen: false,
    }

    this.openModalOtpCode = this.openModalOtpCode.bind(this);
    this.handleSubmitOtpCode = this.handleSubmitOtpCode.bind(this);
  }

  handleInputChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSubmit = async (e) => {
    // console.log(this.state.emailAddr);
    if (!checkUserInput.validEmail(this.state.emailAddr)) {
      doModal.inform('CHECK FORM', 'check your email address');
      return;
    }
    if (!checkUserInput.vaildPassword(this.state.password)) {
      doModal.inform('CHECK FORM', 'check your password');
      return;
    }
    // if (!this.notARobot) {
    //   return;
    // }
    e.preventDefault();

    const { Actions } = this.props;
    try {
        const res = await Actions.signIn(this.state);
        if (res.decoded.subject === 'access') {
          this.afterLogin();
        } else {
          this.tokenTemp = res.token;
          this.openModalOtpCode();
        }
    } catch(error) {
        alert('try again ' + error);
    }
    this.handleReset();
  };

  handleReset = () => {
    this.setState({
      emailAddr: '',
      password: '',
      otpCode: '',
    });
  };

  afterLogin = async() => {
    const { Actions } = this.props;

    await Actions.updateAsset();

    if (this.props.location.state && this.props.location.state.from) {
      this.props.history.push(this.props.location.state.from.pathname);
    } else {
      this.props.history.push('/');
    }
  };

  handleReCaptchaChange = (e) => {
    this.notARobot = (e)?true:false;
  }

  openModalOtpCode() {
    this.setState({modalIsOpen: true});
  }
 
  handleSubmitOtpCode = async(e) => {
    // this.afterLogin();
    e.preventDefault();
    
    const { Actions } = this.props;
    try {
      const res = await Actions.signIn2FA(this.tokenTemp, this.state.otpCode);
      // console.log(res);
      if (res.decoded.subject === 'access') {
        this.afterLogin();
      }
      this.setState({modalIsOpen: false});
    } catch(error) {
      alert('try again ' + error);
    }
    this.handleReset();
  }

  render () {
    return (
      <div className="row bg-contents subpage mysubbg rounded shadow-lg">
        <div className="container col-xl-4 col-lg-6 col-md-8 mt-5">
          <h1 className="mb-5">Log in</h1>
          <form>
            <div className="form-group text-sm-left lead">
              <label className="text-sm-left">ID (Email address)</label>
              <input type="email" className="form-control" aria-describedby="emailHelp" placeholder="Enter email"
                name="emailAddr" onChange={ this.handleInputChange }  value={ this.state.emailAddr }></input>
            </div>
            <div className="form-group text-sm-left lead">
              <label className="text-sm-left">Password</label>
              <input type="password" className="form-control" placeholder="Password"
                name="password"  onChange={ this.handleInputChange }  value={ this.state.password }></input>
            </div>
          </form>
          <div className="btn">
            <ReCAPTCHA
              ref={this.recaptchaRef}
              sitekey={config.recaptcha.sitekey}
              theme={config.recaptcha.theme}
              // size="invisible"
              onChange={this.handleReCaptchaChange}
            />
          </div>
          <button className="btn btn-warning btn-block btn-lg" onClick={this.handleSubmit.bind()}><i className="fa fa-sign-in mr-2" />Login</button>
          <div className="row">
            <div className="col-6 lead text-left">
              <NavLink exact className="nav-link js-scroll-trigger text-warning" to="/signup"><h6>SignUp</h6></NavLink>
            </div>
            <div className="col-6 lead text-right">
              <NavLink exact className="nav-link js-scroll-trigger text-warning" to="/forgotpassword"><h6>Forgot Password</h6></NavLink>
            </div>
          </div>
        </div>
        <Modal
            isOpen={this.state.modalIsOpen}
            onAfterOpen={this.afterOpenModal}
            onRequestClose={this.closeModal}
            contentLabel="Example Modal"
            style={{
              overlay: {
              },
              content: {
                top: '50%',
                left: '50%',
                right: 'auto',
                bottom: 'auto',
                transform: 'translate(-50%, -50%)'
              }
            }}
          >
            <div className='container'>
              <h2 ref={subtitle => this.subtitle = subtitle}>OTP</h2>
              <form>
              <input type="password" className="form-control" placeholder="Password"
                name="otpCode" onChange={ this.handleInputChange }  value={ this.state.otpCode }></input>
              </form>
              <button className='btn btn-primary btn-block mt-3' onClick={this.handleSubmitOtpCode}>Enter</button>
            </div>
          </Modal>
      </div>
    )
  }
}

export default connect(
  null,
  (dispatch) => ({
    Actions: bindActionCreators(actions, dispatch)
  })
)(SignIn);
// export default SignIn;
