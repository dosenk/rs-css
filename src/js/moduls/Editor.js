export default class Editor {
  constructor() {
    this.editor = document.querySelector('.editor-wrapper');
  }

  static compareResults(answer, trueAnswer) {
    const wrongNodes = Array.from(answer).filter(
      (node) => Array.from(trueAnswer).indexOf(node) === -1
    );
    const isCorrectAnswer =
      answer.length !== trueAnswer.length
        ? false
        : Array.from(answer).every((node, index) => node === trueAnswer[index]);
    return { isCorrectAnswer, wrongNodes };
  }

  static setClass(className, node = null) {
    const elem =
      node === null ? document.querySelector('.editor-wrapper') : node;
    elem.classList.add('animate__animated', className);
    setTimeout(() => {
      elem.classList.remove('animate__animated', className);
    }, 600);
  }
}
