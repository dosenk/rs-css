import hljs from 'highlight.js';
import Editor from './Editor';

const data = require('../../assets/data/data.json');

export default class Task {
  constructor(level) {
    this.level = level;
  }

  getDataFromJson(level) {
    const currentLevel = level || this.level;
    return data[currentLevel];
  }

  static prepareDataForViewer(dataViewer) {
    const regOpenTag = /<(\w*)\s(class='[\w,\s]*')?\s?(item=[',"]q\d*[',"])?|</gm;
    const regCloseTag = /(\/)?(mat|book|flower|map|lamp|tel|clock)[\w,',=,\s]*\s?(\/)?>/gm;
    const regClassMoved = /\sclass='moved'|\smoved|<\/?shadow>/gm;
    let stagedData = dataViewer.replace(regClassMoved, '');

    stagedData = stagedData.replace(regOpenTag, (str, p1, p2, p3) => {
      // <pre><code class="language-html">&lt;/div&gt;</code></pre>
      let res = `<div ${p3 || ''}> <pre><code class="language-html"> &lt;${
        p1 || ''
      } ${p2 || ''}`;
      if (p1 === undefined) res = '<pre><code class="language-html"> &lt;';
      return res;
    });
    stagedData = stagedData.replace(regCloseTag, (str, p1, p2, p3) => {
      let res = `${str.slice(0, -1)}&gt; </code></pre></div>`;
      if (p1 === undefined && p3 === undefined)
        res = `${str.slice(0, -1)}&gt; </code></pre>`;
      return res;
    });
    return stagedData;
  }

  static prepareDataForImages(dataImages) {
    const regCloseTag = /([\w]+)(\s*(id|class|item)='[\w\s\d]+'\s*)+\/>/gm;
    //   const shadow = `<div class="shadowFrame small"><svg version="2" class="shadow" viewBox="0 0 122.436 39.744"><ellipse fill="#a9a5a5" fill-opacity="0.25" cx="61.128" cy="19.872" rx="49.25" ry="8.916" /></svg></div>`;
    return dataImages.replace(regCloseTag, (str, p1) => {
      return `${str.slice(0, -2)}></${p1}>`;
    });
  }

  render() {
    this.dataOfLevel = this.getDataFromJson();
    this.taskName = document.querySelector('.task-name');
    this.levelName = document.querySelector('.level-name__current');
    this.examples = document.querySelector('.task-wrapper__examples_text');
    this.instructionName = document.querySelector('.instructions-name');
    this.instructionSurName = document.querySelector('.instructions-surName');
    this.instruction = document.querySelector(
      '.task-wrapper__info_instructions'
    );
    this.viewer = document.querySelector('.viewer__window_code');
    this.images = document.querySelector('.shelf__items');

    this.images.innerHTML = Task.prepareDataForImages(
      this.dataOfLevel.HTMLviewer
    );
    this.viewer.innerHTML = Task.prepareDataForViewer(
      this.dataOfLevel.HTMLviewer
    );

    this.taskName.innerText = this.dataOfLevel.taskName;
    this.levelName.innerText = this.level;
    Task.setActiveForLevel(this.level);
    this.examples.innerHTML = this.dataOfLevel.examples;
    this.instructionName.innerText = this.dataOfLevel.instructionName;
    this.instructionSurName.innerHTML = this.dataOfLevel.instructionSurName;
    this.instruction.innerHTML = this.dataOfLevel.instruction;
    this.editorInput = document.querySelector('.editor__window_input');
    this.editorInput.value = '';
  }

  addListeners() {
    this.images.addEventListener('mouseover', (e) => {
      if (e.target.closest('[item^="q"]') !== null) {
        const elem = e.target.closest('[item^="q"]');
        const item = elem.getAttribute('item');
        Task.displayActiveImages(item);
        elem.onmouseout = () => {
          Task.deletActiveImages(item);
        };
      }
    });
    this.viewer.addEventListener('mouseover', (e) => {
      if (e.target.closest('div')) {
        const elem = e.target.closest('div');
        const item = elem.getAttribute('item');
        Task.displayActiveImages(item);
        elem.onmouseout = () => {
          Task.deletActiveImages(item);
        };
      }
    });
    document
      .querySelector('.page')
      .addEventListener('click', (e) => this.changeLevel(e));
    document
      .querySelector('.editor__window_btn')
      .addEventListener('click', () => this.checkAnswer());
    this.editorInput.addEventListener('keydown', (e) => {
      if (e.code === 'Enter' || e.code === 'NumpadEnter') this.checkAnswer();
    });
  }

  checkAnswer() {
    try {
      const trueAnswer = document.querySelectorAll(`.shelf__items .moved`);
      const answer = document.querySelectorAll(
        `.shelf__items ${this.editorInput.value}`
      );
      const res = Editor.compareResults(answer, trueAnswer);
      if (res) {
        // SET TO LOCALSTORAGE RESULT
        // CHANGED IMAGES OF TRUE ANSWER
        trueAnswer.forEach((item) => {
          item.classList.remove('moved');
          item.classList.add('animate__animated');
          item.classList.add('animate__backOutUp');
        });
        setTimeout(() => {
          this.level += 1;
          this.setLevel(this.level);
        }, 500);
      } else {
        Editor.setClass('animate__shakeX');
      }
    } catch (e) {
      alert('You entered an incorrect selector, please try again!');
    }
  }

  static displayActiveImages(item) {
    const imgElem = document.querySelector(`.shelf__items [item="${item}"]`);
    const codeElem = document.querySelector(
      `.viewer__window_code [item="${item}"]`
    );
    imgElem.classList.add('active');
    codeElem.classList.add('active-code');
    const activeModal = document.querySelector('.viewer__window-active-items');
    activeModal.append(imgElem.cloneNode(true));
  }

  static deletActiveImages(item) {
    const imgElem = document.querySelector(`.shelf__items [item="${item}"]`);
    const codeElem = document.querySelector(
      `.viewer__window_code [item="${item}"]`
    );
    imgElem.classList.remove('active');
    codeElem.classList.remove('active-code');
    const activeModal = document.querySelector('.viewer__window-active-items');
    activeModal.innerHTML = '';
  }

  changeLevel(e) {
    if (e.target.classList.contains('level-change')) {
      const elem = e.target;
      const level = elem.classList.contains('level-prev')
        ? this.level - 1
        : this.level + 1;
      this.setLevel(level);
    } else if (e.target.classList.contains('all-levels__circle')) {
      const level = +e.target.innerText;
      Task.setActiveForLevel(level);
      this.setLevel(level);
    }
  }

  setLevel(level) {
    if (level > 0 && level <= 20) {
      this.level = level;
      this.render();
      hljs.initHighlighting.called = false;
      hljs.initHighlighting();
      const shelf = document.querySelector('.shelf');
      shelf.classList.add('animate__zoomInDown');
      const code = document.querySelector('.viewer__window_shelf');
      code.classList.add('animate__fadeIn');
      setTimeout(() => {
        code.classList.remove('animate__fadeIn');
        shelf.classList.remove('animate__zoomInDown');
      }, 700);
    }
  }

  static setActiveForLevel(level) {
    const allLevels = document.querySelectorAll('.all-levels__circle');
    allLevels.forEach((item) => {
      item.classList.remove('active-level');
    });
    const activeLevel = document.querySelector(`#level-${level}`);
    activeLevel.classList.add('active-level');
  }
}
