import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import store from '../../store'
import UtilTime from '../../util/time';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions';
import { doModal } from '../../components/modal'
import { authRequest } from '../../util/request'
import config from '../../config'

class ArenaGameBetting extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bettingAmount: 0,
      styles : {
        betProgress : {
          display : 'flex',
          height: '20px'
        }
      }
    };

    this.betGame = this.betGame.bind(this);
  }

  betGame = (betType) => {
    if (this.state.bettingAmount <= 0) {
      doModal.inform('Information', 'Please input the amount how many AW you want to bet');
      return;
    }

    if (store.getState().auth.expiresRefreshToken * 1000 < new Date().getTime()) {
      // go to login page
      console.log(this.props.location);
      this.props.history.push({
        pathname: '/signin',
        state: { from: this.props.location }
        // state: { from: {pathname:'/'} }
      });
      return;
    }

    const body = { gameId: this.props.game.selected.gameId, betType, amount:this.state.bettingAmount }

    authRequest.post(`/api/game/bet/`, body)
    .then(response => {
      // console.log(response.data);
      this.props.Actions.updateAsset();
    })
    .catch(error => {
      console.error('error' + error);
      if (error.code) {
        this.props.Actions.signOut();
        doModal.inform('Information', `${error.message}, Go to signin page`, () => this.props.history.push('/signin'));
      }
      this.props.Actions.updateAsset();
      throw(error);
    });

    this.setState({bettingAmount: 0});
  }

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  addAmount = (amount) => {
    const newAmount = Number(this.state.bettingAmount) + amount;
    this.setState({bettingAmount: newAmount});
  }

  renderRemainTime = () => {
    if (!this.props.serverTime) return;
    const remainedTimeSecs = Math.floor((this.props.game.selected.openTime - new Date().getTime() + Number(this.props.serverTime.timeGap)) / 1000).toFixed(0);

    return UtilTime.getElapseTimeHHMMSS(remainedTimeSecs);
  }

  renderButton(renderType) {
    // console.log(this.props)
    return <p className="lead">
      Payout<br/>
      {this.props.game.selected.payout[renderType]?this.props.game.selected.payout[renderType] + '%' : '-'}
    </p>
  }

  renderProgressPercent(){
    // console.log(this.props.game.selected);
    let perCall = 50, perPut = 50;
    if (this.props.game.selected.amount.total > 0) {
      perCall = this.props.game.selected.amount['call'] * 100 / this.props.game.selected.amount.total;
      perPut = this.props.game.selected.amount['put'] * 100 / this.props.game.selected.amount.total;
    }
    var styleProgressBar = {
      width: perCall + '%'
    };
    var styleSub = {
      padding_left: perCall + '%'
    }
    return(
      <div className="progress border border-info" style={this.state.styles.betProgress} >
        <div className="progress-bar bg-info" role="progressbar" style={styleProgressBar} aria-valuenow={perCall} aria-valuemin="0" aria-valuemax="100">
        {/* <div className="progress-bar row bg-info" role="progressbar" style={this.state.styles.betProgressBar} aria-valuenow={this.state.progressNowVal} aria-valuemin="0" aria-valuemax="100"> */}
          <div className="row">
            { (perCall > 30) ? <span className="col">Call</span> : null }
            { (perCall > 20) ? <span className="col">{perCall.toFixed(0)}%</span> : null }
          </div>
        </div>
        <div className="row" style={styleSub}>
          { (perPut > 20) ? <span className="col">{perPut.toFixed(0)}%</span> : null }
          { (perPut > 30) ? <span className="col">Put</span> : null }
        </div>
      </div>
    )
  }

  render() {
    if (!this.props.game.selected) return null;

    return (
      <div className="card mb-3 mainbetting_bg text-white">
        <div className="card-body">
          <div className="mt-2">
            <h4 className="text-warning cyptoOptionMobileMQ">{(this.props.game.selected)? `${this.props.game.selected.coinCode}/${this.props.game.selected.base} ${this.props.game.selected.gameTime}` : ''}</h4>
            <p className="lead mb-3 cyptoOptionMobileMQ">From {(this.props.game.selected.openTime)? `${moment(this.props.game.selected.openTime).format(config.dateFormat.timeOnly)}` : '------'}</p>
            <div className="row">
              <div className="bettingMobilePairExpose col-6">
                <p className="text-warning bettingMobilePairExposeFont text-left">{(this.props.game.selected)? `${this.props.game.selected.coinCode}/${this.props.game.selected.base} ${this.props.game.selected.gameTime}` : ''}</p>
              </div>
              <div className="bettingMobilePairExpose col-6">
                <p className="bettingMobileTimeExposeFont text-right">From {(this.props.game.selected.openTime)? `${moment(this.props.game.selected.openTime).format(config.dateFormat.timeOnly)}` : '------'}</p>
              </div>
            </div>
            <div className="input-group input-group-sm mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text px-5" id="inputGroup-sizing-sm">AW</span>
              </div>
              <input type="text" className="form-control bg-transparent text-light" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm"
                name='bettingAmount' value={this.state.bettingAmount} onChange={this.onChange}></input>
            </div>
            <div>
              <button type="button" className="btn btn-outline-light btn-sm px-3 mt-1 mx-1" onClick={() => this.addAmount(10)}>+AW10</button>
              <button type="button" className="btn btn-outline-light btn-sm px-3 mt-1 mx-1" onClick={() => this.addAmount(50)}>+AW50</button>
              <button type="button" className="btn btn-outline-light btn-sm px-3 mt-1 mx-1" onClick={() => this.addAmount(100)}>+AW100</button>
            </div>
            {/* <BettingAmount onChange={(amount) => this.setState({bettingAmount: amount})}/> */}
          </div>
          <div className="row mt-4 px-2" >
            <div className="col-4 px-2">
              <button type="button" history={this.props.history} className='btn btn-block btn-info pt-4 font-weight-bold' onClick={() => this.betGame('call')}>CALL<br/>
                <div align="center">
                  {this.renderButton('call')}
                </div>
              </button>
            </div>
            <div className="col-4 px-2">
              <button type="button" history={this.props.history} className='btn btn-block btn-secondary pt-4 font-weight-bold' onClick={() => this.betGame('neutral')}>NEUTRAL<br/>
                <div align="center">
                  {this.renderButton('neutral')}
                </div>
              </button>
            </div>
            <div className="col-4 px-2">
              <button type="button" history={this.props.history} className='btn btn-block btn-danger pt-4 font-weight-bold' onClick={() => this.betGame('put')}>PUT<br/>
                <div align="center">
                  {this.renderButton('put')}
                </div>
              </button>
            </div>
          </div>
          <div className="alert alert-secondary mt-3" role="alert">
            {/* <span>{this.state.remainedTime} sec left</span> */}
            {/* {Math.floor(this.state.remainedTime / 3600)} : {Math.floor(this.state.remainedTime / 60)} : {this.state.remainedTime % 60} */}
            {/* { UtilTime.getElapseTimeHHMMSS(this.state.remainedTimeSecs) } */}
            { this.renderRemainTime() }
          </div>
          <div className="alert alert-dark mb-1 border border-secondary" role="alert">
            { this.renderProgressPercent() }
          </div>
        </div>
      </div>
    )
  }
}

export default connect(
  (state) => ({
    game: state.game,
    serverTime: state.common.servertime,
  }),
  (dispatch) => ({
    Actions: bindActionCreators(actions, dispatch)
  })
)(ArenaGameBetting);
