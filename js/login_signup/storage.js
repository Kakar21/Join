const STORAGE_URL = 'http://127.0.0.1:8000/api';


/**
 * Set Datas in the backend
 * 
 * @param {string} key - the key is the name to save the payload in the backend
 * @param {Array, Object, string} value - the value is the payload
 * @returns - return executes the request and processes the response from the backend
 */
async function postItem(key, value) {
    const url = `${STORAGE_URL}/${key}/`;
    const authToken = localStorage.getItem('token') || token;
    return fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Token ${authToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(value)
    }).then(response => response.json());
}


/**
 * delete the Datas from the backend
 * 
 * @param {string} key - key under which the payload is stored
 * @param {string} value - the value to delete
 * @returns - return the status of the request
 */
async function deleteItem(key, value) {
    id = value.id;
    const url = `${STORAGE_URL}/${key}/${id}/`;
    const authToken = localStorage.getItem('token');
    return fetch(url, {
        method: 'DELETE',
        headers: {
            'Authorization': `Token ${authToken}`,
            'Content-Type': 'application/json'
        },
    });
}


/**
 * update the Datas in the backend
 * 
 * @param {string} key - key under which the payload should be updated
 * @param {Object} value - the payload to update in the backend
 * @returns - return the status of the request
 */
async function putItem(key, value) {
    id = value.id;
    const url = `${STORAGE_URL}/${key}/${id}/`;
    const authToken = localStorage.getItem('token');
    const res = await fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': `Token ${authToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(value)
    });
}


/**
 * get the Datas from the backend
 * 
 * @param {string} key - key under which the payload is stored
 * @returns - return executes the request and processes the response from the backend
 */
async function getItem(key) {
    const url = `${STORAGE_URL}/${key}/`;
    const authToken = localStorage.getItem('token') || token;
    return fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Token ${authToken}`,
            'Content-Type': 'application/json'
        }
    }).then(res => res.json()).then(res => {
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
        const tasksData = await getItem('tasks');
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
        const contactsData = await getItem('contacts');
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


/**
 * Fetches summary data from the backend and returns it as an array.
 * @returns {Promise<Array>} - Summary data array or empty array on error.
 */
async function getSummaryData() {
    try {
        summaryData = await getItem("summary");
        if (Array.isArray(summaryData)) {
            return summaryData;
        } else if (typeof summaryData === 'string') {
            return JSON.parse(summaryData);
        } else {
            return [];
        }
    } catch (error) {
        console.error('Error while loading summary: ', error);
        return [];
    }
}