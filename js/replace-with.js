/** Because i dont like the time to be 12:13:3. It needs to have a 0 before the last 3 */
const padWithZeros = ["ss", "mm", "hh", "dd", "month-num"];

/** The current date as normal and updated every second */
let date = new Date();

/** The current date formatted and updated every second */
let currentDate = {
    /**
     * Seconds
     * @example 05
     */
    ss: date.getSeconds(),
    /**
     * Minutes
     * @example 06
     */
    mm: date.getMinutes(),
    /**
     * Hours
     *@example 12
     */
    hh: date.getHours(),
    /**
     * Day of the month
     * @example 04
     */
    dd: date.getDate(),
    /**
     * Year
     * @example 2021
     */
    yyyy: date.getFullYear(),
    /**
     * 3 letter day
     * @example Mon
     */
    "day-short": date.toLocaleDateString("en-US", { weekday: "short" }),
    /**
     * Full day
     * @example Monday
     */
    day: date.toLocaleDateString("en-US", { weekday: "long" }),
    /**
     * The day of the months correct suffix
     * @example st
     */
    th: nth(date.getDate()),
    /**
     * Month of the year
     * @example 04
     */
    "month-num": date.getMonth() + 1,
    /**
     * 3 letter month
     * @example Nov
     */
    "month-short": date.toLocaleDateString("en-US", { month: "short" }),
    /**
     * Full month
     * @example November
     */
    month: date.toLocaleDateString("en-US", { month: "long" }),
};

/**
 * Updates the date variable and replaces all the elements text with the data-replace-with attribute
 */
function updateDate() {
    date = new Date();

    currentDate = {
        /** Seconds */
        ss: date.getSeconds().toFixed(0).padStart(2, "0"),
        /** Minutes */
        mm: date.getMinutes().toFixed(0).padStart(2, "0"),
        /** Hours */
        hh: date.getHours().toFixed(0).padStart(2, "0"),
        /** Day of the month */
        dd: date.getDate().toFixed(0).padStart(2, "0"),
        /** Year */
        yyyy: date.getFullYear(),
        /** 3 letter day */
        "day-short": date.toLocaleDateString("en-US", { weekday: "short" }),
        /** Full day */
        day: date.toLocaleDateString("en-US", { weekday: "long" }),
        /** Month of the year */
        "month-num": (date.getMonth() + 1).toFixed(0).padStart(2, "0"),
        /** 3 letter month */
        "month-short": date.toLocaleDateString("en-US", { month: "short" }),
        /** Full month */
        month: date.toLocaleDateString("en-US", { month: "long" }),
    };

    // Replace all the elements text with the data-replace-with attribute
    [...document.querySelectorAll("[data-replace-with]")].forEach(replaceWith);
}

/**
 * Replace the elements text content with something to do with the date
 * @param {HTMLElement} el
 */
function replaceWith(el) {
    /**
    They will be formatted in this order and can equal the following things;
    - ss = seconds = 05
    - mm = minutes = 05
    - hh = hour = 12
    - dd = day of the month = 05
    - th = day of the month with the correct suffix = th, st, etc
    - yyyy = year = 2021
    - yy = year = 21
    - day-short - 3 letter day - Mon
    - day = The current day - Monday
    - month-num = month of the year = 03
    - month-short - 3 letter month - Nov 
    - month - The current month - November
  */
    const format = el.getAttribute("data-replace-with");
    if (!format) return;

    let currentText = el.textContent;
    let newText = format;

    Object.entries(currentDate).forEach(([key, value]) => {
        newText = newText.replace(new RegExp(key, "g"), value);
    });

    // Only update the text if it has changed
    if (currentText !== newText) el.textContent = newText;
}

/**
 * Returns the correct suffix for the day of the month
 * @param {number} dd - The date e.g. `12`
 */
function nth(dd) {
    if (dd > 3 && dd < 21) return "th";
    switch (dd % 10) {
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
