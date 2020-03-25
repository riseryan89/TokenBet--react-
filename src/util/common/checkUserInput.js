const checkUserInput = {};

checkUserInput.validEmail = (emailAddress) => {
  // return emailAddress.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/g);
  return emailAddress.match(/^[A-Za-z0-9_\\.\\-]+@[A-Za-z0-9\\-]+\.[A-Za-z0-9\\-]+/);
}

checkUserInput.vaildPassword = (password) => {
  return password.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*()_+='";:/?.\\[\]|\\~>,<₩]).{8,}$/g);
}

checkUserInput.vaildOtpCode = (otpCode) => {
  if (otpCode.length > 6) return false;
  return otpCode.match(/\d{6}$/);
}

checkUserInput.isValidAddress = (coinCode, address) => {
  if (coinCode === 'BTC') {
    if (address.length === 34 && (address.startsWith('1') || address.startsWith('3'))) {
      return true;
    } else {
      return false;
    }
  }

  if (coinCode === 'ETH') {
    if (address.length === 42 && address.startsWith('0x')) {
      return true;
    } else {
      return false;
    }
  }

  return false;
};

export default checkUserInput;
