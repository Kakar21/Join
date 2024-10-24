let assignedContacts = [];
let clickedPriority = "medium";
let currentTaskState = "ToDo";


/**
 * Gathers task-related information from user input fields based on the specified context.
 * 
 * @async
 * @param {string} context - The context of the operation ("main" or "edit").
 * @returns {Promise<Object>} An object containing all the task information.
 */
async function getValues(context = "main") {
  let taskId = await createTaskId();
  return {
    "id": taskId,
    "task_title": getTaskTitle(context),
    "description": getTaskDescription(context),
    "contact_ids": getAssignedContacts(),
    "due_date": getDueDate(context),
    "priority": getPriority(),
    "category": getCategory(),
    "subtasks": getSubtask(),
    "subtasks_done": [],
    "state": currentTaskState,
  };
}


/**
 * Generates a unique task ID by iterating through the tasks array retrieved from the backend.
 * Finds the highest existing task ID and increments it by one to ensure the new ID is unique.
 * If no tasks are found, returns 0 as the first task ID.
 * 
 * @async
 * @function createTaskId
 * @returns {Promise<number>} A unique task ID, greater than any existing task ID.
 */
async function createTaskId() {
  let maxId = -1;
  let currentTasks = await getTasksArray();

  if (currentTasks.length === 0) {
    return 0;
  }

  for (let i = 0; i < currentTasks.length; i++) {
    if (currentTasks[i].id > maxId) {
      maxId = currentTasks[i].id;
    }
  }
  return maxId + 1;
}


/**
 * Retrieves the title of the task from the input field, depending on the context.
 * 
 * @param {string} context - The context of task creation ('main' or 'popup').
 * @returns {string} The title of the task.
 */
function getTaskTitle(context) {
  let taskId = context === 'popup' ? "task-title-input-popup" : "task-title-input";
  let taskTitle = document.getElementById(taskId).value;
  return taskTitle;
}


/**
 * Retrieves the description of the task from the textarea field, depending on the context.
 * 
 * @param {string} context - The context of task creation ('main' or 'popup').
 * @returns {string} The description of the task.
 */
function getTaskDescription(context) {
  let descriptionId = context === 'popup' ? "task-description-textarea-popup" : "task-description-textarea";
  let taskDescription = document.getElementById(descriptionId).value;
  return taskDescription;
}


/**
 * Retrieves the IDs and names of contacts assigned to a task.
 * Returns an array of objects, each object containing the ID and name of an assigned contact.
 * 
 * @returns {Array<Object>} An array of objects, each with the structure { id: number, name: string }.
 */
function getAssignedContacts() {
  let assignedContactIds = [];
  for (let i = 0; i < assignedContacts.length; i++) {
    let contact = assignedContacts[i];
    assignedContactIds.push(contact.id);
  }
  return assignedContactIds;
}


/**
 * Retrieves the due date of the task and formats it to dd/mm/yyyy, depending on the context.
 * 
 * @param {string} context - The context of task creation ('main' or 'popup').
 * @returns {string} The formatted due date of the task.
 */
function getDueDate(context) {
  let dueDateId = context === 'popup' ? "due-date-input-popup" : "due-date-input";
  let dueDate = document.getElementById(dueDateId).value;
  let parts = dueDate.split("-");
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  } else {
    return dueDate;
  }
}


/**
 * Retrieves the priority level of the task.
 * 
 * @returns {string} The priority level of the task.
 */
function getPriority() {
  return clickedPriority;
}


/**
 * Retrieves the category of the task.
 * 
 * @returns {string} The category of the task or an empty string if no category is selected.
 */
function getCategory() {
  let categoryDropdown = document.getElementById("categoryDropdown");
  let selectedCategory = categoryDropdown.querySelector(".contactDivClicked");
  if (selectedCategory) {
    return selectedCategory.textContent.trim();
  } else {
    return "";
  }
}


/**
 * Retrieves the list of subtasks.
 * 
 * @returns {Array} An array of subtasks.
 */
function getSubtask() {
  return subtasks;
}