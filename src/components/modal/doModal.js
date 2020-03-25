import eventManager from '../../util/event/eventManager';
import { INFORM, CHECKCONFIRM } from './type';

const doModal = {};

doModal.inform = (title, message = null, callback = null) => {
  if (!title) {
    alert('doModal.inform needs title');
    return;
  }
  eventManager.emit(INFORM, title, message, callback);
}

doModal.checkConfirm = (title, message, callbackOk, callbackCacel = null) => {
  if (!title) {
    alert('doModal.checkCofirm needs title');
    return;
  }
  if (!message) {
    alert('doModal.checkCofirm needs message');
    return;
  }
  if (!callbackOk) {
    alert('doModal.checkCofirm needs callbackOk');
    return;
  }
  eventManager.emit(CHECKCONFIRM, title, message, callbackOk, callbackCacel);
}

export default doModal;
