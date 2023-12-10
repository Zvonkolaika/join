const PRIO_URG = 1;
const PRIO_MDM = 2;
const PRIO_LOW = 3;

let taskPrio = PRIO_MDM;
let tasks = [];
let assignUserList = [];
let storedTasks = [];

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

async function resetRemoteTasks() {
    await setItem('tasks', []).then();
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
    tasks = await getRemoteTasks();
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
}

