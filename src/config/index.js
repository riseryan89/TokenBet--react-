const chartTime = [
  {
    gameTime: '1M',
    timeLengthMin: 5,
    timeIntervalSec: 1
  },
  {
    gameTime: '5M',
    timeLengthMin: 25,
    timeIntervalSec: 10
  },
  {
    gameTime: '15M',
    timeLengthMin: 25,
    timeIntervalSec: 10
  },
  {
    gameTime: '60M',
    timeLengthMin: 80,
    timeIntervalSec: 60
  },
];

const notify = {
  timeRecentGameResult: 1000 * 60,
}

const dateFormat = {
  default: 'MM-DD-YYYY HH:mm:ss',
  timeOnly: 'HH:mm:ss',
}

const otp = {
  label: 'Arenawave',
  algorithm: 'sha512'
}

const recaptcha = {
  sitekey: '6Lc8wV0UAAAAAEn51-0c42ExFJkR0HuexYavcHbp',
  theme: 'dark',
}

export default class config {};
config.chartTime = chartTime;
config.notify = notify;
config.dateFormat = dateFormat;
config.otp = otp;
config.recaptcha = recaptcha;
