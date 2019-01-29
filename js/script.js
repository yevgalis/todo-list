'use strict';

// 2. Передавать в localStorage сделанные задания (возможно, через отдельный блок АРХИВ)
// 3. Сделать drag'n'drop для списка задач

(function () {

const ENTER_KEY_CODE = 13;
const form = document.querySelector('.task-form');
const taskInput = document.querySelector('.task-input');
const taskInputLabel = document.querySelector('.task-input-label');
const validationTextBlock = document.querySelector('.task-input-tips');
const filterInput = document.querySelector('.filter-tasks');
const clearFilterBtn = document.querySelector('.clear-filter-btn');
const taskList = document.querySelector('.task-list');
const clearTasksBtn = document.querySelector('.clear-tasks-btn');

// CLEAR INPUTS
const clearTaskInput = () => {
  taskInput.value = '';
};

const clearFilterInput = () => {
  filterInput.value = '';
};

// INPUT LABEL HANDLING
const onTaskInputFocus = () => {
  taskInputLabel.classList.add('task-input-focus');
  taskInput.addEventListener('blur', onTaskInputBlur);
};

const onTaskInputBlur = () => {
  if (!taskInput.value.length) {
    taskInputLabel.classList.remove('task-input-focus');
  }

  taskInput.removeEventListener('blur', onTaskInputBlur);
};

// ADD NEW TASK
const addTask = evt => {
  evt.preventDefault();
  
  if (taskInput.value && taskInput.value.trim().length) {
    hideValidationText();
    renderTask(taskInput.value);
    addTaskToLocalStorage(taskInput.value);
    clearTaskInput();
    filterTasks();
  } else {
    showValidationText();
  }
};

// TEXT INPUT VALIDATION TIPS
const showValidationText = () => {
  validationTextBlock.style.display = 'block';
  validationTextBlock.textContent = `* text can't be empty or consist of spaces`;
};

const hideValidationText = () => {
  validationTextBlock.style.display = 'none';
};

// RENDER TASK ITEM
const renderTask = taskValue => {
  const li = document.createElement('li');
  const span = document.createElement('span');
  const btn = document.createElement('button');

  li.classList.add('task-list-item');
  li.setAttribute('tabindex', '0');
  span.textContent = taskValue;
  span.classList.add('task-content');
  btn.classList.add('delete-btn');
  btn.setAttribute('aria-label','Delete Task');
  li.appendChild(span);
  li.appendChild(btn);
  taskList.append(li);
};

// DELETE TASK OR MARK AS DONE
const taskListHandler = evt => {
  evt.preventDefault();

  if (evt.target.classList.contains('task-list-item')) {
    evt.target.firstElementChild.classList.toggle('done-task');
  } else if (evt.target.classList.contains('task-content')) {
    evt.target.classList.toggle('done-task');
  }

  if (evt.target.classList.contains('delete-btn')) {
    evt.target.parentElement.remove();
    removeTaskFromLocalStorage(evt.target.parentElement.firstElementChild);
  }
};

const taskListKeyboardHandler = evt => {
  if (evt.target.classList.contains('task-list-item') && evt.keyCode === ENTER_KEY_CODE) {
    evt.target.firstElementChild.classList.toggle('done-task');
  }
};

// FILTER TASKS
const filterTasks = () => {
  document.querySelectorAll('.task-list-item').forEach(task => {
    const item = task.firstElementChild.textContent;
    
    if (item.toLowerCase().indexOf(filterInput.value.toLowerCase()) !== -1) {
      task.style.display = 'flex';
    } else {
      task.style.display = 'none';
    }
  });
};

// CLEAR ALL TASKS
const clearTasks = () => {
  while(taskList.firstChild) {
    taskList.removeChild(taskList.firstChild);
  }

  clearFilterInput();
  clearLocalStorage();
};

// CLEAR FILTER INPUT AND UNFILTER TASKS
const onClearFilterBtnClick = () => {
  clearFilterInput();
  filterTasks();
};

// CHECK LOCAL STORAGE FOR DATA
const checkLocalStorage = () => {
  let tasks;
  
  if (localStorage.getItem('tasks') === null) {
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem('tasks'));
  }

  return tasks;
};

// STORE TASK IN LOCAL STORAGE
const addTaskToLocalStorage = task => {
  let tasks = checkLocalStorage();

  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

// REMOVE TASK FROM LOCAL STORAGE
const removeTaskFromLocalStorage = task => {
  let tasks = checkLocalStorage();

  for (let i = 0; i < tasks.length; i++) {
    if (task.textContent === tasks[i]) {
      tasks.splice(i, 1);
      localStorage.setItem('tasks', JSON.stringify(tasks));
      return true;
    }
  }
};

// CLEAR LOCAL STORAGE
const clearLocalStorage = () => {
  localStorage.clear();
};

// RENDER TASKS FROM LOCAL STORAGE ON PAGE LOAD
const getTasksFromLocalStorage = () => {
  let tasks = checkLocalStorage();

  tasks.forEach(task => {
    renderTask(task);
  });
};

// DEFAULT VALUES
clearTaskInput();
clearFilterInput();

// ADD LISTENERS
document.addEventListener('DOMContentLoaded', getTasksFromLocalStorage);
form.addEventListener('submit', addTask);
taskInput.addEventListener('focus', onTaskInputFocus);
filterInput.addEventListener('input', filterTasks);
clearFilterBtn.addEventListener('click', onClearFilterBtnClick);
taskList.addEventListener('click', taskListHandler);
taskList.addEventListener('keypress', taskListKeyboardHandler);
clearTasksBtn.addEventListener('click', clearTasks);

})();
