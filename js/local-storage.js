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
