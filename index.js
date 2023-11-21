/**
 * The current date updated every second
 * */
let date = new Date();

/**
 * Updates the date variable and replaces all the elements text with the data-replace-with attribute
 */
function updateDate() {
  date = new Date();

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
     - dd = day of the month = 05
     - mm = month of the year = 03
     - yy = year = 21
     - yyyy = year = 2021
     - day = The current day - Monday
     - day-short - 3 letter day - Mon
     - month - The current month - November
     - month-short - 3 letter month - Nov 
     */
  const format = el.getAttribute("data-replace-with");
  if (!format) return;

  let newText = "";

  switch (format) {
    case "dd": {
      newText = date.getDate();
      break;
    }
    case "mm": {
      newText = date.getMonth() + 1;
      break;
    }
    case "yy": {
      newText = date.getFullYear().toString().slice(-2);
      break;
    }
    case "yyyy": {
      newText = date.getFullYear();
      break;
    }
    case "day": {
      newText = date.toLocaleDateString("en-US", { weekday: "long" });
      break;
    }
    case "day-short": {
      newText = date.toLocaleDateString("en-US", { weekday: "short" });
      break;
    }
    case "month": {
      newText = date.toLocaleDateString("en-US", { month: "long" });
      break;
    }
    case "month-short": {
      newText = date.toLocaleDateString("en-US", { month: "short" });
      break;
    }
    default: {
      newText = "Invalid format";
    }
  }

  // Only update the text if it has changed
  if (newText !== el.textContent) el.textContent = newText;
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
