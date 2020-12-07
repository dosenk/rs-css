import hljs from 'highlight.js';
import Editor from './Editor';
import Locastore from './Localstor';
import Modal from './Modal';

const data = require('../../assets/data/data.json');

export default class Task {
  constructor(level) {
    this.level = level;
    this.help = 0; // 0 - not help btn, 1 - with help btn
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
    hljs.initHighlighting.called = false;
    hljs.initHighlighting();
  }

  static getHtmlCodeElement(elem) {
    const tag = elem.tagName.toLowerCase();
    let classNames = '';
    elem.classList.forEach((className) => {
      if (className !== 'moved') {
        classNames += `${className} `;
      }
    });
    const id =
      elem.getAttribute('id') !== null
        ? ` id="${elem.getAttribute('id')}"`
        : '';

    const classes =
      classNames.length > 0 ? ` class="${classNames.trim()}"` : '';
    return `&lt;${tag + classes + id}&gt;&lt;/${tag}&gt;`;
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
    document
      .querySelector('.editor__window_btn-help')
      .addEventListener('click', () => this.getAnswer());
    document
      .querySelector('.editor__window_btn-reset-levels')
      .addEventListener('click', () => {
        localStorage.clear();
        this.setLevel(1);
        Task.setActiveForLevel(1);
      });
    document
      .querySelector('.burger-menu')
      .addEventListener('click', () => this.changeBurger(true));

    document.querySelector('.switch-wrapper').addEventListener('click', (e) => {
      const viewer = document.querySelector('.viewer');
      const viewerTab = document.querySelector('.switch-wrapper_viewer');
      const editorTab = document.querySelector('.switch-wrapper_editor');
      if (e.target.closest('.switch-wrapper_viewer')) {
        viewer.style.zIndex = '2';
        e.target.classList.add('active-viewer');
        editorTab.classList.remove('active-editor');
      }
      if (e.target.closest('.switch-wrapper_editor')) {
        viewer.style.zIndex = '1';
        e.target.classList.add('active-editor');
        viewerTab.classList.remove('active-viewer');
      }
    });
  }

  changeBurger(flag) {
    const page = document.querySelector('.page');
    const burgerMenu = document.querySelector('.burger-menu');
    if (!this.burgerOn && flag) {
      this.burgerOn = true;
      page.style.right = `${(window.innerWidth - 500) / 2}px`;
      burgerMenu.style.transform = 'rotate(90deg)';
    } else {
      this.burgerOn = false;
      page.style = '';
      burgerMenu.style = '';
    }
  }

  getAnswer() {
    this.help = 1;
    const answer = this.dataOfLevel.selector;
    let i = 0;
    const print = (input) => {
      const inputEditor = input;
      i += 1;
      if (i <= answer.length) {
        inputEditor.value = answer.substr(0, i);
        setTimeout(() => print(inputEditor), 20);
      }
    };
    const levelInfo = Locastore.getHelpInfo(this.level);
    if (levelInfo === null) {
      Locastore.setLevelResult(this.level, 0, 1);
    }
    print(this.editorInput);
  }

  checkAnswer() {
    try {
      const trueAnswer = document.querySelectorAll(`.shelf__items .moved`);
      const answer = document.querySelectorAll(
        `.shelf__items ${this.editorInput.value}`
      );
      const res = Editor.compareResults(answer, trueAnswer);
      if (res.isCorrectAnswer) {
        trueAnswer.forEach((item) => {
          item.classList.remove('moved');
          item.classList.add('animate__animated');
          item.classList.add('animate__backOutUp');
        });
        const levelHelp = Locastore.getHelpInfo(this.level) || this.help;
        Locastore.setLevelResult(this.level, 1, levelHelp.help);
        this.changeBurger();
        setTimeout(() => {
          this.level += 1;
          const notDecidedLevels = Locastore.getDicidedLevels(true);
          let msg = 'VICTORY!';
          if (this.level > 20) {
            if (notDecidedLevels.length > 0) {
              const endMsg =
                notDecidedLevels.length > 1 ? 'these levels' : 'this level';
              msg += ` But you haven't solved ${endMsg}: ${notDecidedLevels.join(
                ' ,'
              )}`;
            }
            Modal.drowModal(msg);
            this.level = 20;
          }
          if (notDecidedLevels.length === 0) {
            Modal.drowModal(msg);
            this.level = 1;
          }
          this.setLevel(this.level);
          Locastore.setCurrentLevel(this.level);
        }, 500);
      } else {
        if (res.wrongNodes.length > 0) {
          res.wrongNodes.forEach((node) => {
            Editor.setClass('animate__shakeX', node);
          });
        }
        Editor.setClass('animate__shakeX');
      }
    } catch (e) {
      Modal.drowModal('You entered an incorrect selector, please try again!');
    }
  }

  static displayActiveImages(item) {
    const imgElem = document.querySelector(`.shelf__items [item="${item}"]`);
    const codeElem = document.querySelector(
      `.viewer__window_code [item="${item}"]`
    );
    const htmlCode = Task.getHtmlCodeElement(imgElem);
    const htmlCodeNode = document.createElement('div');
    htmlCodeNode.setAttribute('class', 'active-code-item');
    htmlCodeNode.innerHTML = htmlCode;
    imgElem.appendChild(htmlCodeNode);
    imgElem.classList.add('active');
    codeElem.classList.add('active-code');
  }

  static deletActiveImages(item) {
    const imgElem = document.querySelector(`.shelf__items [item="${item}"]`);
    const codeElem = document.querySelector(
      `.viewer__window_code [item="${item}"]`
    );

    imgElem.classList.remove('active');
    const htmlCodeNode = document.querySelector(
      '.shelf__items .active-code-item'
    );
    if (htmlCodeNode !== null) htmlCodeNode.remove();
    codeElem.classList.remove('active-code');
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
    this.changeBurger();
    if (level > 0 && level <= 20) {
      this.help = 0;
      Locastore.setCurrentLevel(level);
      this.level = level;
      this.render();
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
    const decidedLevels = Locastore.getDicidedLevels();
    allLevels.forEach((item) => {
      item.classList.remove('active-level', 'level-on', 'level-help');
    });
    decidedLevels.forEach((item) => {
      const decidedLevel = document.querySelector(`#level-${item.level}`);
      decidedLevel.classList.add('level-on');
      if (item.levelInfo.help === 1) decidedLevel.classList.add('level-help');
    });
    const activeLevel = document.querySelector(`#level-${level}`);
    activeLevel.classList.add('active-level');
  }
}
