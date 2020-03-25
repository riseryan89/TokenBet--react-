
const getElapseTimeHHMMSS = (seconds) => {
  if (seconds < 0) {
    return seconds;
  }
  let hour = Math.floor(seconds / 3600);
  let minute = Math.floor(seconds / 60) % 60;
  let second = seconds % 60;

  if (hour < 10) hour = '0' + hour;
  if (minute < 10) minute = '0' + minute;
  if (second < 10) second = '0' + second;

  return `${hour}:${minute}:${second} (${seconds})`;
}

export default { getElapseTimeHHMMSS }
