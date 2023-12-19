async function drawCards(){
    let tasks = await getRemote('tasks');
    tasks.forEach(task => {
       renderTaskCard(task);
       renderSubtasks(task);
    });
}

async function selectSubtaskStatus(checkbox, taskID, subtaskID){
    const selectedSubtaskContainer = document.getElementById(`selected-subtask-${subtaskID}`);
    let tasks = await getRemote('tasks');
    const taskIdx = tasks.findIndex((task) => task.taskID === taskID);
    const subtaskIdx = tasks[taskIdx].subtasks.findIndex((subtask) => subtask[SUBTASK_ID] === subtaskID);

    if (subtaskIdx !== -1) {
        if (checkbox.checked) {
            tasks[taskIdx].subtasks[subtaskIdx][SUBTASK_DONE] = true;
        } else {
            tasks[taskIdx].subtasks[subtaskIdx][SUBTASK_DONE][SUBTASK_DONE] = false;
        }
        await setItem('tasks', tasks);
    } else {
        console.log('subtask not found in tasks[' + taskIdx + ']');
    }
}

 function renderSubtask(taskID, subtask){
    const checked = subtask[SUBTASK_DONE] ? "checked" : "";
    return /*html*/`
    <div>${subtask[SUBTASK_TEXT]}
        <input type="checkbox" role="option" class="subtask-entry-task" id="selected-subtask-${subtask[SUBTASK_ID]}" ${checked}
        onclick="selectSubtaskStatus(this, ${taskID}, ${subtask[SUBTASK_ID]})"/>
    </div>  
        `;
}

function renderSubtasks(task){
    const subtaskContainerList = document.getElementById("subtask-container-list");
    subtaskContainerList.innerHTML = "";
    task.subtasks.forEach(subtask => { 
        subtaskContainerList.innerHTML += renderSubtask(task.taskID, subtask);
    });
}

function renderAssignedUserIcons(assignedUserList){
    let html = "";
    assignedUserList.forEach(user => {
        html += renderUserIconDropdown(user);
    });
    return html;
}

function renderPriority(prio, renderName){
    let html = "";
    switch(prio){
        case PRIO_URG: {
            if(renderName) {
                html += /*html*/ `<span>Urgent</span>`;
            } 
            html += /*html*/ `<img class="prio-icon" src="/assets/img/icons/Prio alta.svg" alt="">`;
            break;
        }
        case PRIO_MDM: {
            if(renderName) {
                html += /*html*/ `<span>Medium</span>`;
            }
            html += /*html*/ `<img class="prio-icon" src="/assets/img/icons/Prio media.svg" alt="">`;
            break;
        }
        case PRIO_LOW: {
            if(renderName) {
                html += /*html*/ `<span>Low</span>`;
            }
            html += /*html*/ `<img class="prio-icon" src="/assets/img/icons/Prio baja.svg" alt="">`;
            break;
        }
    }
    return html;
}


function renderTaskCard(task){
    let taskCard = document.getElementById("task-card");
    taskCard.innerHTML += /*html*/`
        
    <div class="container dp-flex flex-column" style="align-items: flex-start; margin: 40px; padding: 40px;">
    <div class="task-categories">
        <span>${task['category']['name']}</span> 
    </div>

    <div class="task-categories">
        <span>${task['title']}</span>
    </div>
    <div class="task-categories description">
        <span>${task['description']}</span>
    </div>

    <div class="task-categories">
        <span>Due date: ${task['date']}</span>
    </div>
    <div class="task-categories">
        <span>Priority: ${renderPriority(task['prio'], true)}</span>
    </div>
    <div class="task-categories">
        <span>Assigned to:</span>
        <div id="assigned-user-icons-container">
            ${renderAssignedUserIcons(task['assignedUsers'])}
        </div>       
    </div>
    <div class="task-categories">
        <span>Subtasks</span>
        <div class="subtask-container-list" id="subtask-container-list">
    </div>       
    <div class="create-delete-task-container">
        <div class="create-delete-task-btn" id="create-delete-task-btns-container">
                <button id="reset" type="reset" class="button-secondary-w-icon add-task-btn">
                    Delete   
                    <img src="/assets/img/icons/cancel.svg" id="clearIconHover" class="clearIconDefault">
                    <img src="/assets/img/icons/iconoir_cancel.svg" id="clearIconDefault" class="clearIconBlue d-none">
                </button>
                <button class="button-w-icon" type="submit">
                    Edit<img src="./assets/img/icons/check.svg" />
                </button>
        </div>
    </div>
</div>
`
}