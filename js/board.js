/**
 * Initializes a variable to track the currently dragged element.
 * 
 * @type {Element}
 */
let currentDragedElement;


/**
 * An array of task states.
 * 
 * @type {string[]}
 */
const states = ["InProgress", "Done", "AwaitFeedback", "ToDo"];


/**
 * Asynchronously loads the task board.
 * 
 * @async
 * @function loadBoard
 */
async function loadBoard() {
  await setTasks();
  await loadContacts();
  renderTasks();
}


/**
 * Asynchronously sets the tasks array by retrieving tasks from storage.
 * If tasks exist in storage, it assigns them to the 'tasks' variable; otherwise, it initializes an empty array.
 * Logs the tasks to the console.
 * 
 * @async
 * @function setTasks
 */
async function setTasks() {
  let tasksToSet = await getTasksArray();
  if (Array.isArray(tasksToSet)) {
    tasks = tasksToSet;
  } else {
    tasks = [];
  }
}


/**
 * Sorts tasks and renders them in their respective containers based on their state.
 * Displays a message indicating there are no tasks in each container if there are no tasks.
 */
function renderTasks() {
  const containerIds = [
    "ToDoContainer",
    "InProgressContainer",
    "AwaitFeedbackContainer",
    "DoneContainer",
  ];
  containerIds.forEach((id) => (document.getElementById(id).innerHTML = ""));
  if (tasks.length > 0) {
    tasks.forEach((task) => renderTaskCard(task.state, task.id));
    
  } else {
    containerIds.forEach(addNoTaskHTML);
  }
}



/**
 * Renders a task card and adds it to the appropriate task container based on its status.
 *
 * @param {string} taskStatus - The status of the task (ToDo, InProgress, AwaitFeedback, Done).
 * @param {number} taskIndex - The index of the task in the tasks array.
 */
function renderTaskCard(taskStatus, taskIndex) {
  const containerId = `${taskStatus}Container`;
  const container = document.getElementById(containerId);
  const task = getTaskFromId(taskIndex);

  container.innerHTML += generateTaskCardHTML(task, taskIndex);

  checkAndAddTasks(tasks);
  addTaskIcon(`cardIcon${taskIndex}`, taskIndex);
  addProgressBar(taskIndex);
}



function getTaskFromId(id) {
  return tasks.find(task => task['id'] == id)
}

/**
 * Opens and displays a detailed card for a task.
 *
 * @param {number} taskIndex - The index of the task in the tasks array.
 */
function openCard(taskIndex) {
  const content = document.getElementById(`openCard`);
  content.innerHTML = "";
  const openCardContainer = document.getElementById("openCardContainer");
  openCardContainer.classList.remove("hidden");
  let categoryName = getTaskFromId(taskIndex)["category"];

  content.innerHTML = generateOpenCardHTML(taskIndex, categoryName);
  addOpenTaskIcon(`openCardIcon${taskIndex}`, taskIndex);
  addTransition();
  addOpenCardSubtasks(taskIndex);
  setTimeout(() => {
    cardIsOpened = true;
  }, 100);
}


/**
 * Opens and displays an editable card for a task, allowing for task details modification.
 *
 * @async
 * @param {number} taskIndex - The index of the task in the tasks array.
 */
async function editCard(taskIndex) {
  const card = document.getElementById(`openCard`);
  card.innerHTML = generateEditCardHTML(taskIndex);
  await loadContacts();
  await generateAssignContacts("assignDropdown-popup", "assigned-contacts-popup");
  setValuesInEditCard(taskIndex, "subTasks-popup");
  isEditFormOpened = true;

  setupDropdownCloseListener("assignDropdown-popup", "add-contact-input-popup", "arrowAssign-popup");
  setupFilterListener("add-contact-input-popup", "assignDropdown-popup");

  toggleDropdown("assignDropdown-popup", "add-contact-input-popup", "arrowAssign-popup", "Select contacts to assign");
  setClickedContacts(taskIndex, "assigned-contacts-popup");
  toggleDropdown("assignDropdown-popup", "add-contact-input-popup", "arrowAssign-popup", "Select contacts to assign");
  clickPriority(taskIndex);
}


/**
 * Adds subtasks to the open task card.
 *
 * @param {number} taskIndex - The index of the task in the tasks array.
 */
function addOpenCardSubtasks(taskIndex) {
  let content = document.getElementById(`openCardSubtasks${taskIndex}`);
  content.innerHTML = "";

  getTaskFromId(taskIndex)["subtasks"].forEach((subtask, i) => {
    content.innerHTML += createIncompleteSubtaskHTML(subtask, i, taskIndex);
  });

  getTaskFromId(taskIndex)["subtasks_done"].forEach((subtask, y) => {
    content.innerHTML += createCompleteSubtaskHTML(subtask, y, taskIndex);
  });

  if (content.innerHTML === "") {
    document.getElementById('opencardSubtaskTitle').parentNode.style.display = 'none';
  }
}


/**
 * Marks a subtask as complete and moves it to the "Done" section.
 *
 * @param {number} i - Index of the subtask to mark as complete.
 * @param {number} taskIndex - Index of the task containing the subtask.
 */
async function subtaskComplete(i, taskIndex) {
  let content = document.getElementById(`subtask${i}`);
  const subtask = getTaskFromId(taskIndex)["subtasks"][i];
  content.innerHTML = createCompleteSubtaskHTML(subtask, i, taskIndex);

  moveSubtaskToDone(i, taskIndex);
  await setItem("tasks", tasks);
  addOpenCardSubtasks(taskIndex);
}


/**
 * Marks a completed subtask as incomplete and moves it back to the "To Do" subtasks list.
 *
 * @param {number} i - Index of the completed subtask to mark as incomplete.
 * @param {number} taskIndex - Index of the task containing the subtasks.
 */
async function subtaskUnComplete(i, taskIndex) {
  let content = document.getElementById(`subtasks_done${i}`);
  const subtask = getTaskFromId(taskIndex)["subtasks_done"][i];
  content.innerHTML = createIncompleteSubtaskHTML(subtask, i, taskIndex);

  moveSubtaskToNotDone(i, taskIndex);
  await setItem("tasks", tasks);
  addOpenCardSubtasks(taskIndex);
}


/**
 * Moves a subtask from the "To Do" subtasks list to the "Done" subtasks list of a task.
 *
 * @param {number} subTaskIndex - Index of the subtask to move.
 * @param {number} taskIndex - Index of the task containing the subtasks.
 */
function moveSubtaskToDone(subTaskIndex, taskIndex) {
  let subTaskToRemove = getTaskFromId(taskIndex)["subtasks"][subTaskIndex];
  getTaskFromId(taskIndex)["subtasks"].splice(subTaskIndex, 1);
  getTaskFromId(taskIndex)["subtasks_done"].push(subTaskToRemove);
  addOpenCardSubtasks(taskIndex);
}


/**
 * Moves a subtask from the "Done" subtasks list to the "To Do" subtasks list of a task.
 *
 * @param {number} subTaskIndex - Index of the subtask to move.
 * @param {number} taskIndex - Index of the task containing the subtasks.
 */
function moveSubtaskToNotDone(subTaskIndex, taskIndex) {
  let subTaskToUndo = getTaskFromId(taskIndex)["subtasks_done"][subTaskIndex];
  getTaskFromId(taskIndex)["subtasks_done"].splice(subTaskIndex, 1);
  getTaskFromId(taskIndex)["subtasks"].push(subTaskToUndo);
  addOpenCardSubtasks(taskIndex);
}


/**
 * Closes the open task card and hides it from the view.
 *
 * @param {boolean} deleted - Indicates whether the card was deleted or not.
 */
function closeCard(deleted) {
  const transitionDiv = document.getElementById("openCard");
  const div = document.getElementById("openCardContainer");

  if (deleted) {
    div.classList.add("hidden");
  } else {
    div.style.animation = "blendOut 100ms ease-out forwards";
    transitionDiv.style.animation = "slideOutCard 100ms ease-out forwards";
    setTimeout(() => {
      div.classList.add("hidden");
    }, 100);
  }

  isEditFormOpened = cardIsOpened = false;
  renderTasks();
}


/**
 * Highlights the appropriate hover containers based on the given container ID.
 * Also, removes the "No Task" message from the related hover containers.
 *
 * @param {string} containerId - The ID of the container to highlight.
 */
function highlight(containerId) {
  const hoverMap = {
      "ToDo": ["InProgress"],
      "InProgress": ["ToDo", "AwaitFeedback"],
      "AwaitFeedback": ["InProgress", "Done"],
      "Done": ["AwaitFeedback"]
  };

  hideAllHoverContainers();
  const relatedContainers = hoverMap[containerId] || [];
  relatedContainers.forEach(container => {
      updateHoverContainer(container);
      removeNoTaskHTML(container);
  });
}


/**
 * Hides all hover containers.
 */
function hideAllHoverContainers() {
  const hoverContainers = ["ToDo", "InProgress", "AwaitFeedback", "Done"];
  hoverContainers.forEach(containerId => {
      const container = document.getElementById(containerId + "HoverContainer");
      if (container) {
          container.classList.add("d-none");
      }
  });
}


/**
 * Shows a specific hover container based on the provided container ID.
 *
 * @param {string} containerId - The ID of the container to show.
 */
function updateHoverContainer(containerId) {
  const hoverContainer = document.getElementById(containerId + "HoverContainer");
  if (hoverContainer) {
      hoverContainer.classList.remove("d-none");
      // removeNoTaskHTML(containerId); // Only call if the hoverContainer exists
  }
}


/**
 * Adds a "No Task" message to the specified container based on its ID.
 *
 * @param {string} containerId - The ID of the container where the message should be added.
 */
function addNoTaskHTML(containerId) {
  const messages = {
    ToDoContainer: "No tasks to do",
    InProgressContainer: "No tasks in progress",
    AwaitFeedbackContainer: "No tasks awaiting feedback",
    DoneContainer: "No completed tasks",
  };

  const message = messages[containerId];
  document.getElementById(containerId).innerHTML = createNoTaskHTML(message);
}


/**
 * Removes the "No Task" message from the container if it's displayed.
 *
 * @param {string} state - The state of the task container ('ToDo', 'InProgress', 'AwaitFeedback', or 'Done').
 */
function removeNoTaskHTML(state) {
  const container = document.getElementById(state + 'Container');
  if (container && container.parentNode) {
    const hasTasks = tasks.some((task) => task.state === state);

    if (!hasTasks) {
      container.innerHTML = ''; // Remove the "No Task" message
      container.parentNode.style = 'gap: 0;'; // Apply specific style when empty
    } else {
      container.parentNode.style = '';
    }
  }
}


/**
 * Creates HTML for displaying a "No Task" message with the specified message text.
 *
 * @param {string} message - The message text to display.
 * @returns {string} HTML string for the "No Task" message.
 */
function createNoTaskHTML(message) {
  return /*html*/ `
        <div class="noTaskFound noselect">
            <p>${message}</p>
        </div>
    `;
}


/**
 * Opens the add task menu and sets the current task state based on the selected state.
 * If the window width is less than 1000 pixels, it redirects to the "add-task.html" page.
 * Otherwise, it displays the add task menu with a sliding animation.
 *
 * @param {string} state - The selected task state ("ToDo", "InProgress", "AwaitFeedback", "Done").
 */
function openAddTaskMenu(state) {
  currentTaskState = state;
  const div = document.getElementById("animationDiv");
  div.classList.remove("hidden");
  div.style = "animation: blendIn 100ms ease-in-out forwards";

  const transitionDiv = document.getElementById("transition");
  transitionDiv.style = "animation: slideInAddNew 100ms ease-in-out forwards;";
}


/**
 * Hides the add task menu with an animation and clears the form.
 *
 * @param {string} assignedContactsAvatarDivId - The ID of the assigned contacts avatar div.
 */
function hideAddTaskMenu(assignedContactsAvatarDivId) {
  const transitionDiv = document.getElementById("transition");
  const animationDiv = document.getElementById("animationDiv");

  animationDiv.style.animation = "blendOut 100ms ease-in-out forwards";
  transitionDiv.style.animation = "slideOutAddNew 100ms ease-in-out forwards";

  setTimeout(() => {
    animationDiv.classList.add("hidden");
  }, 100);

  clearForm(assignedContactsAvatarDivId, "subTasks");
}


/**
 * Deletes the currently open card from the tasks list, sorts the tasks, and closes the card.
 * Also updates the tasks data in storage.
 *
 * @async
 * @param {number} i - The index of the task to delete.
 */
async function deleteOpenCard(i) {
  task = getTaskFromId(i);
  tasks.splice(tasks.indexOf(task), 1);
  renderTasks();
  closeCard(true);
  await deleteItem("tasks", task);
}