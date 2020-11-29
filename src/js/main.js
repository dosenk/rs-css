const { default: Task } = require('./moduls/Task');

window.onload = () => {
  const currentLevel = 2;
  const task = new Task(currentLevel);
  task.render();
  task.addListeners();

  const a = document.querySelector('.shelf__items');
  a.addEventListener('click', (e) => {
    const b = e.target.closest('.shelf__items_image');
    if (b) {
      b.classList.add('animate__animated', 'animate__fadeOutUpBig');
    }
  });
};
