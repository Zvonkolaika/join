let assignUserList = [];
let usersList = [];

/**
 * Retrieves the selected user from the user-select element and adds their ID to the assignUserList array.
 */
function getSelectedUser(){
    let user = document.getElementById('user-select').value;
    let userID = parseInt(user.replace('User', ''));
    assignUserList.push(userID);
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
 * Handles the click event on the user dropdown.
 * @param {string} userId - The ID of the user.
 */
function userDropDownClick(userId) {
    const userCheckbox = document.getElementById('dropdown-user-' + userId.toString());
    userCheckbox.checked = !userCheckbox.checked;
    selectOption(userCheckbox, userId);
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
            <div>
                ${user['name']}
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
    for (let index = 0; index < usersList.length; index++) {
        let user = usersList[index];
        if (assignUserList.length != 0) {
            const userIndex = assignUserList.findIndex((assignedUser) => assignedUser['id'] === user['id']);
            if (userIndex != -1) {
               continue;
            }
        }
        dropdown.innerHTML += /*html*/`
        <div class="user-option" onclick="userDropDownClick(${user.id})" 
            style="display: flex; flex-direction: row; flex-wrap: wrap; justify-content: space-between; padding-bottom: 10px;">
            ${renderUserIconDropdown(user)}
            <input type="checkbox" role="option" class="contact-entry-task" id='dropdown-user-${user.id}'
                data-name="${user.name}" onclick="selectOption(this, ${user.id})"/>
        </div>
        `;
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
function renderTaskUserIcon(userID, userColour, userName) {
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
        renderTaskUserIcon(id, usersList[index].bgColor, usersList[index].name);
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
