import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';
import { SELECTGAME } from '../../actions/types';

class ArenaGameOption extends Component {
  constructor(props) {
    super(props);

    this.state = {
      gamelist: []
    };
  }

  componentWillMount() {
    // this.updateRatio();

    this.timer();
    this.timeID = setInterval(
      () => this.timer(),
      1000
    )
  }

  componentWillUnmount() {
    clearInterval(this.timeID)
  }

  timer = () => {
    this.updateRatio();
  }

  renderDetailOptions() {
    let cols = [];

    const getGameName = (game) => (
      `${game.coinCode}/${game.base} ${game.gameTime}`
    )

    cols = this.state.gamelist.map((x, i) => {
      x.payoutCall = x.amount.call === 0 ? 1 : x.amount.total/x.amount.call;
      x.payoutPut = x.amount.put === 0 ? 1 : x.amount.total/x.amount.put;
      // return(<button className="lead m-1" name={x.gameId} key={i} onClick={this.selectGame}>{getGameName(x)}</button>)
      return(
        <button className='btn btn btn-outline-light pt-4 ml-2' key={i} name={x.gameId} onClick={this.selectGame.bind()}>{getGameName(x)}
          <div className="col pb-3">
            <span>CALL</span> <span>PUT</span><br/>
            <span>{x.payoutCall.toFixed(2)}</span> <span>{x.payoutPut.toFixed(2)}</span>
          </div>
        </button>
      );
    });
    return (
      <div className="card-body">
        {cols}
        <i className="fa fa-angle-double-right text-light ml-2"/>
      </div>
    );
  }

  selectGame = (e) => {
    // console.log(e.target);
    const gameId = e.target.name;
    // console.log(this.state.gamelist.find(x => x.gameId === gameId));
    this.props.SelectGame(this.state.gamelist.find(x => x.gameId === gameId));
  }

  render() {
    return (
      // <div className='col-xl-9 col-lg-7 col-md-6 col-sm-12'>
      <div align="left">
        <div className="accordion" id="optionList">
          <div className="card bg-contents rounded mt-4 mb-2">
            <div className="card-header" id="headingTwo">
              <h5 className="mb-0">
                <button className="btn bg-contents02 collapsed btn-block text-left text-light" type="button" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                  Option List
                  <i className="fa fa-chevron-circle-down float-right text-light mt-1"/>
                </button>
                <span className="glyphicon glyphicon-chevron-down" aria-hidden="true"></span>
              </h5>
            </div>
            <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#optionList">
              {this.renderDetailOptions()}
            </div>
          </div>
        </div>
      </div>
      // </div>
    )
  }

  updateRatio() {
    axios.get(`/api/game/nextgames`)
    .then(response => {return response.data})
    .then(data => {
      this.setState({
        gamelist: data
      });
      if (this.props.game.selected === undefined) {
        if (this.state.gamelist.length) {
          this.props.SelectGame(this.state.gamelist[0]);
        }
      } else {
        this.props.SelectGame(this.state.gamelist.find(x => x.gameId === this.props.game.selected.gameId));
      }
    })
    .catch(error => {
      console.error('error' + error);
      throw(error);
    });
  }
}

export default connect(
  (state) => ({
    game: state.game,
  }),
  (dispatch) => ({
    SelectGame: bindActionCreators((selectedGame) => { return { type:SELECTGAME, payload: selectedGame }}, dispatch)
  })
)(ArenaGameOption);