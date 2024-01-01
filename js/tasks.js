const PRIO_URG = 1;
const PRIO_MDM = 2;
const PRIO_LOW = 3;
const SUBTASK_ID = 0;
const SUBTASK_TEXT = 1;
const SUBTASK_DONE = 2;
const TASK_STATUS_TODO = 0;
const TASK_STATUS_INPROGRESS = 1;
const TASK_STATUS_AWAITFEEDBACK = 2;
const TASK_STATUS_DONE = 3;

let taskPrio = PRIO_MDM;
let tasks = [];
let assignUserList = [];
let storedTasks = [];
let usersList = [];
let subtasks = [];
let category = [];

const taskStatusCategories = ["To do", "In progress", "Await feedback", "Done"];

const categories = [
    {
        name: 'Development',
        colour: '#462F8A',
    },
    {
        name: 'Design',
        colour: '#FF7A00',
    },
    {
        name: 'Project and Task Management',
        colour: '#1FD7C1',
    },
    {
        name: 'Collaboration and Communication',
        colour: '#0038FF',
    },
    {
        name: 'Management',
        colour: '#9C27B0',
    },
];

/**
 * Submits a task with the given task status and optional task ID.
 * @param {string} taskStatus - The status of the task.
 * @param {number} [submitTaskID=0] - The ID of the task to be submitted (optional).
 * @returns {Promise<void>} - A promise that resolves when the task is submitted.
 */
async function submitTask(taskStatus, submitTaskID = 0) {

    let title = document.getElementById('task-title').value;
    let description = document.getElementById('task-description').value;
    let date = new Date(document.getElementById('task-date').value);
    let task = {
        'title': title,
        'description': description,
        'date': date,
        'prio': taskPrio,
        'assignedUsers': assignUserList,
        'category': category,
        'taskStatus': taskStatus,
        'taskID': new Date().getTime(),
        'subtasks': subtasks,
    };

    tasks = await getRemote('tasks');

    if(submitTaskID){
        const index = tasks.findIndex((task) => task.taskID === submitTaskID);
        task.taskID = submitTaskID;
        tasks[index] = task;
    } else {
        tasks.push(task);
    }
  
    await setItem('tasks', tasks);
    showAddedTaskMsg();
    //redirect to task card
    setTimeout(() => {
        window.location.href = `./board.html`;
    }, 1800);
}

/**
 * Shows a message indicating that a task has been added.
 */
function showAddedTaskMsg() {
    document.getElementById("task-added").classList.remove("d-none");
    setTimeout(() => {
      document.getElementById("task-added").classList.add("d-none");
    }, 900);
  }

/**
 * Retrieves the selected user from the user-select element and adds their ID to the assignUserList array.
 */
function getSelectedUser(){
    let user = document.getElementById('user-select').value;
    let userID = parseInt(user.replace('User', ''));
    assignUserList.push(userID);
}

/**
 * Updates the priority button based on the pressed state.
 * @param {boolean} pressed - The state of the button (true if pressed, false otherwise).
 * @param {string} btn - The ID of the button element.
 */
function prioButtonUpdate(pressed, btn) {
        if(pressed){
            document.getElementById(btn).classList.add('d-none');
            document.getElementById(btn + '-clicked').classList.remove('d-none');
        } else {
            document.getElementById(btn).classList.remove('d-none');
            document.getElementById(btn + '-clicked').classList.add('d-none');
        }
}

/**
 * Sets the task priority to urgent and updates the priority buttons accordingly.
 */
function prioButtonUrgent(){
    taskPrio = PRIO_URG;
    prioButtonUpdate(true, 'urgent-btn');
    prioButtonUpdate(false, 'medium-btn');
    prioButtonUpdate(false, 'low-btn');
}

/**
 * Sets the task priority to medium and updates the priority buttons accordingly.
 */
function prioButtonMedium(){
    taskPrio = PRIO_MDM;
    prioButtonUpdate(false, 'urgent-btn');
    prioButtonUpdate(true, 'medium-btn');
    prioButtonUpdate(false, 'low-btn');
}

/**
 * Sets the task priority to low and updates the priority buttons accordingly.
 */
function prioButtonLow(){
    taskPrio = PRIO_LOW;
    prioButtonUpdate(false, 'urgent-btn');
    prioButtonUpdate(false, 'medium-btn');
    prioButtonUpdate(true, 'low-btn');
}

/**
 * Disables the default behavior of a button.
 * @param {string} button - The ID of the button to disable.
 */
function disableBtnsDefault(button){
    document.getElementById(button).addEventListener('click', function(event) {
        event.preventDefault();
    });
}

/**
 * Disables the default behavior of buttons.
 */
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

/**
 * Renders the full list of users by fetching data from the remote server and rendering it on the HTML page.
 * @returns {Promise<void>} A promise that resolves when the rendering is complete.
 */
async function renderFullUsersList() {
    usersList = await getRemote('contacts');
    renderHTMLUsersList(usersList);
}

/**
 * Renders the user icon dropdown.
 * 
 * @param {object} user - The user object.
 * @returns {string} The HTML string representing the user icon dropdown.
 */
function renderUserIconDropdown(user){
    return /*html*/`
        <div class="initials-name">
            <div class="acc-initials" style="background-color:${user['bgColor']}">
                <p>${returnInitials(user['name'])}</p>
                </div>
                <div>${user['name']}</div>
            </div>
        </div>
    `;
}

/**
 * Renders the HTML for the users list dropdown.
 * 
 * @param {Array} usersList - The list of users.
 */
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
        option.innerHTML = renderUserIconDropdown(user);
        option.innerHTML += /*html*/`
            <input type="checkbox" role="option" class="contact-entry-task"
                data-name="${userName}" onclick="selectOption(this, ${user.id})"/>
        `;
        dropdown.appendChild(option);
    }
} 

/**
 * Toggles the visibility of a custom select dropdown.
 */
function toggleCustomSelect() {
    let dropdown = document.getElementById('select-dropdown-users');
    let dropdownIcon = document.getElementById('dropdown-icon-users');
    dropdownIcon.classList.toggle("rotate");
    dropdown.classList.toggle("d-none-ni");
}

/**
 * Removes the visibility of the input users dropdown.
 */
function toggleInputUsers() {
    let dropdown = document.getElementById('select-dropdown-users');
    dropdown.classList.remove("d-none-ni");
}

/**
 * Removes the assigned user with the specified ID from the list.
 * @param {number} id - The ID of the user to be removed.
 */
function removeAssignedUser(id) {
    document.getElementById('selected-icon-user-assigned-' + id.toString()).remove();
    const index = assignUserList.findIndex((user) => user.id === id);
    if (index != -1) {
        assignUserList.splice(index, 1);
    }
}

/**
 * Renders a user icon with the specified user ID, user colour, and user name.
 * @param {number} userID - The ID of the user.
 * @param {string} userColour - The colour of the user icon.
 * @param {string} userName - The name of the user.
 */
function renderUserIcon(userID, userColour, userName) {
    const selectedUsersContainer = document.getElementById('selected-users-container');
    selectedUsersContainer.innerHTML +=  /*html*/`
            <div class="selected-icon" id="selected-icon-user-assigned-${userID.toString()}" ondblclick="removeAssignedUser(${userID})">
            <div class="acc-initials" style="background-color:${userColour}">
                    <p>${returnInitials(userName)}</p>
                </div>
            </div>
        `;
}

/**
 * Handles user selection in the dropdown menu.
 * If the checkbox is checked, the corresponding user icon is added to the list and 
 * removed from the dropdown.
 * 
 * @param {HTMLInputElement} checkbox - The checkbox element.
 * @param {number} id - The ID of the selected option.
 */
function selectOption(checkbox, id) {
    if (checkbox.checked) {
        let selectedName = checkbox.getAttribute('data-name');   
        // Create a div element for the icon with initials using innerHTML
        const index = usersList.findIndex((user) => user.id === id);
        if (index != -1) {
            assignUserList.push(usersList[index]);
        }
        renderUserIcon(id, usersList[index].bgColor, usersList[index].name);
    } else {
        // If checkbox is unchecked, remove the corresponding icon div
        const selectedIcon = document.getElementById('selected-icon-user-assigned-' + id.toString());
        if (selectedIcon) {
            selectedIcon.remove();
        }
    }
}

/**
 * Filters the users based on the search input and renders the filtered list.
 * If the users list is empty, it fetches the contacts remotely.
 */
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

/**
 * Callback for closing dropdown on click outside
*/
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

/**
 * Renders a category list item with the given name, colour, and index.
 * 
 * @param {string} name - The name of the category.
 * @param {string} colour - The colour of the category.
 * @param {number} index - The index of the category.
 * @returns {string} The HTML representation of the category list item.
 */
function renderCategoriesList(name, colour, index) {
    return /*html*/`
            <div class="dropdown-position" onclick="selectOptionCat(this, ${index})" id="category-${name}">
                <div class="initials-name" value="${index}" name="${name}">
                ${name}
                </div>
                <div class="acc-initials categories-colour" style="background-color: ${colour}">
                </div>
            </div>
        `;
    }

/**
 * Toggles the visibility of the categories select dropdown and renders the categories list.
 */
function toggleCategoriesSelect() {
    let categoriesList = document.getElementById('categories-list');
    categoriesList.innerHTML = '';
    for (let index = 0; index < categories.length; index++) {
        let name = categories[index]['name'];
        let colour = categories[index]['colour'];
        categoriesList.innerHTML += renderCategoriesList(name, colour, index);
    }   
    const dropdown = document.getElementById('categories-list');
    const dropdownIcon = document.getElementById('dropdown-icon-categories');
    dropdownIcon.classList.toggle("rotate");
    dropdown.classList.toggle("d-none-ni");
}

/**
 * Retrieves the task category list.
 * @returns {Promise<Array>} The task category list.
 */
 async function getTaskCategorieList() {
    return categories;
 }

/**
 * Handles category selection in the categories dropdown and updates the category value.
 * @param {HTMLElement} element - The element representing the selected option.
 * @param {number} index - The index of the selected option in the dropdown.
 * @returns {Promise<void>} - A promise that resolves when the selected category is retrieved.
 */
async function selectOptionCat(element, index) {
    const selectedCategoryInput = document.getElementById('selected-category');
    const selectedEntry = element.querySelector('.initials-name').getAttribute('name');

    // Update the input value and close the dropdown
    selectedCategoryInput.value = selectedEntry;
    toggleCategoriesSelect();
    const selectedCategory = await getTaskCategorieList();
    
    category = selectedCategory[index];
}

/**
 * Callback for closing dropdown on click outside
*/
document.addEventListener('click', function (event) {
    const dropdown = document.getElementById('categories-list');
    const dropdownContainer = document.getElementById('categories-select-button');
    const dropdownIcon = document.getElementById('dropdown-icon-categories');

    if(dropdownContainer){
        if (!dropdownContainer.contains(event.target)) {
            // Click is outside the dropdown, close it
            dropdown.classList.add('d-none-ni');
            dropdownIcon.classList.remove('rotate');
        }
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

/**
 * Inserts a subtask into the task list.
 */
function incertSubtask() {
    const subtaskInput = document.getElementById('subtask-input');
    const subtaskText = subtaskInput.value.trim();
    
    if (subtaskText !== '') {
        createSubtaskListItem(subtaskText);
        resetSubtaskInput(subtaskInput);
        closeEditSubtask();
    }
    else{
        closeEditSubtask();
    }
}

/**
 * Closes the edit subtask section and resets the subtask input.
 */
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

/**
 * Renders the HTML for the subtask edit mode.
 * 
 * @param {string} subtaskText - The text of the subtask.
 * @param {string} subtaskId - The ID of the subtask.
 * @returns {string} The HTML markup for the subtask edit mode.
 */
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

/**
 * Entering edit sutask mode.
 * 
 * @param {string} subtaskText - The text of the subtask.
 * @param {string} subtaskId - The ID of the subtask.
 */
function editModeSavedSubtask(subtaskText, subtaskId) {
    const selectSubtaskEdit = document.getElementById(`${subtaskId}`);
    selectSubtaskEdit.classList.add('display-block');
    selectSubtaskEdit.innerHTML = renderEditModeSavedSubtask(subtaskText, subtaskId);

    // Set focus on the input field
    focusEditSavedSubtask(`${subtaskId}-edit-subtask-input`);
}

/**
 * Closes the edit mode for a subtask.
 * 
 * @param {string} subtaskText - The updated text of the subtask.
 * @param {string} subtaskId - The ID of the subtask.
 */
function closeEditSavedSubtask(subtaskText, subtaskId) {
    let selectSubtaskEditItem = document.getElementById(`${subtaskId}`);
    if (selectSubtaskEditItem) {
        selectSubtaskEditItem.innerHTML = "";
        selectSubtaskEditItem.innerHTML = renderSubtaskListItem(subtaskText, subtaskId);    }
}

/**
 * Sets focus on the input element with the specified ID.
 * @param {string} elementId - The ID of the input element.
 */
function focusEditSavedSubtask(elementId){
    const editSubtaskInput = document.getElementById(elementId);
    if (editSubtaskInput) {
        editSubtaskInput.focus();
    }
}

/**
 * Updates the saved subtask with the provided text.
 * @param {string} subtaskText - The updated text for the subtask.
 * @param {string} subtaskId - The ID of the subtask.
 */
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

/**
 * Creates a subtask list item and adds it to the select-subtask list.
 * 
 * @param {string} subtaskText - The text of the subtask.
 * @returns {void}
 */
function createSubtaskListItem(subtaskText) {
    const selectSubtaskList = document.getElementById('select-subtask');
    const subtaskId = generateUniqueID();
    selectSubtaskList.innerHTML += renderSubtaskListItem(subtaskText, subtaskId);
    subtasks.push([subtaskId, subtaskText, false]);
}

/**
 * Renders a subtask list item with the given subtask text and ID.
 * @param {string} subtaskText - The text of the subtask.
 * @param {string} subtaskId - The ID of the subtask.
 * @returns {string} The HTML representation of the subtask list item.
 */
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
                    <img class="add-subtaskicons icon delete" src="/assets/img/icons/Property 1=delete.svg" alt="" onclick="deleteSubtask(event, ${subtaskId})">
                </div>
            </div>
        </div>
    </li>
`;
}

/**
 * Deletes a subtask from the subtasks array and removes it from the DOM.
 * @param {Event} event - The event object triggered by the user action.
 * @param {string} subtaskId - The ID of the subtask to be deleted.
 */
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

/**
 * Generates a unique ID based on the current timestamp.
 * @returns {number} The generated unique ID.
 */
function generateUniqueID() {
    const timestamp = new Date().getTime();
    return timestamp;
}

/**
 * Resets the value of a subtask input field.
 * @param {HTMLInputElement} subtaskInput - The input field to be reset.
 */
function resetSubtaskInput(subtaskInput) {
    // Clear the input value
    subtaskInput.value = '';
}

/**
 * Retrieves the task status by index.
 * @param {number} idx - The index of the task status.
 * @returns {string} The task status.
 */
function getTaskStatusByIndex(idx){
    return taskStatusCategories[idx];
}

/**
 * Retrieves a task by its ID.
 * @param {string} id - The ID of the task.
 * @returns {Object} - The task object matching the provided ID.
 */
async function getTaskById(id){
    tasks = await getRemote('tasks');
    const index = tasks.findIndex((task) => task.taskID === id);
    return tasks[index];
}

/**
 * Deletes a task with the specified ID.
 * @param {string} id - The ID of the task to be deleted.
 * @returns {Promise<void>} - A promise that resolves when the task is deleted.
 */
async function deleteTask(id) {
    tasks = await getRemote('tasks');
    const index = tasks.findIndex((task) => task.taskID === id);
    if (index !== -1) {
        tasks.splice(index, 1);
    }
    await setItem('tasks', tasks);
    window.location.href = `./board.html`;
}





