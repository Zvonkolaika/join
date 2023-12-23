let allTasksFromStorage = [];
let currentDraggedElement;

async function init() {
    await includeHTML();
    setCurrentPageLinkActive('board');
    await getTasks();
    loadBoard();
}


function openAddTaskPopup() {
    let popupContainer = document.getElementById('add_task_popup');
    document.getElementById('add_task_popup_container').classList.add('show_add_task_popup');
}


function closeAddTaskPopup() {
    let popupContainer = document.getElementById('add_task_popup');
    document.getElementById('add_task_popup_container').classList.remove('show_add_task_popup');
}


async function getTasks() {
    allTasksFromStorage = JSON.parse(await getItem("tasks"));
    console.log(allTasksFromStorage);
}


function loadBoard() {
    renderToDo();
    renderInProgress();
    renderAwaitFeedback();
    renderDone();
}


function renderToDo() {
    let toDo = allTasksFromStorage.filter(t => t['taskStatus'] === 0);
    document.getElementById('column_todo').innerHTML = '';

    for (let index = 0; index < toDo.length; index++) {
        const element = toDo[index];
console.log(element);
        document.getElementById('column_todo').innerHTML += thumbnailCardHTML(element, index);
    }
}


function renderInProgress() {
    let inProgress = allTasksFromStorage.filter(t => t['taskStatus'] === 1);
    document.getElementById('column_in_progress').innerHTML = '';

    for (let index = 0; index < inProgress.length; index++) {
        const element = inProgress[index];
        document.getElementById('column_in_progress').innerHTML += thumbnailCardHTML(element, index);
    }
}


function renderAwaitFeedback() {
    let awaitFeedback = allTasksFromStorage.filter(t => t['taskStatus'] === 2);
    document.getElementById('column_await_feedback').innerHTML = '';

    for (let index = 0; index < awaitFeedback.length; index++) {
        const element = awaitFeedback[index];
        document.getElementById('column_await_feedback').innerHTML += thumbnailCardHTML(element, index);
    }
}


function renderDone() {
    let done = allTasksFromStorage.filter(t => t['taskStatus'] === 3);
    document.getElementById('column_done').innerHTML = '';

    for (let index = 0; index < done.length; index++) {
        const element = done[index];
        document.getElementById('column_done').innerHTML += thumbnailCardHTML(element, index);
    }
}


function renderAssignedUsers(index) {
    for (let i = 0; i < allTasksFromStorage[index].assignedUsers.length; i++) {
        console.log(allTasksFromStorage[index].assignedUsers[i].bgColor);
        document.getElementById('task_card_thumbnail_assigned_users_container').innerHTML +=
            `<div class="task_card_thumbnail_profile_badge_frame" style="background-color: ${allTasksFromStorage[index].assignedUsers[i].bgColor};">
            <div class="task_card_thumbnail_profile_badge">AB</div>
            </div>`;
    }
    
}



//   Drag and Drop
function allowDrop(ev) {
    ev.preventDefault();
}


function startDragging(id, index) {
    currentDraggedElement = index;
    console.log(id);
    console.log(index);
}


function moveTo(task_status) {
    allTasksFromStorage[currentDraggedElement].taskStatus = task_status;
    loadBoard();
}


function highlight(id) {
    document.getElementById(id).classList.add('drag_area_highlight');
}


function removeHighlight(id) {
    document.getElementById(id).classList.remove('drag-area-highlight');
}


// HTML Templates


function generateNoTaskToDo() {
    let columnToDo = document.getElementById('column_todo');
    columnToDo.innerHTML += noTaskToDoHTML();
}


function noTaskToDoHTML() {
    return `<div class="no_task">
                <p>No task To Do</p>
            </div>`
}


function thumbnailCardHTML(element, index) {
    return ` <div id="${element.taskID}" class="task-card-thumbnail-container" draggable="true" ondragstart="startDragging(${element.taskID},${index})">
    <div class="task_card_thumbnail_content">
        <div class="task_card_thumbnail_label" style="background: ${allTasksFromStorage[index].category.colour};">
            ${allTasksFromStorage[index].category.name}
        </div>
        <div class="task_card_thumbnail_main">
            <div class="task_card_thumbnail_title">${allTasksFromStorage[index].title}</div>
            <div class="task_card_thumbnail_description">${allTasksFromStorage[index].description}</div>
        </div>
        <div class="task_card_thumbnail_progress">
            <div class="task_card_thumbnail_progressbar_container">
                <div class="task_card_thumbnail_progressbar" style="width: 50%;"></div>
            </div>
            <div>0/${allTasksFromStorage[index].subtasks.length} Subtasks</div>
        </div>
        <div class="task_card_thumbnail_prio_and_assignment">
            <div class="task_card_thumbnail_assigned_users_container" id="task_card_thumbnail_assigned_users_container">
            </div>
            <div class="task_card_thumbnail_assigned_priority_symbol_container">
                <img class="task_card_thumbnail_assigned_priority_symbol" id="task_card_thumbnail_assigned_priority_symbol" src="assets/img/icons/prio${allTasksFromStorage[index].prio}.svg">
            </div>
        </div>
    </div>
</div>`
}
