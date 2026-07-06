let tasks = JSON.parse(localStorage.getItem("kanbanTasks")) || [];

const columns = ["todo", "progress", "done"];

function saveTasks() {
    localStorage.setItem("kanbanTasks", JSON.stringify(tasks));
}

function addTask() {

    const input = document.getElementById("taskInput");
    const text = input.value.trim();

    if (text === "") {
        alert("Please enter a task.");
        return;
    }

    tasks.push({
        id: crypto.randomUUID(),
        text: text,
        status: "todo",
        created: new Date().toLocaleString()
    });

    input.value = "";

    saveTasks();
    renderBoard();

}

function renderBoard() {

    columns.forEach(column => {

        const list = document.getElementById(column);

        list.innerHTML = "";

    });

    tasks.forEach(task => {

        const card = createCard(task);

        document.getElementById(task.status).appendChild(card);

    });

    columns.forEach(column => {

        const list = document.getElementById(column);

        if (list.children.length === 0) {

            const empty = document.createElement("div");

            empty.className = "empty";

            empty.innerHTML = "No tasks yet";

            list.appendChild(empty);

        }

    });

    updateCounters();

}
function createCard(task) {

    const card = document.createElement("div");

    card.className = "card";
    card.draggable = true;
    card.dataset.id = task.id;

    card.innerHTML = `
        <p>${task.text}</p>

        <small>${task.created}</small>

        <br><br>

        <button class="edit">Edit</button>

        <button class="delete">Delete</button>
    `;

    card.addEventListener("dragstart", dragStart);

    card.addEventListener("dragend", dragEnd);

    card.querySelector(".edit").addEventListener("click", () => {

        editTask(task.id);

    });

    card.querySelector(".delete").addEventListener("click", () => {

        deleteTask(task.id);

    });

    return card;

}

function editTask(id) {

    const task = tasks.find(t => t.id === id);

    if (!task) return;

    const updated = prompt("Edit Task", task.text);

    if (updated === null) return;

    const text = updated.trim();

    if (text === "") {

        alert("Task cannot be empty.");

        return;

    }

    task.text = text;

    saveTasks();

    renderBoard();

}

function deleteTask(id) {

    if (!confirm("Delete this task?")) return;

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();

    renderBoard();

}

function updateCounters() {

    document.getElementById("todoCount").innerHTML =
        "(" + tasks.filter(t => t.status === "todo").length + ")";

    document.getElementById("progressCount").innerHTML =
        "(" + tasks.filter(t => t.status === "progress").length + ")";

    document.getElementById("doneCount").innerHTML =
        "(" + tasks.filter(t => t.status === "done").length + ")";

}

function dragStart(event) {

    event.dataTransfer.effectAllowed = "move";

    event.dataTransfer.setData(
        "text/plain",
        event.currentTarget.dataset.id
    );

    event.currentTarget.style.opacity = "0.5";

}

function dragEnd(event) {

    event.currentTarget.style.opacity = "1";

    document.querySelectorAll(".task-list").forEach(column => {
        column.classList.remove("drag-over");
    });

}

function allowDrop(event) {

    event.preventDefault();

}

function dragEnter(event) {

    event.preventDefault();

    event.currentTarget.classList.add("drag-over");

}

function dragLeave(event) {

    event.currentTarget.classList.remove("drag-over");

}

function drop(event) {

    event.preventDefault();

    event.currentTarget.classList.remove("drag-over");

    const id = event.dataTransfer.getData("text/plain");

    const column = event.currentTarget.id;

    const task = tasks.find(t => t.id === id);

    if (!task) return;

    task.status = column;

    saveTasks();

    renderBoard();

}

document.addEventListener("DOMContentLoaded", () => {

    renderBoard();

    document.getElementById("addBtn").addEventListener("click", addTask);

    document.getElementById("taskInput").addEventListener("keydown", function(event){

        if(event.key === "Enter"){

            addTask();

        }

    });

    document.querySelectorAll(".task-list").forEach(column => {

        column.addEventListener("dragover", allowDrop);

        column.addEventListener("dragenter", dragEnter);

        column.addEventListener("dragleave", dragLeave);

        column.addEventListener("drop", drop);

    });

});
