const categorys = ["Technical Task", "User Story"];

let dropdownState = "closed";
let clickedStates = [];
let dropdownCloseListener;
let filterListener;


/**
 * Initializes the Add Task page by loading necessary components. It generates the 
 * list of assignable contacts, the category options for tasks, and sets up listeners 
 * for handling dropdown interactions and filtering contacts.
 */
async function loadAddTaskPage() {
  await loadContacts();
  generateAssignContacts('assignDropdown', 'assigned-contacts');
  generateCategoryOptions();
  setupDropdownCloseListener('assignDropdown', 'add-contact-input', 'arrowAssign');
  setupFilterListener('add-contact-input', 'assignDropdown');
}


/**
 * Initializes the Add Task page by loading necessary components. It generates the 
 * list of assignable contacts, the category options for tasks, and sets up listeners 
 * for handling dropdown interactions and filtering contacts.
 */
function loadFromAddTaskPage() {
  generateCategoryOptions();
}


/**
 * Clears all tasks in the backend by setting the 'tasks' storage item to an empty array.
 * 
 * @async
 */
async function clearAllTasksInBackend() { //DO NOT DELETE THIS FUNCTION
  try {
    await setItem('tasks', []);
    console.log('All tasks have been successfully cleared.');
  } catch (error) {
    console.error('Error while clearing tasks: ', error);
  }
}


/**
 * Validates form fields and creates a task if all validations pass. 
 * Triggers an animation indicating task addition and redirects to the board page after a delay.
 * 
 * @async
 * @param {string} assignedContactsAvatarDiv - ID of the div with avatars of assigned contacts.
 * @param {string} subTaskDiv - ID of the subTaskDiv.
 */
async function validateAndCreateTask(assignedContactsAvatarDiv, subTaskDiv) {
  if (!currentTaskState) {
    currentTaskState = "ToDo";
  }

  let isValidTitle = validateField("task-title-input", "requiredTextTitle");
  let isValidDescription = validateField("task-description-textarea", "requiredTextDescription");
  let isValidDueDate = validateField("due-date-input", "requiredTextDueDate");
  let isValidCategory = validateDropdown("add-category-input", "requiredTextCategory");

  if (isValidTitle && isValidDescription && isValidDueDate && isValidCategory) {
    await createTask("main");
    clearForm(assignedContactsAvatarDiv, subTaskDiv);
    animateTaskAdded();
    setTimeout(function () {
      window.location.href = 'board.html';
    }, 250);
    
    currentTaskState = 'ToDo';
  }
}


/**
 * Validates form fields in the add-task popup window and creates a task if all validations pass.
 * Triggers an animation indicating task addition and closes the popup after a short delay.
 * 
 * @async
 * @param {string} assignedContactsAvatarDiv - ID of the div with avatars of assigned contacts.
 * @param {string} subTaskDiv - ID of the subTaskDiv.
 * @param {string} context - Context in which the function is called.
 */
async function validateAndCreateTaskPopup(assignedContactsAvatarDiv, subTaskDiv, context) {
  let isValidTitle = validateField("task-title-input", "requiredTextTitle"),
      isValidDescription = validateField("task-description-textarea", "requiredTextDescription"),
      isValidDueDate = validateField("due-date-input", "requiredTextDueDate"),
      isValidCategory = validateDropdown("add-category-input", "requiredTextCategory");

  if (isValidTitle && isValidDescription && isValidDueDate && isValidCategory) {
    await createTask(context);
    clearForm(assignedContactsAvatarDiv, subTaskDiv);
    setTimeout(() => hideAddTaskMenu(assignedContactsAvatarDiv), 150);
    currentTaskState = 'ToDo';
    loadBoard();
  }
}


/**
 * Validates the format of the due date entered in the input field.
 * Alerts the user and clears the input field if the format is not dd/mm/yyyy.
 */
function validateDueDate() {
  const dueDateInput = document.getElementById("due-date-input");
  const datePattern = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!datePattern.test(dueDateInput.value)) {
    alert("Ungültiges Datumsformat. Bitte verwenden Sie das Format dd/mm/yyyy.");
    dueDateInput.value = "";
  }
}


/**
 * Handles the selection state for task category options.
 * Only the clicked category option has the 'contactDivClicked' class for styling.
 * Updates the category input with the selected category's text.
 * 
 * @param {number} index - The index of the category option that was clicked.
 */
function switchTaskCategoryClickedState(index) {
  const element = document.getElementById(`categoryOption${index}`);
  const categoryOptions = document.getElementsByClassName("categoryDiv");

  for (const option of categoryOptions) {
    removeClass(option, "contactDivClicked");
  }

  assignClass(element, "contactDivClicked");
  const selectedCategory = element.textContent;
  updateCategoryInput(selectedCategory);
}


/**
 * Updates the category input field with the selected category and hides the category dropdown.
 * 
 * @param {string} selectedCategory - The category selected by the user.
 */
function updateCategoryInput(selectedCategory) {
  const categoryInput = document.getElementById("add-category-input");
  const categoryDropdown = document.getElementById("categoryDropdown");

  categoryInput.value = `${selectedCategory}`;
  categoryDropdown.classList.add("d-none");
}


/**
 * Toggles the selection state of a contact in the 'assign to' dropdown.
 * Updates the appearance based on selection and updates the clicked state array.
 * 
 * @param {number} index - The index of the contact in the contacts array.
 * @param {string} container - The ID of the container where assigned contacts are displayed.
 */
function toggleContact(index, container) {
  initializeClickedState(index);
  const contactDiv = document.getElementById(`contact${index}`);
  const checkboxImg = document.getElementById(`checkbox${index}`);
  const isClicked = getClickStateById(index);
  const contact = getContactFromId(index);
  if (isClicked) {
    handleClickedState(contactDiv, checkboxImg, false, "./assets/img/Desktop/add-task/check_button.svg");
    removeAvatar(contact, container);
  } else {
    handleClickedState(contactDiv, checkboxImg, true, "./assets/img/Desktop/add-task/check button_checked_white.svg");
    addAvatar(contact, container);
  }
  updateClickedState(index, !isClicked);
}



function clearContact(index, container) {
  initializeClickedState(index);
  const contactDiv = document.getElementById(`contact${index}`);
  const checkboxImg = document.getElementById(`checkbox${index}`);
  const contact = getContactFromId(index);
  handleClickedState(contactDiv, checkboxImg, false, "./assets/img/Desktop/add-task/check_button.svg");
  removeAvatar(contact, container);
  updateClickedState(index, false);
}


/**
 * Opens a dropdown menu, clears the selected element's value, sets the dropdown state to 'open',
 * and changes the arrow image to indicate the dropdown is open.
 * 
 * @param {HTMLElement} dropdown - The dropdown element to be opened.
 * @param {HTMLElement} selectedElement - The element whose value is to be cleared.
 * @param {HTMLElement} arrowImage - The image element used as an arrow indicator.
 */
function openDropdown(dropdown, arrowImage) {
  dropdown.classList.remove("d-none");
  dropdownState = "open";
  arrowImage.src = "assets/img/Desktop/add-task/arrow_dropdown_up.svg";
}


/**
 * Closes a dropdown menu, sets the input field value, changes the dropdown state to 'closed',
 * and updates the arrow image to indicate the dropdown is closed.
 * 
 * @param {HTMLElement} dropdown - The dropdown element to be closed.
 * @param {HTMLElement} inputfield - The input field whose value is to be set.
 * @param {HTMLElement} arrowImage - The image element used as an arrow indicator.
 */
function closeDropdown(dropdown, arrowImage) {
  dropdown.classList.add("d-none");
  dropdownState = "closed";
  arrowImage.src = "./assets/img/Desktop/add-task/arrow_dropdown_down.svg";
}


/**
 * Generates and populates the 'assign to' dropdown menu with contact options.
 * Initializes the clickedStates array with false for each contact.
 * 
 * @param {string} dropdownId - The ID of the dropdown element.
 * @param {string} container - The ID of the container where assigned contacts are displayed.
 */
async function generateAssignContacts(dropdownId, container) {
  let dropdowncontainer = document.getElementById(`${dropdownId}`);
  dropdowncontainer.innerHTML = "";
  
  for (let i = 0; i < contacts.length; i++) {
    const selectableContact = contacts[i];
    dropdowncontainer.innerHTML += generateAssignContactsHTML(selectableContact, selectableContact.id, container);
  }

  clickedStates = contacts.map(contact => {
    return { [contact.id]: false };
  });
}


/**
 * Populates the 'category' dropdown menu with predefined category options.
 */
async function generateCategoryOptions() {
  let dropdowncontainer = document.getElementById("categoryDropdown");
  dropdowncontainer.innerHTML = "";
  for (let i = 0; i < categorys.length; i++) {
    let category = categorys[i].trim();
    dropdowncontainer.innerHTML += generateCategoryOptionsHTML(category, i);
  }
}


/**
 * Filters the contacts in the dropdown menu based on user input.
 * Displays only contacts matching the typed value.
 * 
 * @param {string} inputfieldId - The ID of the input field used for filtering.
 * @param {string} dropDownId - The ID of the dropdown that displays filtered results.
 */
function filterContacts(inputfieldId, dropDownId) {
  const input = document.getElementById(inputfieldId);
  const value = input.value.toLowerCase();
  const dropdown = document.getElementById(dropDownId);
  const contacts = dropdown.getElementsByClassName("contactDiv");

  for (const contact of contacts) {
    const name = contact.textContent.toLowerCase();
    contact.style.display = name.includes(value) ? "flex" : "none";
  }
}


/**
 * Creates a closure function to handle the closing of a dropdown menu.
 * This function checks if the click event occurred outside the dropdown, input field, or arrow image.
 * If the click is outside these elements, it closes the dropdown menu.
 *
 * @param {string} dropdownId - The ID of the dropdown element.
 * @param {string} inputfieldId - The ID of the input field associated with the dropdown.
 * @param {string} arrowId - The ID of the arrow image used to toggle the dropdown.
 * @returns {Function} A function that takes an event and closes the dropdown if the event target is outside the dropdown elements.
 */
function createDropdownCloseListener(dropdownId, inputfieldId, arrowId) {
  return function (event) {
    const dropdown = document.getElementById(dropdownId);
    const inputField = document.getElementById(inputfieldId);
    const arrowImage = document.getElementById(arrowId);

    if (!dropdown.contains(event.target) && event.target !== inputField && event.target !== arrowImage) {
      closeDropdown(dropdown, arrowImage);
    }
  };
}


/**
 * Creates a closure function for filtering contacts based on the input field's value.
 * This function is triggered on 'input' event and calls `filterContacts` with specified IDs.
 *
 * @param {string} inputfieldId - The ID of the input field used for filtering.
 * @param {string} dropDownId - The ID of the dropdown that displays filtered results.
 * @returns {Function} A function that triggers the filtering of contacts.
 */
function createFilterListener(inputfieldId, dropDownId) {
  return function () {
    filterContacts(inputfieldId, dropDownId);
  };
}


/**
 * Sets up a global listener for closing a dropdown menu.
 * This listener is added to the document and triggers the closing of the dropdown when a click occurs outside its elements.
 *
 * @param {string} dropdownId - The ID of the dropdown element.
 * @param {string} inputfieldId - The ID of the input field associated with the dropdown.
 * @param {string} arrowId - The ID of the arrow image used to toggle the dropdown.
 */
function setupDropdownCloseListener(dropdownId, inputfieldId, arrowId) {
  dropdownCloseListener = createDropdownCloseListener(dropdownId, inputfieldId, arrowId);
  document.addEventListener("click", dropdownCloseListener, true);
}


/**
 * Sets up a listener for the input event on a specified input field.
 * This listener is used for filtering contacts based on the input value.
 *
 * @param {string} inputfieldId - The ID of the input field used for filtering.
 * @param {string} dropDownId - The ID of the dropdown that displays filtered results.
 */
function setupFilterListener(inputfieldId, dropDownId) {
  filterListener = createFilterListener(inputfieldId, dropDownId);
  const inputField = document.getElementById(inputfieldId);
  inputField.addEventListener("input", filterListener, true);
}


/**
 * Removes event listeners from the specified input field and the document.
 * Designed to remove the global `dropdownCloseListener` and `filterListener`.
 * 
 * @param {string} inputfieldId - The ID of the input field from which the filter listener should be removed.
 */
function removeListeners(inputfieldId) {
  if (dropdownCloseListener) {
    document.removeEventListener("click", dropdownCloseListener, true);
    dropdownCloseListener = null;
  }

  const inputField = document.getElementById(inputfieldId);
  if (filterListener && inputField) {
    inputField.removeEventListener("input", filterListener, true);
    filterListener = null;
  }
}


/**
 * Initiates an animation to indicate that a task has been successfully added.
 * It targets the task-added-container element and adds a CSS class to control the animation.
 */
function animateTaskAdded() {
  const taskAddedContainer = document.querySelector('.task-added-container');
  taskAddedContainer.classList.add('task-added-animate');
}