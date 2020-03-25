import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { Line, defaults } from 'react-chartjs-2';
import moment from 'moment';
import 'chartjs-plugin-annotation';
import config from '../../config';

class ArenaChart extends React.Component {
  constructor (props) {
    super(props)

    // chart.js defaults
    // Chart.defaults.global.defaultFontColor = '#000';
    // Chart.defaults.global.defaultFontSize = 16;
    defaults.global.animation = false;

    this.state = {
      chartData: [],
      openValue: null,
      currentValue: null,
      currPlayingOpenData: {},
    }

    this.gameId = '';
  }

  componentDidMount () {
    this.getBitcoinData()
    this.timer = setInterval(()=> this.getBitcoinData(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  getBitcoinData () {
    if (!this.props.game.selected) return;
    // console.log(this.props.game.selected);
    if (this.gameId !== this.props.game.selected.gameId) {
      this.gameId = this.props.game.selected.gameId;
      this.setState({
        chartData: [],
        openValue: null,
        currentValue: null,
      })
    }
    
    const cfgChartData = config.chartTime.find(x => x.gameTime === this.props.game.selected.gameTime);
    // console.log(cfgChartData);
    const chartStTime = new Date().getTime() - cfgChartData.timeLengthMin * 60000;
    const fromTime = this.state.chartData.length ? this.state.chartData[this.state.chartData.length - 1].timeMillis : chartStTime;
    // console.log(fromTime);
    const params = {gameId:this.props.game.selected.gameId, fromTime, intervalSec: cfgChartData.timeIntervalSec};
    axios.get('/api/chart', { params })
    .then(res => {return res.data;})
    .then(data => {
      // console.log(data);
      if (data.length === 0) { return }
      const newData = data.map(x => {
        return {
          timeMillis: x.timeStamp,
          openPrice: x.openPrice,
          closePrice: x.closePrice,
        }
      });
      let uptData = this.state.chartData.filter(x => (x.timeMillis > chartStTime) && (x.timeMillis < fromTime)).concat(newData);

      const currPlayingOpenTime = this.props.game.selected.openTime - this.props.game.selected.gameTimeSec * 1000;
      const currPlayingData = this.state.chartData.filter(x => x.timeMillis >= currPlayingOpenTime);
      this.setState({
        chartData: uptData,
        openValue: null,
        currentValue: data[data.length - 1].closePrice,
        currPlayingOpenData: (currPlayingData.length > 0) ? currPlayingData[0] : null,
      })
    })
    .catch(e => e);
  }

  formatChartData () {
    return {
      labels: this.state.chartData.map(x => moment(x.timeMillis).utc().format(config.dateFormat.timeOnly)),
      datasets: [
        {
          label: "Bitcoin",
          fill: false,
          lineTension: 0.1,
          backgroundColor: '#ffc107',
          borderColor: '#ffc107',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: '#ffc107',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 3,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: '#ffc107',
          pointHoverBorderColor: '#ffc107',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: this.state.chartData.map(x => x.closePrice)
        }
      ]
    }
  }

  render() {
    let currGameStart = '';
    if (this.state.currPlayingOpenData) {
      currGameStart = moment(this.state.currPlayingOpenData.timeMillis).utc().format(config.dateFormat.timeOnly);
    }
    var options = {
      legend: {
        display: false,
      },
      annotation: {
        annotations: [{
          type: 'line',
          mode: 'vertical',
          scaleID: 'x-axis-0',
          value: currGameStart,
          borderColor: 'red',
          borderWidth: 1
        }],
        drawTime: "afterDraw" // (default)
      }
    };

    // this.props.game.selected
    if (this.state.chartData) {
      return (
        <div className="card mb-3 bg-contents text-white">
          {/* <div className="card-header text-info">
            <i className="fas fa-chart-bar text-info"></i>
            <h3><small>Bitcoin (BTC)</small></h3>
          </div> */}
          <div className="card-body">
            <Line data={this.formatChartData()} options={options} />
          </div>
          <div className="card-footer lead">
            <div className="row cryptoOptionMobileRowMargin">
              <div className="col-4">
                <span className="cryptoOptionMobileFont">Open: {(this.state.currPlayingOpenData) ? this.state.currPlayingOpenData.openPrice : null}</span>
              </div>
              <div className="col-4">
                <span className="cryptoOptionMobileFont">Open: {(this.state.currPlayingOpenData) ? moment(this.state.currPlayingOpenData.timeMillis).utc().format(config.dateFormat.timeOnly) : null}</span>
              </div>
              <div className="col-4">
                <span className="cryptoOptionMobileFont">Current: {this.state.currentValue}</span>
              </div>
            </div>
          </div>
        </div>
      )
    } else {
      return null;
    }
  }
}

export default connect(
  (state) => ({
    game: state.game,
  }),
  null
)(ArenaChart);