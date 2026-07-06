const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");

const todo = document.getElementById("todo");
const progress = document.getElementById("progress");
const done = document.getElementById("done");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateCounts() {
    document.getElementById("todoCount").textContent =
        "(" + tasks.filter(task => task.status === "todo").length + ")";

    document.getElementById("progressCount").textContent =
        "(" + tasks.filter(task => task.status === "progress").length + ")";

    document.getElementById("doneCount").textContent =
        "(" + tasks.filter(task => task.status === "done").length + ")";
}

function renderTasks() {
    todo.innerHTML = "";
    progress.innerHTML = "";
    done.innerHTML = "";

    tasks.forEach(task => {
        const card = document.createElement("div");
        card.className = "card";
        card.draggable = true;
        card.dataset.id = task.id;

        const text = document.createElement("p");
        text.textContent = task.text;

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.className = "edit";

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete";

        editBtn.onclick = function () {
            const newText = prompt("Edit Task", task.text);
            if (newText && newText.trim() !== "") {
                task.text = newText.trim();
                saveTasks();
                renderTasks();
            }
        };

        deleteBtn.onclick = function () {
            tasks = tasks.filter(t => t.id !== task.id);
            saveTasks();
            renderTasks();
        };

        card.appendChild(text);
        card.appendChild(editBtn);
        card.appendChild(deleteBtn);

        card.addEventListener("dragstart", function () {
            card.classList.add("dragging");
        });

        card.addEventListener("dragend", function () {
            card.classList.remove("dragging");
        });

        if (task.status === "todo") {
            todo.appendChild(card);
        } else if (task.status === "progress") {
            progress.appendChild(card);
        } else {
            done.appendChild(card);
        }
    });

    updateCounts();
}

function addTask() {
    const text = taskInput.value.trim();

    if (text === "") return;

    tasks.push({
        id: Date.now().toString(),
        text: text,
        status: "todo"
    });

    taskInput.value = "";

    saveTasks();
    renderTasks();
}

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        addTask();
    }
});

[todo, progress, done].forEach(function (column) {

    column.addEventListener("dragover", function (e) {
        e.preventDefault();
    });

    column.addEventListener("drop", function () {
        const card = document.querySelector(".dragging");

        if (!card) return;

        const id = card.dataset.id;

        const task = tasks.find(function (t) {
            return t.id === id;
        });

        if (column.id === "todo") {
            task.status = "todo";
        } else if (column.id === "progress") {
            task.status = "progress";
        } else {
            task.status = "done";
        }

        saveTasks();
        renderTasks();
    });

});

renderTasks();
