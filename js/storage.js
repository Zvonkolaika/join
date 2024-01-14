const STORAGE_TOKEN = 'I0RRFUNI9BMJ8CEHATSQHZ6NTNGVO5OHLGOWM266';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';

/**
 * Sets an item in the storage.
 * @param {string} key - The key of the item.
 * @param {any} value - The value of the item.
 * @returns {Promise<any>} - A promise that resolves to the response from the server.
 */
async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) })
        .then(res => res.json());
}

/**
 * Retrieves the value associated with the specified key from the storage.
 * @param {string} key - The key to retrieve the value for.
 * @returns {Promise<any>} - A promise that resolves to the retrieved value.
 */
async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return await fetch(url)
        .then(res => res.json().then(res => res.data.value));
}

/**
 * Resets the remote storage for the given key.
 * @param {string} key - The key to reset the remote storage for.
 * @returns {Promise<void>} - A promise that resolves when the remote storage is reset.
 */
async function resetRemote(key) {
    await setItem(key, []).then();
}

/**
 * Retrieves the remote values associated with the given key.
 * @param {string} key - The key used to retrieve the values.
 * @returns {Promise<Array>} - A promise that resolves to an array of values.
 */
async function getRemote(key) {
    let values = [];
    let storedPromise = await getItem(key);
    storedValue = JSON.parse(storedPromise);

    if (!isJSON(storedValue)) {
        console.warn('storedValue is not JSON');
        console.warn('All stored tasks are gone.');
        resetTasks(key)
    } else {
        values = storedValue;
    }
    return values;
}

/**
 * Checks if a value is a valid JSON object.
 * @param {*} value - The value to be checked.
 * @returns {boolean} - Returns true if the value is a valid JSON object, otherwise returns false.
 */
function isJSON(value) {
    try {
        JSON.stringify(value);
        return true;
    } catch (ex) {
        return false;
    }
}