import hljs from 'highlight.js';

const { default: Task } = require('./moduls/Task');

window.onload = () => {
  const currentLevel = 2;
  const task = new Task(currentLevel);
  task.render();
  task.addListeners();
  hljs.initHighlighting();
};
