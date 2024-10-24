let taskFound = false;


/**
 * Formats a given text into a category class name by removing spaces.
 *
 * @param {string} text - The text to format.
 * @returns {string} A formatted category class name.
 */
function category(text) {
   return 'header' + text.replace(/\s/g, '');
}


/**
 * Truncates the text to a specified length, ending at the last complete word within the limit.
 *
 * @param {string} text - The text to be truncated.
 * @param {number} [maxLength=40] - Maximum length of the truncated text.
 * @returns {string} Truncated text ending with an ellipsis if it exceeds the specified length.
 */
function addDescription(text, maxLength = 40) {
   if (text.length <= maxLength) {
      return text;
   }

   let truncatedText = text.substring(0, maxLength);
   const lastSpaceIndex = truncatedText.lastIndexOf(' ');

   if (lastSpaceIndex !== -1) {
      truncatedText = truncatedText.substring(0, lastSpaceIndex);
   }

   return truncatedText + '...';
}


/**
 * Adds a progress bar to a task card based on the completion of subtasks.
 *
 * @param {number} i - The index of the task in the tasks array.
 */
function addProgressBar(i) {
   let task = getTaskFromId(i)['subtasks'].length + getTaskFromId(i)['subtasks_done'].length;
   if (task > 0) {
      let calculatetSubtask = 100 / task;
      calculatetSubtask = calculatetSubtask * getTaskFromId(i)['subtasks_done'].length;
      content = document.getElementById(`progressbar${i}`);
      content.innerHTML = /*html*/ `
                <progress max="100" value="${calculatetSubtask}"></progress>
                <span>${getTaskFromId(i)['subtasks_done'].length}/${task} Subtasks</span>
                `;
   } else {
      document.getElementById(`progressbar${i}`).remove();
   }
}


/**
 * Sets the priority of the task to match the specified priority.
 *
 * @param {number} taskIndex - The index of the task in the tasks array.
 */
function clickPriority(taskIndex) {
   let setPriority = getTaskFromId(taskIndex).priority;
   setPrio(setPriority);
}


/**
 * Adds icons for assigned contacts to the open card.
 *
 * @param {string} id - The ID of the HTML element where icons will be added.
 * @param {number} x - The index of the task in the tasks array.
 */
function addOpenTaskIcon(id, x) {
   let content = document.getElementById(id);
   getTaskFromId(x)['assigned_to'].forEach((assignedContact) => {
      let contact = contacts.find((c) => c.id === assignedContact.id);
      if (contact) {
         content.innerHTML += createContactIcon(contact);
      }
   });
}


/**
 * Adds icons for assigned contacts to a task card.
 *
 * @param {string} id - The ID of the HTML element where icons will be added.
 * @param {number} x - The index of the task in the tasks array.
 */
function addTaskIcon(id, x) {
   let content = document.getElementById(id);
   let contactsLeft;
   const assignedContacts = getTaskFromId(x)['assigned_to'];

   id = id.slice(-1);
   for (let i = 0; i < assignedContacts.length; i++) {
      let contact = contacts.find((c) => c.id === assignedContacts[i].id);
      contactsLeft = assignedContacts.length - i;
      content.innerHTML += createContactIconHTML(contact, i, contactsLeft);

      if (i == 3) {
         return;
      }
   }
}


/**
 * Adds a transition effect to show the open task card.
 */
function addTransition() {
   const openCardContainer = document.getElementById('openCardContainer');
   const openCard = document.getElementById('openCard');

   openCardContainer.classList.remove('hidden');
   openCardContainer.style.animation = 'blendIn 100ms ease-out forwards';
   openCard.style.animation = 'slideInCard 100ms ease-out forwards';
}


/**
 * Initiates the drag operation when an element is being dragged.
 *
 * @param {number} index - The unique identifier of the element being dragged.
 */
function startDraggin(index) {
   currentDraggedElement = index;
}


/**
 * Allows a drop operation by preventing the default behavior of the dragover event.
 *
 * @param {Event} ev - The dragover event.
 */
function allowDrop(ev) {
   ev.preventDefault();
}


/**
 * Moves a task to a different category.
 *
 * @param {string} category - The category to which the task should be moved.
 * @param {number} id - The ID of the task to be moved.
 */
async function moveTo(category) {
   let task = getTaskFromId(currentDragedElement);

   tasks.splice(currentDraggedElement, 1);
   tasks.push(task);

   tasks[tasks.length - 1][`state`] = category;
   await saveStateChangeAfterDroppingTask();
   renderTasks();
   hideAllHoverContainers();
}


/**
 * Saves Tasks into Backend
 */
async function saveStateChangeAfterDroppingTask() {
   let tasksToPush = tasks;
   await setItem('tasks', tasksToPush);
}


/**
 * Checks if there are tasks for each state and adds a "No Task" message if no tasks exist.
 *
 * @param {Array} tasks - An array of tasks to be checked.
 */
function checkAndAddTasks(tasks) {
   states.forEach((state) => {
      const filteredTasks = tasks.filter((task) => task.state === state);

      if (filteredTasks.length === 0) {
         addNoTaskHTML(state + 'Container');
      }
   });
}


/**
 * Sorts and filters task cards based on a given search term. It searches within card titles and
 * displays only those cards matching the search term, hiding all others.
 *
 * @param {string} inputId - The ID of the input element containing the search term.
 */
function sortAndFilterCards(inputId) {
   document.getElementById('allertNoTasksFoundContainer').innerHTML = '';
   const searchTerm = document.getElementById(inputId).value.toLowerCase();
   const cards = document.querySelectorAll('.toDoCard');
   const states = ['ToDo', 'InProgress', 'Done', 'AwaitFeedback'];

   if (searchTerm) {
      states.forEach((state) => {
         removeNoTaskHTML(state);
      });
   } else if (!searchTerm) {
      checkAndAddTasks(tasks);
   }

   cards.forEach((card) => {
      const title = card.querySelector('h3').textContent.toLowerCase();
      const description = card.querySelector('p').textContent.toLowerCase();
      if (title.includes(searchTerm) || description.includes(searchTerm)) {
         card.parentNode.style.display = 'block';
         taskFound = true;
      } else {
         card.parentNode.style.display = 'none';
      }
   });

   if (taskFound === false) {
      let content = document.getElementById('allertNoTasksFoundContainer');
      content.innerHTML = 'No task found';
      document.getElementById('allertNoTasksFoundContainer').style.zIndex = '10';
   }
   taskFound = false;
}


/**
 * Hides the "No Tasks Found"-Message
 */
function RemoveNoTaksFound() {
   console.log('test');
   document.getElementById('allertNoTasksFoundContainer').innerHTML = '';
}
