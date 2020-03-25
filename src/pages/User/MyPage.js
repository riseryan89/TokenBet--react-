import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import moment from "moment";
import DatePicker from "react-datepicker";
import * as actions from '../../actions';
import { authRequest } from '../../util/request';
import { doModal } from '../../components/modal';
import config from '../../config';

import "react-datepicker/dist/react-datepicker.css";

class MyPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: moment(),
      endDate: moment(),
      myGames: []
    };
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.handleSubmitSearch = this.handleSubmitSearch.bind(this);
    this.handleQuickDateSetting = this.handleQuickDateSetting.bind(this);
  }

  componentDidMount() {
    this.props.Actions.updateAsset();
  }

  handleStartDateChange(date) {
    this.setState({
      startDate: date
    });
  }

  handleEndDateChange(date) {
    this.setState({
      endDate: date
    });
  }

  handleQuickDateSetting = e => {
    let startDate = moment(this.state.endDate);

    if (e.target.name === '1W') {
      startDate.subtract(1, 'w');
    } else if (e.target.name === '1M') {
      startDate.subtract(1, 'M');
    } else if (e.target.name === '3M') {
      startDate.subtract(3, 'M');
    }

    this.setState({
      startDate
    });
  }

  handleInputChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  // https://github.com/Hacker0x01/react-datepicker
  renderDatePicker() {
    return (
      <div className="row">
        <DatePicker
          className="react-datepicker ml-3 text-center py-2"
          selected={this.state.startDate}
          name="startDate"
          onChange={this.handleStartDateChange}
        />{" "}
        <span className="mt-1 px-1">~</span>
        <DatePicker
          className="react-datepicker text-center py-2"
          selected={this.state.endDate}
          name="endDate"
          onChange={this.handleEndDateChange}
        />
      </div>
    );
  }

  handleSubmitSearch = () => {
    const fromTime = this.state.startDate.utc().startOf('day').valueOf();
    const toTime = this.state.endDate.utc().endOf('day').valueOf();

    const params = { fromTime, toTime };

    authRequest.get(`/api/game/mygameresulthistory`, { params })
    .then(response => {return response.data})
    .then(data => {
      // console.log(data);
      this.setState({
        myGames: data
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

  getStringBettingType = (char) => { return (char === 'C') ? 'CALL' : (char === 'P') ? 'PUT' : 'NEUTRAL'; }
  getStringGameResult = (char) => { return (char === '1') ? 'Win' : (char === '0') ? 'Lose' : 'Cancel'; }
  getStringGameMessage = (char, game) => { return (char === '1') ? `+${game.revenue}` : (char === '0') ? 'Lose' : this.getCancelMessage(game.cancelCode); }
  getCancelMessage = (code) => {
    const cancelCase = this.props.gameCancelCodes.find(x => x.code === code);
    if (cancelCase) {
      return cancelCase.message;
    } else {
      return '';
    }
  }

  renderHistoryTable() {
    let rowsGame = [];
    if (this.state.myGames) {
      rowsGame = this.state.myGames.map((game, i) => {
        let classNameResult = 'align-middle ';
        classNameResult += (game.gameResult === '1') ? ' text-danger' : 'text-info';
        const pairspl = game.gameId.split('_');
        return (
          <tr key={i}>
            <td>
              <span>{pairspl[0]}/{pairspl[1]}</span>
              <br />
              <span>{pairspl[2]}</span>
            </td>
            <td className="align-middle">{moment(game.openTime).format(config.dateFormat.default)}</td>
            <td className="align-middle">{moment(game.closeTime).format(config.dateFormat.default)}</td>
            <td className="align-middle">{game.openRate}</td>
            <td className="align-middle">{game.closeRate}</td>
            <td>
              <span>AW {game.amount}</span>
              <br />
              <span>{this.getStringBettingType(game.type)}</span>
            </td>
            <td className={classNameResult}>{this.getStringGameResult(game.gameResult)}</td>
            <td className={classNameResult}>{this.getStringGameMessage(game.gameResult, game)}</td>
            {/* <td className={classNameResult}>{(game.gameResult === '1') ? '+' : ''}{game.revenue}</td> */}
          </tr>
        )
      });
    }

    return (
      <div className="table-responsive">
        <table className="table table-hover tablestyle mt-3">
          <thead className="tablehead">
            <tr>
              <th scope="col" className="align-middle">
                Pair
              </th>
              <th scope="col" className="align-middle">
                Open Time
              </th>
              <th scope="col" className="align-middle">
                Close Time
              </th>
              <th scope="col" className="align-middle">
                Open Rate
              </th>
              <th scope="col" className="align-middle">
                Closed Rate
              </th>
              <th scope="col" className="align-middle">
                Investment
              </th>
              <th scope="col" className="align-middle">
                Result
              </th>
              <th scope="col" className="align-middle">
                Return
              </th>
            </tr>
          </thead>
          <tbody className="small">
            { rowsGame }
            <tr>
              <td>
                <span>BTC/USDT</span>
                <br />
                <span>1M</span>
              </td>
              <td className="align-middle">12-12-2018 12:12</td>
              <td className="align-middle">12-12-2018 12:12</td>
              <td className="align-middle">6241.48</td>
              <td className="align-middle">6241.57</td>
              <td>
                <span>AW99</span>
                <br />
                <span>CALL</span>
              </td>
              <td className="text-danger align-middle">Win</td>
              <td className="text-danger align-middle">+145.55</td>
            </tr>
            <tr>
              <td>
                <span>BTC/USDT</span>
                <br />
                <span>1M</span>
              </td>
              <td className="align-middle">12-12-2018 12:12</td>
              <td className="align-middle">12-12-2018 12:12</td>
              <td className="align-middle">6241.48</td>
              <td className="align-middle">6241.57</td>
              <td>
                <span>AW99</span>
                <br />
                <span>CALL</span>
              </td>
              <td className="text-info align-middle">Lose</td>
              <td className="text-info align-middle">0</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  renderAsset() {
    if (this.props.coins) {
      let rows = [];
      for (let i = 0; i < this.props.coins.length; i++) {
        rows.push(
          <div className="lead text-left font-weight-bold" key={i}>
            <small>• {this.props.coins[i].code} : {this.props.coins[i].amount} {this.props.coins[i].code}</small>
          </div>
        );
      }
      return <div>{rows}</div>;
    }
  }

  render() {
    if (!this.props.accessToken) {
      return null;
    }
    return (
      <div className="row bg-contents subpage mysubbg rounded">
        <div className="container">
          <div className="row">
            <div className="card text-dark bg-light col col-lg-6 col-12 mt-2">
              <div className="card-body">
                <h5 className="pt-1">
                  <i className="fa fa-info-circle pr-2" />
                  My info
                </h5>
                <div className="lead text-left font-weight-bold">
                  <small>• NAME : {this.props.fullname}</small>
                </div>
                <div className="lead text-left font-weight-bold">
                  <small>• E-MAIL : {this.props.emailAddr}</small>
                </div>
                <div className="form-check form-check-inline float-left">
                 <input className="form-check-input" type="checkbox" disabled={true} value={this.props.twoFactorUse}></input>
                 <label className="form-check-label">Use OTP</label>
                </div>
              </div>
            </div>
            <div className="card text-dark bg-light col col-lg-6 col-12 mt-2">
              <div className="card-body">
                <h5 className="pt-1">
                  <i className="fa fa-money pr-2" />
                  My property
                </h5>
                <div className="col col-lg-6 col-12">
                  {this.renderAsset()}
                  <div className="lead text-left font-weight-bold">
                    <small>• AW : {this.props.chip ? this.props.chip.amount : 0} </small>
                  </div>
                  <div className="form-check form-check-inline float-left">
                   <input className="form-check-input" type="checkbox" id="chkAutoExchange" value="option1"></input>
                   <label className="form-check-label" htmlFor="chkAutoExchange">Auto Exchange</label>
                 </div>
                </div>
              </div>
            </div>
          </div>
          <h3 className="mt-5">
            <i className="fa fa-history mr-2" />
            My History
          </h3>
          <div className="row mt-3">
            {this.renderDatePicker()}
            <button type="button" name='1W' className="btn btn-outline-warning btn-sm mr-1 ml-4" onClick={this.handleQuickDateSetting}>1W</button>
            <button type="button" name='1M' className="btn btn-outline-warning btn-sm mr-1" onClick={this.handleQuickDateSetting}>1M</button>
            <button type="button" name='3M' className="btn btn-outline-warning btn-sm mr-3" onClick={this.handleQuickDateSetting}>3M</button>
            <button type="button" className="btn btn-warning float-right" onClick={this.handleSubmitSearch}>Search</button>
            {this.renderHistoryTable()}
          </div>
        </div>
      </div>
    );
  }
}

MyPage = connect(
  state => {
    return {
      accessToken: state.auth.accessToken,
      emailAddr: state.auth.emailAddr,
      fullname: `${state.auth.givenName} ${state.auth.surName}`,
      twoFactorUse: state.auth.twoFactorUse,
      chip: state.asset.chip,
      coins: state.asset.coins,
      gameCancelCodes: state.common.gameCancelCodes
    };
  },
  dispatch => ({
    Actions: bindActionCreators(actions, dispatch),
  })
)(MyPage);

export default MyPage;
