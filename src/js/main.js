const { default: Task } = require('./moduls/Task');
const { default: Localstor } = require('./moduls/Localstor');

window.onload = () => {
  const currentLevel = Localstor.getCurrentLevel();
  const level = currentLevel === null ? 1 : +currentLevel;
  console.log(level);

  const task = new Task(level);
  task.render();
  task.addListeners();
};
