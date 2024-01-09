let allTasksFromStorage = [];
let currentDraggedElementID;
let currentDraggedElementINDEX;

let toDo;
let inProgress;
let awaitFeedback;
let done;

async function init() {
    await loadTemplates();
    setCurrentPageLinkActive('board');
    await getTasks();
    loadBoard();
}


function openAddTaskPopup() {
    renderAddTaskForm('add-task-placeholder');
    document.getElementById('add_task_popup_container').classList.add('show_add_task_popup');
    document.getElementById('edit_task_popup_close_button').classList.add('d-none');
}


function closeAddTaskPopup() {
    document.getElementById('add-task-placeholder').innerHTML = '';
    document.getElementById('add_task_popup_container').classList.remove('show_add_task_popup');
}


function openTaskCard(elementByID, cardID) {
    renderTaskCardBoard(elementByID, cardID);
    document.getElementById('task-card-bgr-container').classList.add('show-task-card');
}


function closeTaskCard() {
    document.getElementById('task-card-bgr-container').classList.remove('show-task-card');
}


async function getTasks() {
    allTasksFromStorage = JSON.parse(await getItem("tasks"));
}


function loadBoard() {
    renderToDo();
    renderInProgress();
    renderAwaitFeedback();
    renderDone();
}


function loadSearchResult() {
    renderToDo();
    renderInProgress();
    renderAwaitFeedback();
    renderDone();
}


function renderToDo() {
    document.getElementById('column_todo').innerHTML = '';
    toDo = allTasksFromStorage.filter(t => t['taskStatus'] == 0);

    if (toDo.length == 0) {
        renderNoTaskToDo('column_todo');
    }
    else {
        for (let index = 0; index < toDo.length; index++) {
            const element = toDo[index];
            renderThumbnailCard('column_todo', index, element)
        }
    }
}


function renderInProgress() {
    document.getElementById('column_in_progress').innerHTML = '';
    inProgress = allTasksFromStorage.filter(t => t['taskStatus'] == 1);

    if (inProgress.length == 0) {
        renderNoTaskToDo('column_in_progress');
    }
    else {
        for (let index = 0; index < inProgress.length; index++) {
            const element = inProgress[index];
            renderThumbnailCard('column_in_progress', index, element)
        }
    }
}


function renderAwaitFeedback() {
    document.getElementById('column_await_feedback').innerHTML = '';
    awaitFeedback = allTasksFromStorage.filter(t => t['taskStatus'] == 2);

    if (awaitFeedback.length == 0) {
        renderNoTaskToDo('column_await_feedback');
    }
    else {
        for (let index = 0; index < awaitFeedback.length; index++) {
            const element = awaitFeedback[index];
            renderThumbnailCard('column_await_feedback', index, element)
        }
    }
}


function renderDone() {
    document.getElementById('column_done').innerHTML = '';
    done = allTasksFromStorage.filter(t => t['taskStatus'] == 3);

    if (done.length == 0) {
        renderNoTaskDone('column_done');
    }
    else {
        for (let index = 0; index < done.length; index++) {
            const element = done[index];
            renderThumbnailCard('column_done', index, element)
        }
    }
}


async function searchTask() {
    await getTasks();
    inputSearchfield = document.getElementById('inputfield_find_task').value.toLowerCase();
    let filteredTasks = allTasksFromStorage.filter(task => task['title'].toLowerCase().includes(inputSearchfield));
    filteredTasks = allTasksFromStorage.filter(task => task['description'].toLowerCase().includes(inputSearchfield));
    allTasksFromStorage = filteredTasks;
    loadBoard();
}


//   Drag and Drop
function allowDrop(ev) {
    ev.preventDefault();
}


function startDragging(index, element_taskID) {
    document.getElementById(element_taskID).classList.add('rotare_thumpnail');
    currentDraggedElementID = element_taskID;
    currentDraggedElementINDEX = index;
}


function moveTo(task_status) {
    let currentDraggedElement = allTasksFromStorage.filter(t => t['taskID'] == currentDraggedElementID);
    currentDraggedElement[0]['taskStatus'] = task_status;
    setItem('tasks', allTasksFromStorage);
    loadBoard();
}


function highlight(id) {
    document.getElementById(id).classList.add('drag_area_highlight');
}


function removeHighlight(id) {
    document.getElementById(id).classList.remove('drag-area-highlight');
}


// HTML Templates


function renderNoTaskToDo(category) {
    document.getElementById(category).innerHTML += noTaskToDoHTML();
}


function noTaskToDoHTML() {
    return `<div class="no_task">
                <p>No task To Do</p>
            </div>`
}


function renderNoTaskDone(category) {
    document.getElementById(category).innerHTML += noTaskDoneHTML();
}


function noTaskDoneHTML() {
    return `<div class="no_task">
                <p>No task Done</p>
            </div>`
}


function renderThumbnailCard(category, index, element) {
    document.getElementById(category).innerHTML += thumbnailCardHTML(index, element);
    renderAssignedUsers(element);
    loadSubtasksInThumbnail(element);
}


function thumbnailCardHTML(index, element) {
    return ` <div id="${element.taskID}" class="task-card-thumbnail-container" draggable="true" ondragstart="startDragging(${index}, ${element.taskID})">
    <div class="task_card_thumbnail_content"  onclick="openTaskCard('task-card', ${element.taskID})">
        <div class="task_card_thumbnail_label" style="background: ${element.category.colour};">
            ${element.category.name}
        </div>
        <div class="task_card_thumbnail_main">
            <div class="task_card_thumbnail_title">${element.title}</div>
            <div class="task_card_thumbnail_description">${element.description}</div>
        </div>
        <div class="task_card_thumbnail_progress" id="task_card_thumbnail_progress_${element.taskID}">
            <div class="task_card_thumbnail_progressbar_container">
                <div class="task_card_thumbnail_progressbar" id="task_card_thumbnail_progressbar" style="width: ${renderSubtaskProgressBar(element.subtasks)}%;"></div>
            </div>
            <div>${SubtasksDone(element.subtasks)}/${element.subtasks.length} Subtasks</div>
        </div>
        <div class="task_card_thumbnail_prio_and_assignment">
            <div class="task_card_thumbnail_assigned_users_container" id="task_card_thumbnail_assigned_users_container_${element.taskID}">
            </div>
            <div class="task_card_thumbnail_assigned_priority_symbol_container">
                <img class="task_card_thumbnail_assigned_priority_symbol" id="task_card_thumbnail_assigned_priority_symbol" src="assets/img/icons/prio${element.prio}.svg">
            </div>
        </div>
    </div>
</div>`;
}


function renderAssignedUsers(element) {

    for (let i = 0; i < element.assignedUsers.length; i++) {
        document.getElementById(`task_card_thumbnail_assigned_users_container_${element.taskID}`).innerHTML += `
        <div class="acc-initials task_card_thumbnail_profile_badge_frame" style="background: ${element.assignedUsers[i].bgColor};">${returnInitials(element.assignedUsers[i].name)}</div>
        `;
    }
}


function renderTaskCardBoard(elementId, cardID) {
    task = allTasksFromStorage.filter(t => t['taskID'] == cardID)[0];
    let taskCard = document.getElementById(elementId);
    taskCard.innerHTML = /*html*/`
        
    <div class="task_card_content" id="task_card_ID_${task['taskID']}">
    <div class="task_card_header">
        <div class="task_card_thumbnail_label"  style="background: ${task['category']['colour']};">
            <span>${task['category']['name']}</span>
        </div>
        <div class="task_card_header_close_icon_frame" onclick="closeTaskCard()">
        <img src="assets/img/icons/cancel.svg">
        </div>
    </div>

    <div class="task_card_title">
        <h1>${task['title']}</h1>
    </div>

    <div class="task_card_description">
        <span>${task['description']}</span>
    </div>

    <div class="task_card_date">
        <span>Due date: </span>${normalDate(task['date'])}
    </div>
    <div class="task_card_prio">
        <span>Priority: </span>${renderPriority(task['prio'], true)}
    </div>

    <div class="task_card_assigned_users_container">
        <span>Assigned to:</span>
        <div id="assigned-user-icons-container">
            ${renderAssignedUserIcons(task['assignedUsers'])}
        </div>       
    </div>

    <div class="task_card_subtask_container">
        <span>Subtasks</span>
        <div class="task_card_subtask_list" id="subtask-container-list-${task['taskID']}">
        ${loadSubtasksInCard(task.taskID, task.subtasks)}
        </div>
    </div>
    <div class="create-delete-task-container-responsive">
        <button id="task-delete" type="reset" onclick="deleteTask(${task['taskID']}); showPopUp('${elementId}', false)">
            <img src="./assets/img/icons/delete.svg" />
            Delete
            </button>
        <button id="task-edit" type="submit" onclick="loadEditTaskForm('${elementId}', ${task['taskID']})">
        <img src="./assets/img/icons/edit.svg" />
        Edit
        </button>
    </div>
</div>
`;
}


function loadSubtasksInCard(taskID, subtasks) {
    if (subtasks.length == 0) {
        return `No Subtasks`;
    }
    else {
        return renderSubtasks(taskID, subtasks);
    }
}


function loadSubtasksInThumbnail(element) {
    if (element.subtasks.length == 0) {
        document.getElementById(`task_card_thumbnail_progress_${element.taskID}`).innerHTML = `<div class="no_subtasks">No Subtasks</div>`;
    }
}


function renderSubtaskProgressBar(subtasks) {
    let NumberOfSubtasks = subtasks.length;
    let SubtasksDone = subtasks.filter(t => t['2'] == true);
    return Math.round((100 /NumberOfSubtasks) * SubtasksDone.length);
}


function SubtasksDone(subtasks) {
    let SubtasksDone = subtasks.filter(t => t['2'] == true);
    return SubtasksDone.length;
}


async function loadEditTaskForm(elementId, taskID) {
    await renderEditTaskForm(elementId, taskID);
    overwriteAddTaskFormCSS();
}


function overwriteAddTaskFormCSS() {
    document.getElementById('task-card').classList.add('task_card_container_overwrite');
    document.getElementById('add-task-form-container').classList.add('add_task_form_overwrite', 'task_card_container::-webkit-scrollbar', 'hide_scrollbar', 'add-task-form-overwrite');
    document.getElementById('content-add-task').classList.add('content_add_task_overwrite');
    document.getElementById('borderline').classList.add('borderline_overwrite');
    document.getElementById('add_task_popup_close_button').classList.add('d-none');
}