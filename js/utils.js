import { doneSvg, pinnedSvg, delSvg, editSvg } from "./icons.js";
import { getTasksLocalStorage, setTasksLocalStorage } from "./localStorage.js";
import {
  snackbar,
  completedTask,
  empty,
  total,
  completedTotal,
} from "./variables.js";

let isPopupActive = false;

export async function popUpMessage(text) {
  if (isPopupActive) return;

  isPopupActive = true;
  snackbar.textContent = text;
  snackbar.classList.add("show");

  await new Promise((resolve) => {
    setTimeout(() => {
      snackbar.classList.remove("show");
      resolve();
    }, 3000);
  });
  isPopupActive = false;
}

export function debounce(callback, delay = 300) {
  let timerId;
  return function (...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      callback.apply(this, args);
    }, delay);
  };
}

export function updateListTasks() {
  completedTask.textContent = "";
  const tasks = getTasksLocalStorage();
  navigationTasks();
  if (tasks.length !== 0) {
    empty.classList.add("hidden");
  } else {
    empty.classList.remove("hidden");
  }
  renderTask(tasks);
}

function navigationTasks() {
  const tasks = getTasksLocalStorage();
  total.textContent = tasks.length;

  const itemElem = tasks.filter((item) => item.done === true);
  completedTotal.textContent = itemElem.length;
}

function renderTask(tasks) {
  if (!tasks || !tasks.length) return;

  tasks
    .sort((a, b) => {
      if (a.done !== b.done) {
        return a.done ? 1 : -1;
      }

      if (a.pinned !== b.pinned) {
        return a.pinned ? -1 : 1;
      }

      return a.position - b.position;
    })
    .forEach((value, i) => {
      const { id, task, pinned, done } = value;
      const item = `
	<li class="task__list-item ${done ? "done" : ""} ${
        pinned ? "pinned" : ""
      }" data-task-id="${id}" draggable="true">
			<span class="task__index ${done ? "none" : ""}">${i + 1}.</span>
			<p class="task__text">${task}</p>
			<div class="task__btns">
					<button class="task__done ${done ? "active" : ""}">${doneSvg}</button>
					<button class="task__pinned ${pinned ? "active" : ""}">${pinnedSvg}</button>
					<button class="task__edit">${editSvg}</button>
					<button class="task__del">${delSvg}</button>
			</div>
	</li>
	`;
      completedTask.insertAdjacentHTML("beforeend", item);
    });

  activationDrag();
}

function activationDrag() {
  const tasksElement = [...document.querySelectorAll(".task__list-item")];

  tasksElement.forEach((item) => {
    item.addEventListener("dragstart", () => {
      setTimeout(() => item.classList.add("dragging"), 0);
    });

    item.addEventListener("dragend", () => {
      item.classList.remove("dragging");
      savePositionTask();
    });
  });
}

function savePositionTask() {
  const tasks = getTasksLocalStorage();
  const elements = [...document.querySelectorAll(".task__list-item")];

  elements.forEach((item, index) => {
    const id = item.dataset.taskId;
    const taskIndex = tasks.findIndex((t) => t.id === id);
    if (taskIndex !== -1) {
      tasks[taskIndex].position = index;
    }
  });

  setTasksLocalStorage(tasks);
  updateListTasks();
}

export function initSortableList(e) {
  e.preventDefault();

  const draggingItem = document.querySelector(".dragging");
  const siblings = [
    ...completedTask.querySelectorAll(".task__list-item:not(.dragging)"),
  ];

  let nextSibling = siblings.find((sibling) => {
    const rect = sibling.getBoundingClientRect();
    return e.clientY < rect.top + rect.height / 2;
  });

  completedTask.insertBefore(draggingItem, nextSibling);
}
