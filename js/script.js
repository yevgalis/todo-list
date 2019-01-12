'use strict';

const form = document.querySelector('.task-form');
const taskInput = document.querySelector('.task-input');
const taskList = document.querySelector('.task-list');
const filterInput = document.querySelector('.filter-tasks');
const clearBtn = document.querySelector('.clear-btn');

// DEFAULT VALUES
taskInput.value = '';
filterInput.value = '';

// ADD NEW TASK
const addTask = evt => {
  evt.preventDefault();
  
  if (taskInput.value) {
    const li = document.createElement('li');
    const span = document.createElement('span');
    const btn = document.createElement('button');

    li.classList.add('task-list-item');
    span.textContent = taskInput.value;
    btn.classList.add('delete-btn', 'btn');
    btn.setAttribute('aria-label','Delete Task');
    li.appendChild(span);
    li.appendChild(btn);
    taskList.append(li);

    taskInput.value = '';
  }
};

// DELETE TASK OR MARK AS DONE
const taskListHandler = evt => {
  evt.preventDefault();

  if (evt.target.classList.contains('task-list-item')) {
    evt.target.classList.toggle('done-task');
  }

  if (evt.target.classList.contains('delete-btn')) {
    evt.target.parentElement.remove();
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
};


// ADD LISTENERS
form.addEventListener('submit', addTask);
taskList.addEventListener('click', taskListHandler);
filterInput.addEventListener('keyup', filterTasks);
clearBtn.addEventListener('click', clearTasks);
