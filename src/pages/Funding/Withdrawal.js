import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';
import * as actions from '../../actions';
import { doModal } from '../../components/modal';
import { checkUserInput } from '../../util/common';
import { authRequest } from '../../util/request'

class Withdrawal extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selectCoin: '',
      dailyLimit: 0,
      minAmount: 0,
      available: 0,
      useAmountIn24H: 0,
      fee: 1,
      actualArrival: 0,
    }

    this.selectedCoinRule = {};
    this.withdrawalRule = [];
    // code: "BTC"
    // depositMinAmount: 0.005
    // minUnit: 0.0001
    // name: "BTC"
    // order: 0
    // withdrawDailyLimit: 20
    // withdrawFee: 0.002
    // withdrawMinAmount: 0.02
  }

  componentDidMount() {
    this.getWithdrawalRule();
    // this.getWithdrawalAvailable('ETH');
  }

  handleInputChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
    if (e.target.name === 'amount') {
      this.setState({
        actualArrival: (e.target.value - this.state.fee).toFixed(8)
      })
    }
  };

  handleReset = () => {
    this.setState({
      amount: 0,
      fee: 0,
      actualArrival: 0,
      address: '0xb437e38fcf8c8e88bcc1a4e198bdd4c42db6bbf0',
      password: 'Dhwprtm4000!$',
      otpCode: ''
    });
  };

  handleCoinChange(event) {
    const val = event.currentTarget.querySelector("input").value;
    // console.log(val);
    this.setState({
      selectCoin: val
    })
    this.handleReset();
    this.selectCoin(val);
  }

  handleButtonClickAll = () => {
    this.setState({
      amount : (this.state.available < this.state.dailyLimit) ? this.state.available : this.state.dailyLimit
    })
  }

  getActualArrival = () => {
    if (!this.refAmount) return 0;

    let retValue = this.refAmount.value - this.state.fee;
    if (retValue < 0) {
      retValue = 0;
    }
    return retValue.toFixed(8)
  }

  selectCoin = (code) => {
    this.getWithdrawalAvailable(code);
    this.selectedCoinRule = this.withdrawalRule.find(x => x.code === code);
    this.setState({
      fee: this.selectedCoinRule.withdrawFee,
      minAmount: this.selectedCoinRule.withdrawMinAmount,
      dailyLimit: this.selectedCoinRule.withdrawDailyLimit
    });
  }

  checkVaild = () => {
    if (this.state.selectCoin.length === 0) {
      doModal.inform(null, 'Please select coin.');
      this.refAmount.focus();
      throw Error();
    }
    if (this.refAmount.value < this.state.fee) {
      doModal.inform(null, 'Please check the amount you want to withdrawal.');
      this.refAmount.focus();
      throw Error();
    }
    if(!checkUserInput.vaildOtpCode(this.state.selectCoin, this.refAddress.value)) {
      doModal.inform(null, 'Please check your withdrawal address.');
      this.refAddress.focus();
      throw Error();
    }
    if(!checkUserInput.vaildPassword(this.refPassword.value)) {
      doModal.inform(null, 'Please check your password.');
      this.refPassword.focus();
      throw Error();
    }
    if(!checkUserInput.vaildOtpCode(this.refOtpCode.value)) {
      doModal.inform(null, 'Please check your otpcode.');
      this.refOtpCode.focus();
      throw Error();
    }
  }

  handleSubmit = e => {
    try {
      this.checkVaild();
    } catch (error) {
      return;
    }
    const body = {
      coinCode: this.state.selectCoin,
      amount: this.refAmount.value,
      address: this.refAddress.value,
      password: this.refPassword.value,
      veriCode: this.refOtpCode.value,
    }
    doModal.checkConfirm('Check', `Do you want to withdrawal ${body.coinCode} ${body.amount}?`, () =>{
      // console.log(body);
      authRequest.post(`/api/funding/withdrawal`, body,)
      .then(response => {return response.data})
      .then(data => {
        // console.log(data);
      })
      .catch(error => {
        console.error('error' + error);
        if (error.code) {
          this.props.Actions.signOut();
          doModal.inform('Information', `${error.message}, Go to signin page`, () => this.props.history.push('/signin'));
        }
        throw(error);
      });
    });
  }

  getWithdrawalRule() {
    axios.get(`/api/funding/withdrawal/rule`)
    .then(response => {return response.data})
    .then(data => {
      // console.log(data);
      this.withdrawalRule = data;
    })
    .catch(error => {
      console.error('error' + error);
      throw(error);
    });
  }

  getWithdrawalAvailable(coinCode) {
    const params = { coinCode };

    // console.log(params)
    authRequest.get(`/api/funding/withdrawal/available`, { params })
    .then(response => {return response.data})
    .then(data => {
      // console.log(data);
      // available
      // useAmountIn24H
      this.setState({
        available: data.available,
        useAmountIn24H: data.useAmountIn24H,
      });
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

  withdrawal = () => {
    const body = { coinCode:'ETH', amount:'0.2', address:'0xb437e38fcf8c8e88bcc1a4e198bdd4c42db6bbf0', password:'Dhwprtm4000!$', veriCode:'' }

    authRequest.post(`/api/funding/withdrawal`, body)
    .then(response => {return response.data})
    .then(data => {
      // console.log(data);
    })
    .catch(error => {
      console.error('error' + error);
      throw(error);
    });
  };

  render() {
    return (
      <div className="bg-contents subpage mysubbg rounded">
        <div className='container col-xl-8 col-lg-10 col-md-12'>
          <form>
            <div className="form-group text-sm-left lead btn-group-toggle" data-toggle='buttons'>
              <label className="text-sm-left mr-3">Withdrawal</label>
              <label className="btn btn-outline-warning btn-sm px-4 mr-2" onClick={this.handleCoinChange.bind(this)}>
                <input type="radio" value="BTC" name="coin"/> Bitcoin
              </label>
              <label className="btn btn-outline-warning btn-sm px-4" onClick={this.handleCoinChange.bind(this)}>
                <input type="radio" value="ETH" name='coin'/> Ethereum
              </label>
              <div className="card bg-secondary float-right px-4 py-2 lead">
                <small className="row"> • Minimum withdrawal amount : {this.state.minAmount} {this.state.selectCoin}<br/></small>
                <small className="row"> • 24H withdrawal limit : {this.state.dailyLimit - this.state.useAmountIn24H} / {this.state.dailyLimit} {this.state.selectCoin}</small>
              </div>
            </div>
            <div className="form-group text-sm-left lead">
              <label className="text-sm-left mr-3">Amount</label>
              <button type="button" className="btn btn-outline-light btn-sm px-3" onClick={this.handleButtonClickAll}>All</button>
              <label className="text-sm-left ml-3">({this.state.available} {this.state.selectCoin})</label>
              <input type="text" className="form-control" placeholder="Amount" ref={ input => this.refAmount = input }/>
            </div>
            <fieldset disabled>
              <div className="form-group text-sm-left text-sm-left lead">
                <label className="text-sm-left">Fee</label>
                <input type="text" className="form-control" placeholder="Disabled input" readOnly={true} value={ this.state.fee }></input>
              </div>
            </fieldset>
            <fieldset disabled>
              <div className="form-group text-sm-left text-sm-left lead">
                <label className="text-sm-left">Actual arrival</label>
                <input type="text" className="form-control" placeholder="Disabled input" readOnly={true} value={ this.getActualArrival() }></input>
              </div>
            </fieldset>
            <div className="form-group text-sm-left lead">
              <label className="text-sm-left">Address</label>
              <input type="text" className="form-control" placeholder="Address" ref={input => this.refAddress = input }/>
            </div>
            <div className="form-group text-sm-left lead">
              <label className="text-sm-left">Password</label>
              <input type="password" className="form-control" placeholder="Password" ref={input => this.refPassword = input }/>
            </div>
            <div className="form-group text-sm-left lead">
              <label className="text-sm-left">Verify</label>
              <input type="password" className="form-control" placeholder="Verify" ref={input => this.refOtpCode = input }/>
            </div>
          </form>
          <button className="btn btn-warning btn-block btn-lg" onClick={this.handleSubmit}>Submit</button>
        </div>
      </div>
    )
  };
}

export default connect(
  null,
  dispatch => ({
    Actions: bindActionCreators(actions, dispatch),
  })
)(Withdrawal);
