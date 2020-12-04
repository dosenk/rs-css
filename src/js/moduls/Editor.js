export default class Editor {
  constructor() {
    this.editor = document.querySelector('.editor-wrapper');
  }

  static compareResults(answer, trueAnswer) {
    if (answer.length !== trueAnswer.length) {
      return false;
    }
    return Array.from(answer).every(
      (node, index) => node === trueAnswer[index]
    );
  }

  static setClass(className) {
    const editor = document.querySelector('.editor-wrapper');
    editor.classList.add('animate__animated', className);
    setTimeout(() => {
      editor.classList.remove('animate__animated', className);
    }, 600);
  }
}
