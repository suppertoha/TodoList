import { light, dark, body, THEME_KEY } from "./variables.js";

export function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "dark") {
    body.classList.add("dark");
  } else {
    body.classList.remove("dark");
  }
}

export function setTheme(mode) {
  if (mode === "dark") {
    body.classList.add("dark");
    dark.classList.add("hidden");   
    light.classList.remove("hidden"); 
  } else {
    body.classList.remove("dark");
    light.classList.add("hidden");  
    dark.classList.remove("hidden"); 
  }
  localStorage.setItem(THEME_KEY, mode);
}

light.addEventListener("click", () => setTheme("light"));
dark.addEventListener("click", () => setTheme("dark"));
