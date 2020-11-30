const data = require('../../assets/data/data.json');

export default class Task {
  constructor(level) {
    this.level = level;
  }

  getDataFromJson() {
    return data[this.level];
  }

  static prepareDataForViewer(dataViewer) {
    const regSingleTag = /<(mat|book|flower|tel|clock)\s(class='[a-z\s]*')?\s*(id='q\d*')\s*\/>/gm;
    const regClassMoved = /\sclass='moved'|\smoved/gm;

    const regPairedTags = [
      /<(book|mat)\s?(class='.{5,15}')?\s?(id='q\d?')\s?>/gm,
      /<\/(book|mat)()>/gm,
    ];

    let stagedData = dataViewer.replace(regClassMoved, '');
    stagedData = stagedData.replace(regSingleTag, (str, p1, p2, p3) => {
      return `<div ${p3}>&lt;${p1} ${p2 || ''} /&gt;</div>`;
    });

    function replaceData(strForReplace, reg, i) {
      const res = strForReplace.replace(reg, (str, p1, p2, p3) => {
        const startHtml = !i ? `<div ${p3}>&lt;` : '&lt;';
        const endHtml = i ? '&gt;</div>' : '&gt;';
        return `${startHtml}${p1} ${p2 || ''}${endHtml}`;
      });
      return res;
    }
    for (let i = 0; i < regPairedTags.length; i += 1) {
      stagedData = replaceData(stagedData, regPairedTags[i], i);
    }
    return stagedData;
  }

  static prepareDataForImages(dataImages) {
    const tag = /<(mat|book|flower|tel|clock)\s(class='[a-z\s]*')?\s*(id='q\d*')\s*\/>/gm;
    return dataImages.replace(tag, (str, p1, p2, p3) => {
      const tagClass = p2 || '';
      let res = `<${p1} ${tagClass} ${p3}></${p1}>`;
      if (tagClass.indexOf('moved') > 0) {
        const shadowClass =
          tagClass.indexOf('small') > 0 ? 'shadowFrame small' : 'shadowFrame';
        const shadow = `<div class="${shadowClass}"><svg version="2" class="shadow" viewBox="0 0 122.436 39.744"><ellipse fill="#a9a5a5" fill-opacity="0.25" cx="61.128" cy="19.872" rx="49.25" ry="8.916" /></svg></div>`;
        res = `<shadow>${res}${shadow}</shadow>`;
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
      const tags = ['BOOK', 'FLOWER', 'TEL', 'MAT', 'SHADOWFRAME'];
      if (tags.indexOf(e.target.tagName) >= 0) {
        e.target.classList.add('active');
        Task.displayElementOnModal();
        e.target.onmouseout = () => {
          Task.deletElementFromModal();
          e.target.classList.remove('active');
        };
      } else if (e.target.closest('shadow')) {
        const shadowParent = e.target.closest('shadow').parentNode;
        if (tags.indexOf(shadowParent.tagName) >= 0) {
          shadowParent.classList.add('active');
          Task.displayElementOnModal();
          shadowParent.onmouseout = () => {
            Task.deletElementFromModal();
            shadowParent.classList.remove('active');
          };
        }
      }
    });
  }

  static displayElementOnModal() {
    const activeElement = document.querySelector('.active');
    const idActiveElement = activeElement.getAttribute('id');
    console.log(idActiveElement);
    const codeElement = document.querySelector(
      `.viewer__window_code #${idActiveElement}`
    );
    codeElement.classList.add('active-code');

    const activeModal = document.querySelector('.viewer__window-active-items');
    // activeModal.classList.add('active-wrapper');
    activeModal.append(activeElement.cloneNode(true));
    // console.log(activeElement.);
  }

  static deletElementFromModal() {
    const activeElement = document.querySelector('.active');
    const idActiveElement = activeElement.getAttribute('id');
    // console.log(idActiveElement);
    const codeElement = document.querySelector(
      `.viewer__window_code #${idActiveElement}`
    );
    codeElement.classList.remove('active-code');

    const activeModal = document.querySelector('.viewer__window-active-items');
    // activeModal.classList.remove('active-wrapper');
    activeModal.innerHTML = '';
  }
}
