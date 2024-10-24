/**
 * Generates HTML markup for the edit task card popup.
 *
 * @param {number} i - The index of the task to be edited.
 * @returns {string} HTML markup for the edit task card.
 */
function generateEditCardHTML(i) {
   return /*HTML*/ `
<div class="edit-tasks-popup pos-static">

<div class="editor-wrapper">
    <div class="editTaskHeader">
        <button class="noselect" id="closeAddTaskButton" onclick="closeCard(), clearForm('assigned-contacts-popup', 'subTasks-popup'), removeListeners('add-contact-input'),setEditFormOpenedToFalse();"><svg xmlns="http://www.w3.org/2000/svg"
                width="24" height="24" viewBox="0 0 24 24" fill="none">
                <mask id="mask0_116223_1910" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0"
                    width="24" height="24">
                    <rect width="24" height="24" fill="#D9D9D9" />
                </mask>
                <g mask="url(#mask0_116223_1910)">
                    <path
                        d="M12 13.4L7.1 18.3C6.91667 18.4834 6.68333 18.575 6.4 18.575C6.11667 18.575 5.88333 18.4834 5.7 18.3C5.51667 18.1167 5.425 17.8834 5.425 17.6C5.425 17.3167 5.51667 17.0834 5.7 16.9L10.6 12L5.7 7.10005C5.51667 6.91672 5.425 6.68338 5.425 6.40005C5.425 6.11672 5.51667 5.88338 5.7 5.70005C5.88333 5.51672 6.11667 5.42505 6.4 5.42505C6.68333 5.42505 6.91667 5.51672 7.1 5.70005L12 10.6L16.9 5.70005C17.0833 5.51672 17.3167 5.42505 17.6 5.42505C17.8833 5.42505 18.1167 5.51672 18.3 5.70005C18.4833 5.88338 18.575 6.11672 18.575 6.40005C18.575 6.68338 18.4833 6.91672 18.3 7.10005L13.4 12L18.3 16.9C18.4833 17.0834 18.575 17.3167 18.575 17.6C18.575 17.8834 18.4833 18.1167 18.3 18.3C18.1167 18.4834 17.8833 18.575 17.6 18.575C17.3167 18.575 17.0833 18.4834 16.9 18.3L12 13.4Z"
                        fill="#2A3647" />
                </g>
            </svg>
        </button>
    </div>

        <section class="task-forms task-forms-editor">
                <div class="form-div" style="margin-top: 1.5rem">
                    <span class="form-span required-asteriks">Title</span>
                    <div class="form-subcontainer noselect">
                        <input id="task-title-input-popup" maxlength="48" class="task-title-input" type="text"
                            placeholder="Enter a title" required />
                        <p class="input-required-warning invisible" id="requiredTextTitle">This field is
                            required</p>
                    </div>
                </div>

                <div class="form-div">
                    <span class="form-span required-asteriks">Description</span>
                    <div class="form-subcontainer noselect">
                        <textarea id="task-description-textarea-popup" class="task-description-textarea"
                            name="inputDescription" placeholder="Enter a Description" required></textarea>
                        <p class="input-required-warning invisible" id="requiredTextDescription">This
                            field is required</p>
                    </div>
                </div>

                <div class="form-div" style="margin-bottom: 0.5rem">
                    <span class="form-span required-asteriks">Due
                        date</span>
                    <div class="form-subcontainer noselect">

                        <div class="input-div">
                            <input id="due-date-input-popup" maxlength="48" class="due-date-input" type="date"
                                placeholder="dd/mm/yyyy" required />
                        </div>

                        <p class="input-required-warning invisible" id="requiredTextDueDate">This field
                            is required</p>

                    </div>
                </div>




                <div class="form-div" style="margin-bottom: 0.5rem">
                    <span class="form-span">Priority</span>
                    <div class="prio-buttons noselect">
                        <button type="button" class="prio-btn" id="urgentBtn" onclick="setPrio('urgent')">
                            <span>Urgent</span>
                            <img src="./assets/img/Desktop/add-task/priority_icons/urgent.svg" id="urgentSymbol" />
                        </button>
                        <button type="button" class="prio-btn medium" id="mediumBtn" onclick="setPrio('medium')">
                            <span>Medium</span>
                            <img src="./assets/img/Desktop/add-task/priority_icons/medium_white.svg" id="mediumSymbol" />
                        </button>
                        <button type="button" class="prio-btn" id="lowBtn" onclick="setPrio('low')">
                            <span>Low</span>
                            <img src="./assets/img/Desktop/add-task/priority_icons/low.svg" id="lowSymbol" />
                        </button>
                    </div>
                </div>

                <div class="form-div" style="margin-bottom: 0.5rem">
                    <span class="form-span">Assigned to</span>
                    <div class="input-div-wrapper noselect">
                        <div class="input-div">
                            <input id="add-contact-input-popup" class="add-contact-input" type="text"
                                placeholder="Select contacts to assign" required
                                onclick="toggleDropdown('assignDropdown-popup', 'arrowAssign-popup');" />
                            <img class="arrow-symbol input-symbol" id="arrowAssign-popup"
                                src="./assets/img/Desktop/add-task/arrow_dropdown_down.svg" alt="Pfeil runter"
                                onclick="toggleDropdown('assignDropdown-popup', 'arrowAssign-popup');" />
                        </div>
                        <div class="assignDropdown-popup editTaskDropdownHeight d-none" id="assignDropdown-popup"></div>
                    </div>
                    <div class="assigned-contacts noselect" id="assigned-contacts-popup"></div>
                </div>

                <div class="form-div">
                    <span class="form-span">Subtasks</span>
                    <div class="form-subcontainer noselect">

                        <div class="input-div" id="subtask-input-div">
                            <input id="subtask-input-popup" maxlength="48" class="subtask-input" type="text"
                                placeholder="Add new subtask" onfocus="addFocusClass()" />

                            <div class="plus-symbol-div" id="plus-symbol-div">
                                <img class="plus-symbol input-symbol" id="plus-symbol-subtask>"
                                    onclick="addFocusClass()"
                                    src="./assets/img/Desktop/add-task/subtasks_icons/add.svg" alt="plus" />
                            </div>

                            <div class="create-task-div d-none" id="create-task-div">
                                <img class="plus-symbol input-symbol" id="close-symbol-subtask"
                                    onclick="clearSubtaskInput()"
                                    src="./assets/img/Desktop/add-task/subtasks_icons/close.svg"
                                    alt="cancel-symbol" />

                                <img class="check-symbol input-symbol" id="check-symbol-subtask"
                                    onclick="setSubtask('subtask-input-popup', 'subTasks-popup')"
                                    src="./assets/img/Desktop/add-task/subtasks_icons/check.svg" alt="check-symbol" />
                            </div>
                        </div>
                    </div>
                    <div id="subTasks-popup" class="subTasks"></div>
                </div>    
        </section>
</div>

<div class="footer-edit-task noselect">


    <div class="footer-btn-container">


        <button id="createTaskBtn" type="submit" class="addTaskBtnOk createBtn"
            onclick="acceptAndSetEditOfTask(${i}, 'popup'), setEditFormOpenedToFalse()">
            <span>Ok</span>
            <img src="./assets/img/Desktop/add-task/check.svg" alt="weißer Haken" />
        </button>
    </div>
</div>

</div>
    `;
}


/**
 * Generates HTML markup for an open task card.
 *
 * @param {number} taskIndex - The index of the task in the tasks array.
 * @returns {string} HTML markup for the open task card.
 */
function generateOpenCardHTML(taskIndex, categoryName) {
   return /*html*/ `        
    <div class="toDoCard openCard">
        <div class="openCardHeader noselect">
        <div class="header${categoryName.trim().replace(/\s+/g, '')} headerUserStoryPopUp openCardCategory">${categoryName}</div>
            <a onclick="closeCard()">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <mask id="mask0_117782_4211" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                        <rect width="24" height="24" fill="#D9D9D9"/>
                        </mask>
                        <g mask="url(#mask0_117782_4211)">
                        <path d="M12 13.4L7.09999 18.3C6.91665 18.4834 6.68332 18.575 6.39999 18.575C6.11665 18.575 5.88332 18.4834 5.69999 18.3C5.51665 18.1167 5.42499 17.8834 5.42499 17.6C5.42499 17.3167 5.51665 17.0834 5.69999 16.9L10.6 12L5.69999 7.10005C5.51665 6.91672 5.42499 6.68338 5.42499 6.40005C5.42499 6.11672 5.51665 5.88338 5.69999 5.70005C5.88332 5.51672 6.11665 5.42505 6.39999 5.42505C6.68332 5.42505 6.91665 5.51672 7.09999 5.70005L12 10.6L16.9 5.70005C17.0833 5.51672 17.3167 5.42505 17.6 5.42505C17.8833 5.42505 18.1167 5.51672 18.3 5.70005C18.4833 5.88338 18.575 6.11672 18.575 6.40005C18.575 6.68338 18.4833 6.91672 18.3 7.10005L13.4 12L18.3 16.9C18.4833 17.0834 18.575 17.3167 18.575 17.6C18.575 17.8834 18.4833 18.1167 18.3 18.3C18.1167 18.4834 17.8833 18.575 17.6 18.575C17.3167 18.575 17.0833 18.4834 16.9 18.3L12 13.4Z" fill="#2A3647"/>
                    </g>
                </svg>
            </a>
        </div>
        <div class="openCardOverflow">
            <div class="openCardContent">
                <h3 id="openCardTitle${taskIndex}">${getTaskFromId(taskIndex)[`task_title`]}</h3>
                <h4 id="openCardDescription${taskIndex}">${getTaskFromId(taskIndex)[`description`]}</h4>
                <div class="openCardTable">
                <p>Due date:</p><span id="openCardDate${taskIndex}">${getTaskFromId(taskIndex)[`due_date`]}<span>
                </div>
                <div class="openCardTable priority">
                <p>Priority:</p>
                    <div class="openCardPriority">
                    <span id="openCardPriority${taskIndex}">${capFirstLetter(getTaskFromId(taskIndex)[`priority`])}</span>
                    <img class="noselect" src="./assets/img/Desktop/board/priority_symbols/${
                    getTaskFromId(taskIndex)[`priority`]
                    }.svg">
                    </div>
                </div>
            </div>

            <div class="openCardAssignedTitle">
                <p>Assigned To:</p>
                <div id="openCardIcon${taskIndex}" class="openCardAssigned"></div>
            </div>

            <div class="openCardSubtasks-container">
                <p id="opencardSubtaskTitle">Subtasks</p>
                <div id="openCardSubtasks${taskIndex}"></div>
            </div>
        </div>
        <div class="openCardFooter noselect">
            <a href="#" onclick="deleteOpenCard(${taskIndex})"><img src="../assets/img/Desktop/contacts/delete.svg">
                <p>Delete</p></a>
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" width="2" height="24" viewBox="0 0 2 24" fill="none">
                <path d="M1 0V24" stroke="#D1D1D1"/>
                </svg>
                </div>
            <a href="#" onclick="editCard(${taskIndex}), loadFromAddTaskPage()">
                    <img src="../assets/img/Desktop/contacts/edit.svg">
                <p>Edit</p>
            </a>
        </div>
    </div>
    `;
}


/**
 * Creates an icon for a contact.
 *
 * @param {Object} contact - The contact object.
 * @returns {string} - HTML string for the contact icon.
 */
function createContactIcon(contact) {
   let color = contact['color'];
   const nameParts = contact['name'].split(' ');
   const firstNameInitial = nameParts[0].charAt(0);
   const lastNameInitial = nameParts.length > 1 ? nameParts[nameParts.length - 1].charAt(0) : '';

   return /*html*/ `
        <div class="openCardIcon">
          <div class="icon noselect" style="background-color: ${color};">${getInitials(contact["name"])}</div>
          <p>${contact["name"]}</p>
        </div>
    `;
}


/**
 * Generates HTML for a contact icon.
 *
 * @param {Object} contact - The contact object.
 * @param {number} index - The current index in the loop.
 * @returns {string} HTML string for the contact icon.
 */
function createContactIconHTML(contact, index, contactsLeft) {
   if (index === 3) {
      return /*html*/ `<div class="icon" style="background-color: #F6F7F8; color: #2A3647;"><b style="font-weight: 900; margin-left: -0.25rem;">+${contactsLeft}</b></div>`;
   }

    let name = getInitials(contact["name"]);
    return /*html*/ `<div class="icon" style="background-color: ${contact["color"]};">${name}</div>`;
}


/**
 * Creates HTML for an incomplete subtask.
 *
 * @param {string} subtask - The subtask text.
 * @param {number} index - The index of the subtask.
 * @param {number} taskIndex - The index of the task.
 * @returns {string} HTML string for the incomplete subtask.
 */
function createIncompleteSubtaskHTML(subtask, index, taskIndex) {
   return /*html*/ `
        <div class="hoverPointer openCardSubtasks" id="subtask${index}" onclick="subtaskComplete(${index}, ${taskIndex})">
        <img class="noselect" src="../assets/img/Desktop/add-task/subtasks_icons/checkbox.svg">
          ${subtask}
        </div>
    `;
}


/**
 * Creates HTML for a completed subtask.
 *
 * @param {string} subtask - The subtask text.
 * @param {number} index - The index of the subtask.
 * @param {number} taskIndex - The index of the task.
 * @returns {string} HTML string for the completed subtask.
 */
function createCompleteSubtaskHTML(subtask, index, taskIndex) {
   return /*html*/ `
        <div class="openCardSubtasks" id="subtasks_done${index}" onclick="subtaskUnComplete(${index}, ${taskIndex})">
        <img class="noselect" src="../assets/img/Desktop/add-task/subtasks_icons/checkbox_checked.svg">
          <p class="textCross">
            ${subtask}
          </p>
        </div>
    `;
}


/**
 * Generates HTML markup for a task card.
 *
 * @param {Object} task - The task object.
 * @param {number} taskIndex - The index of the task in the tasks array.
 * @returns {string} HTML markup for the task card.
 */
function generateTaskCardHTML(task, taskIndex) {
   return /*html*/ `    
        <div class="hoverPointer" onclick="openCard(${taskIndex})" id="card${taskIndex}" draggable="true" ondragstart="startDraggin(${taskIndex}), highlight('${task.state}')">
            <div class="toDoCard">
                <div class="${category(task.category)} headerUserStoryPopUp">${task.category}</div>
                <div>
                    <h3>${task.task_title}</h3>
                    <p>${addDescription(task.description)}</p>
                </div>
                <div id="progressbar${taskIndex}" class="progressbar"></div>
                <div class="toDoCardFooter">
                    <div id="cardIcon${taskIndex}" class="userIcon"></div>
                    <img src="./assets/img/Desktop/board/priority_symbols/${task.priority}.svg">
                </div>
            </div>
        </div>
    `;
}
