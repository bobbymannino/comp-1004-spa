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

// What to do on initialization
function init() {
  // Start the updateDate function every second to stay up to date
  setInterval(updateDate, 1e3);
  // You have to call it as well because interval will wait 1 second before actually calling it
  updateDate();
  // Load the calender to have the right columns and rows and days in the month
  loadCalender();
}

// On the document load call the init function to set everything up
document.addEventListener("DOMContentLoaded", init, { once: true });

function loadCalender() {
  const calender = document.querySelector(".calender");
  if (!calender) return; // Should never return but always have a failsafe so no errors are thrown
  calender.classList.add(
    currentDate["month-num"] === 2 ? "grid-rows-4" : "grid-rows-5"
  ); // Feb has 28 days which is only 4 rows of 7 whereas every other month has at least 5 rows of 7

  // get days in month
  const daysInMonth = new Date(
    currentDate.yyyy,
    currentDate["month-num"],
    0
  ).getDate();

  // Add each day to the calender
  for (let date = 1; date <= daysInMonth; date++) {
    const day = document.createElement("div");
    day.className = date == currentDate.dd ? "" : "";
    const dayText = document.createElement("small");
    dayText.textContent = date;
    dayText.className = `rounded-full p-0.5 block ${
      date == currentDate.dd ? "bg-primary-100" : "bg-neutral-200"
    }`;
    day.appendChild(dayText);
    calender.appendChild(day);
  }
}
