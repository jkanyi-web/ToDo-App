/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
const taskInput = document.querySelector('.task-input input');
const clearAll = document.querySelector('.clear-btn');
const filters = document.querySelectorAll('.filters span');
const taskBox = document.querySelector('.task-box');

let editId;
let isEditedTask = false;
// getting localStorage todo-list
let todos = JSON.parse(localStorage.getItem('todo-list'));

filters.forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelector('span.active').classList.remove('active');
    btn.classList.add('active');
    showTodo(btn.id);
  });
});

function showTodo(filter) {
  let li = '';
  if (todos) {
    todos.forEach((todo, id) => {
      // if todo status is completed, set the isCompleted value to checked
      const isCompleted = todo.status === 'completed' ? 'checked' : '';
      if (filter === todo.status || filter === 'all') {
        li += `
          <li class="task">
            <label for="${id}">
              <input onclick="updateStatus(this)" type="checkbox" ${isCompleted} name="checkbox" id="${id}">
              <p class='${isCompleted}'>${todo.name}</p>
            </label>
            <div class="settings">
              <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
              <ul class="task-menu">
                <li onclick="editTask(${id}, '${todo.name}')"><i class="uil uil-pen"></i>Edit</li>
                <li onclick="deleteTask(${id})"><i class="uil uil-trash"></i>Delete</li>
              </ul>
            </div>
          </li>
        `;
      }
    });
  }
  taskBox.innerHTML = li || '<span>You don\'t have any tasks here yet</span>';
}
showTodo('all');

function showMenu(selectedTask) {
  // Getting task menu div
  const taskMenu = selectedTask.parentElement.lastElementChild;
  taskMenu.classList.add('show');
  document.addEventListener('click', (e) => {
    // Removing show class from the task Menu on document click
    if (e.target.tagName !== 'I' || e.target !== selectedTask) {
      taskMenu.classList.remove('show');
    }
  });
}

function editTask(taskId, taskName) {
  editId = taskId;
  isEditedTask = true;
  taskInput.value = taskName;
}

function deleteTask(deleteId) {
  // Removing selected task from array/todos
  todos.splice(deleteId, 1);
  localStorage.setItem('todo-list', JSON.stringify(todos));
  showTodo('all');
}

clearAll.addEventListener('click', () => {
  // Removing all tasks from array/todos
  todos.splice(0, todos.length);
  localStorage.setItem('todo-list', JSON.stringify(todos));
  showTodo('all');
});

function updateStatus(selectedTask) {
  // getting paragraph that contains task name
  const taskName = selectedTask.parentElement.lastElementChild;
  if (selectedTask.checked) {
    taskName.classList.add('checked');
    todos[selectedTask.id].status = 'completed';
  } else {
    taskName.classList.remove('checked');
    todos[selectedTask.id].status = 'pending';
  }
  localStorage.setItem('todo-list', JSON.stringify(todos));
}

taskInput.addEventListener('keyup', (e) => {
  const userTask = taskInput.value.trim();
  if (e.key === 'Enter' && userTask) {
    if (!isEditedTask) { // if edited task isn't true
      if (!todos) {
        // if todo-list doesn't exist, pass an empty array to todos
        todos = [];
      }

      const taskInfo = { name: userTask, status: 'pending' };
      // adding a new task to todos
      todos.push(taskInfo);
    } else {
      isEditedTask = false;
      todos[editId].name = userTask;
    }
    taskInput.value = '';
    localStorage.setItem('todo-list', JSON.stringify(todos));
    showTodo('all');
  }
});