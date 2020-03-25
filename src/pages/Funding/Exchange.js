import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';
import moment from 'moment';
import Big from 'big.js';
import { authRequest } from '../../util/request'
import { doModal } from '../../components/modal'
import * as actions from '../../actions';
const regexpInt = /^[0-9]+$/;
const regexpFloat = /^\d+\.?\d*$/;

class Exchange extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedCoin: null,
      selectedExchangeRate: 1,
      second: 0,
      exchangeRatio: [],
      exAmountChip: 0,
      exAmountCoin: 0
    };

    this.exchangeRatio = new Set();
  }

  componentWillMount() {
    this.updateRatio();
  }

  componentDidMount(){
    this.timeID = setInterval(
      () => this.Change(),
      1000
    )
  }

  componentWillUnmount() {
    clearInterval(this.timeID)
  }

  getBalanceSelectedCoin() {
    if (this.props.coins) {
      return this.props.coins.filter(x => x.code === 'ETH')[0].amount;
    }
    return '?';
  }

  Change = () => {
    this.setState({
      second: moment().second()
    })

    if (this.state.second === 0) {
      this.updateRatio();
    }
  }

  renderProgressPercent(){
    var style = {
      width: (this.state.second * 100 / 60) + '%'
    };
    return(
      <div className="progress">
        <div className="progress-bar progress-bar-striped bg-warning" style={style} role="progressbar" aria-valuenow="30" aria-valuemin="0" aria-valuemax="60">
        </div>
        <p className="text-dark">{60 - this.state.second} sec left</p>
      </div>
    )
  }

  updateRatio() {
    axios.get(`/api/funding/exchangeratio`)
    .then(response => {return response.data})
    .then(data => {
      this.setState({
        exchangeRatio: data
      });
      data.forEach(x => {
        this.exchangeRatio[x.coinCode] = x;
      });
      this.setState({
        selectedExchangeRate: this.getExchangeRate(this.state.selectedCoin)
      });
    })
    .catch(error => {
      console.log('error' + error);
      throw(error);
    });
  }

  buyAw = () => {
    const body = { awAmount: this.state.exAmountChip, coinCode: this.state.selectedCoin };

    return authRequest.post(`/api/funding/buyAw`, body)
    .then(response => {return response.data})
    .then(data => {
      console.log(data);
      this.props.updateAsset();
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

  sellAw = () => {
    const body = { awAmount: this.state.exAmountChip, coinCode: this.state.selectedCoin };

    return authRequest.post(`/api/funding/sellAw`, body)
    .then(response => {return response.data})
    .then(data => {
      console.log(data);
      this.props.updateAsset();
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


  getExchangeRate(coinCode) {
    if (this.exchangeRatio[coinCode]) {
      return this.exchangeRatio[coinCode].exchangeRate;
    } else {
      return 0;
    }
  }

  selectCoin = e => {
    this.setState({
      selectedCoin: e.target.name,
      selectedExchangeRate: this.getExchangeRate(e.target.name)
    });
  }

  handleInputExChange = e => {
    if (e.target.value === '') {
      e.target.value = 0;
    }
    if (e.target.name === 'exAmountChip') {
      if (regexpInt.test(e.target.value)) {
        this.setState({
          [e.target.name]: e.target.value,
          exAmountCoin: Big(e.target.value).div(this.state.selectedExchangeRate).toFixed(8)
        });
      }
    } else {
      if (regexpFloat.test(e.target.value)) {
        this.setState({
          [e.target.name]: e.target.value,
          exAmountChip: Big(Number(e.target.value)).times(this.state.selectedExchangeRate).toFixed(0)
        });
      }
    }
  }

  renderExchangeTable(){
    let rowsCoin = [];

    if (this.state.exchangeRatio) {
      rowsCoin = this.state.exchangeRatio.map((coin, i) => {
        let balance = 0;
        if (this.props.coins) {
          const found = this.props.coins.filter(x => x.code === coin.coinCode);
          if (found.length > 0) {
            balance = found[0].amount;
          }
        }
        return (
          <tr key={i}>
            <td className="align-middle">{ coin.coinCode }</td>
            <td className="align-middle">1 { coin.coinCode } = { coin.exchangeRate } AW </td>
            <td className="align-middle"> { balance } { coin.coinCode }</td>
            <td className="align-middle"><button name={ coin.coinCode } className="btn btn-outline-warning btn-sm px-2" onClick={this.selectCoin}>Exchange</button></td>
          </tr>
        )
      })
    }

    return(
      <div className="table-responsive">
      <table className="table table-hover tablestyle mt-5">
        <thead className="tablehead">
          <tr>
            <th scope="col">Assets</th>
            <th scope="col">AW Rate</th>
            <th scope="col">My Balance</th>
            <th scope="col">Exchange</th>
          </tr>
        </thead>
        <tbody className="small">
          { rowsCoin }
        </tbody>
      </table>
      </div>
    )
  }

  renderExchangeBox() {
    if (!this.state.selectedCoin) {
      return null;
    }

    return (
      <div className="row justify-content-center mt-4">
        <div className='col-xl-6 col-lg-8 col-md-10 col-sm-12 funding_exchange px-3 py-5 mt-3'>
          <h4 className="mb-3"><i className="fa fa-exchange text-light mr-2"/>AW / {this.state.selectedCoin} Exchange</h4>
          <div className="row">
            <div className="col-5 mb-4">
              <div className="row input-group">
                <div className="input-group-prepend ml-3">
                  <span className="input-group-text px-3" id="basic-addon1">AW</span>
                </div>
                <input type="text" className="form-control bg-transparent text-light" placeholder="Please enter amount" aria-label="email address" aria-describedby="basic-addon1"
                  name="exAmountChip" onChange={ this.handleInputExChange } value={ this.state.exAmountChip }/>
              </div>
              <div className="lead text-left"><i className="fa fa-hourglass-o text-light"/>Current Balance: {this.props.chip ? this.props.chip.amount : ''}</div>
            </div>
            <div className="col-2"><h4><i className="fa fa-arrows-h text-light"/></h4></div>
            <div className="col-5">
              <div className="row input-group ml-1">
                <div className="input-group-prepend">
                  <span className="input-group-text px-3" id="basic-addon1">{this.state.selectedCoin}</span>
                </div>
                <input type="text" className="form-control bg-transparent text-light" placeholder="Please enter amount" aria-label="Username" aria-describedby="basic-addon1"
                  name="exAmountCoin" onChange={ this.handleInputExChange } value={ this.state.exAmountCoin }/>
              </div>
              <p className="lead text-right">Current Balance: {this.getBalanceSelectedCoin()}</p>
            </div>
          </div>
          {this.renderProgressPercent()}
          <h4 className="mt-5"><i className="fa fa-clock-o text-light mr-2"/>Current {this.state.selectedCoin}/AW: {this.state.selectedExchangeRate}</h4>
          <div className="">
            <button className='btn btn-light mt-3 px-5 mx-3' onClick={this.buyAw}>{this.state.selectedCoin}->AW</button>
            <button className='btn btn-outline-light mt-3 px-5 mx-3' onClick={this.sellAw}>AW->{this.state.selectedCoin}</button>
          </div>
        </div>
      </div>
    )
  }

  render() {
    // console.log(this.state.selectedCoin);
    if (!this.exchangeRatio) {
      return null;
    }
    return (
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className='col-md-8 col-sm-12'>
            {this.renderExchangeTable()}
          </div>
        </div>
        {this.renderExchangeBox()}
      </div>
    )
  }
}

export default connect(
  state => {
    return {
      chip: state.asset.chip,
      coins: state.asset.coins,
    };
  },
  (dispatch) => ({
    Actions: bindActionCreators(actions, dispatch),
    updateAsset: () => {
      dispatch(actions.updateAsset());
    },
  })
)(Exchange);
