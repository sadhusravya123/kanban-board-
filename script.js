let tasks = JSON.parse(localStorage.getItem("kanbanTasks")) || [];
let draggedId = null;

function saveTasks() {
    localStorage.setItem("kanbanTasks", JSON.stringify(tasks));
}

function addTask() {

    const input = document.getElementById("taskInput");

    const text = input.value.trim();

    if(text === ""){
        alert("Enter a task.");
        return;
    }

    tasks.push({
        id: Date.now(),
        text: text,
        status: "todo"
    });

    input.value = "";

    saveTasks();
    renderTasks();

}

function renderTasks(){

    document.getElementById("todo").innerHTML = "";
    document.getElementById("progress").innerHTML = "";
    document.getElementById("done").innerHTML = "";

    tasks.forEach(task=>{

        const card = document.createElement("div");

        card.className = "card";

        card.draggable = true;

        card.id = task.id;

        card.ondragstart = drag;

        card.innerHTML = `
            <p>${task.text}</p>

            <button class="edit"
            onclick="editTask(${task.id})">
            Edit
            </button>

            <button class="delete"
            onclick="deleteTask(${task.id})">
            Delete
            </button>
        `;

        document.getElementById(task.status).appendChild(card);

    });

}

function editTask(id){

    const task = tasks.find(t=>t.id===id);

    const newText = prompt("Edit Task",task.text);

    if(newText===null) return;

    task.text = newText.trim();

    saveTasks();

    renderTasks();

}

function deleteTask(id){

    tasks = tasks.filter(task=>task.id!==id);

    saveTasks();

    renderTasks();

}

function drag(event){

    draggedId = event.target.id;

}

function allowDrop(event){

    event.preventDefault();

}

function drop(event){

    event.preventDefault();

    const column = event.currentTarget.id;

    const task = tasks.find(t=>t.id==draggedId);

    if(task){

        task.status = column;

        saveTasks();

        renderTasks();

    }

}

renderTasks();
