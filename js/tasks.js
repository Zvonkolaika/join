const PRIO_URG = 1;
const PRIO_MDM = 2;
const PRIO_LOW = 3;

let taskPrio = PRIO_MDM;

function createNewTask(){
    let titel = document.getElementById('task-title').value;
    let description = document.getElementById('task-description').value;
    let date = document.getElementById('task-date').value;
   // let titel = document.getElementById('task-title').value;
   // let titel = document.getElementById('task-title').value;
}

function prioButtonUpdate(pressed, btn) {
        if(pressed){
            document.getElementById(btn).classList.add('d-none');
            document.getElementById('clicked-' + btn).classList.remove('d-none');
        } else {
            document.getElementById(btn).classList.remove('d-none');
            document.getElementById('clicked-' + btn).classList.add('d-none');
        }
}

function prioButtonUrgent(){
    prioButtonUpdate(true, 'urgent-btn');
    prioButtonUpdate(false, 'medium-btn');
    prioButtonUpdate(false, 'low-btn');
    taskPrio = PRIO_URG;
}

function prioButtonMedium(){
    prioButtonUpdate(false, 'urgent-btn');
    prioButtonUpdate(true, 'medium-btn');
    prioButtonUpdate(false, 'low-btn');
    taskPrio = PRIO_MDM;
}

function prioButtonLow(){
    prioButtonUpdate(false, 'urgent-btn');
    prioButtonUpdate(false, 'medium-btn');
    prioButtonUpdate(true, 'low-btn');
    taskPrio = PRIO_LOW;
}

