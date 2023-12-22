let allTasksFromStorage = [];

async function init() {
    await includeHTML();
    setCurrentPageLinkActive('board');
    await loadTasks();

  }

async function renderTaskCardById(elementId, taskId) {
  let task = await getTaskById(taskId);
  renderTaskCard(elementId, task);
}

function renderTaskCardSmall(elementId, task){
  let taskCard = document.getElementById(elementId);
  taskCard.innerHTML += /*html*/`
      
  <div id="task-card-small-id-${task['taskID']}" onclick="renderTaskCardById('board_popup_placeholder', ${task.taskID}); showTaskCardPopup('board_popup_placeholder', true)">
    <div>${task['category']['name']}</div>
    <div>${task['title']}</div>
    <div>${task['description']}</div>
    <div>   
        <div>
            <div id="assigned-user-icons-container">
                ${renderAssignedUserIcons(task['assignedUsers'])}
            </div>       
        </div>
        <div>
            ${renderPriority(task['prio'], false)}
        </div>  
    </div>  
    <div id="edit-mode-task-small-${task['taskID']}"></div>
  </div>
  `;
}

function showAddTaskPopup (elementId, show) {
  document.getElementById(elementId).classList.add("show-add-task-popup");
  showPopUp(elementId, show);
}

function showTaskCardPopup (elementId, show) {
  document.getElementById(elementId).classList.add("show-task-card-popup");
  showPopUp(elementId, show);
}

function showAddTaskForm (elementId, show) {
  document.getElementById(elementId).classList.add("show-add-task-form");
  showPopUp(elementId, show);
}


  async function loadTasks() {
    allTasksFromStorage = await getRemote("tasks");
      console.log(allTasksFromStorage);

      allTasksFromStorage.forEach(task => {
        switch(task.taskStatus) {
          case TASK_STATUS_TODO:
            {
              renderTaskCardSmall('column_todo', task);
              break;
            }
          case TASK_STATUS_INPROGRESS:
            {
              renderTaskCardSmall("column_in_progress", task); 
              break;
            }
          case TASK_STATUS_AWAITFEEDBACK:
            {
              renderTaskCardSmall("column_await_feedback", task); 
              break;
            }
          case TASK_STATUS_DONE:
            {
              renderTaskCardSmall("column_done", task);
              break;
            }
          }
        });
  }