const PRIO_URG = 1;
const PRIO_MDM = 2;
const PRIO_LOW = 3;

let taskPrio = PRIO_MDM;
let tasks = [];
let assignUserList = [];
let storedTasks = [];
let usersList = [];

// use default parameters to set JSON values 
function addTask(title = 'title is empty',
                    description = 'description is empty',
                    date = new Date().getTime(),
                    prio = PRIO_MDM,
                    assignedUsers = assignUserList,
                    category = 0,
                    taskStatus = 0,
                    taskID = new Date().getTime()) 
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
        'prio': prio,
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
    usersList.forEach(user => {
        //console.log('usersList ' + user["name"]);
        var option = document.createElement('div');
        option.style.display = "flex";
        option.style.flexDirection = "row";
        option.style.flexWrap = "wrap";
        option.style.justifyContent = "space-between";
        option.style.paddingBottom = "10px";
        const userName = user['name'];
        option.innerHTML = /*html*/`
                <div class="initials-name">
                    <div class="acc-initials">
                        <p>${returnInitials(user['name'])}</p>
                        </div>
                        <div>${user['name']}</div>
                    </div>
                </div>
                <input type="checkbox" role="option" class="contact-entry-task" data-name="${userName}" onclick="selectOption(this, '${userName}')"/>

        `;
        dropdown.appendChild(option);
    });
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

    if (!dropdownContainer.contains(event.target)) {
        // Click is outside the dropdown, close it
        dropdown.classList.add('d-none-ni');
        dropdownIcon.classList.remove('rotate');
        document.getElementById('search').value = "";
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
function incertSubtask() {
    const subtaskInput = document.getElementById('subtask-input');
    const subtaskText = subtaskInput.value.trim();
    if (subtaskText !== '') {
        //const subtaskId = generateUniqueID();
        createSubtaskListItem(subtaskText);
        resetSubtaskInput(subtaskInput);
    }
}

function addToSubtaskArrays(subtaskText, subtaskId) {
    subtaskTextsArray.push(subtaskText);
    subtaskIdsArray.push(subtaskId);
}

function createSubtaskListItem(subtaskText) {
    const subtaskId = generateUniqueID();
    const selectSubtaskList = document.getElementById('select-subtask');

    const subtaskItem = document.createElement('li');
    subtaskItem.innerHTML = /*html*/`
        <div class="subtask-item" id="${subtaskId}">
            <div>${subtaskText}</div>
            <div class="subtask-icons">       
                <div class="pencil_icon_div">
                    <img class="addSubTaskIcons icon pencil" src="/assets/img/icons/Property 1=edit.svg" alt="" onclick="editSubtask(event)">
                </div>
                <div class="delete_icon_div">
                    <img class="addSubTaskIcons icon delete" src="/assets/img/icons/Property 1=delete.svg" alt="" onclick="deleteSubtask(event)">
                </div>
        </div>
    `;
    selectSubtaskList.appendChild(subtaskItem);
}

// Example of generating a unique ID
function generateUniqueID() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

function resetSubtaskInput(subtaskInput) {
    // Clear the input value
    subtaskInput.value = '';
}





