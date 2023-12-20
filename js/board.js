let allTasksFromStorage = [];

async function init() {
    await includeHTML();
    setCurrentPageLinkActive('board');
    await loadTasks();

  }


  async function loadTasks() {
    allTasksFromStorage = JSON.parse(await getItem("tasks"));
      console.log(allTasksFromStorage);

      for (let index = 0; index < allTasksFromStorage.length; index++) {
        renderTaskCard(index);
      }
  }