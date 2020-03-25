import React, { Component } from 'react';
import { NavLink, Switch } from 'react-router-dom';
import { PrivateRoute } from '../../util/router';
import FundingHistory from './FundingHistory';
import Deposit from './Deposit';
import Withdrawal from './Withdrawal';
import Exchange from './Exchange';

class Funding extends Component {
  render() {
    return (
      <div className="bg-contents subpage mysubbg rounded">
        <div className="row justify-content-center">
          <div className='col-md-8 col-sm-12 btn-group mt-5'>
            <NavLink className="col btn btn-funding" to="/fund/fundinghistory"><small>Funding</small></NavLink>
            <NavLink className="col btn btn-funding" to="/fund/deposit"><small>Deposit</small></NavLink>
            <NavLink className="col btn btn-funding" to="/fund/Exchange"><small>Exchange</small></NavLink>
            <NavLink className="col btn btn-funding" to="/fund/Withdrawal"><small>Withdrawal</small></NavLink>
          </div>
        </div>
        <div className='container-fluid'>
          <Switch>
            <PrivateRoute path='/fund/fundingHistory' component={FundingHistory}/>
            <PrivateRoute path='/fund/deposit' component={Deposit}/>
            <PrivateRoute path='/fund/exchange' component={Exchange}/>
            <PrivateRoute path='/fund/withdrawal' component={Withdrawal}/>
          </Switch>
        </div>
      </div>
    )
  }
}

export default Funding;
