const STORAGE_KEY = "too-doo-list.tasks";

const taskForm = document.querySelector("#taskForm");
const taskInput = document.querySelector("#taskInput");
const taskList = document.querySelector("#taskList");
const taskTemplate = document.querySelector("#taskTemplate");
const filterButtons = document.querySelectorAll(".filter-btn");
const clearDoneButton = document.querySelector("#clearDone");
const emptyState = document.querySelector("#emptyState");
const taskCount = document.querySelector("#taskCount");
const doneCount = document.querySelector("#doneCount");
const weekday = document.querySelector("#weekday");
const monthDay = document.querySelector("#monthDay");

let tasks = loadTasks();
let currentFilter = "all";

setDate();
renderTasks();

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = taskInput.value.trim();

  if (!title) {
    return;
  }

  tasks.unshift({
    id: crypto.randomUUID(),
    title,
    completed: false,
    createdAt: Date.now()
  });

  taskInput.value = "";
  saveTasks();
  renderTasks();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle("active", item === button));
    renderTasks();
  });
});

clearDoneButton.addEventListener("click", () => {
  tasks = tasks.filter((task) => !task.completed);
  saveTasks();
  renderTasks();
});

taskList.addEventListener("change", (event) => {
  if (!event.target.matches("input[type='checkbox']")) {
    return;
  }

  const item = event.target.closest(".task-item");
  const task = tasks.find((entry) => entry.id === item.dataset.id);

  if (task) {
    task.completed = event.target.checked;
    saveTasks();
    renderTasks();
  }
});

taskList.addEventListener("click", (event) => {
  if (!event.target.matches(".delete-btn")) {
    return;
  }

  const item = event.target.closest(".task-item");
  tasks = tasks.filter((task) => task.id !== item.dataset.id);
  saveTasks();
  renderTasks();
});

function renderTasks() {
  taskList.innerHTML = "";

  const visibleTasks = tasks.filter((task) => {
    if (currentFilter === "active") {
      return !task.completed;
    }

    if (currentFilter === "completed") {
      return task.completed;
    }

    return true;
  });

  visibleTasks.forEach((task) => {
    const clone = taskTemplate.content.firstElementChild.cloneNode(true);
    const checkbox = clone.querySelector("input");
    const title = clone.querySelector(".task-title");

    clone.dataset.id = task.id;
    clone.classList.toggle("completed", task.completed);
    checkbox.checked = task.completed;
    title.textContent = task.title;

    taskList.appendChild(clone);
  });

  const activeTotal = tasks.filter((task) => !task.completed).length;
  const completedTotal = tasks.length - activeTotal;

  taskCount.textContent = `${activeTotal} ${activeTotal === 1 ? "task" : "tasks"} left`;
  doneCount.textContent = `${completedTotal} completed`;
  emptyState.classList.toggle("visible", visibleTasks.length === 0);
}

function loadTasks() {
  const savedTasks = localStorage.getItem(STORAGE_KEY);

  if (!savedTasks) {
    return [];
  }

  try {
    return JSON.parse(savedTasks);
  } catch {
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function setDate() {
  const today = new Date();
  weekday.textContent = today.toLocaleDateString(undefined, { weekday: "long" });
  monthDay.textContent = today.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric"
  });
}
