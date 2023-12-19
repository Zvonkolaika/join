let tasks = [];

async function init() {
  await includeHTML();
  await loadTasks();
  renderMetricValues();
}

async function loadTasks() {
  try {
    tasks = JSON.parse(await getItem("tasks"));
    console.log(`${tasks.length} tasks successfully loaded`, tasks);
  } catch (e) {
    console.warn("no tasks found on server");
  }
}

function returnTotalTasks() {
  return tasks.length;
}

function returnTasksInProgress() {}

function returnPriorityTasks() {
  let value = 0;
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    if (task["prio"] == 1) value++;
  }
  return value;
}

function returnNextDueDate() {
  const dueDate = new Date(Math.min(...tasks.map((e) => e.date)));
  const dueDateString = dueDate.toLocaleString("default", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return dueDateString;
}

function renderMetricValues() {
  /*   document.getElementById("todo").innerHTML =
  document.getElementById("done").innerHTML = */
  document.getElementById("priority").innerHTML = returnPriorityTasks();
  document.getElementById("deadline").innerHTML = returnNextDueDate();
  document.getElementById("total-tasks").innerHTML = returnTotalTasks();
  /*   document.getElementById("in-progress-tasks").innerHTML =
  document.getElementById("awaiting-feedback-tasks").innerHTML = */
}
