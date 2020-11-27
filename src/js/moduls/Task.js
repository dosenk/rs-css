const data = require('../../assets/data/data.json');

export default class Task {
  constructor(level) {
    this.level = level;
  }

  getDataFromJson() {
    return data[this.level];
  }

  static prepareDataForViewer(dataViewer) {
    const tag = /<(book|flower)\s(class='[a-z\s]*?'\s)?\/>/gm;
    const classMoved = /\sclass='moved'|\smoved/gm;
    const pairedTagBook = /<(book)(>)?.*<\/book>/gm;
    const pairedTagPlace = /<(plate)(>)?.*<\/plate>/gm;

    let stagedData = dataViewer.replace(classMoved, '');

    stagedData = stagedData.replace(tag, (str) => {
      return `<div>&lt;${str.slice(1, -1)}&gt;</div>`;
    });

    stagedData = stagedData.replace(pairedTagBook, (str, p1, p2) => {
      const closeTag = p2 === undefined ? ' ' : '>';
      return `<div>&lt;${p1}${closeTag}${str.slice(
        p1.length + 2,
        -p1.length - 3
      )}&lt;/${p1}&gt;</div>`;
    });

    return stagedData.replace(pairedTagPlace, (str, p1, p2) => {
      const closeTag = p2 === undefined ? ' ' : '>';
      return `<div>&lt;${p1}${closeTag}${str.slice(
        p1.length + 2,
        -p1.length - 3
      )}&lt;/${p1}&gt;</div>`;
    });
  }

  static prepareDataForImages(dataImages) {
    const tag = /<(book|flower)\s(class='[a-z\s]*?'\s)?\/>/gm;
    const shadow =
      '<div class="shadowFrame"><svg version="2" class="shadow" viewBox="0 0 122.436 39.744"><ellipse fill="#a9a5a5" fill-opacity="0.25" cx="61.128" cy="19.872" rx="49.25" ry="8.916" /></svg></div>';
    return dataImages.replace(tag, (str, p1, p2) => {
      let res = `<${p1} ${p2}></${p1}>`;
      if (p2.indexOf('moved') > 0) res = `<shadow>${res}${shadow}</shadow>`;
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
}
