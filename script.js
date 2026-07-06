let tasks = JSON.parse(localStorage.getItem("kanbanTasks")) || [];

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
        status: "todo"
    });

    input.value = "";

    saveTasks();
    renderTasks();
}

function renderTasks() {

    document.getElementById("todo").innerHTML = "";
    document.getElementById("progress").innerHTML = "";
    document.getElementById("done").innerHTML = "";

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
            editTask(task.id);
        });

        card.querySelector(".delete").addEventListener("click", () => {
            deleteTask(task.id);
        });

        document.getElementById(task.status).appendChild(card);

    });

}

function dragStart(event) {

    event.dataTransfer.setData(
        "text/plain",
        event.currentTarget.dataset.id
    );

    event.currentTarget.style.opacity = "0.5";

}

document.addEventListener("dragend", function(event) {

    if(event.target.classList.contains("card")){

        event.target.style.opacity = "1";

    }

});

function allowDrop(event) {

    event.preventDefault();

}

function drop(event) {

    event.preventDefault();

    const id = event.dataTransfer.getData("text/plain");

    const column = event.currentTarget.id;

    const task = tasks.find(t => t.id === id);

    if(task){

        task.status = column;

        saveTasks();

        renderTasks();

    }

}

function editTask(id) {

    const task = tasks.find(t => t.id === id);

    const updated = prompt("Edit Task", task.text);

    if(updated === null) return;

    const text = updated.trim();

    if(text === "") return;

    task.text = text;

    saveTasks();

    renderTasks();

}

function deleteTask(id) {

    if(!confirm("Delete this task?")) return;

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();

    renderTasks();

}

document.addEventListener("DOMContentLoaded", () => {

    renderTasks();

    document.getElementById("addBtn").addEventListener("click", addTask);

    document.getElementById("taskInput").addEventListener("keypress", function(event){

        if(event.key === "Enter"){

            addTask();

        }

    });

    document.querySelectorAll(".task-list").forEach(column => {

        column.addEventListener("dragover", allowDrop);

        column.addEventListener("drop", drop);

    });

});
