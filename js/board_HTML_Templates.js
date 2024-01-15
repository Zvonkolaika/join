function taskCardBoard_HTML(task, elementId) {
    return `
    <div class="task_card_content" id = "task_card_ID_${task['taskID']}">
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
</div >`;
}


function thumbnailCard_HTML(index, element) {
    return ` <div id="${element.taskID}" class="task-card-thumbnail-container" draggable="true" ondragstart="startDragging(${index}, ${element.taskID})">
    <div class="task_card_thumbnail_content"  onclick="openTaskCard('task-card', ${element.taskID})">

    <div class="task_card_thumbnail_submenu_container" id="task_card_thumbnail_submenu_${element.taskID}">
        <div class="task_card_thumbnail_submenu_header">
            <p>MOVE TO:</p>
            <img class="task_card_thumbnail_submenu_icon" src="assets/img/icons/cancel.svg" onclick="closeThumbnailSubmenu(${element.taskID})">
        </div>
            <div class="task_card_thumbnail_submenu_link_container" id="task_card_thumbnail_submenu_link_container_${element.taskID}"></div>
    </div>

        <div class="task_card_thumbnail_header">
            <div class="task_card_thumbnail_label" style="background: ${element.category.colour};">
                ${element.category.name}
            </div>
            <img class="task_card_thumbnail_submenu_icon" src="assets/img/icons/ellipsis-solid.svg" onclick="openThumbnailSubmenu(${element.taskID}, ${element.taskStatus})">
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


function noTaskToDoHTML() {
    return `<div class="no_task">
                <p>No task To Do</p>
            </div>`
}


function noTaskDoneHTML() {
    return `<div class="no_task">
                <p>No task Done</p>
            </div>`
}