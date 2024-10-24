/**
 * Clears all inputs and selections in the task creation form. It resets the title,
 * description, due date, priority selection, assigned contacts, subtasks, and the 
 * task category to their default states.
 *
 * @param {string} assignedContactsAvatarDiv - The ID of the assigned contacts avatar container.
 * @param {string} SubTasksDiv - The ID of the subtasks container.
 */
function clearForm(assignedContactsAvatarDiv, SubTasksDiv) {
  clearTaskTitle();
  clearTaskDescription();
  clearTaskDueDate();
  clearPriority();
  clearAssignedContact(assignedContactsAvatarDiv);
  clearSubtask(SubTasksDiv);
  clearCategory();
  addstandardPrioMedium();
}


/**
 * Clears the content of the task title input field.
 */
function clearTaskTitle() {
  let tasktitle = document.getElementById("task-title-input");
  tasktitle.value = "";
}


/**
 * Clears the content of the task description textarea.
 */
function clearTaskDescription() {
  let taskDescription = document.getElementById("task-description-textarea");
  taskDescription.value = "";
}


/**
 * Resets the due date input field to empty.
 */
function clearTaskDueDate() {
  let taskDueDate = document.getElementById("due-date-input");
  taskDueDate.value = "";
}


/**
 * Clears the subtask input field and removes all existing subtasks from the list.
 */
function clearSubtask(SubTasksDiv) {
  let subTaskInput = document.getElementById("subtask-input");
  subTaskInput.value = "";
  subtasks = [];
  updateSubtaskList(SubTasksDiv);
}


/**
 * Clears all selected contacts for task assignment. 
 * It iterates through the clicked states array, 
 * resets each selected contact, and updates the avatar display accordingly.
 */
function clearAssignedContact(assignedContactsAvatarDiv) {
  assignedContacts = [];
  clickedStates.forEach(state => {
    clearContact(Object.keys(state), assignedContactsAvatarDiv)
  })
  updateAvatars(assignedContactsAvatarDiv);
}


/**
 * Clears the selected task priority. 
 * It resets the clickedPriority variable to an empty string 
 * and calls resetPriorityClasses to update the UI accordingly.
 */
function clearPriority() {
  clickedPriority = "";
  resetPriorityClasses();
}


/**
 * Clears the selected category from the category dropdown. 
 * If a category is selected (highlighted), it removes the highlighting class. 
 * It also resets the category input field to its default placeholder value.
 */
function clearCategory() {
  const categoryDropdown = document.getElementById("categoryDropdown");
  const selectedCategory = categoryDropdown.querySelector(".contactDivClicked");

  if (selectedCategory) {
    removeClass(selectedCategory, "contactDivClicked");
  }

  const addCategoryInput = document.getElementById("add-category-input");
  addCategoryInput.value = "Select task category";
}