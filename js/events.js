import {
  form,
  formInput,
  completedTask,
  formCreateButtonText,
  state,
} from "./variables.js";

import { popUpMessage, updateListTasks, initSortableList } from "./utils.js";

import {
  getTasksLocalStorage,
  setTasksLocalStorage,
  generateUniqueId,
} from "./localStorage.js";

updateListTasks();
form.addEventListener("submit", createTask);
completedTask.addEventListener("dragover", initSortableList);
completedTask.addEventListener("dragenter", (event) => event.preventDefault());

function createTask(e) {
  e.preventDefault();
  const task = formInput.value.trim().replace(/\s+/g, " ");
  if (!task) {
    formInput.classList.add("error");
    return popUpMessage("Нада чутка насыпать текста в задачу, а иначе бяда!");
  } else {
    formInput.classList.remove("error");
  }

  if (state.isEditTask) {
    saveEditedTask(task);
    return;
  }

  formCreateButtonText.textContent = "Докинуть";

  const tasks = getTasksLocalStorage();

  tasks.push({
    id: generateUniqueId(),
    task,
    done: false,
    pinned: false,
    emptyTask: false,
    position: tasks.length,
  });

  setTasksLocalStorage(tasks);
  updateListTasks();
  form.reset();
}

completedTask.addEventListener("click", taskControlBtns);

function taskControlBtns(e) {
  const targEl = e.target.closest(".task__btns");
  if (targEl == null && !completedTask.contains(targEl)) return;

  if (e.target.closest(".task__done")) {
    doneTask(e);
  } else if (e.target.closest(".task__pinned")) {
    donePinned(e);
  } else if (e.target.closest(".task__edit")) {
    doneEdit(e);
  } else if (e.target.closest(".task__del")) {
    doneDel(e);
  }
}

function getTaskElement(e) {
  const el = e.target.closest(".task__list-item");
  if (!el) {
    popUpMessage("Элемент не найден");
    return null;
  }

  const id = el.dataset.taskId;

  const tasks = getTasksLocalStorage();
  const index = tasks.findIndex((task) => task.id === id);

  if (index === -1) {
    popUpMessage("Ох, чет не сходится)");
    return null;
  }

  return { el, id, tasks, index };
}

function doneTask(e) {
  const data = getTaskElement(e);
  if (!data) return;

  const { tasks, index } = data;

  if (!tasks[index].done && tasks[index].pinned) {
    tasks[index].pinned = false;
  }

  tasks[index].done = !tasks[index].done;

  setTasksLocalStorage(tasks);
  updateListTasks();
}

function donePinned(e) {
  const data = getTaskElement(e);
  if (!data) return;

  const { tasks, index } = data;

  if (!tasks[index].pinned && tasks[index].done) {
    return popUpMessage("Зы) нада убрать отметку шо уже выполнено)");
  }

  tasks[index].pinned = !tasks[index].pinned;

  setTasksLocalStorage(tasks);
  updateListTasks();
}

function doneDel(e) {
  const data = getTaskElement(e);
  if (!data) return;

  const { tasks, id } = data;

  const newTask = tasks.filter((task) => task.id !== id);
  setTasksLocalStorage(newTask);
  updateListTasks();

  if (tasks.length == 0) {
    console.log(111111111);
  }
}

function doneEdit(e) {
  const data = getTaskElement(e);
  if (!data) return;

  const { tasks, el, id } = data;
  const text = el.querySelector(".task__text");
  formInput.value = text.textContent;
  state.isEditTask = true;
  state.editId = id;
  formCreateButtonText.textContent = "Поменять";
  form.scrollIntoView({ behavior: "smooth" });

  setTasksLocalStorage(tasks);
  updateListTasks();
}

function saveEditedTask(newText) {
  const tasks = getTasksLocalStorage();

  const index = tasks.findIndex((t) => t.id === state.editId);

  if (index === -1) {
    popUpMessage("Зы)! А нечего сохранять, все удалено до нас)");
    return;
  }

  tasks[index].task = newText;

  setTasksLocalStorage(tasks);
  updateListTasks();

  state.isEditTask = false;
  state.editId = null;
  form.reset();
  formCreateButtonText.textContent = "Докинуть";
}
