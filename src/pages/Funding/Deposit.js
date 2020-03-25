import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import QRCode from 'qrcode';
import { authRequest } from '../../util/request';
import { doModal } from '../../components/modal';
import * as actions from '../../actions';

class Deposit extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selectCoin: '',
      walletAddress: '',
      qrCodeImg: null,
    }

    this.handleButtonClickBtc = this.handleButtonClickBtc.bind(this);
    this.handleButtonClickEth = this.handleButtonClickEth.bind(this);
  }

  handleCoinChange(event) {
    const val = event.currentTarget.querySelector("input").value;
    // console.log(val);
    this.setState({
      selectCoin: val
    })
  }

  handleButtonClickBtc = () => {
    this.getDepositAddress('BTC');
  }

  handleButtonClickEth = () => {
    this.getDepositAddress('ETH');
  }

  getDepositAddress = () => {
    if (this.state.selectCoin.length === 0) {
      alert('dddd');
      return;
    }

    this.setQRCodeImg('0xb437e38fcf8c8e88bcc1a4e198bdd4c42db6bbf0');

    authRequest.get(`/api/funding/deposit/address/${this.state.selectCoin}`)
    .then(response => {return response.data})
    .then(data => {
      // console.log(data);
      this.setState({
        walletAddress:data.address
      })
      this.setQRCodeImg(data.address);
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

  setQRCodeImg = (qrCodString) => {
    QRCode.toDataURL(qrCodString, (err, image_data) => {
      if(err){
        console.error(err);
      } else {
        this.setState({
          qrCodeImg: image_data
        })
      }
    });
  }

  render() {
    return (
    <div className="bg-contents subpage mysubbg rounded">
      <div className='container col-xl-8 col-lg-7 col-md-6 col-sm-12 mb-3'>
        <div className="btn-group-toggle mb-4" data-toggle='buttons'>
          <label className="btn btn-outline-warning btn-sm px-4 mr-2" onClick={this.handleCoinChange.bind(this)}>
            <input type="radio" value="BTC" name="coin"/> Bitcoin
          </label>
          <label className="btn btn-outline-warning btn-sm px-4" onClick={this.handleCoinChange.bind(this)}>
            <input type="radio" value="ETH" name='coin'/> Ethereum
          </label>
        </div>
        <h4 className="mb-3 float-left"><i className="fa fa-link mr-2"/>Bitcoin Wallet Address</h4>
        <div className="input-group my-3">
          <input type="text" className="form-control" placeholder="Bitcoin Wallet Address" readOnly={true} value={this.state.walletAddress}></input>
          <div className="input-group-append">
            <button className="btn btn-warning rounded-right px-3" type="button" id="button-addon2" onClick={this.getDepositAddress}>Show</button>
          </div>
          <button className="btn btn-secondary ml-3 px-5" type="button" id="button-addon2">Copy</button>
        </div>
        <ul className="list-group list-group-flush rounded mt-4 bg-transparent">
          <li className="list-group-item text-sm-left text-light bg-transparent"><i className="fa fa-check text-warning mr-2"/>Your permanent Bitcoin (BTC) address for receiving funds.</li>
          <li className="list-group-item text-sm-left text-light bg-transparent"><i className="fa fa-check text-warning mr-2"/>Deposits to this address are credited after 1 confirmation and within a few minutes.</li>
          <li className="list-group-item text-sm-left text-light bg-transparent"><i className="fa fa-check text-warning mr-2"/>Minimum deposit amount is 0.005 BTC.</li>
          <li className="list-group-item text-sm-left text-light bg-transparent"><i className="fa fa-check text-warning mr-2"/>If you make a deposit in other currencies, your fund can be lost permanently.</li>
        </ul>
        <h4 className="mt-5 row pl-3"><i className="fa fa-qrcode mr-2 mt-1"/>QR Code</h4>
        <div className="card mt-3">
          <div className="card-body">
            <img src={this.state.qrCodeImg} alt={this.state.walletAddress}/>
          </div>
        </div>
      </div>
    </div>
    )
  }
}

export default connect(
  null,
  (dispatch) => ({
    Actions: bindActionCreators(actions, dispatch)
  })
)(Deposit);