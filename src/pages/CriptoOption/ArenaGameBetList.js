import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import store from '../../store'
import UtilTime from '../../util/time';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions';
import authRequest from '../../util/request/authRequest';
import { doModal } from '../../components/modal'

class ArenaGameBetList extends Component {
  constructor(props) {
    super(props);

    this.updateMyOpenBettingList = this.updateMyOpenBettingList.bind(this);

    this.state = {
      openBetList: [],
    };

    this.styles = {
      betList : {
        fontSize:'11px'
      },
      btnStyleBlue : {
        backgroundColor:'#777777',
        fontSize:'10px'
      },
    }
  }

  componentDidMount() {
    this.timerId = setInterval(this.timer, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerId);
  }

  timer = () => {
    this.updateMyOpenBettingList();
  }

  updateMyOpenBettingList = () => {
    if (this.props.expiresAccessToken * 1000 < new Date().getTime()) return;
    // console.log('updateMyOpenBettingList', this.props.expiresAccessToken);

    if (store.getState().auth.accessToken === undefined) return;
    // console.log(store.getState().auth.accessToken);
    authRequest.get('/api/game/myopenbet')
    .then(response => {
      // console.log(response.data);
      this.setState({
        openBetList: response.data
      })
    })
    .catch(error => {
      if (error.code) {
        this.props.Actions.signOut();
        doModal.inform('Information', `${error.message}, Go to signin page`, () => this.props.history.push('/signin'));
      }
    });
  }

  cancelSelect = (e) => {
    const i = e.target.name;

    doModal.checkConfirm('title', 'Do you want to cancel this order?', () =>{
      // console.log('cancelSelect ' + i);
      // console.log(this.state.openBetList[i]);
      const { type, amount, time, gameId, openTime } = this.state.openBetList[i]

      const token = store.getState().auth.accessToken;

      if (token === undefined) return;

      const headers = { authorization: 'bearer ' + token};
      const params = { type, amount, time, gameId, openTime };

      axios.delete(`/api/game/myopenbet/cancel`, { headers, params })
      .then(response => {return response.data})
      .then(data => {
        // console.log(data);
        this.props.Actions.updateAsset();
        doModal.inform('inform', 'your order is successfully canceled');
      })
      .catch(error => {
        console.error('error' + error);
        doModal.inform('error', 'try again');
        throw(error);
      });
    })
  }

  renderBetListTable(){
    let now = new Date().getTime();
    if (this.props.serverTime) {
      now += Number(this.props.serverTime.timeGap);
    }
    let rowsMyBet = [];

    if (this.state.openBetList) {
      rowsMyBet = this.state.openBetList.map((bet, i) => {
        return (
          <tr key={i}>
            <td>{ i + 1 }</td>
            <td>{ bet.gameId.replace('_', '/').replace('_', ' ') }</td>
            {/* <td>{ Math.floor((bet.closeTime - now) / 1000) } s</td> */}
            <td>{ UtilTime.getElapseTimeHHMMSS(Math.floor((bet.closeTime - now) / 1000)) }</td>
            <td>AW<span className="text-danger">{ bet.amount }</span> <small>{ bet.type.toUpperCase() }</small></td>
            {
              (bet.openTime > now + 5000) ?
                <td><button name={ i } className="btn btn-secondary btn-sm px-3 align-middle" style={this.styles.btnStyleBlue} onClick={this.cancelSelect}>cancel</button></td>
              : <td><button name={ i } disabled={true} className="btn btn-secondary btn-sm px-3 align-middle" style={this.styles.btnStyleBlue} onClick={this.cancelSelect}>cancel</button></td>
            }
          </tr>
        )
      });
    }
    // console.log(this.state.openList);

    return(
      <div className="px-3 py-3">
        <table className="table table-hover main-tablestyle" style={this.styles.betList}>
          <thead className="main-tablehead">
            <tr>
              <th scope="col">No</th>
              <th scope="col">Pair</th>
              <th scope="col">Time Left</th>
              <th scope="col">Investment</th>
              <th scope="col">cancel</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row" className="align-middle">0</th>
              <td>
                <span>BTC/USDT</span><br/>
                <span><small>1M</small></span>
              </td>
              <td className="align-middle">13:00</td>
              <td>
                <span>AW99</span><br/>
                <span><small>PUT</small></span>
              </td>
              <td><button className="btn btn-secondary btn-sm px-3 align-middle" style={this.styles.btnStyleBlue}>cancel</button></td>
            </tr>
            { rowsMyBet }
          </tbody>
        </table>
      </div>
    )
  }

  render() {
    return (
      <div className="card mb-3 bg-contents text-white cryptoOptionMobileTopRowMargin">
        {this.renderBetListTable()}
      </div>
    )
  }
}

export default connect(
  (state) => ({
    expiresAccessToken: state.auth.expiresAccessToken,
    game: state.game,
    serverTime: state.common.servertime,
  }),
  (dispatch) => ({
    Actions: bindActionCreators(actions, dispatch)
  })
)(ArenaGameBetList);
