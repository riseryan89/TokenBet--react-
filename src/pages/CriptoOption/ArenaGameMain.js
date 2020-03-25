import React from 'react';
import ArenaChart from './ArenaChart';
import ArenaGameBetting from './ArenaGameBetting';
import ArenaGameBetList from './ArenaGameBetList';
import ArenaGameOption from './ArenaGameOption';

class ArenaGameMain extends React.Component {
  render() {
    return (
      <div className="row cryptoOptionMobileTopRowMargin">
        <div className="col-xl-8 col-lg-7 col-md-6 col-sm-12">
          <ArenaGameOption/>
          <ArenaChart/>
        </div>
        <div className="col-xl-4 col-lg-5 col-md-6 col-sm-12 mt-4 cryptoOptionMobileMargin">
          <ArenaGameBetting history={this.props.history}/>
          <ArenaGameBetList history={this.props.history}/>
        </div>
      </div>
    )
  }
}

export { ArenaGameMain }
