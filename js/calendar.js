/**
 * The calendar element
 * @type {HTMLDivElement}
 */
const calendarElement = document.querySelector(".calendar");

/**
 * The calendar data
 * @type {Calendar}
 */
let calendarData = {};

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
        calendarElement.appendChild(day);
    }

    loadCalendarData();
}

/**
 * A single event
 * @typedef {{
 * urgent: boolean,
 * title: string,
 * color: string,
 * description: string,
 * } & ({ allDay: true } | { startTime: number, endTime: number })} CalendarEvent
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

    calendarData = await response.json();

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
    const dayEventsElement = calendarElement.querySelector(
        `.day:nth-child(${date}) .events`
    );

    day.sort((a, b) => a.startTime - b.startTime)
        .sort((a) => (a.allDay ? -1 : 0))
        .forEach((event) => addEventToCalender(event, dayEventsElement));
}

/**
 * Takes in an event and adds it to the calender.
 * @param {CalendarEvent} event - The event to add
 * @param {HTMLDivElement} eventElement - The day element to add the event to
 */
function addEventToCalender(event, eventsElement) {
    const eventElement = document.createElement("li");
    eventElement.className = "event";
    eventElement.textContent = event.title;
    eventElement.dataset.urgent = event.urgent;
    eventElement.dataset.allDay = event.allDay === true;
    eventElement.style.setProperty("--event-color", event.color);

    eventsElement.appendChild(eventElement);
}

/**
 * Create an event from the form data
 * @param {HTMLFormElement} form
 */
function newEvent(form) {
    const formData = new FormData(form);

    const newEventDay =
        formData.get("date") ||
        `${currentDate.yyyy}-${currentDate["month-num"]}-${currentDate.dd}`; // Make sure to set defaults in none is set by user

    /**
     * @type {CalendarEvent}
     */
    const newEvent = {
        title: formData.get("title") || "Untitled",
        description: formData.get("description"),
        startTime: undefined,
        endTime: undefined,
        urgent: formData.get("urgent") === "on",
        allDay: formData.get("all__day") === "on",
        color: formData.get("color"),
    };

    if (!newEvent.allDay) {
        newEvent.startTime = parseInt(
            formData.get("start__time") || `${currentDate.hh}${currentDate.mm}`
        );

        newEvent.endTime = parseInt(
            formData.get("end__time") || `${currentDate.hh}${currentDate.mm}`
        );
    }

    const [newEventYear, newEventMonth, newEventDate] = newEventDay
        .split("-")
        .map((x) => parseInt(x));

    // If day already exists then add it to day
    if (calendarData[newEventYear][newEventMonth][newEventDate])
        calendarData[newEventYear][newEventMonth][newEventDate].push(newEvent);
    // Else create the day and add the event to it
    else calendarData[newEventYear][newEventMonth][newEventDate] = [newEvent];

    // If event is in current month add it to calender
    if (
        newEventMonth == currentDate["month-num"] &&
        newEventYear == currentDate.yyyy
    )
        addEventToCalender(
            newEvent,
            calendarElement.querySelector(
                `.day:nth-child(${newEventDate}) .events`
            )
        );

    // Close the modal
    closeModal("new__event");
}

/**
 * Open a specific modal
 * @param {string} modal - The modals class name specific to that one
 */
function openModal(modal) {
    document.querySelector(`.modal.${modal}`).classList.remove("hidden");
}

/**
 * Close a specific modal
 * @param {string} modal - The modals class name specific to that one
 */
function closeModal(modal) {
    document.querySelector(`.modal.${modal}`).classList.add("hidden");
}

// function exportCalendar() {
//   const updatedData = JSON.stringify(newCalendar);
//   const file = new Blob([updatedData], { type: "application/json" });
//   const a = document.createElement("a");
//   a.href = URL.createObjectURL(file);
//   a.download = "data.json";
//   a.click();
// }