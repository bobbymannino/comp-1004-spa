/** The current date as normal and updated every second */
let date = new Date();

/** The current date formatted and updated every second */
let currentDate = {
  /** Seconds */
  ss: date.getSeconds(),
  /** Minutes */
  mm: date.getMinutes(),
  /** Hours */
  hh: date.getHours(),
  /** Day of the month */
  dd: date.getDate(),
  /** Year */
  yyyy: date.getFullYear(),
  /** 3 letter day */
  "day-short": date.toLocaleDateString("en-US", { weekday: "short" }),
  /** Full day */
  day: date.toLocaleDateString("en-US", { weekday: "long" }),
  /** Month of the year */
  "month-num": date.getMonth() + 1,
  /** 3 letter month */
  "month-short": date.toLocaleDateString("en-US", { month: "short" }),
  /** Full month */
  month: date.toLocaleDateString("en-US", { month: "long" }),
};

/**
 * Updates the date variable and replaces all the elements text with the data-replace-with attribute
 */
function updateDate() {
  date = new Date();

  currentDate = {
    /** Seconds */
    ss: date.getSeconds(),
    /** Minutes */
    mm: date.getMinutes(),
    /** Hours */
    hh: date.getHours(),
    /** Day of the month */
    dd: date.getDate(),
    /** Year */
    yyyy: date.getFullYear(),
    /** 3 letter day */
    "day-short": date.toLocaleDateString("en-US", { weekday: "short" }),
    /** Full day */
    day: date.toLocaleDateString("en-US", { weekday: "long" }),
    /** Month of the year */
    "month-num": date.getMonth() + 1,
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
     format can equal the following things;
     - ss = seconds = 05
     - mm = minutes = 05
     - hh = hour = 12
     - dd = day of the month = 05
     - yyyy = year = 2021
     - yy = year = 21
     - day-short - 3 letter day - Mon
     - day = The current day - Monday
     - month-num = month of the year = 03
     - month-short - 3 letter month - Nov 
     - month - The current month - November
     They will be formatted in that order
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

// What to do on initialization
function init() {
  // Start the updateDate function every second to stay up to date
  setInterval(updateDate, 1e3);
  // You have to call it as well because interval will wait 1 second before actually calling it
  updateDate();
}

// On the document load call the init function to set everything up
document.addEventListener("DOMContentLoaded", init, { once: true });
