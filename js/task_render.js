async function drawCards(){
    let tasks = await getRemote('tasks');
    tasks.forEach(task => {
        renderTaskCard("task-card", task);
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
            tasks[taskIdx].subtasks[subtaskIdx][SUBTASK_DONE] = false;
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

function renderSubtasks(taskID, subtasks){
    let html = "";
    subtasks.forEach(subtask => { 
        html += renderSubtask(taskID, subtask);
    });
    return html;
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


// return date in format dd/mm/yyyy
function normalDate(date) {
    let d = new Date(date);
    let day = d.getDate();
    let month = d.getMonth() + 1; // Month is zero-based, so we add 1
    let year = d.getFullYear() % 100; // Get last two digits of the year

    day = day < 10 ? '0' + day : day;
    month = month < 10 ? '0' + month : month;

    return `${day}/${month}/${year}`;
}

function normalDateEditTask(date) {
    let d = new Date(date);
    let day = d.getDate();
    let month = d.getMonth() + 1; // Month is zero-based, so we add 1
    let year = d.getFullYear(); // Get last two digits of the year

    day = day < 10 ? '0' + day : day;
    month = month < 10 ? '0' + month : month;

    return `${year}-${month}-${day}`;
}

function renderAddTaskForm(elementId, setTaskStatus = TASK_STATUS_TODO) {
    let addTaskForm = document.getElementById(elementId);
    addTaskForm.innerHTML = '';
    const date = new Date().getTime();
    addTaskForm.innerHTML = renderTaskForm(
                                'Add Task',                     //  formTitle
                                '',                             //  title
                                '',                             //  description
                                date,                           //  date
                                undefined,                      //  prio
                                undefined,                      //  assignedUsers
                                undefined,                      //  categorySubmit
                                taskStatus = setTaskStatus,     //  taskStatus
                                undefined,                      //  taskID
                                undefined                       //  subtasksSubmit
                                );
    disablePrioBtns();
}

async function renderEditTaskForm(elementId, taskId) {
    let task = await getTaskById(taskId);
    let addTaskForm = document.getElementById(elementId);

    assignUserList = task['assignedUsers'];
    console.log("Date " + task['date'] );
    addTaskForm.innerHTML = '';
    addTaskForm.innerHTML = renderTaskForm(
                                'Edit Task',                        //  formTitle
                                task['title'],                      //  title
                                task['description'],                //  description
                                task['date'],                       //  date
                                task['prio'],                       //  prio
                                task['assignedUsers'],              //  assignedUsers
                                task['category'],                   //  categorySubmit
                                taskStatus = task['taskStatus'],    //  taskStatus
                                task['taskID'],                     //  taskID
                                task['subtasks']                    //  subtasksSubmit
                                );
    
    
    document.getElementById('selected-category').value = task['category']['name'];
    assignUserList.forEach(user => {    
        renderUserIcon(user.id, user.bgColor, user.name);
    });
    switch(task['prio']){
        case PRIO_URG: {
            prioButtonUrgent();
            break;
        } 
        case PRIO_MDM: {
            prioButtonMedium();
            break;
        }
        case PRIO_LOW: {
            prioButtonLow();
            break;
        }
    }
    subtasks = task['subtasks'];
    subtasks.forEach(subtask => {
        const selectSubtaskList = document.getElementById('select-subtask');
        selectSubtaskList.innerHTML += renderSubtaskListItem(subtask[SUBTASK_TEXT] , subtask[SUBTASK_ID]);
    });
    disablePrioBtns();
}

function renderTaskForm(
                formTitle = 'Untitled', 
                title = '',
                description = '',
                date = new Date().getTime(),
                prio = PRIO_MDM,
                assignedUsers = [],
                categorySubmit = [],
                taskStatus = TASK_STATUS_TODO,
                taskID = 0,
                subtasksSubmit = []) {

    let submitBtnName = !taskID ? 'Create Task' : 'Submit Changes';
    let popUpMsg = !taskID ? 'Task created ' : 'Task updated ';
    let taskTitle = title.length ? `value="${title}"` : '';
    let taskDescription = description.length ? `${description}` : '';
    let taskDate = date !== 0 ? `value="${normalDateEditTask(date)}"` : '';
    category = categorySubmit;
    return /*html*/ `
    <form class="add-task-form" id="add-task-form-container" action="task_card.html" method="get"
        onsubmit="event.preventDefault(); submitTask(${taskStatus}, submitTaskID = ${taskID});">
        <div class="task-form-full">
        <!-- Header Section -->
        <div class="header-div">
            <h1>${formTitle}</h1>
        </div>
        <div class="content-add-task">
            <div class="title-description-div">
                <!-- Task Title -->
                <div class="task-categories title">
                    <div class="required">
                        <span>Title</span><span class="red-asterisk">*</span>
                    </div>
                    <div class="input-container">
                        <input type="text" ${taskTitle} id="task-title" required class="input-field" placeholder="Enter a title">
                    </div>
                </div>
                <div class="task-categories description">
                    <span>Description</span>
                    <div class="input-container">
                        <textarea type="text" text="ewewr" required id="task-description" 
                        class="input-field" placeholder="Enter a Description">${taskDescription}</textarea>
                    </div>
                </div>
                <div class="task-categories users">
                    <span>Assigned to</span>
                    <div class="custom-select" id="select-users">
                        <button class="dropdown select-button" role="combobox"
                            onclick="filterUsers();" id="user-select-button">
                            <input placeholder="Select contacts to assign" type="text" autocomplete="off"
                                class="selected-value" id="search" onclick="filterUsers(); toggleInputUsers()" onchange="filterUsers()">
                            <img class="dropdown-icon" id="dropdown-icon-users"
                                src="/assets/img/icons/arrow_drop_downaa.svg" alt="dropdown icon" onclick="toggleCustomSelect()">
                        </button>
                        <div>
                            <span id="list"></span>
                        </div>
                        <ul class="dropdown d-none-ni" role="listbox" id="select-dropdown-users">
                        </ul>
                    </div>
                    <div class="selected-users-container" id="selected-users-container">
                    </div>
                </div>
            </div>
            <div class="borderline"></div>
            <div class="date-prio-container">
                    <div class="task-categories date">
                        <div class="required">
                            <span>Due date</span><span class="red-asterisk">*</span>
                        </div>
                        <input type="date" id="task-date" class="input-field date-task-inputfield" ${taskDate} placeholder="dd/mm/yy">
                    </div>
                    <div class="task-categories prio-categories">
                        <span>Prio</span>
                        <div class="prio-btn-container">
                            <button onclick="prioButtonUrgent()" class="prio urgent-btn" id="urgent-btn">
                                <span>Urgent</span>
                                <img class="prio-icon" src="/assets/img/icons/Prio alta.svg" alt="">
                            </button>
                            <button type="button" value="urgent" class="prio urgent-btn-clicked d-none"
                                id="urgent-btn-clicked">
                                <span>Urgent</span>
                                <img class="prio-icon" src="/assets/img/icons/Prio alta-white.svg" alt="">
                            </button>
                            <button onclick="prioButtonMedium()" class="prio medium-btn d-none" id="medium-btn">
                                <span>Medium</span>
                                <img class="prio-icon" src="/assets/img/icons/Prio media.svg" alt="Medium Prio Icon">
                            </button>
                            <button type="button" value="medium" class="prio medium-btn-clicked"
                                id="medium-btn-clicked">
                                <span>Medium</span>
                                <img class="prio-icon" src="assets/img/icons/Prio media-white.svg"
                                    alt="Medium Prio Icon">
                            </button>
                            <button onclick="prioButtonLow()" class="prio low-btn" id="low-btn">
                                <span>Low</span>
                                <img class="prio-icon" src="/assets/img/icons/Prio baja.svg" alt="Low Prio Icon">
                            </button>
                            <button type="button" value="low" class="prio low-btn-clicked d-none" id="low-btn-clicked">
                                <span>Low</span>
                                <img class="prio-icon" src="/assets/img/icons/Prio baja-white.svg" alt="Low Prio Icon">
                            </button>
                        </div>
                    </div>
                    <div class="task-categories categories">
                        <div class="required">
                            <span>Categories</span><span class="red-asterisk">*</span>
                        </div>
                        <div class="custom-select">
                            <button class="dropdown select-button" role="combobox" id="categories-select-button"  onclick="toggleCategoriesSelect();">
                                <input placeholder="Select task category" type="text" autocomplete="off" class="selected-value" id="selected-category" readonly>
                                <img class="dropdown-icon" id="dropdown-icon-categories" src="/assets/img/icons/arrow_drop_downaa.svg" alt="dropdown icon">
                            </button>
                            <ul id="categories-list" class="dropdown d-none-ni" role="listbox">
                            </ul>
                        </div>
                    </div> 
                    <div class="task-categories subtask">
                        <span>Subtasks</span>
                        <div class="input-container" id="subtask-input-container">
                            <input class="input-field" type="text" id="subtask-input" placeholder="Add new subtask" onclick="editModeSubtask()" ondblclick="incertSubtask()">
                            <img class="subtask-img icon" id="subtask-plus-icon" src="/assets/img/icons/Property 1=add.svg" alt="" onclick="editModeSubtask()">
                            <img class="subtask-img icon d-none-ni" id="subtask-close-icon" src="/assets/img/icons/Property 1=close.svg" alt="" onclick="closeEditSubtask()">
                            <img class="subtask-img icon d-none-ni" id="subtask-vector-icon" src="/assets/img/icons/Vector 19.svg">
                            <img class="subtask-img icon d-none-ni" id="subtask-check-icon" src="/assets/img/icons/Property 1=check.svg" alt="" onclick="incertSubtask()">
                        </div>
                        <ul id="select-subtask" class=""></ul>
                        <div id="select-subtask-edit" class=""></div>
                    </div>
            </div>
        </div>
        
        </div>
        <div class="create-delete-task-container">
            <div>
                <span class="required-field"><span class="red-asterisk">*</span>This field is required</span>
            </div>
                <div class="create-delete-task-btn" id="create-delete-task-btns-container">
                    <button id="reset" type="reset" class="button-secondary-w-icon add-task-btn">
                        Clear
                        <img src="/assets/img/icons/cancel.svg" id="clearIconHover" class="clearIconDefault">
                        <img src="/assets/img/icons/iconoir_cancel.svg" id="clearIconDefault"
                            class="clearIconBlue d-none-ni">
                    </button>
                    <button class="button-w-icon" type="submit" value="Submit">
                        ${submitBtnName}
                        <img src="./assets/img/icons/check.svg">
                    </button>
                </div>
        </div>
    </form>
    <div id="task-added" class="task-added d-none">
                <span>${popUpMsg}&nbsp;</span>
                <img src="/assets/img/icons/Vector_task_added.svg" alt="task added icon" class="icon">
    </div>
    `;
}

function renderTaskCard(elementId, task){
    let taskCard = document.getElementById(elementId);
    taskCard.innerHTML += /*html*/`
        
    <div class="container dp-flex flex-column" id="task-card-id-${task['taskID']}" style="align-items: flex-start; margin: 40px; padding: 40px;">
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
        <span>Due date: ${normalDate(task['date'])}</span>
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
        <div class="subtask-container-list" id="subtask-container-list-${task['taskID']}">
        ${renderSubtasks(task.taskID, task.subtasks)}
        </div>
    </div>       
    <div class="create-delete-task-container">
        <div class="create-delete-task-btn" id="create-delete-task-btns-container">
                <button id="reset" type="reset" class="button-secondary-w-icon add-task-btn" onclick="deleteTask(${task['taskID']})">
                    Delete   
                    <img src="/assets/img/icons/cancel.svg" id="clearIconHover" class="clearIconDefault">
                    <img src="/assets/img/icons/iconoir_cancel.svg" id="clearIconDefault" class="clearIconBlue d-none">
                </button>
                <button class="button-w-icon" type="submit" onclick="renderEditTaskForm('task-card-id-${task['taskID']}', ${task['taskID']})">
                    Edit<img src="./assets/img/icons/check.svg" />
                </button>
        </div>
        <div id="edit-mode-task"></div>
    </div>
</div>
`;
}