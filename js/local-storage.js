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
 * Creates a local storage store based off an object
 * @param {string} key The key for the local storage
 * @param {object} initialValue The initial value if no value is found in local storage
 * @returns {object} A value with the same type of initial value
 */
function createStore(key, initialValue) {
    let data = localStorage.getItem(key);

    if (data) data = JSON.parse(data);
    else {
        data = initialValue;

        localStorage.setItem(key, JSON.stringify(data));
    }

    return new Proxy(data, {
        set: (target, prop, value) => {
            target[prop] = value;

            localStorage.setItem(key, JSON.stringify(target));

            return true;
        },
    });
}
