const STORAGE_TOKEN = 'I0RRFUNI9BMJ8CEHATSQHZ6NTNGVO5OHLGOWM266';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';


async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload)})
    .then(res => res.json());
}

async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    // return fetch(url).then(res => res.json());
    return await fetch(url)
        .then(res => res.json().then(res => res.data.value));
}

async function getRemoteTasks() {
    let storedTasksPromise = await getItem('tasks');
    // console.log('storedTasksPromise ' + storedTasksPromise);
    storedTasks = JSON.parse(storedTasksPromise);
    // console.log('storedTasks ' + storedTasks);

    
    if(!isJSON(storedTasks)){
        console.log('#### storedTasks is not JSON');
        console.log('All stored tasks are gone.');
        resetTasks()
    } else {
        tasks = storedTasks;
    }
    // console.log('getRemoteTasks() ' + tasks);
    
    return tasks;
}

function printAllTasks(tasks){
    tasks.forEach(task => {
        printTask(task);
    });
}

function printTask(task){
    Object.keys(task).forEach(function (key) {
        console.log(key + ": " + task[key]);
    });
}


function isJSON(value) {
    try {
        JSON.stringify(value);
        return true;
    } catch (ex) {
        return false;
    }
}