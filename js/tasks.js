const PRIO_URG = 1;
const PRIO_MDM = 2;
const PRIO_LOW = 3;
const SUBTASK_ID = 0;
const SUBTASK_TEXT = 1;
const SUBTASK_DONE = 2;

let taskPrio = PRIO_MDM;
let tasks = [];
let assignUserList = [];
let storedTasks = [];
let usersList = [];
let subtasks = [];
let subtaskIdsArray = []; 

// use default parameters to set JSON values 
function addTask(title = 'title is empty',
                    description = 'description is empty',
                    date = new Date().getTime(),
                    prio = PRIO_MDM,
                    assignedUsers = assignUserList,
                    category = 0,
                    taskStatus = 0,
                    taskID = new Date().getTime(),
                    subtasksSubmit = subtasks)
{
    let task = {
        'title': title,
        'description': description,
        'date': date,
        'prio': prio,
        'assignedUsers': assignedUsers,
        'category': category,
        'taskStatus': taskStatus,
        'taskID': taskID,
        'subtasks': subtasksSubmit,
    };
    return task;
} 

async function createNewTask() {

    let title = document.getElementById('task-title').value;
    let description = document.getElementById('task-description').value;
    let date = document.getElementById('task-date').value;
    let task = addTask(title = title, 
                        description = description, 
                        date = new Date().getTime(document.getElementById('task-date').value), 
                        prio = taskPrio, 
                        assignedUsers = assignUserList); 
    tasks = await getRemote('tasks');
    tasks.push(task);
  
    await setItem('tasks', tasks);
    //redirect to task card
    window.location.href = `./task_card.html`;
}

// TODO: support real contacts list
function getSelectedUser(){
    let user = document.getElementById('user-select').value;
    //console.log('Selected user is ' + user);
    let userID = parseInt(user.replace('User', ''));
    assignUserList.push(userID);
}

//function to render assigned users
function prioButtonUpdate(pressed, btn) {
        if(pressed){
            document.getElementById(btn).classList.add('d-none');
            document.getElementById(btn + '-clicked').classList.remove('d-none');
        } else {
            document.getElementById(btn).classList.remove('d-none');
            document.getElementById(btn + '-clicked').classList.add('d-none');
        }
}

function prioButtonUrgent(){
    taskPrio = PRIO_URG;
    console.log('Task prio ' + taskPrio);
    prioButtonUpdate(true, 'urgent-btn');
    prioButtonUpdate(false, 'medium-btn');
    prioButtonUpdate(false, 'low-btn');
}

function prioButtonMedium(){
    taskPrio = PRIO_MDM;
    //console.log('Task prio ' + taskPrio);
    prioButtonUpdate(false, 'urgent-btn');
    prioButtonUpdate(true, 'medium-btn');
    prioButtonUpdate(false, 'low-btn');
}

function prioButtonLow(){
    taskPrio = PRIO_LOW;
    // console.log('Task prio ' + taskPrio);
    prioButtonUpdate(false, 'urgent-btn');
    prioButtonUpdate(false, 'medium-btn');
    prioButtonUpdate(true, 'low-btn');
}

function disableBtnsDefault(button){
    document.getElementById(button).addEventListener('click', function(event) {
        // Prevent the form from being submitted
        event.preventDefault();
    });
}

function disablePrioBtns(){
    disableBtnsDefault('urgent-btn');
    disableBtnsDefault('medium-btn');
    disableBtnsDefault('low-btn');
    disableBtnsDefault('urgent-btn-clicked');
    disableBtnsDefault('medium-btn-clicked');
    disableBtnsDefault('low-btn-clicked');
    disableBtnsDefault('user-select-button');
    disableBtnsDefault('categories-select-button');
}

async function renderFullUsersList() {
    usersList = await getRemote('contacts');
    renderHTMLUsersList(usersList);
}

function renderHTMLUsersList(usersList){
    let dropdown = document.getElementById('select-dropdown-users');
    dropdown.innerHTML = '';
    console.log('usersList ' + usersList);
    for (let index = 0; index < usersList.length; index++) {
        let user = usersList[index];
    
        console.log('usersList ' + user["name"] + " user['id'] " +  user["id"] + " assignUserList " + assignUserList.length);
        if (assignUserList.length != 0) {

            const userIndex = assignUserList.findIndex((assignedUser) => assignedUser['id'] === user['id']);
            if (userIndex != -1) {
                console.log('user ' + user['name'] + ' alredy is assigned');
               continue;
            }
        }

        var option = document.createElement('div');
        option.style.display = "flex";
        option.style.flexDirection = "row";
        option.style.flexWrap = "wrap";
        option.style.justifyContent = "space-between";
        option.style.paddingBottom = "10px";
        option.className = "user-option";
        const userName = user['name'];
        option.innerHTML = /*html*/`
                <div class="initials-name">
                    <div class="acc-initials">
                        <p>${returnInitials(user['name'])}</p>
                        </div>
                        <div>${user['name']}</div>
                    </div>
                </div>
                <input type="checkbox" role="option" class="contact-entry-task"
                 data-name="${userName}" onclick="selectOption(this, ${user.id})"/>

        `;
        dropdown.appendChild(option);
    }
} 

function toggleCustomSelect() {
    let dropdown = document.getElementById('select-dropdown-users');
    let dropdownIcon = document.getElementById('dropdown-icon-users');
    dropdownIcon.classList.toggle("rotate");
    dropdown.classList.toggle("d-none-ni");
}

function toggleInputUsers() {
    let dropdown = document.getElementById('select-dropdown-users');
    dropdown.classList.remove("d-none-ni");
}

function selectOption(checkbox, id) {
    const selectedUsersContainer = document.getElementById('selected-users-container');

    if (checkbox.checked) {
        let selectedName = checkbox.getAttribute('data-name');
        
        // Create a div element for the icon with initials using innerHTML
        selectedUsersContainer.innerHTML += /*html*/`
            <div class="selected-icon" id="selected-icon-user-assigned-${id.toString()}">
                <div class="acc-initials">
                    <p>${returnInitials(selectedName)}</p>
                </div>
            </div>
        `;
        const index = usersList.findIndex((user) => user.id === id);
        console.log('usersList ' + usersList.length + ' index ' + index +  ' id ' + id );
         if (index != -1) {
            console.log('id ' + id);
            assignUserList.push(usersList[index]);
         }
    } else {
        // If checkbox is unchecked, remove the corresponding icon div
        const selectedIcon = document.getElementById('selected-icon-user-assigned-' + id.toString());
        if (selectedIcon) {
            selectedIcon.remove();
        }
    }

    // toggleCustomSelect(); // Close the dropdown after selection if needed
}

async function filterUsers() {
    let search = document.getElementById('search').value;
    search = search.toLowerCase();
    if(usersList.length == 0){
        usersList = await getRemote('contacts');
    }
    let filteredList = [];
    if (search != '') {
        for (let i = 0; i < usersList.length; i++) {
            let name = usersList[i].name;
            if (name.toLowerCase().includes(search)) {
                filteredList.push(usersList[i]);
            }
        }
    }
    if (filteredList.length == 0) {
        filteredList = usersList;
    }
    renderHTMLUsersList(filteredList);
}

document.addEventListener('click', function (event) {
    const dropdown = document.getElementById('select-dropdown-users');
    const dropdownContainer = document.getElementById('select-users');
    const dropdownIcon = document.getElementById('dropdown-icon-users');

    if(dropdownContainer){
    if (!dropdownContainer.contains(event.target)) {
        // Click is outside the dropdown, close it
        dropdown.classList.add('d-none-ni');
        dropdownIcon.classList.remove('rotate');
        document.getElementById('search').value = "";
        }
    }
});

function toggleCategoriesSelect() {
    let dropdown = document.getElementById('select-dropdown-categories');
    let dropdownIcon = document.getElementById('dropdown-icon-categories');
    dropdownIcon.classList.toggle("rotate");
    dropdown.classList.toggle("d-none-ni");
}

function selectOptionCat(element) {
    const selectedCategoryInput = document.getElementById('selected-category');
    const selectedCategoryValue = element.querySelector('.initials-name').getAttribute('value');

    // Update the input value and close the dropdown
    selectedCategoryInput.value = selectedCategoryValue;
    toggleCategoriesSelect();
}

document.addEventListener('click', function (event) {
    const dropdown = document.getElementById('select-dropdown-categories');
    const dropdownContainer = document.getElementById('categories-select-button');
    const dropdownIcon = document.getElementById('dropdown-icon-categories');

    if (!dropdownContainer.contains(event.target)) {
        // Click is outside the dropdown, close it
        dropdown.classList.add('d-none-ni');
        dropdownIcon.classList.remove('rotate');
    }
});

/**
 * Adds the first subtask to the list if the input is not empty.
 * Generates a unique ID for the subtask, creates a list item,
 * and resets the subtask input field.
 */
function editModeSubtask(){
    const subTaskPlusIcon = document.getElementById('subtask-plus-icon');
    const subTaskCheckIcon = document.getElementById('subtask-check-icon');
    const subTaskVectorIcon = document.getElementById('subtask-vector-icon');
    const subTaskCloseIcon = document.getElementById('subtask-close-icon');
    subTaskPlusIcon.classList.add('d-none-ni');
    subTaskCheckIcon.classList.remove('d-none-ni');
    subTaskCloseIcon.classList.remove('d-none-ni');
    subTaskVectorIcon.classList.remove('d-none-ni');
}

function incertSubtask() {
    const subtaskInput = document.getElementById('subtask-input');
    const subtaskText = subtaskInput.value.trim();
    
    if (subtaskText !== '') {
        //const subtaskId = generateUniqueID();
        createSubtaskListItem(subtaskText);
        resetSubtaskInput(subtaskInput);
        closeEditSubtask();
    }
    else{
        closeEditSubtask();
    }
}

function closeEditSubtask(){
    const subtaskInput = document.getElementById('subtask-input');
    const subTaskPlusIcon = document.getElementById('subtask-plus-icon');
    const subTaskCheckIcon = document.getElementById('subtask-check-icon');
    const subTaskVectorIcon = document.getElementById('subtask-vector-icon');
    const subTaskCloseIcon = document.getElementById('subtask-close-icon');
    subTaskPlusIcon.classList.remove('d-none-ni');
    subTaskCheckIcon.classList.toggle('d-none-ni');
    subTaskCloseIcon.classList.toggle('d-none-ni');
    subTaskVectorIcon.classList.toggle('d-none-ni');
    resetSubtaskInput(subtaskInput);
}

function renderEditModeSavedSubtask(subtaskText, subtaskId) {
    return /*html*/`
    <div class="subtask-item input-container width-small" id="${subtaskId}-input"> 
        <input class="input-field" type="text" value="${subtaskText}" id="${subtaskId}-edit-subtask-input">
        <div class="subtask-icons visible" id="subtask-icons-saved-edit-${subtaskId}">
            <div class="check_icon_div">
                <img class="subtask-img icon" id="subtask-check-icon" src="/assets/img/icons/Property 1=check.svg" alt="" onclick="updateSavedSubtask('${subtaskText}', '${subtaskId}')">
            </div>
            <div class="vector_icon_div">
                    <img class="add-subtaskicons icon vector" src="/assets/img/icons/Vector 19.svg" alt="">
                </div>
            <div class="delete_icon_div">
                <img class="subtask-img icon" id="subtask-close-icon" src="/assets/img/icons/Property 1=close.svg" alt="" onclick="closeEditSavedSubtask('${subtaskText}', '${subtaskId}')">
            </div>
        </div>
    </div>
`;
}

function editModeSavedSubtask(subtaskText, subtaskId) {
    const selectSubtaskEdit = document.getElementById(`${subtaskId}`);
    selectSubtaskEdit.classList.add('display-block');
    selectSubtaskEdit.innerHTML = renderEditModeSavedSubtask(subtaskText, subtaskId);

    // Set focus on the input field
    focusEditSavedSubtask('edit-subtask-input');
}

function closeEditSavedSubtask(subtaskText, subtaskId) {
    let selectSubtaskEditItem = document.getElementById(`${subtaskId}`);
    if (selectSubtaskEditItem) {
        selectSubtaskEditItem.innerHTML = "";
        selectSubtaskEditItem.innerHTML = renderSubtaskListItem(subtaskText, subtaskId);    }
}
 // Set focus to the edit mode input

function focusEditSavedSubtask(elementId){
    const editSubtaskInput = document.getElementById(elementId);
    if (editSubtaskInput) {
        editSubtaskInput.focus();
    }
}

function updateSavedSubtask(subtaskText, subtaskId) {
    const editSubtaskInput = document.getElementById(`${subtaskId}-edit-subtask-input`);
    const updatedText = editSubtaskInput.value.trim();

    if (updatedText !== '') {

        editSubtaskInput.value = updatedText;
        subtaskText = updatedText;
        const index = subtasks.findIndex((task) => task[SUBTASK_ID] === subtaskId);
        if (index !== -1) {
            subtasks[index][SUBTASK_TEXT] = subtaskText;
        }
    }
    closeEditSavedSubtask(subtaskText, subtaskId);
}

function createSubtaskListItem(subtaskText) {
    const selectSubtaskList = document.getElementById('select-subtask');
    const subtaskId = generateUniqueID();
    selectSubtaskList.innerHTML += renderSubtaskListItem(subtaskText, subtaskId);
    subtasks.push([subtaskId, subtaskText, false]);
}

function renderSubtaskListItem(subtaskText, subtaskId) {
    return /*html*/`
    <li id="${subtaskId}" class="subtask-li" ondblclick="editModeSavedSubtask('${subtaskText}', '${subtaskId}')">
        <div class="subtask-item">
            <div>${subtaskText}</div>
            <div class="subtask-icons" id="subtask-icons-edit-${subtaskId}">       
                <div class="pencil_icon_div">
                    <img class="add-subtaskicons icon pencil" src="/assets/img/icons/Property 1=edit.svg" alt="" onclick="editModeSavedSubtask('${subtaskText}', '${subtaskId}')">
                </div>
                <div class="vector_icon_div">
                    <img class="add-subtaskicons icon vector" src="/assets/img/icons/Vector 19.svg" alt="">
                </div>
                <div class="delete_icon_div">
                    <img class="add-subtaskicons icon delete" src="/assets/img/icons/Property 1=delete.svg" alt="" onclick="deleteSubtask(event, '${subtaskId}')">
                </div>
            </div>
        </div>
    </li>
`;
}


function deleteSubtask(event, subtaskId) {
    const subtaskItem = event.target.closest('li');
    if (subtaskItem) {
        // Find the index of the subtask in the arrays
        const index = subtasks.findIndex((task) => task[SUBTASK_ID] === subtaskId);
        // If the subtask is found in the arrays, remove it
        if (index !== -1) {
            subtasks.splice(index, 1);
        }
        // Remove the subtaskItem from the DOM
        subtaskItem.remove();
    }
}

function generateUniqueID() {
    const timestamp = new Date().getTime();
    return timestamp;
}

function resetSubtaskInput(subtaskInput) {
    // Clear the input value
    subtaskInput.value = '';
}





