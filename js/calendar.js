/**
 * The calendar element
 * @type {HTMLDivElement}
 */
const calendar = document.querySelector(".calendar");

/**
 * Loads the calendar and calendar data.
 */
function loadCalendar() {
  /** The amount of days in the current month */
  const daysInMonth = new Date(
    currentDate.yyyy,
    currentDate["month-num"],
    0
  ).getDate();

  // Add each day to the calendar
  for (let date = 1; date <= daysInMonth; date++) {
    const day = document.createElement("div");
    day.className = "day";
    day.dataset.isCurrentDay = date == currentDate.dd;

    const dateText = document.createElement("h3");
    dateText.className = "date";
    dateText.textContent = date + nth(date);

    const hr = document.createElement("hr");

    const events = document.createElement("ol");
    events.className = "events";

    day.appendChild(dateText);
    day.appendChild(hr);
    day.appendChild(events);
    calendar.appendChild(day);
  }

  loadCalendarData();
}

/**
 * A single event
 * @typedef {{ urgent: boolean, startTime: number, endTime: number, title: string, color: string, description: string }} CalendarEvent
 */

/**
 * A single day
 * @typedef {CalendarEvent[]} Day
 */

/**
 * A single month
 * @typedef {{[date: string]: Day}} Month
 */

/**
 * A single year
 * @typedef {{[month: string]: Month}} Year
 */

/**
 * Represents the calendar data.
 * @typedef {{ [year: string]: Year }} Calendar
 */

/**
 * Loads the calendar data from a JSON file.
 * @returns {Promise<void>} - A promise that resolves when the calendar data is loaded.
 */
async function loadCalendarData() {
  const response = await fetch("../data/calendar.json");
  if (!response.ok) return alert("Failed to load calendar data");

  /**
   * @type {Calendar}
   */
  const calendarData = await response.json();

  const thisMonthsData =
    calendarData[currentDate.yyyy][currentDate["month-num"]];

  Object.keys(thisMonthsData).forEach((date) => {
    addEventsToDay(date, thisMonthsData[date]);
  });
}

/**
 * Takes in a day and adds all the events to that day
 * @param {string} date - The date of the day
 * @param {Day} day - An array of events for that day
 */
function addEventsToDay(date, day) {
  const dayEventsElement = calendar.querySelector(
    `.day:nth-child(${date}) .events`
  );

  day
    .sort((a, b) => a.startTime - b.startTime)
    .forEach((event) => addEventToCalender(event, dayEventsElement));
}

/**
 * Takes in an event and adds it to the calender.
 * @param {CalendarEvent} event
 * @param {HTMLDivElement} eventsElement
 */
function addEventToCalender(event, eventsElement) {
  const eventElement = document.createElement("li");
  eventElement.className = "event";
  eventElement.textContent = event.title;
  eventElement.dataset.urgent = event.urgent;
  eventElement.style.setProperty("--event-color", event.color);

  eventsElement.appendChild(eventElement);
}
