'use strict';

const form = document.querySelector('.task-form');
const taskInput = document.querySelector('.task-input');
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

// ADD NEW TASK
const addTask = evt => {
  evt.preventDefault();
  
  if (taskInput.value) {
    renderTask(taskInput.value);
    addTaskToLocalStorage(taskInput.value);
    clearTaskInput();
    filterTasks();
  }
};

// RENDER TASK ITEM
const renderTask = taskValue => {
  const li = document.createElement('li');
  const span = document.createElement('span');
  const btn = document.createElement('button');

  li.classList.add('task-list-item');
  span.textContent = taskValue;
  btn.classList.add('delete-btn', 'btn');
  btn.setAttribute('aria-label','Delete Task');
  li.appendChild(span);
  li.appendChild(btn);
  taskList.append(li);
};

// DELETE TASK OR MARK AS DONE
const taskListHandler = evt => {
  evt.preventDefault();

  if (evt.target.classList.contains('task-list-item')) {
    evt.target.classList.toggle('done-task');
  }

  if (evt.target.classList.contains('delete-btn')) {
    evt.target.parentElement.remove();
    removeTaskFromLocalStorage(evt.target.parentElement.firstElementChild);
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

  tasks.forEach((taskItem, index) => {
    if (task.textContent === taskItem) {
      tasks.splice(index, 1);
    }
  });

  localStorage.setItem('tasks', JSON.stringify(tasks));
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
filterInput.addEventListener('input', filterTasks);
clearFilterBtn.addEventListener('click', onClearFilterBtnClick);
taskList.addEventListener('click', taskListHandler);
clearTasksBtn.addEventListener('click', clearTasks);
