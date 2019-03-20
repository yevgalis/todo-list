'use strict';

const ACTIVE_TASKS_STORAGE = 'tasks';
const DONE_TASKS_STORAGE = 'doneTasks';
const form = document.querySelector('.task-form');
const taskInput = document.querySelector('.task-input');
const taskInputLabel = document.querySelector('.task-label');
const taskValidationMessage = document.querySelector('.task-validation');
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
const addTask = (evt) => {
  evt.preventDefault();
  
  if (taskInput.value && taskInput.value.trim().length) {
    hideValidationText();
    renderTask(taskInput.value);
    addTaskToLocalStorage(taskInput.value, ACTIVE_TASKS_STORAGE);
    clearTaskInput();
    filterTasks();
  } else {
    showValidationText();
  }
};

// TEXT INPUT VALIDATION TIPS
const showValidationText = () => {
  taskValidationMessage.style.display = 'block';
  taskValidationMessage.textContent = `* text can't be empty or consist of spaces`;
};

const hideValidationText = () => {
  taskValidationMessage.style.display = 'none';
};

// RENDER TASK ITEM
const renderTask = (taskValue, isDone = false) => {
  const taskTemplate = document.querySelector('#task-item').content.querySelector('.task-item').cloneNode(true);
  const taskCheckbox = taskTemplate.querySelector('.task-checkbox');
  const taskContent = taskTemplate.querySelector('.task-content');
  const delBtn = taskTemplate.querySelector('.delete-btn');

  taskContent.textContent = taskValue;
  taskCheckbox.addEventListener('input', taskCheckboxHandler);
  delBtn.addEventListener('click', onDeleteTaskBtnClick);

  if (isDone) {
    taskCheckbox.checked = true;
    taskContent.classList.add('done-task');
  }

  taskList.appendChild(taskTemplate);
};

// CHECK/UNCHECK TASK AS DONE
const taskCheckboxHandler = (evt) => {
  const taskContent = evt.target.parentElement.querySelector('.task-content');

  if (evt.target.checked === true) {
    taskContent.classList.add('done-task');
    addTaskToLocalStorage(taskContent.textContent, DONE_TASKS_STORAGE);
    removeTaskFromLocalStorage(taskContent.textContent, ACTIVE_TASKS_STORAGE);
  } else {
    taskContent.classList.remove('done-task');
    addTaskToLocalStorage(taskContent.textContent, ACTIVE_TASKS_STORAGE);
    removeTaskFromLocalStorage(taskContent.textContent, DONE_TASKS_STORAGE);
  }
};

//  DELETE TASK
const onDeleteTaskBtnClick = (evt) => {
  evt.preventDefault();

  evt.target.parentElement.remove();
  removeTaskFromLocalStorage(evt.target.parentElement.querySelector('.task-content')); // STORAGE !!!!!!!!!!!!!!!!!!!!!!!
}

// FILTER TASKS
const filterTasks = () => {
  document.querySelectorAll('.task-item').forEach((task) => {
    const item = task.querySelector('.task-content').textContent;
    
    if (item.toLowerCase().indexOf(filterInput.value.toLowerCase()) !== -1) {
      task.style.display = 'flex';
    } else {
      task.style.display = 'none';
    }
  });
};

// CLEAR ALL TASKS
const onClearTasksBtnClick = () => {
  while(taskList.firstChild) {
    taskList.removeChild(taskList.firstChild);
  }

  clearFilterInput();
  clearLocalStorage();  //  STORAGENAME
};

// CLEAR FILTER INPUT AND UNFILTER TASKS
const onClearFilterBtnClick = () => {
  clearFilterInput();
  filterTasks();
};

// CHECK LOCAL STORAGE FOR DATA
const checkLocalStorage = (storageName) => {
  let tasks;
  
  if (localStorage.getItem(storageName) === null) {
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem(storageName));
  }

  return tasks;
};

// STORE TASK IN LOCAL STORAGE
const addTaskToLocalStorage = (task, storageName) => {
  let tasks = checkLocalStorage(storageName);

  tasks.push(task);
  localStorage.setItem(storageName, JSON.stringify(tasks));
};

// REMOVE TASK FROM LOCAL STORAGE
const removeTaskFromLocalStorage = (task, storageName) => {
  let tasks = checkLocalStorage(storageName);

  for (let i = 0; i < tasks.length; i++) {
    if (task === tasks[i]) {
      tasks.splice(i, 1);
      localStorage.setItem(storageName, JSON.stringify(tasks));
      return;
    }
  }
};

// CLEAR LOCAL STORAGE
const clearLocalStorage = (storageName = null) => {
  (storageName === null) ? localStorage.clear() : localStorage.removeItem(storageName);
};

// RENDER TASKS FROM LOCAL STORAGE ON PAGE LOAD
const getTasksFromLocalStorage = () => {
  let activeTasks = checkLocalStorage(ACTIVE_TASKS_STORAGE);
  let doneTasks = checkLocalStorage(DONE_TASKS_STORAGE);

  activeTasks.forEach((task) => {
    renderTask(task);
  });

  doneTasks.forEach((task) => {
    renderTask(task, true);
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
clearTasksBtn.addEventListener('click', onClearTasksBtnClick);
