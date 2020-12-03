const { default: Task } = require('./moduls/Task');

window.onload = () => {
  const currentLevel = 1;
  const task = new Task(currentLevel);
  task.setLevel(currentLevel);
  task.addListeners();
};
