/**
 * Initializes the contacts.html
 */
async function initContacts() {
    renderContactList();
    tasks = await getTasksArray();
}


/**
 * Renders the contact list and the first letter to sort
 */
async function renderContactList() {
    await loadContacts()
    let contactList = document.getElementById('contactList');
    contactList.innerHTML = /* html */ `<div class="contact-list-padding"></div>`;

    let letters = [];

    contacts.forEach(contact => {
        const firstLetter = contact['name'].charAt(0);

        if (letters.indexOf(firstLetter) == -1) {
            contactList.innerHTML += returnContactListHTML(0, firstLetter);
            letters.push(firstLetter);
        }
        contactList.innerHTML += returnContactListHTML(1, 0, contact['id'], contact['color'], getInitials(contact['name']), contact['name'], contact['email']);
    })
}


/**
 * Renders pop up and changes html and styles to add new contact design
 */
function openAddNewContact() {
    const popUpSubmit = document.getElementById('popUpSubmit');

    renderPopUp('add-new');

    document.getElementById('popUpVector').classList.remove('vector-margin');
    document.getElementById('popUpProfile').style.backgroundColor = '#D1D1D1';
    document.getElementById('popUpSubtitle').classList.remove('d-none');

    popUpSubmit.parentNode.parentNode.onsubmit = function () { return addNewContact() };
    popUpSubmit.previousElementSibling.onclick = function () { closePopUp() };

    openPopUpAni('add-new');
}


/**
 * Renders pop up and changes html and styles to edit contact design with the given contact
 * 
 * @param {number} i - Index of the choosen contact
 */
function openEditContact(i) {
    const popUpSubmit = document.getElementById('popUpSubmit');

    renderPopUp('edit', i);

    document.getElementById('popUpVector').classList.add('vector-margin');
    document.getElementById('popUpProfile').style.backgroundColor = getContactFromId(i)['color'];
    document.getElementById('popUpSubtitle').classList.add('d-none');

    popUpSubmit.parentNode.parentNode.onsubmit = function () { return editContact(i) };
    popUpSubmit.previousElementSibling.onclick = function () { deleteContact(i) };

    setInput(i);
    openPopUpAni('edit');
}


/**
 * Plays the opening animation of the popup (both variants) for desktop & mobile
 * 
 * @param {string} variant - 'add-new' for the Add-New-Contact popUp or 'edit' for the Edit-Contact popUp
 */
function openPopUpAni(variant) {
    popUp.classList.remove('d-none');
    popUp.style = 'animation: blendIn 300ms ease-out;'

    if ((window.matchMedia("(max-width: 1000px)").matches)) {
        if (variant == 'add-new') {
            document.getElementById('popup-buttons').firstElementChild.classList.add('d-none');
        } else if (variant == 'edit') {
            document.getElementById('popup-buttons').firstElementChild.classList.remove('d-none')
        }
        popUp.firstElementChild.style = 'animation: slideInPopUpMobile 300ms ease-out;';
    } else {
        popUp.firstElementChild.style = 'animation: slideInPopUp 300ms ease-out;';
    }
}


/**
 * Changes the popup elements to match the given variant
 * 
 * @param {string} variant - 'add-new' for the Add-New-Contact popUp or 'edit' for the Edit-Contact popUp
 * @param {number} i - Index of the choosen contact (optional)
 */
function renderPopUp(variant, i) {
    const popUpTitle = document.getElementById('popUpTitle')
    const popUpProfile = document.getElementById('popUpProfile');
    const popUpSubmit = document.getElementById('popUpSubmit');

    if (variant == 'add-new') {
        popUpTitle.innerHTML = 'Add contact';
        popUpProfile.innerHTML = /* html */ `<img src="./assets/img/Desktop/contacts/person.svg"
        alt="Profile-Image"></div>`;
        popUpSubmit.innerHTML = /* html */ `Create contact<img src="./assets/img/Desktop/contacts/check.svg"
        alt="Create Contact">`
        popUpSubmit.previousElementSibling.innerHTML = /* html */ `Cancel<img src="./assets/img/Desktop/contacts/iconoir_cancel.svg" alt="Cancel">`
    } else if (variant == 'edit') {
        popUpTitle.innerHTML = 'Edit contact';
        popUpProfile.innerHTML = getInitials(getContactFromId(i)['name']);
        popUpSubmit.innerHTML = /* html */ `Save<img src="./assets/img/Desktop/contacts/check.svg"
        alt="Create Contact">`;
        popUpSubmit.previousElementSibling.innerHTML = 'Delete';
    }
}


/**
 * Sets the editing contact information in the input fields
 * 
 * @param {number} i - Index of the choosen contact
 */
function setInput(i) {
    const contact = getContactFromId(i);

    document.getElementById('popUpName').value = contact['name'];
    document.getElementById('popUpEmail').value = contact['email'];
    document.getElementById('popUpPhone').value = contact['phone'];
}


/**
 * Resets all input fields
 */
function resetInput() {
    document.getElementById('popUpName').value = '';
    document.getElementById('popUpEmail').value = '';
    document.getElementById('popUpPhone').value = '';
}


/**
 * Opens the clicked contact and deselects previous one if it exists
 * 
 * @param {number} i - Index of the choosen contact
 */
async function openContact(i) {
    await renderContactList();

    let contact = getContactFromId(i);
    let contactsInfo = document.getElementById('contactsInfo');
    let contactElement = document.getElementById(`contact${i}`);

    contactsInfo.innerHTML = '';
    contactElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    contactsInfo.innerHTML = returnContactInfoHTML(contact['color'], getInitials(contact['name']), contact['name'], contact['email'], contact['phone'], i);

    if (window.matchMedia("(max-width: 1000px)").matches) {
        openContactMobile();
    } else {
        contactElement.classList.add('contact-selected');
        contactsInfo.style = 'animation: slideInInfo 100ms ease-in-out;';

        setTimeout(function () {
            contactsInfo.style = '';
        }, 100);
    }
}


/**
 * Opens contact info on mobile
 */
function openContactMobile() {
    document.getElementById('contact-menu-button').classList.remove('d-none');
    document.getElementById('contact-list-container').classList.add('d-none');
}


/**
 * Closes contact info on mobile
 */
function closeContactMobile() {
    document.getElementById('contact-menu-button').classList.add('d-none');
    document.getElementById('contact-list-container').classList.remove('d-none');
}


/**
 * Closes the popUp + animation
 * 
 * @param {boolean} submitted - true if form was submitted / false if form was cancelled
 */
function closePopUp(submitted) {
    let popUp = document.getElementById('popUp');

    if (!submitted) {
        popUp.style = 'animation: blendOut 300ms ease-out;'

        if ((window.matchMedia("(max-width: 1000px)").matches)) {
            popUp.firstElementChild.style = 'animation: slideOutPopUpMobile 300ms ease-out;';
        } else {
            popUp.firstElementChild.style = 'animation: slideOutPopUp 300ms ease-out;';
        }

        setTimeout(function () {
            popUp.classList.add('d-none');
            resetInput();
        }, 300);
    } else {
        popUp.classList.add('d-none');
        resetInput();
    }
}


/**
 * Deletes a selected contact and updates the UI.
 * 
 * @param {number} i - The index of the contact to delete.
 */
async function deleteContact(i) {
    // deleteContactFromTasks(i);
    contacts.splice(i, 1);
    contact = getContactFromId(i)
    await saveContacts("DELETE", contact);

    renderContactList();
    document.getElementById('contactsInfo').innerHTML = '';

    if ((window.matchMedia("(max-width: 1000px)").matches)) {
        document.getElementById('contact-list-container').classList.remove('d-none');
    }
    closePopUp(true);
}


function getContactFromId(id) {
    return contacts.find(contact => contact['id'] == id)
}


// /**
//  * Removes a contact from all tasks it's assigned to.
//  * 
//  * @param {number} i - The index of the contact to remove from tasks.
//  */
// async function deleteContactFromTasks(i) {
//     let contactToDelete = getContactFromId(i);
//     for (let j = 0; j < tasks.length; j++) {
//         const task = getTaskFromId(j);
//         for (let z = 0; z < task.assigned_to.length; z++) {
//             const contact = task.assigned_to[z].name;

//             if (contact == contactToDelete.name) {
//                 task.assigned_to.splice(z, 1);
//                 await setItem('tasks', tasks);
//             }
//         }
//     }
// }


/**
 * Changes the edited contact information like entered and sorts the contacts by their names
 * 
 * @param {number} i - Index of the choosen contact
 */
async function editContact(i) {
    event.preventDefault();

    let lastId = getContactFromId(i)['id'];

    getContactFromId(i).name = document.getElementById('popUpName').value;
    getContactFromId(i).email = document.getElementById('popUpEmail').value;
    getContactFromId(i).phone = document.getElementById('popUpPhone').value;

    let editedContact = getContactFromId(lastId)

    contacts = contacts.sort((a, b) => a.name.localeCompare(b.name));
    let index = contacts.findIndex(c => c.id == lastId);
    await saveContacts("PUT", editedContact)

    closePopUp(true);
    openContact(lastId);
}


/**
 * Adds the new contact to the array sorted by the name
 */
async function addNewContact() {
    event.preventDefault();
    let newContact = {
        "id": contacts.length,
        "color": randomColor(),
        "name": document.getElementById('popUpName').value,
        "email": document.getElementById('popUpEmail').value,
        "phone": document.getElementById('popUpPhone').value
    };

    let lastId = contacts.length;

    contacts.push(newContact);
    contacts = contacts.sort((a, b) => a.name.localeCompare(b.name));
    let index = contacts.findIndex(c => c.id == lastId);
    await saveContacts("POST", newContact);

    closePopUp(true);
    renderContactList();
    openContact(index);
    playMessageAni();
}


/**
 * Adds new registered user to the contact list
 */
async function addUserToContacts(user) {
    let newContact = {
        "color": user.color,
        "name": user.username,
        "email": user.email,
        "phone": '+49 1111 111 11 1'
    };

    contacts.push(newContact);
    contacts = contacts.sort((a, b) => a.name.localeCompare(b.name));
    await saveContacts("POST", newContact);
}


/**
 * Displays the "Contact succesfully created" message for 2.5s for desktop & mobile
 */
function playMessageAni() {
    let message = document.getElementById('message');

    message.classList.remove('d-none');

    if (window.matchMedia("(max-width: 1000px)").matches) {
        message.classList.add('message-animation-mobile'); // start animation
        setTimeout(function () {
            message.classList.remove('message-animation-mobile'); // reset animation
            message.classList.add('d-none');
        }, 2500);
    } else {
        message.classList.add('message-animation'); // start animation
        setTimeout(function () {
            message.classList.remove('message-animation'); // reset animation
            message.classList.add('d-none');
        }, 2500);
    }
}


/**
 * Returns 1 of 15 random colors
 * 
 * @returns - random HEX color code
 */
function randomColor() {
    let colors = ['#FF7A00', '#FF5EB3', '#6E52FF', '#9327FF', '#00BEE8', '#1FD7C1', '#FF745E', '#FFA35E', '#FC71FF', '#FFC701', '#0038FF', '#C3FF2B', '#FFE62B', '#FF4646', '#FFBB2B'];
    let num = Math.floor(Math.random() * 15);
    return colors[num];
}


/**
 * Returns the first letter of the first and last name in upper case
 * 
 * @param {string} name - first & last name
 * @returns - name initials
 */
function getInitials(name) {
    let firstLastName = name.split(' ');
    let firstLetter = firstLastName[0].charAt(0).toLocaleUpperCase();
    if (firstLastName[1]) {
        let secondLetter = firstLastName[1].charAt(0).toLocaleUpperCase();
        return firstLetter + secondLetter;
    } else {
        return firstLetter;
    }
}


/**
 * Stops the clicked element from starting onclick function of the parent div
 * 
 * @param {event} event
 */
function doNotClose(event) {
    event.stopPropagation();
}


/**
 * Saves the contacts-array in the back end
 */
async function saveContacts(method, item) {
    if (method == "POST") {
        await postItem('contacts', item);
    } else if (method == "PUT") {
        await putItem('contacts', item);
    } else if (method == "DELETE")
        await deleteItem('contacts', item);
}


/**
 * Loads the contacts-array from the back end
 */
async function loadContacts() {
    let contactsArray = await getContactsArray()
    if (Array.isArray(contactsArray)) {
        contacts = contactsArray;
    }
}


/**
 * Opens the contact menu with the edit and delete options + animation
 * 
 * @param {number} i - Index of the choosen contact
 */
function openContactMenu(i) {
    let contactMenu = document.getElementById('contact-menu');

    contactMenu.classList.remove('d-none')

    contactMenu.innerHTML = returnContactMenuHTML(i);

    contactMenu.firstElementChild.style = 'animation: slideInContactMenu 300ms ease-out';
}


/**
 * Closes the contact menu + animation
 */
function closeContactMenu() {
    let contactMenu = document.getElementById('contact-menu');
    contactMenu.firstElementChild.style = 'animation: slideOutContactMenu 300ms ease-out'
    setTimeout(function () {
        contactMenu.classList.add('d-none');
        contactMenu.innerHTML = '';
    }, 300)
}