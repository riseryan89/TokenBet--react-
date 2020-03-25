import React from 'react';

export const renderButton = (btnClass, btnStyle, btnName, btnDisabled) => {
  if(btnClass !== '' && btnName !== '' && btnDisabled !== ''){
    btnDisabled = btnDisabled === undefined || btnDisabled === '' ? false : btnDisabled
    if(btnStyle !== '' || btnStyle !== undefined){
      return (
        // "btn btn-secondary"
        <button type="button" className={btnClass} aria-disabled={btnDisabled} style={btnStyle}>{btnName}</button>
      )
    } else {
      return (
        // "btn btn-secondary"
        <button type="button" className={btnClass} aria-disabled={btnDisabled}>{btnName}</button>
      )
    }
  }
}
