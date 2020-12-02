import newData from '../../assets/data/data';

const data = require('../../assets/data/data.json');

export default class Task {
  constructor(level) {
    // this.newData = newData;
    this.level = level;
  }

  getDataFromJson() {
    // console.log(data);
    return data[this.level];
  }

  static prepareDataForViewer(dataViewer) {
    const regOpenTag = /<(\w*)\s(class='[\w,\s]*')?\s?(id=[',"]q\d*[',"])?|</gm;
    const regCloseTag = /(\/)?(mat|book|flower|map|lamp|tel|clock)[\w,',=,\s]*\s?(\/)?>/gm;
    const regClassMoved = /\sclass='moved'|\smoved/gm;

    let stagedData = dataViewer.replace(regClassMoved, '');

    stagedData = stagedData.replace(regOpenTag, (str, p1, p2, p3) => {
      let res = `<div ${p3 || ''}> &lt;${p1 || ''} ${p2 || ''}`;
      if (p1 === undefined) res = '&lt;';
      return res;
    });
    stagedData = stagedData.replace(regCloseTag, (str, p1, p2, p3) => {
      let res = `${str.slice(0, -1)}&gt;</div>`;
      if (p1 === undefined && p3 === undefined) res = `${str.slice(0, -1)}&gt;`;
      return res;
    });
    return stagedData;
  }

  static prepareDataForImages(dataImages) {
    const tag = /<(mat|book|flower|tel|clock)\s(class='[a-z\s]*')?\s*(id='q\d*')\s*\/>/gm;
    return dataImages.replace(tag, (str, p1, p2, p3) => {
      const tagClass = p2 || '';
      // console.log(p1, tagClass, p3);
      let res = `<${p1} ${tagClass} ${p3}></${p1}>`;
      if (tagClass.indexOf('moved') >= 0) {
        const shadowClass = tagClass.indexOf('small') >= 0 ? 'small' : '';
        const shadow = `<div class="shadowFrame ${shadowClass}"><svg version="2" class="shadow" viewBox="0 0 122.436 39.744"><ellipse fill="#a9a5a5" fill-opacity="0.25" cx="61.128" cy="19.872" rx="49.25" ry="8.916" /></svg></div>`;
        res = `<shadow class='${shadowClass}'>${res}${shadow}</shadow>`;
      }
      return res;
    });
  }

  render() {
    const dataOfLevel = this.getDataFromJson();
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

    this.viewer.innerHTML = Task.prepareDataForViewer(dataOfLevel.HTMLviewer);

    this.images.innerHTML = Task.prepareDataForImages(dataOfLevel.HTMLviewer);
    this.taskName.innerText = dataOfLevel.taskName;
    this.levelName.innerText = this.level;
    this.examples.innerHTML = dataOfLevel.examples;
    this.instructionName.innerText = dataOfLevel.instructionName;
    this.instructionSurName.innerHTML = dataOfLevel.instructionSurName;
    this.instruction.innerHTML = dataOfLevel.instruction;
  }

  addListeners() {
    this.images.addEventListener('mouseover', (e) => {
      // const tags = ['BOOK', 'FLOWER', 'TEL', 'MAT'];
      if (e.target.closest('[id^="q"]') !== null) {
        const elem = e.target.closest('[id^="q"]');
        if (e.target.closest('.shadowFrame') !== null) return;
        const id = elem.getAttribute('id');
        if (!id) return;
        Task.displayElementOnModal(id, elem);
        elem.onmouseout = (event) => {
          if (event.relatedTarget.closest('.shadowFrame') !== null) return;
          Task.deletElementFromModal(id, elem);
        };
      }
    });
    this.viewer.addEventListener('mouseover', (e) => {
      const id = e.target.getAttribute('id');

      console.log(id);
    });
  }

  static displayElementOnModal(id, elem) {
    elem.classList.add('active');
    const codeElement = document.querySelector(`.viewer__window_code #${id}`);
    codeElement.classList.add('active-code');
    const activeModal = document.querySelector('.viewer__window-active-items');
    activeModal.append(elem.cloneNode(true));
  }

  static deletElementFromModal(id, elem) {
    elem.classList.remove('active');
    const codeElement = document.querySelector(`.viewer__window_code #${id}`);
    codeElement.classList.remove('active-code');
    const activeModal = document.querySelector('.viewer__window-active-items');
    activeModal.innerHTML = '';
  }
}
