/**
 * Initializes the selection state of a contact in the clickedStates array.
 *
 * @param {number} index - Index of the contact.
 */
function initializeClickedState(index) {
  if (getClickStateById(index) === undefined) {
    setClickStateById(index, false)
  }
}


/**
 * Sets the selection state of a contact in the clickedStates array.
 *
 * @param {number} index - Index of the contact.
 * @param {boolean} value - Selection state to set (true for selected, false for not selected).
 */
function updateClickedState(index, value) {
  setClickStateById(index, value)
}


function getClickStateById(id) {
  const stateObject = clickedStates.find(state => state.hasOwnProperty(id));
  return stateObject ? stateObject[id] : undefined;
}

function setClickStateById(id, value) {
  clickedStates = clickedStates.map(state => {
      if (state.hasOwnProperty(id)) {
          return { [id]: value }; // Ändere den Wert für das spezifische id
      }
      return state; // Unveränderte Einträge zurückgeben
  });
}


/**
 * Adds a CSS class to a DOM element.
 *
 * @param {Element} element - The element to which the class will be added.
 * @param {string} className - The class name to add.
 */
function assignClass(element, className) {
  element.classList.add(className);
}


/**
 * Removes a specified CSS class from a DOM element.
 *
 * @param {Element} element - The element from which the class will be removed.
 * @param {string} className - The class name to remove.
 */
function removeClass(element, className) {
  element.classList.remove(className);
}


/**
 * Sets the 'src' attribute of an image element.
 *
 * @param {Element} element - The image element.
 * @param {string} src - The source URL.
 */
function changeSrc(element, src) {
  element.src = src;
}


/**
 * Toggles the visibility of an element using the 'd-none' CSS class and changes the arrow image source.
 *
 * @param {string} elementId - ID of the DOM element to be toggled.
 * @param {string} arrowId - ID of the arrow image element.
 */
function switchVisibility(elementId, arrowId) {
  const element = document.getElementById(elementId);
  const arrowDown = document.getElementById(arrowId);

  // Toggle the visibility of the element
  if (element.classList.contains("d-none")) {
    element.classList.remove("d-none");
    arrowDown.src = './assets/img/Desktop/add-task/arrow_dropdown_up.svg';
  } else {
    element.classList.add("d-none");
    arrowDown.src = './assets/img/Desktop/add-task/arrow_dropdown_down.svg';
  }
}


/**
 * Sets the priority level for a task.
 *
 * @param {string} priority - The priority level to be set.
 */
function setPriority(priority) {
  clickedPriority = priority;
}


/**
 * Adds a contact to the list of assigned contacts and updates the avatars display.
 *
 * @param {Object} contact - The contact object to add.
 * @param {string} container - The ID of the container for avatars display.
 */
function addAvatar(contact, container) {
  assignedContacts.push(contact);
  updateAvatars(container);
}


/**
 * Updates the display of assigned contact avatars.
 *
 * @param {string} container - The ID of the container for avatars display.
 */
function updateAvatars(container) {
  let avatarContainer = document.getElementById(container);
  avatarContainer.innerHTML = ""; 

  assignedContacts.forEach(contact => {
    let avatarHTML = generateAvatar(contact);
    avatarContainer.innerHTML += avatarHTML;
  })
}


/**
 * Removes a contact from the list of assigned contacts and updates the avatars display.
 * 
 * @param {Object} contact - The contact object to remove.
 * @param {string} container - The ID of the container for avatars display.
 */
function removeAvatar(contact, container) {
  const index = assignedContacts.indexOf(contact);
  if (index !== -1) {
    assignedContacts.splice(index, 1);
    updateAvatars(container);
  }
}


/**
 * Opens a dropdown menu and updates its visual state.
 * 
 * @param {string} dropdownId - The ID of the dropdown menu.
 * @param {string} inputfieldId - The ID of the input field associated with the dropdown.
 * @param {string} svgId - The ID of the SVG icon used in the dropdown.
 */
function openDropdownState(dropdownId, svgId) {
  const dropdown = document.getElementById(dropdownId);
  const arrowImage = document.getElementById(svgId);
  openDropdown(dropdown, arrowImage);
}


/**
 * Closes a dropdown menu and resets its visual state.
 * 
 * @param {string} dropdownId - The ID of the dropdown menu.
 * @param {string} inputfieldId - The ID of the input field associated with the dropdown.
 * @param {string} svgId - The ID of the SVG icon used in the dropdown.
 */
function closeDropdownState(dropdownId, svgId) {
  const dropdown = document.getElementById(dropdownId);
  const arrowImage = document.getElementById(svgId);
  closeDropdown(dropdown, arrowImage);
}


/**
 * Checks if a given field is empty.
 * 
 * @param {Element} field - The input field element to check.
 * @returns {boolean} True if the field is empty, false otherwise.
 */
function isFieldEmpty(field) {
  return field.value.trim() === "";
}


/**
 * Displays a warning message by removing the 'invisible' class from the element.
 * 
 * @param {Element} warningElement - The warning message element to display.
 */
function showWarning(warningElement) {
  warningElement.classList.remove("invisible");
}


/**
 * Hides a warning message by adding the 'invisible' class to the element.
 * 
 * @param {Element} warningElement - The warning message element to hide.
 */
function hideWarning(warningElement) {
  warningElement.classList.add("invisible");
}


/**
 * Checks if a dropdown menu is unselected.
 * 
 * @param {Element} dropdown - The dropdown menu element to check.
 * @returns {boolean} True if the dropdown is unselected, false otherwise.
 */
function isDropdownUnselected(dropdown) {
  return dropdown.value === "Select task category" || dropdown.value.trim() === "";
}


/**
 * Validates the content of a specified input field and displays a warning if it's empty.
 * Adds a visual indication for invalid fields.
 * 
 * @param {string} inputId - The ID of the input field to validate.
 * @param {string} warningId - The ID of the warning element associated with the input field.
 * @returns {boolean} True if the input field is valid, false otherwise.
 */
function validateField(inputId, warningId) {
  const inputElement = document.getElementById(inputId);
  const isValid = !isFieldEmpty(inputElement);

  document.getElementById(warningId).style.visibility = isValid ? 'hidden' : 'visible';
  const elementToUpdate = inputElement.closest('.input-div') || inputElement;
  elementToUpdate.classList.toggle("invalid-field", !isValid);

  return isValid;
}


/**
 * Validates the selection of a dropdown menu and displays a warning if unselected.
 * Adds a visual indication for unselected dropdowns.
 * 
 * @param {string} inputId - The ID of the dropdown menu to validate.
 * @param {string} warningId - The ID of the warning element associated with the dropdown.
 * @returns {boolean} True if the dropdown selection is valid, false otherwise.
 */
function validateDropdown(inputId, warningId) {
  const dropdownElement = document.getElementById(inputId);
  const isValid = !isDropdownUnselected(dropdownElement);

  document.getElementById(warningId).style.visibility = isValid ? 'hidden' : 'visible';
  const elementToUpdate = dropdownElement.closest('.input-div') || dropdownElement;
  elementToUpdate.classList.toggle("invalid-field", !isValid);

  return isValid;
}


/**
 * Creates and stores a new task based on user inputs.
 * This function retrieves current tasks, adds a new task to the array, 
 * and updates the backend storage. It also clears the input form upon completion.
 * 
 * @async
 * @function createTask
 * @param {Object} context - The context object containing user inputs.
 */
async function createTask(context) {
  let currentTasks = await getTasksArray();
  let newTask = await getValues(context); // Kontext an getValues übergeben

  try {
    currentTasks.push(newTask);
    await postItem('tasks', newTask);
  } catch (error) {
    console.error('Fehler beim Erstellen der Aufgabe: ', error);
  }
}


/**
 * Toggles the state of a dropdown menu between open and closed.
 * 
 * @param {string} dropdownId - The ID of the dropdown menu.
 * @param {string} inputfieldId - The ID of the input field associated with the dropdown.
 * @param {string} svgId - The ID of the SVG icon used in the dropdown.
 */
function toggleDropdown(dropdownId, svgId) {
  if (dropdownState === "closed") {
    openDropdownState(dropdownId, svgId);
  } else {
    closeDropdownState(dropdownId, svgId);
  }
}


/**
 * Handles the click event on an assigned contact.
 * 
 * @param {number} index - The index of the contact in the contacts array.
 * @param {string} container - The ID of the container element to update.
 */
function handleClickOnAssignedContact(index, container) {
  toggleContact(index, container);
  updateAvatars(container);
}


/**
 * Updates the clicked state of a contact and modifies its visual representation.
 * 
 * @param {Element} div - The contact element to toggle.
 * @param {Element} img - The image element to update.
 * @param {boolean} clicked - The new clicked state.
 * @param {string} src - The source path for the image.
 */
function handleClickedState(div, img, clicked, src) {
  // Toggles the contact's visual representation and updates the image source
  div.classList.toggle("contactDivClicked", clicked);
  img.src = src;
}