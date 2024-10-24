
const STORAGE_TOKEN = '8P6ZMZZXOD1PUSKXJNGCX6Y5OU550K3CS45YN7FK';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';
const NEW_STORAGE_URL = 'http://127.0.0.1:8000/api'


/**
 * Set Datas in the backend
 * 
 * @param {string} key - the key is the name to save the payload in the backend
 * @param {Array, Object, string} value - the value is the payload
 * @returns - return executes the request and processes the response from the backend
 */
async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) })
        .then(res => res.json());
}


/**
 * get the Datas from the backend
 * 
 * @param {string} key - key under which the payload is stored
 * @returns - return executes the request and processes the response from the backend
 */
async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(url).then(res => res.json()).then(res => {
        if (res.data) { 
            return res.data.value;
        } throw `Could not find data with key "${key}".`;
    });
}


/**
 * Set Datas in the backend
 * 
 * @param {string} key - the key is the name to save the payload in the backend
 * @param {Array, Object, string} value - the value is the payload
 * @returns - return executes the request and processes the response from the backend
 */
async function postItem(key, value) {
    const url = `${NEW_STORAGE_URL}/${key}/`;
    return fetch(url, { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(value)
    })
}


/**
 * delete the Datas from the backend
 * 
 * @param {string} key - key under which the payload is stored
 * @param {string} value - the value to delete
 * @returns - return the status of the request
 */
async function deleteItem(key, value) {
    id = value.id
    const url = `${NEW_STORAGE_URL}/${key}/${id}/`;
    return fetch(url, {
        method: 'DELETE'
    })
}


/**
 * update the Datas in the backend
 * 
 * @param {string} key - key under which the payload should be updated
 * @param {Object} value - the payload to update in the backend
 * @returns - return the status of the request
 */
async function putItem(key, value) {
    id = value.id
    const url = `${NEW_STORAGE_URL}/${key}/${id}/`;
    const res = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(value)
    })
}


/**
 * get the Datas from the backend
 * 
 * @param {string} key - key under which the payload is stored
 * @returns - return executes the request and processes the response from the backend
 */
async function newGetItem(key) {
    const url = `${NEW_STORAGE_URL}/${key}/`;
    return fetch(url).then(res => res.json()).then(res => {
        if (res) { 
            return res;
        } throw `Could not find data with key "${key}".`;
    });
}


/**
 * Retrieves the tasks array from the backend storage and parses it.
 * If the tasks data is not found or is in an invalid format, it returns an empty array.
 * 
 * @async
 * @function getTasksArray
 * @returns {Promise<Array>} An array containing the tasks data.
 * @throws {Error} Throws an error if there is an issue while loading the tasks.
 */
async function getTasksArray() {
    try {
        const tasksData = await newGetItem('tasks');
        if (Array.isArray(tasksData)) {
            return tasksData;
        } else if (typeof tasksData === 'string') {
            return JSON.parse(tasksData);
        } else {
            return [];
        }
    } catch (error) {
        console.error('Error while loading tasks: ', error);
        return [];
    }
}


/**
 * Retrieves the contacts array from the backend storage and parses it.
 * If the contacts data is not found or is in an invalid format, it returns an empty array.
 * 
 * @async
 * @function getContactsArray
 * @returns {Promise<Array>} An array containing the contacts data.
 * @throws {Error} Throws an error if there is an issue while loading the tasks.
 */
async function getContactsArray() {
    try {
        const contactsData = await newGetItem('contacts');
        if (Array.isArray(contactsData)) {
            return contactsData;
        } else if (typeof contactsData === 'string') {
            return JSON.parse(contactsData);
        } else {
            return [];
        }
    } catch (error) {
        console.error('Error while loading contacts: ', error);
        return;
    }
}

// TODO: getItem und Contacts eingebungen jetzt setItem und für Contacts und dann beides für alle anderen