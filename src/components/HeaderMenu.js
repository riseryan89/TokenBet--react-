import React, { Component } from 'react';
import moment from 'moment';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import logo from '../aw_logo_w_piled.png';
import { bindActionCreators } from 'redux';
import * as actions from '../actions';
import config from '../config';
import { authRequest } from '../util/request';
import { doModal } from './modal';

class HeaderMenu extends Component {
  constructor(props) {
    super(props);
    this.lastResultTime = new Date().getTime() - config.notify.timeRecentGameResult;   // 1 minute
    this.state = {
      currentTime: '-',
    }
  }

  handleSignOut = e => {
    e.preventDefault();
    this.props.Actions.signOut();
    // this.handleReset();
  };

  componentDidMount() {
    this.props.Actions.tryReloadToken();
    this.props.Actions.getServerTime();
    this.props.Actions.getCancelCodes();
    this.timer = setInterval(() => this.updateTime(), 100);
    this.timerResult = setInterval(() => this.updateGameResult(), 3000);
    // this.notify();
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    clearInterval(this.timerResult);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.expiresAccessToken === 1 && nextProps.expiresAccessToken) {
      this.props.Actions.updateAsset();
    }
  }

  updateTime = () => {
    if (this.props.serverTime) {
      const now = new Date().getTime() + Number(this.props.serverTime.timeGap);
      // console.log(now);
      this.setState({
        // currentTime: new Date(now).toUTCString()
        currentTime: moment(now).format(config.dateFormat.default),
      })
    } else {
      // this.props.onTimeSync();
    }
  }

  updateGameResult = () => {
    if (this.props.expiresAccessToken * 1000 < new Date().getTime()) return;
    
    const params = { fromTime: this.lastResultTime };
    authRequest.get(`/api/game/myrecentresult`, { params })
    .then(response => {return response.data})
    .then(data => {
      // console.log(data);
      data.filter(x => x.resultTime > this.lastResultTime).forEach(x => {
        // console.log(x);
        const betTimeStr = moment(x.betTime).format(config.dateFormat.timeOnly);
        const [fsym, tsym, interval] = x.gameId.split('_');
        if (x.gameResult === 1) {
          toast.success(`Win! aquired AW${x.acquireAmount} ${fsym}/${tsym} ${interval}`, {
            position: toast.POSITION.BOTTOM_RIGHT
          });
        } else if (x.gameResult === 2) {
          toast.warn(`Canceled! ${fsym}/${tsym} ${interval} Time: ${betTimeStr}`, {
            position: toast.POSITION.BOTTOM_RIGHT
          });
        } else {
          toast.error(`Loose! lost AW${x.betAmount} ${fsym}/${tsym} ${interval}`, {
            position: toast.POSITION.BOTTOM_RIGHT
          });
        }
        if (this.lastResultTime < x.resultTime) { this.lastResultTime = x.resultTime}
      });
    })
    .catch(error => {
      if (error.code) {
        this.props.Actions.signOut();
        doModal.inform('Information', `${error.message}, Go to signin page`, () => this.props.history.push('/signin'));
      }
      throw(error);
    });
  };

  renderSignInOut () {
    return (
      <div className="row">
        {/* <div className="col-auto mr-auto align-middle"></div> */}
        {
          this.props.accessToken ?
          <span className="col-auto nav-link bg-transparent text-light text-right align-middle"><small><strong>[ My AW ]</strong> {(this.props.chip)? this.props.chip.amount: ''}</small></span>
          : null
        }
        {
          this.props.accessToken ?
          <span className="col-auto nav-link bg-transparent text-light text-right align-middle" onClick={this.handleSignOut}><i className="fa fa-sign-out text-white-50 fa-1x mr-1"/><small>Log Out</small></span>
          :
          <NavLink className="col-auto nav-link bg-transparent text-light text-right align-middle" to="/signin"><i className="fa fa-sign-in text-white-50 fa-1x mr-1"/><small>Log In</small></NavLink>
        }
      </div>
    )
  }

  render () {
    // console.log(this.props)
    return (
      <nav className="navbar navbar-expand-lg navbar-dark fixed-top arenaheader shadow" id="mainNav">
        <div className="container-fluid">

          <NavLink className="navbar-brand js-scroll-trigger text-ligth font-weight-bold" to="/"><img src={logo} className="header-logo" alt="logo" />
            <h3 className="d-none d-lg-inline align-middle">ARENA WAVE</h3>
          </NavLink>
          <div className="d-flex justify-content-end">
            <div className="mr-2 d-lg-none">
            { this.renderSignInOut() }
            </div>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerMainmenu">
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>
          <div className="collapse navbar-collapse ml-3" id="navbarTogglerMainmenu">
            <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
              <li className="nav-item">
                <NavLink exact className="nav-link text-right" to="/"><strong>Crypto Option</strong></NavLink>
              </li>
              <li className="nav-item">
                <a className="nav-link text-right" href="#Documents"><strong>Documents</strong></a>
              </li>
              <li className="nav-item">
                <NavLink exact className="nav-link text-right" to="/fund/fundinghistory"><strong>Funding</strong></NavLink>
              </li>
              <li className="nav-item">
                <a className="nav-link text-right" href="#support"><strong>Support</strong></a>
              </li>
              <li className="nav-item">
                <NavLink exact className="nav-link text-right d-lg-none" to="/my/myPage"><strong>My Page</strong></NavLink>
              </li>
            </ul>
          </div>
          <div className="row d-none d-lg-flex">
            <span className="nav-link bg-transparent text-light d-none d-lg-flex mt-1"><small><i className="fa fa-clock-o text-white-50 fa-1x"/> {this.state.currentTime}</small></span>
            { this.renderSignInOut() }
          </div>
          <div className="ml-4 float-right d-none d-lg-inline">
            <NavLink exact className="" to="/my/myPage">
              <button type="button" className="btn btn-warning rounded-circle mt-1 align-middle">
                <i className="fa fa-user text-dark fa-1x"/>
              </button>
            </NavLink>
          </div>
        </div>
      </nav>
    )
  }
}

// export default HeaderMenu;
const mapStateToProps = state => {
  return {
    accessToken: state.auth.accessToken,
    expiresAccessToken: state.auth.expiresAccessToken,
    chip: state.asset.chip,
    coins: state.asset.coins,
    serverTime: state.common.servertime,
  };
};

export default connect(
  mapStateToProps,
  (dispatch) => ({
    Actions: bindActionCreators(actions, dispatch)
  })
)(HeaderMenu);
