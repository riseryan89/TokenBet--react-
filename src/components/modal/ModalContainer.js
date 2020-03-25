import React, { Component } from 'react';
import Modal from 'react-modal';
import eventManager from '../../util/event/eventManager';
import { INFORM, CHECKCONFIRM } from './type';

class ModalContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      message: '',
      modalIsOpen: false
    }

    this.eventName = '';
    this.callback = null;
    this.callbackCancel = null;
  }

  componentDidMount() {
    Modal.setAppElement('body');
    eventManager
      .on(INFORM, (title, message = null, callback = null) => { this.showInform(title, message, callback)})
      .on(CHECKCONFIRM, (title, message = null, callback = null, callbackCancel = null) => { this.showCheckConfirm(title, message, callback, callbackCancel)});
  }

  componentWillUnmount() {
    eventManager
      .off(INFORM)
      .off(CHECKCONFIRM)
  }

  onAfterOpen = () => {

  }

  onRequestClose = () => {
    this.eventName === INFORM ? this.onClickOK() : this.onClickCancel()
  }

  showInform = (title, message, callback) => {
    this.eventName = INFORM;
    this.callback = callback;
    this.setState({
      title,
      message,
      modalIsOpen: true
    })
  }

  showCheckConfirm = (title, message, callback, callbackCancel) => {
    this.eventName = CHECKCONFIRM;
    this.callback = callback;
    this.callbackCancel = callbackCancel;
    this.setState({
      title,
      message,
      modalIsOpen: true
    })
  }

  onClickCancel = () => {
    this.setState({
      modalIsOpen: false
    });
    if (this.callbackCancel) {
      this.callbackCancel();
    }
  }

  onClickOK = () => {
    this.setState({
      modalIsOpen: false
    });
    if (this.callback) {
      this.callback();
    }
  }

  render() {
    return (
      <Modal
        isOpen={this.state.modalIsOpen}
        onAfterOpen={this.onAfterOpen}
        onRequestClose={this.onRequestClose}
        contentLabel="Modal"
        style={{
          overlay: {
          },
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            transform: 'translate(-50%, -50%)'
          }
        }}
      >
        <div>
          <h3 className="text-center">{this.state.title}</h3>
          {
            this.state.message?
            <h6 className="text-center">{this.state.message}</h6>:null
          }
          {
            this.eventName === CHECKCONFIRM ?
            <button className='btn btn-warning btn-block mt-3' onClick={this.onClickCancel}>Cancel</button>:null
          }
          <button className='btn btn-warning btn-block mt-3' onClick={this.onClickOK}>OK</button>
        </div>
      </Modal>
    )
  }
}

export default ModalContainer;
