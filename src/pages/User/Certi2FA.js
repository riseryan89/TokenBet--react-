import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import * as actions from '../../actions'
import { doModal } from '../../components/modal'
import { authRequest } from '../../util/request'
import config from '../../config'

class Certi2FA extends Component {
  constructor(props) {
    super(props);

    this.state = {
      qrCodeNumber: '',
      qrCodeImg: null,
    };

    this.getQrCode = this.getQrCode.bind(this);
  }

  componentDidMount() {
    this.getQrCode();
    this.otpCode.focus();
  }

  handleSubmit = e => {
    e.preventDefault();

    if (this.otpCode.value.length === 0) {
      doModal.inform('CHECK', 'Please input the otp code');
      this.otpCode.focus();
      return;
    }

    this.registerOTP(this.state.qrCodeNumber, this.otpCode.value);
  };

  handleDeactivate = e => {
    e.preventDefault();

    this.deactivateOTP(this.otpCode.value);
  };

  getQrCode = () => {
    if (!this.props.accessToken) return;

    const label = `${config.otp.label} (${this.props.emailAddr})`;

    if (this.props.twoFactorUse) {
      // get from server
      authRequest.get('/api/mypage/otp/certiNo')
      .then(response => {return response.data})
      .then(data => {
        this.setState({
          qrCodeNumber: data.certiNo,
        })
        var url = `otpauth://totp/${label}?secret=${data.certiNo}&algorithm=${config.otp.algorithm}`;
        this.setQRCodeImage(url);
      })
      .catch(error => {
        console.error('error' + error);
        if (error.code) {
          this.props.Actions.signOut();
          doModal.inform('Information', `${error.message}, Go to signin page`, () => this.props.history.push('/signin'));
        }
        throw(error);
      });
    } else {
      const secret = speakeasy.generateSecret({length:20});
      var url = speakeasy.otpauthURL({ secret: secret.ascii, label, algorithm: config.otp.algorithm });
      const userSecret = secret.base32;

      this.setState({
        qrCodeNumber: userSecret,
      })

      this.setQRCodeImage(url);
    }
  }

  setQRCodeImage = (secretOtpauth_url) => {
    QRCode.toDataURL(secretOtpauth_url, (err, image_data) => {
      if(err){
        console.error(err);
      } else {
        this.setState({
          qrCodeImg: image_data
        })
      }
    });
  }

  registerOTP(userSecret, otpCode) {
    const body = { userSecret, otpCode };

    authRequest.post(`/api/mypage/otp/register`, body)
    .then(response => {return response.data})
    .then(data => {
      // console.log(data);
      doModal.inform('INFORM', 'OTP Code is successfully registered, Please login again', () => this.props.history.push('/signin'));
    })
    .catch(error => {
      console.error('error' + error);
      throw(error);
    });
  }

  deactivateOTP(otpCode) {
    const body = { otpCode };

    authRequest.put(`/api/mypage/otp/deactivation`, body)
    .then(response => {return response.data})
    .then(data => {
      // console.log(data);
      doModal.inform('INFORM', '2FA is successfully deactivated, Please login again', () => this.props.history.push('/signin'));
    })
    .catch(error => {
      console.error('error' + error);
      if (error.code) {
        this.props.Actions.signOut();
        doModal.inform('Information', `${error.message}, Go to signin page`, () => this.props.history.push('/signin'));
      }
      throw(error);
    });
  }

  render() {
    if (!this.props.accessToken) return;

    return (
      <div className="row bg-contents subpage mysubbg rounded">
        <div className="container col-xl-4 col-lg-6 col-md-8 mt-2">
          <div className='container-fluid'>
            <div><h1>Certi2FA</h1></div>
            <div className="mt-5">
              {this.state.qrCodeNumber}
            </div>
            <div className="my-4">
              <img src={this.state.qrCodeImg} alt={this.state.qrCodeNumber}/>
            </div>
            <div className="input-group">
              <input type="text" className="form-control" ref={ input => this.otpCode = input }/>
              <div className="input-group-append" id="button-addon4">
              {
                this.props.twoFactorUse
                ? <button className="btn btn-outline-secondary px-3" type="button" onClick={this.handleDeactivate}>Deactivate</button>
                : <button className="btn btn-secondary px-3" type="button" onClick={this.handleSubmit}>Submit</button>
              }
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(
  (state) => ({
    accessToken: state.auth.accessToken,
    emailAddr: state.auth.emailAddr,
    twoFactorUse: state.auth.twoFactorUse,
  }),
  dispatch => ({
    Actions: bindActionCreators(actions, dispatch),
  })
)(Certi2FA)
