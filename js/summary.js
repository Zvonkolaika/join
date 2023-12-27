let tasks = [];

async function init() {
  await loadTemplates();
  await loadTasks();
  greetUser();
  renderMetricValues();
  setCurrentPageLinkActive("summary");
}

async function loadTasks() {
  try {
    tasks = JSON.parse(await getItem("tasks"));
    convertDueDates();
    console.log(`${tasks.length} tasks successfully loaded`, tasks);
  } catch (e) {
    console.warn("no tasks found on server");
  }
}

function convertDueDates() {
  for (let i = 0; i < tasks.length; i++) {
    let taskDueDate = new Date(tasks[i]["date"]);
    tasks[i]["date"] = taskDueDate;
  }
}

function returnNumberofTasks(key, value) {
  let x = 0;
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    if (task[key] == value) x++;
  }
  return x;
}

function returnTotalTasks() {
  return tasks.length;
}

function returnNextDueDate() {
  const dueDate = new Date(Math.min(...tasks.map((e) => e.date)));

  if (!isNaN(dueDate)) {
    const dueDateString = dueDate.toLocaleString("default", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    return dueDateString;
  } else {
    return "no deadline approaching";
  }
}

function renderMetricValues() {
  document.getElementById("todo").innerHTML = returnNumberofTasks(
    "taskStatus",
    0
  );
  document.getElementById("done").innerHTML = returnNumberofTasks(
    "taskStatus",
    3
  );
  document.getElementById("priority").innerHTML = returnNumberofTasks(
    "prio",
    1
  );
  document.getElementById("deadline").innerHTML = returnNextDueDate();
  document.getElementById("total-tasks").innerHTML = returnTotalTasks();
  document.getElementById("in-progress-tasks").innerHTML = returnNumberofTasks(
    "taskStatus",
    1
  );
  document.getElementById("awaiting-feedback-tasks").innerHTML =
    returnNumberofTasks("taskStatus", 2);
}

function greetUser() {
  let now = new Date();
  let time = now.getHours();

  if (time <= 12)
    document.getElementById("greeting-message").innerHTML = "Good Morning,";
  if (time >= 12)
    document.getElementById("greeting-message").innerHTML = "Good Afternoon,";
  if (time >= 16)
    document.getElementById("greeting-message").innerHTML = "Good Evening,";

  document.getElementById("user-name").innerHTML = currentUser;
}
