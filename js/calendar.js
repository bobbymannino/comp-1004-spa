/**
 * The calendar element
 * @type {HTMLDivElement}
 */
const calendarElement = document.querySelector(".calendar");

/**
 * The calendar data. A list of all the events in the calendar
 * @type {CalendarData}
 */
let calendarData = [];

/**
 * Loads the calendar UI to the current data. It uses calendarData to load the events and uses the entered date to load the correct month.
 * @param {number} year - The year to load
 * @param {number} month - The month to load
 */
async function loadCalendarUI(year, month) {
    // Make sure the calendar is empty each time
    calendarElement.innerHTML = "";

    /** The amount of days in the current month */
    const daysInMonth = new Date(year, month, 0).getDate();

    // Add each day to the calendar
    for (let date = 1; date <= daysInMonth; date++) {
        const day = document.createElement("div");
        day.className = "day";
        day.dataset.isCurrentDay = year == currentDateTime.year && month == currentDateTime.month && date == currentDateTime.date;

        const dateText = document.createElement("h3");
        dateText.className = "date";
        dateText.textContent = date + nthOfDate(date);

        const hr = document.createElement("hr");

        const eventList = document.createElement("ol");
        eventList.className = "event-list";

        const events = sortEvents(findEvents(year, month, date));

        events.forEach((event) => {
            eventList.appendChild(createEventElement(event));
        });

        day.appendChild(dateText);
        day.appendChild(hr);
        day.appendChild(eventList);

        calendarElement.appendChild(day);
    }
}

/**
 * Create an event element
 * @param {CalendarEvent} event
 */
function createEventElement(event) {
    const eventContainer = document.createElement("li");
    eventContainer.className = "event";
    eventContainer.dataset.priority = event.priority;
    eventContainer.style.setProperty("--hue", event.hue);

    const eventTitle = document.createElement("b");
    eventTitle.className = "title";
    eventTitle.textContent = event.title;

    const eventDescription = document.createElement("p");
    eventDescription.className = "description";
    eventDescription.textContent = event.description;

    eventContainer.appendChild(eventTitle);
    eventContainer.appendChild(eventDescription);

    eventContainer.addEventListener("dblclick", () => {
        loadUpdateEventModal(event);

        openModal("update-event");
    });

    return eventContainer;
}

/**
 * Loads the calendar data from a JSON file.
 * @param {Object | undefined} json - The json data
 * @returns {Promise<void>} - A promise that resolves when the calendar data is loaded.
 */
async function loadCalendarData(json) {
    if (json) calendarData = json;
    else {
        const response = await fetch("../data/calendar.json");
        if (!response.ok) return alert("Failed to load calendar data");

        calendarData = await response.json();
    }

    datePickerYear.value = currentDateTime.year;
    datePickerMonth.value = currentDateTime.month;
}

/**
 * Check for events and return a list of events for that day
 * @param {string | undefined} year - The year to check for events e.g. 2004
 * @param {string | undefined} month - The month to check for events e.g. 12
 * @param {string | undefined} date - The date to check for events e.g. 1
 * @param {string | undefined} id - The id of the event to check for e.g. 124-xcb-315
 * @returns {CalendarEvent[]} - An array of events for that day
 */
function findEvents(year, month, date, id) {
    const events = calendarData.events.filter((event) => {
        const begin = new Date(event.begin);

        if (id) return event.id === id;

        if (year) {
            if (month) {
                if (date) {
                    // Use triple === because its faster then double
                    return begin.getFullYear() === year && begin.getMonth() + 1 === month && begin.getDate() === date;
                }
                return begin.getFullYear() === year && begin.getMonth() + 1 === month;
            }
            return begin.getFullYear() === year;
        }

        return true;
    });

    return events;
}

/**
 * Sort events by date first, then by priority
 * @param {CalendarEvent[]} events - The events to sort
 */
function sortEvents(events) {
    return events.sort((a, b) => {
        const aBegin = new Date(a.begin);
        const bBegin = new Date(b.begin);

        if (aBegin.getTime() === bBegin.getTime()) return a.priority - b.priority;

        return aBegin.getTime() - bBegin.getTime();
    });
}
