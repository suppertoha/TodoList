export const form = document.querySelector('[data-js-todo-form]')
export const formInput = document.querySelector('[data-js-todo-form-input]')
export const formCreateButton = document.querySelector('[data-js-todo-form-create-button]')
export const formCreateButtonText = formCreateButton.querySelector('span')
export const total = document.querySelector('[data-js-todo-total]')
export const filter = document.querySelector('[data-js-todo-filter]')
export const completedTotal = document.querySelector('[data-js-todo-completed-total]')
export const completedTask = document.querySelector('[data-js-todo-completed-task]')
export const snackbar = document.querySelector('[data-js-snackbar]')
export const empty = document.querySelector('[data-js-todo-empty]')
export const light = document.querySelector('[data-page-light]')
export const dark = document.querySelector('[data-page-dark]')
export const body = document.querySelector('body')
export const THEME_KEY = "theme";

export const state = {
  isEditTask: false,
  editId: null
};
