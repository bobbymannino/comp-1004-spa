/**
 * The calendar element
 * @type {HTMLDivElement}
 */
const calendarElement = document.querySelector(".calendar");

/**
 * The calendar data. A list of all the events in the calendar
 * @type {CalendarData}
 */
let calendarData = new Proxy(
    { events: [] },
    // Runs every time a property is set
    {
        set: (obj, prop, val) => {
            obj[prop] = val;

            // Save the data to local storage
            saveCalendarDataToLocalStorage(obj);

            return true;
        },
    }
);

/**
 * Checks if there is any events that exist during a single event
 * @param {CalendarEvent} event - The event to check if overlapping
 * @returns {boolean} - If there are any events during the single event
 */
function isEventOverlapping(event) {
    const eventStart = new Date(event.begin).getTime();
    const eventEnd = new Date(event.end).getTime();

    const overlappingEvents = calendarData.events.filter((e) => {
        const begin = new Date(e.begin).getTime();
        const end = new Date(e.end).getTime();

        return eventStart < end && eventEnd > begin;
    });

    return overlappingEvents.length > 0;
}

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
        day.addEventListener("drop", (e) => handleDrop(e));
        day.addEventListener("dragover", (e) => {
            e.preventDefault();

            day.dataset.draggingOver = true;
        });
        day.addEventListener("dragleave", (e) => {
            e.preventDefault();

            day.dataset.draggingOver = false;
        });

        const span = document.createElement("span");
        span.className = "weekday";
        // - 1 because months are zero indexed
        span.textContent = new Date(year, month - 1, date).toLocaleString("en", { weekday: "long" });

        const dateText = document.createElement("h3");
        dateText.className = "date";
        dateText.textContent = date + nthOfDate(date) + " ";
        dateText.appendChild(span);

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
    eventContainer.id = `event-${event.id}`;
    eventContainer.className = "event";
    eventContainer.setAttribute("draggable", true);
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

    eventContainer.addEventListener("dragstart", (e) => {
        eventContainer.dataset.dragging = true;

        e.dataTransfer.setData("text/plain", event.id);
    });

    eventContainer.addEventListener("dragend", (e) => {
        eventContainer.dataset.dragging = false;
    });

    return eventContainer;
}

/**
 * Handles the drop of an event on a day
 * @param {DragEvent} e - The drop event
 */
function handleDrop(e) {
    e.preventDefault();

    const eventId = e.dataTransfer.getData("text/plain");

    let newDayElement = e.target;
    while (newDayElement.className != "day") {
        newDayElement = newDayElement.parentElement;
    }

    const newDate = [...calendarElement.children].findIndex((day) => day === newDayElement) + 1;

    calendarData.events = calendarData.events.map((event) => {
        if (event.id === eventId) {
            const begin = new Date(event.begin);
            begin.setDate(newDate);
            event.begin = begin;

            const end = new Date(event.end);
            end.setDate(newDate);
            event.end = end;
        }

        return event;
    });

    loadCalendarUI(Number(datePickerYear.value), Number(datePickerMonth.value));
    loadBannerUI();
}

/**
 * Fetches and returns the demo calendar data events
 */
async function getDemoCalendarDataEvents() {
    const response = await fetch("../data/calendar.json");

    /** @type {{ events: CalendarEvent[] }} */
    const events = (await response.json()).events;

    return events;
}

/**
 * Loads the calendar data from a JSON file.
 * @param {{ [k: any]: any } | "localStorage" | undefined} json - The json data
 * @returns {Promise<void>} - A promise that resolves when the calendar data is loaded.
 */
async function loadCalendarData(json) {
    // Load from the demo file
    if (!json) calendarData.events = await getDemoCalendarDataEvents();
    // Try to load from localStorage
    else if (json === "localStorage") {
        const possibleCalendarData = getCalendarDataFromLocalStorage();

        // If the data exists, use it
        if (possibleCalendarData) calendarData.events = possibleCalendarData.events;
        // Else load from the demo file
        else calendarData.events = await getDemoCalendarDataEvents();
    }
    // Load from the provided json
    else calendarData.events = json.events;

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
