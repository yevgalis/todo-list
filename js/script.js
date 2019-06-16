'use strict';

const ACTIVE_TASKS_STORAGE = 'activeTasks';
const DONE_TASKS_STORAGE = 'doneTasks';
const DONE_TASK_CLASS = 'js-done-task';
const addTaskForm = document.querySelector('.task-form');
const taskInput = document.querySelector('.task-input');
const taskInputLabel = document.querySelector('.task-label');
const taskValidationMessage = document.querySelector('.task-validation');
const filterInput = document.querySelector('.filter-tasks');
const clearFilterBtn = document.querySelector('.clear-filter-btn');
const taskList = document.querySelector('.task-list');
const clearTasksBtn = document.querySelector('.clear-tasks-btn');
const doneTaskList = document.querySelector('.archive-list');
const doneTaskBtn = document.querySelector('.toggle-archive-btn');
const clearDoneTasksBtn = document.querySelector('.clear-archive-btn');
const doneTaskCount = document.querySelector('.js-archive-counter');

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
  setTimeout(() => { taskInput.placeholder = 'feed the raccoon'; }, 200);
  taskInput.addEventListener('blur', onTaskInputBlur);
};

const onTaskInputBlur = () => {
  if (!taskInput.value.length) {
    taskInputLabel.classList.remove('task-input-focus');
  }

  setTimeout(() => { taskInput.placeholder = ''; }, 100);
  taskInput.removeEventListener('blur', onTaskInputBlur);
};

// ADD NEW TASK
const addTask = (evt) => {
  evt.preventDefault();

  if (taskInput.value.trim().length) {
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
  taskValidationMessage.textContent = `* text can't consist of spaces`;
  setTimeout(() => { hideValidationText(); }, 3000);
};

const hideValidationText = () => {
  taskValidationMessage.style.display = 'none';
};

// RENDER TASK ITEM
const renderTask = (taskValue, isDone = false) => {
  const taskTemplate = document.querySelector('#task-item').content.cloneNode(true);
  const taskCheckbox = taskTemplate.querySelector('.task-checkbox');
  const taskContent = taskTemplate.querySelector('.task-content');
  const delBtn = taskTemplate.querySelector('.delete-btn');

  taskContent.textContent = taskValue;
  taskCheckbox.addEventListener('input', taskCheckboxHandler);
  delBtn.addEventListener('click', onDeleteTaskBtnClick);

  if (isDone) {
    taskCheckbox.checked = true;
    taskContent.classList.add(DONE_TASK_CLASS);
    doneTaskList.appendChild(taskTemplate)
  } else {
    taskList.appendChild(taskTemplate);
  }
};

// CHECK/UNCHECK TASK AS DONE
const taskCheckboxHandler = (evt) => {
  const taskContent = evt.target.parentElement.querySelector('.task-content');

  if (evt.target.checked === true) {
    taskContent.classList.add(DONE_TASK_CLASS);
    doneTaskList.appendChild(evt.target.parentElement);
    addTaskToLocalStorage(taskContent.textContent, DONE_TASKS_STORAGE);
    removeTaskFromLocalStorage(taskContent.textContent, ACTIVE_TASKS_STORAGE);
  } else {
    taskContent.classList.remove(DONE_TASK_CLASS);
    taskList.appendChild(evt.target.parentElement);
    addTaskToLocalStorage(taskContent.textContent, ACTIVE_TASKS_STORAGE);
    removeTaskFromLocalStorage(taskContent.textContent, DONE_TASKS_STORAGE);
  }

  setDoneTasksCounter();
};

//  DELETE TASK
const onDeleteTaskBtnClick = (evt) => {
  evt.preventDefault();

  const taskContent = evt.target.parentElement.querySelector('.task-content');
  evt.target.parentElement.remove();

  if (taskContent.classList.contains(DONE_TASK_CLASS)) {
    removeTaskFromLocalStorage(taskContent.textContent, DONE_TASKS_STORAGE);
    setDoneTasksCounter();
  } else {
    removeTaskFromLocalStorage(taskContent.textContent, ACTIVE_TASKS_STORAGE);
  }
}

// FILTER TASKS
const filterTasks = () => {
  document.querySelectorAll('.task-list .task-item').forEach((task) => {
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
  clearLocalStorage(ACTIVE_TASKS_STORAGE);
};

// CLEAR FILTER INPUT AND UNFILTER TASKS
const onClearFilterBtnClick = () => {
  clearFilterInput();
  filterTasks();
};

//  GET NUMBER OF DONE TASKS
const setDoneTasksCounter = () => {
  const archiveTasksCount = doneTaskList.querySelectorAll('.task-item').length;

  doneTaskCount.textContent = archiveTasksCount;
  (archiveTasksCount > 1) ? clearDoneTasksBtn.style.display = 'inline-block' : clearDoneTasksBtn.style.display = 'none';
}

// CLEAR ARCHIVE
const onClearDoneTasksBtnClick = () => {
  while(doneTaskList.firstChild) {
    doneTaskList.removeChild(doneTaskList.firstChild);
  }

  setDoneTasksCounter();
  clearLocalStorage(DONE_TASKS_STORAGE);
};

//  HIDE OR SHOW ARCHIVE TASKS
const onDoneBtnClick = (evt) => {
  evt.preventDefault();

  if (evt.target.textContent === 'hide') {
    doneTaskList.style.display = 'none';
    evt.target.textContent = 'show';
  } else if (evt.target.textContent === 'show') {
    doneTaskList.style.display = 'block';
    evt.target.textContent = 'hide';
  }
}

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
  const activeTasks = checkLocalStorage(ACTIVE_TASKS_STORAGE);
  const doneTasks = checkLocalStorage(DONE_TASKS_STORAGE);

  activeTasks.forEach((task) => {
    renderTask(task);
  });

  doneTasks.forEach((task) => {
    renderTask(task, true);
  });

  setDoneTasksCounter();
};

// DEFAULT VALUES
clearTaskInput();
clearFilterInput();
taskInput.placeholder = '';

// ADD LISTENERS
document.addEventListener('DOMContentLoaded', getTasksFromLocalStorage);
addTaskForm.addEventListener('submit', addTask);
taskInput.addEventListener('focus', onTaskInputFocus);
filterInput.addEventListener('input', filterTasks);
clearFilterBtn.addEventListener('click', onClearFilterBtnClick);
clearTasksBtn.addEventListener('click', onClearTasksBtnClick);
clearDoneTasksBtn.addEventListener('click', onClearDoneTasksBtnClick);
doneTaskBtn.addEventListener('click', onDoneBtnClick);
