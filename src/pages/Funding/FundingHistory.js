import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import moment from 'moment';
import * as actions from '../../actions';
import { authRequest } from '../../util/request';
import { doModal } from '../../components/modal';
import config from '../../config';

class FundingHistory extends Component {

  constructor(props) {
    super(props);

    this.state = {
      fundingHistory: []
    };
  }

  componentDidMount = () => {
    authRequest.get(`/api/funding/history`)
    .then(response => {return response.data})
    .then(data => {
      // console.log(data);
      this.setState({
        fundingHistory: data
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

  renderAssetsTable(){
    let rows = [];
    if (this.props.coins) {
      for (let i = 0; i < this.props.coins.length; i++) {
        rows.push(
          <tr key={this.props.coins[i].code}>
            <td>{this.props.coins[i].code}</td>
            <td>{this.props.coins[i].amount}</td>
          </tr>
        );
      }
    }

    return(
      <table className="table table-hover tablestyle">
        <thead className="tablehead">
          <tr>
            <th scope="col">Assets</th>
            <th scope="col">Balance</th>
          </tr>
        </thead>
        <tbody className="small">
          { rows }
          <tr>
            <td>AW</td>
            <td>{this.props.chip ? this.props.chip.amount : 0}</td>
          </tr>
        </tbody>
      </table>
    )
  }

  renderFundingHistoryTable(){
    let rows = [];
    if (this.state.fundingHistory) {
      rows = this.state.fundingHistory.map(x => (
        <tr key={x.time}>
          <td>{x.code}</td>
          
          <td>{moment(x.time).format(config.dateFormat.default)}</td>
          <td>{x.type}</td>
          <td>{x.addr}</td>
          <td>{x.amount} {x.code}</td>
        </tr>
      ));
    }

    return(
      <div className="table-responsive">
        <table className="table table-hover tablestyle">
          <thead className="tablehead">
            <tr>
              <th scope="col">Assets</th>
              <th scope="col">Time</th>
              <th scope="col">Type</th>
              <th scope="col">From / To</th>
              <th scope="col">Amount</th>
            </tr>
          </thead>
          <tbody className="small">
            { rows }
            <tr>
              <td>BitCoin</td>
              <td>[ 09-09-2018 ] 22:11:20</td>
              <td>in</td>
              <td>this is sample</td>
              <td>3.42345 BTC</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }

  render() {
    return (
      <div className="bg-contents subpage mysubbg rounded">
        <h4 className="mb-3"><span><i className="fa fa-database mr-2" />Assets</span></h4>
        <div className="row justify-content-center">
          <div className='col-lg-4 col-md-6 col-sm-12'>
            {this.renderAssetsTable()}
          </div>
        </div>
        <h4 className="mb-3"><span><i className="fa fa-history mr-2 mt-3" />Funding History</span></h4>
        <div className="row justify-content-center">
          <div className='col-md-8 col-sm-12'>
            {this.renderFundingHistoryTable()}
          </div>
        </div>
      </div>
    )
  }
}

export default connect(
  state => {
    return {
      chip: state.asset.chip,
      coins: state.asset.coins
    };
  },
  dispatch => {
    return {
      Actions: bindActionCreators(actions, dispatch),
    };
  }
)(FundingHistory);
