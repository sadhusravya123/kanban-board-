const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");

const columns = {
    todo: document.getElementById("todo"),
    progress: document.getElementById("progress"),
    done: document.getElementById("done")
};

let tasks = JSON.parse(localStorage.getItem("kanbanTasks")) || [];

function saveTasks() {
    localStorage.setItem("kanbanTasks", JSON.stringify(tasks));
}

function updateCounts() {
    document.getElementById("todoCount").textContent =
        `(${tasks.filter(task => task.status === "todo").length})`;

    document.getElementById("progressCount").textContent =
        `(${tasks.filter(task => task.status === "progress").length})`;

    document.getElementById("doneCount").textContent =
        `(${tasks.filter(task => task.status === "done").length})`;
}

function showEmptyMessages() {
    Object.keys(columns).forEach(status => {
        const column = columns[status];

        if (column.children.length === 0) {
            column.innerHTML = `<div class="empty">No tasks</div>`;
        }
    });
}

function renderTasks() {

    Object.values(columns).forEach(col => col.innerHTML = "");

    tasks.forEach(task => {

        const card = document.createElement("div");
        card.className = "card";
        card.draggable = true;
        card.dataset.id = task.id;

        card.innerHTML = `
            <p>${task.text}</p>
            <button class="edit">Edit</button>
            <button class="delete">Delete</button>
        `;

        card.addEventListener("dragstart", dragStart);

        card.querySelector(".edit").addEventListener("click", () => {
            const newText = prompt("Edit task:", task.text);

            if (newText !== null && newText.trim() !== "") {
                task.text = newText.trim();
                saveTasks();
                renderTasks();
            }
        });

        card.querySelector(".delete").addEventListener("click", () => {
            tasks = tasks.filter(t => t.id !== task.id);
            saveTasks();
            renderTasks();
        });

        columns[task.status].appendChild(card);

    });

    showEmptyMessages();
    updateCounts();
}

function addTask() {

    const text = taskInput.value.trim();

    if (text === "") return;

    tasks.push({
        id: Date.now().toString(),
        text,
        status: "todo"
    });

    taskInput.value = "";

    saveTasks();
    renderTasks();
}

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", e => {
    if (e.key === "Enter") addTask();
});

let draggedCard = null;

function dragStart(e) {
    draggedCard = e.target;
}

Object.keys(columns).forEach(status => {

    const column = columns[status];

    column.addEventListener("dragover", e => {
        e.preventDefault();
        column.classList.add("drag-over");
    });

    column.addEventListener("dragleave", () => {
        column.classList.remove("drag-over");
    });

    column.addEventListener("drop", () => {

        column.classList.remove("drag-over");

        const id = draggedCard.dataset.id;

        const task = tasks.find(t => t.id === id);

        task.status = status;

        saveTasks();
        renderTasks();

    });

});

renderTasks();
