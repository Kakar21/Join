/**
 * Speichert Daten in Firestore unter dem angegebenen Schlüssel.
 * 
 * @param {string} key - Der Schlüssel, unter dem die Daten gespeichert werden.
 * @param {Array|Object|string} value - Die zu speichernden Daten.
 * @returns {Promise<void>} - Gibt ein Promise zurück, das nach erfolgreichem Speichern aufgelöst wird.
 */
async function setItem(key, value) {
    try {
        // Verweis auf das Dokument in der "storage" Collection
        const docRef = window.doc(db, 'storage', key);

        // Speichert die Daten im Dokument
        await window.setDoc(docRef, { value });
    } catch (error) {
        console.error('Fehler beim Speichern der Daten: ', error);
    }
}


/**
 * Ruft Daten aus Firestore unter dem angegebenen Schlüssel ab.
 * 
 * @param {string} key - Der Schlüssel, unter dem die Daten gespeichert sind.
 * @returns {Promise<any>} - Gibt die abgerufenen Daten zurück.
 * @throws {Error} - Wenn der Schlüssel nicht gefunden wurde oder ein anderer Fehler auftritt.
 */
async function getItem(key) {
    try {
        // Verweis auf das Dokument in der "storage" Collection
        const docRef = window.doc(window.db, 'storage', key);

        // Abrufen des Dokuments
        const docSnap = await window.getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data().value;
        } else {
            throw `Keine Daten mit dem Schlüssel "${key}" gefunden.`;
        }
    } catch (error) {
        console.error('Fehler beim Abrufen der Daten: ', error);
        throw error;
    }
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
        console.error('Error while loading tasks: ', error);
        return;
    }
}
