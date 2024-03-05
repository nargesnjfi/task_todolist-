let todos = [];
let filterValue = "all";
let editable = false;
let id = "";

const todoInput = document.querySelector(".todo-input");
const todoForm = document.querySelector(".todo-form"); //کلش
const todoList = document.querySelector(".todolist");
const selectFilter = document.querySelector(".filter-todos");

todoForm.addEventListener("submit", addNewTodo);
selectFilter.addEventListener("change", (e) => {
  filterValue = e.target.value;
  filterTodos();
});

document.addEventListener("DOMContentLoaded", (e) => {
  todos = getAllTodos();
  createTodos(todos);
});

function addNewTodo(e) {
  e.preventDefault();

  if (!todoInput.value) return null;

  if (!editable) {
    const newTodo = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      title: todoInput.value,
      isCompleted: false,
    };

    // todos.push(newTodo);
    saveTodo(newTodo);
  } else {
    const find = todos.find((item) => {
      return item.id === +id;
    });
    find.title = todoInput.value;
    editable = false;
    todoInput.value = "";
  }
  filterTodos();
}

function createTodos(todos) {
  let result = "";
  todos.forEach((todo) => {
    result += `<li class="todo">
    <p class="todo__title ${todo.isCompleted && "completed"}">${todo.title}</p>
    <span class="todo__createdAt">${new Date(todo.createdAt).toLocaleDateString(
      "fa-IR"
    )}</span>
    <button class= "todo__check" data-todo-id= ${
      todo.id
    }><i class="far fa-check-square"></i></button>
    <button class="todo__edit" data-todo-id= ${
      todo.id
    }><i class="far fa-edit"></i></button>
    <button class="todo__remove" data-todo-id= ${
      todo.id
    }><i class="far fa-trash-alt"></i></button>
  </li>`;
  });

  todoList.innerHTML = result;
  todoInput.value = ""; //خالی کردن اینپوت

  const removeBtns = [...document.querySelectorAll(".todo__remove")];
  removeBtns.forEach((btn) => btn.addEventListener("click", removeTodo));

  const editBtns = [...document.querySelectorAll(".todo__edit")];
  editBtns.forEach((btn) => btn.addEventListener("click", editTodo));

  const checkBtns = [...document.querySelectorAll(".todo__check")];
  checkBtns.forEach((btn) => btn.addEventListener("click", checkTodo));
}

function editTodo() {
  const todoElements = document.querySelectorAll(".todo");
  todoElements.forEach((todoElement, index) => {
    todoElement.addEventListener("click", (e) => {
      editable = true;
      todoInput.value = todos[index].title;
      id = e.target.dataset.todoId;
    });
  });
}

function filterTodos() {
  switch (filterValue) {
    case "all": {
      createTodos(todos);
      break;
    }
    case "completed": {
      const filteredTodos = todos.filter((t) => t.isCompleted);
      createTodos(filteredTodos);
      break;
    }
    case "uncompleted": {
      const filteredTodos = todos.filter((t) => !t.isCompleted);
      createTodos(filteredTodos);
      break;
    }
    default:
      createTodos(todos);
  }
}

function removeTodo(e) {
  const todoId = Number(e.target.dataset.todoId);
  todos = todos.filter((t) => t.id !== todoId);
  filterTodos();
}

function checkTodo(e) {
  const todoId = Number(e.target.dataset.todoId);
  const todo = todos.find((t) => t.id === todoId);
  todo.isCompleted = !todo.isCompleted;
  filterTodos();
}

function getAllTodos() {
  const savedTodos = JSON.parse(localStorage.getItem("todos")) || [];
  return savedTodos;
}

function saveTodo(todo) {
  todos.push(todo);
  localStorage.setItem("todos", JSON.stringify(todos));
}
