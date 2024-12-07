const taskForm = document.getElementById("task-form");
const taskList = document.getElementById("task-list");

document.addEventListener("DOMContentLoaded", loadTasks);

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("task-title").value.trim();
  const desc = document.getElementById("task-desc").value.trim();
  const deadline = document.getElementById("task-deadline").value;
  const urgency = document.getElementById("task-urgency").value;

  addTask(title, desc, deadline, urgency);

  taskForm.reset();
});

function saveTasksToLocalStorage() {
  const tasks = [];
  document.querySelectorAll("#task-list .task").forEach(task => {
    const title = task.querySelector(".view-mode h3").textContent;
    const desc = task.querySelector(".view-mode p:nth-of-type(1)").textContent;
    const deadline = task.querySelector(".view-mode p:nth-of-type(2)").textContent.replace("Deadline: ", "");
    const urgency = task.querySelector(".task-urgency").textContent;
    tasks.push({ title, desc, deadline, urgency });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

//load tasks from localstorage
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(task => addTask(task.title, task.desc, task.deadline, task.urgency));
}

// Add a new task
function addTask(title, desc, deadline, urgency) {
  const task = document.createElement("li");
  task.classList.add("task");

  task.innerHTML = `
    <div class="view-mode">
      <h3>${title}</h3>
      <p>${desc}</p>
      <p><strong>Deadline:</strong> ${deadline}</p>
      <p class="task-urgency urgency-${urgency.toLowerCase()}">${urgency}</p>
      <div class="task-actions">
        <button class="edit">Edit</button>
        <button class="delete">Delete</button>
      </div>
    </div>
    <div class="edit-mode" style="display: none;">
      <label for="edit-title">Task Title</label>
      <input type="text" id="edit-title" value="${title}">
      
      <label for="edit-desc">Description</label>
      <textarea id="edit-desc">${desc}</textarea>
      
      <label for="edit-deadline">Deadline</label>
      <input type="date" id="edit-deadline" value="${deadline}">
      
      <label for="edit-urgency">Urgency</label>
      <select id="edit-urgency">
        <option value="Low" ${urgency === "Low" ? "selected" : ""}>Low</option>
        <option value="Medium" ${urgency === "Medium" ? "selected" : ""}>Medium</option>
        <option value="High" ${urgency === "High" ? "selected" : ""}>High</option>
        <option value="Urgent" ${urgency === "Urgent" ? "selected" : ""}>Urgent</option>
      </select>
      
      <button class="save">Save</button>
    </div>
  `;

  const editButton = task.querySelector(".edit");
  const deleteButton = task.querySelector(".delete");
  const saveButton = task.querySelector(".save");

  editButton.addEventListener("click", () => toggleEditMode(task));
  saveButton.addEventListener("click", () => {
    saveEdits(task);
    saveTasksToLocalStorage();
  });
  deleteButton.addEventListener("click", () => {
    task.remove();
    saveTasksToLocalStorage();
  });

  taskList.appendChild(task);
  saveTasksToLocalStorage(); 
}

function toggleEditMode(task) {
  const viewMode = task.querySelector(".view-mode");
  const editMode = task.querySelector(".edit-mode");
  viewMode.style.display = viewMode.style.display === "none" ? "block" : "none";
  editMode.style.display = editMode.style.display === "none" ? "block" : "none";
}

function saveEdits(task) {
  const titleInput = task.querySelector("#edit-title").value;
  const descInput = task.querySelector("#edit-desc").value;
  const deadlineInput = task.querySelector("#edit-deadline").value;
  const urgencyInput = task.querySelector("#edit-urgency").value;

  task.querySelector(".view-mode h3").textContent = titleInput;
  task.querySelector(".view-mode p:nth-of-type(1)").textContent = descInput;
  task.querySelector(".view-mode p:nth-of-type(2)").textContent = `Deadline: ${deadlineInput}`;
  const urgencyElement = task.querySelector(".view-mode .task-urgency");
  urgencyElement.textContent = urgencyInput;
  urgencyElement.className = `task-urgency urgency-${urgencyInput.toLowerCase()}`;

  toggleEditMode(task);
  saveTasksToLocalStorage(); 
}
