export default class Modal {
  static drowModal(info) {
    Modal.windowWrapper = document.querySelector('.modal');
    Modal.windowWrapper.classList.add('modal_active');
    Modal.window = document.querySelector('.modal_window');
    Modal.window.classList.add('animate__zoomIn');
    Modal.addInfo(info);
    Modal.addListener();
  }

  static closeModal(e) {
    if (e.target.closest('.modal_window__btn')) {
      Modal.windowWrapper.removeEventListener('click', Modal.closeModal);
      Modal.windowWrapper.classList.remove('modal_active');
    }
  }

  static addListener() {
    Modal.windowWrapper.addEventListener('click', (e) => Modal.closeModal(e));
  }

  static addInfo(info) {
    Modal.infoBlock = document.querySelector('.modal_window__info p');
    Modal.infoBlock.innerHTML = info;
  }
}
