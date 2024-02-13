/**
 * The current date. Updated every second
 */
let date = new Date();

/**
 * The current date and time updated every second
 */
let currentDateTime = {
    /**
     * Day of the month
     * @example 04
     */
    date: date.getDate(),
    /**
     * Year
     * @example 2021
     */
    year: date.getFullYear(),
    /**
     * Month
     * @example 6
     */
    month: date.getMonth() + 1,
    /**
     * Seconds
     * @example 05
     */
    second: date.getSeconds(),
    /**
     * Minutes
     * @example 06
     */
    minute: date.getMinutes(),
    /**
     * Hours
     * @example 12
     */
    hour: date.getHours(),
};

/**
 * Updates the currentDateTime variable
 */
function updateDateTime() {
    date = new Date();

    currentDateTime = {
        date: date.getDate(),
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        second: date.getSeconds(),
        minute: date.getMinutes(),
        hour: date.getHours(),
    };
}

/**
 * Takes in a date and returns the nth of the date
 * @param {Date} date
 */
function nthOfDate(date) {
    if (date > 3 && date < 21) return "th";
    switch (date % 10) {
        case 1:
            return "st";
        case 2:
            return "nd";
        case 3:
            return "rd";
        default:
            return "th";
    }
}
