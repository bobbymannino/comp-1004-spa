/**
 * Checks for and returns the calendar data from local storage (if it exists)
 * @returns {CalendarData | undefined}
 */
function getCalendarDataFromLocalStorage() {
    const data = localStorage.getItem("calendarData");

    if (data) {
        const parsed = JSON.parse(data);

        return parsed;
    }
}

/**
 * Saves the calendar data to local storage
 * @param {CalendarData} data - The calendar data to save
 */
function saveCalendarDataToLocalStorage(data) {
    localStorage.setItem("calendarData", JSON.stringify(data));
}

/**
 * Creates a local storage store with history that updates everytime is is changed and is recovered on load
 * @param {string} key The key for the local storage
 * @param {any} initialValue The initial value if no value is found in local storage 
 * @returns {typeof initialValue} A value with the same type of initial value
 */
function createStore(key, initialValue) {
    let data = localStorage.getItem(key);

    /** @type {Store} */
    let store = { [(new Date()).getTime()]: initialValue };

    if (value) {
        store = JSON.parse(data);
    } else {
        localStorage.setItem(key, JSON.stringify(store));
    }

    return createProxy(store, (obj, prop, value) => {
        localStorage.setItem(key,)
    })
}

/**
 * Creates a proxy and returns it
 * @param {object} initialValue The intial value
 * @param { (obj, prop, value) => {} } onSet A function to do everytime the variable is set
 * @returns {typeof initialValue}
 */
function createProxy(intialValue, onSet) {
    return new Proxy(initialValue,
        {
            set: (obj, prop, val) => {
                obj[prop] = val;

                onSet(obj, prop, value);

                return true;
            },
        }
    );
}