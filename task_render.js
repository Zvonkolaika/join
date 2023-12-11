async function drawCards(){
    let tasks = await getRemoteTasks();
    tasks.forEach(task => {
       renderTaskCard(task); 
    });
}

function renderTaskCard(task){
    let taskCard = document.getElementById("task-card");
    taskCard.innerHTML += /*html*/`
        
    <div class="container dp-flex flex-column" style="align-items: flex-start; margin: 40px; padding: 40px;">
    <div class="task-categories">
        <span>${task['category']}</span> 
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
        <span>Priority:</span>
        <div class="prio-btn-container">
            <button class="prio urgent-btn" id="urgent-btn">
                    <span>${task['prio']}</span>
                    <img class="prio-icon" src="/assets/img/icons/Prio alta.svg" alt="">
            </button>
        </div>
    </div>
    <div class="task-categories">
        <span>Assigned to: ${task['assignedUsers']}</span>
    </div>
    <div class="task-categories">
        <span>Subtasks</span>
        </div>
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