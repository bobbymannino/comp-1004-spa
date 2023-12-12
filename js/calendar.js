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
 * Resets the calender
 */
function resetCalendar() {
    calendarElement.innerHTML = "";
}

/**
 * @param {Object | undefined} jsonFile - The json object
 * Loads the calendar and calendar data.
 */
async function loadCalendar(jsonFile) {
    /** The amount of days in the current month */
    const daysInMonth = new Date(currentDate.yyyy, currentDate["month-num"], 0).getDate();

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

    await loadCalendarData(jsonFile);

    loadBanner();
}

/**
 * Function to reset the banner
 */
function resetBanner() {
    const banner = document.querySelector("header[role='banner']");
    banner.querySelector("ol").innerHTML = "";
}

/**
 * Loads the banner element and sets it right
 */
function loadBanner() {
    const todaysEvents = checkForEvents(currentDate.yyyy, parseInt(currentDate["month-num"]), parseInt(currentDate.dd));

    const banner = document.querySelector("header[role='banner']");
    banner.dataset.hidden = todaysEvents.length === 0;

    const bannerList = banner.querySelector("ol");

    todaysEvents.forEach((event) => {
        const eventElement = document.createElement("div");
        eventElement.className = "event";
        eventElement.dataset.urgent = event.urgent;
        eventElement.dataset.allDay = event.allDay === true;
        eventElement.style.setProperty("--event-color", event.color);

        const eventTitle = document.createElement("p");
        eventTitle.className = "title";
        eventTitle.textContent = event.title;

        eventElement.appendChild(eventTitle);

        bannerList.appendChild(eventElement);
    });
}

/**
 * A single event
 * @typedef {{
 * urgent: boolean,
 * title: string,
 * color: string,
 * description: string,
 * id: string,
 * } & ({ allDay: true } | { startTime: { hour: number, minute: number }, endTime: { hour: number, minute: number }})} CalendarEvent
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
 * @param {Object | undefined} jsonFile - The path to the JSON file.
 * @returns {Promise<void>} - A promise that resolves when the calendar data is loaded.
 */
async function loadCalendarData(jsonFile) {
    if (jsonFile) {
        calendarData = jsonFile;
    } else {
        const response = await fetch("../data/calendar.json");
        if (!response.ok) return alert("Failed to load calendar data");

        calendarData = await response.json();
    }

    const thisMonthsData = calendarData[currentDate.yyyy][currentDate["month-num"]];

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
    const dayEventsElement = calendarElement.querySelector(`.day:nth-child(${date}) .events`);

    day.sort((a, b) => {
        if (a.allDay && b.allDay) return 0;
        else if (a.allDay) return -1;
        else if (b.allDay) return 1;
        else return getTime(a).startTime - getTime(b).startTime;
    }).forEach((event) => addEventToCalender(event, dayEventsElement));
}

/**
 * Returns the time for an event or "All day" if it is an all day event
 * @param {CalendarEvent} event
 */
function getTime(event) {
    if (event.allDay) return "All day";

    const startTime = `${padWithZero(event.startTime.hour, 2)}:${padWithZero(event.startTime.minute, 2)}`;
    const endTime = `${padWithZero(event.endTime.hour, 2)}:${padWithZero(event.endTime.minute, 2)}`;

    return { startTime, endTime };
}

/**
 * Check for events and return a list of events for that day
 * @param {string} year - The year to check for events e.g. 2004
 * @param {string} month - The month to check for events e.g. 12
 * @param {string} date - The date to check for events e.g. 1
 * @returns {Day} - An array of events for that day
 */
function checkForEvents(year, month, date) {
    return calendarData[year][month][date] || [];
}

/**
 * Takes in an event and adds it to the calender.
 * @param {CalendarEvent} event - The event to add
 * @param {HTMLDivElement} eventElement - The day element to add the event to
 */
function addEventToCalender(event, eventsElement) {
    const eventElement = document.createElement("li");
    eventElement.dataset.eventId = event.id;
    eventElement.className = "event";
    eventElement.dataset.urgent = event.urgent;
    eventElement.dataset.allDay = event.allDay === true;
    eventElement.style.setProperty("--event-color", event.color);
    eventElement.title = "Toggle description";

    const eventTitle = document.createElement("p");
    eventTitle.className = "title";
    eventTitle.textContent = event.title;

    const eventDescription = document.createElement("small");
    eventDescription.className = "description";
    eventDescription.textContent = event.description;

    eventElement.appendChild(eventTitle);
    eventElement.appendChild(eventDescription);

    eventsElement.appendChild(eventElement);

    eventElement.addEventListener("click", () => {
        eventElement.dataset.open = eventElement.dataset.open === "true" ? false : true;
    });

    eventElement.addEventListener("dblclick", () => {
        openEditEventModal(event);
    });
}

/**
 * Opens the edit event modal
 * @param {CalendarEvent} event - The event to edit
 */
function openEditEventModal(event) {
    openModal("edit__event");

    const form = document.querySelector("div.modal.edit__event .container form");

    form.querySelector("input[name='id']").value = event.id;
    form.querySelector("input[name='title']").value = event.title;
    form.querySelector("textarea[name='description']").value = event.description;
    form.querySelector("input[name='color']").value = event.color;
    form.querySelector("input[name='urgent']").checked = event.urgent;
    if (event.allDay) form.querySelector("input[name='all__day']").checked = true;
    else {
        form.querySelector("input[name='all__day']").checked = false;

        form.querySelector("input[name='start__time']").value = `${padWithZero(event.startTime.hour, 2)}:${padWithZero(
            event.startTime.minute,
            2
        )}`;

        form.querySelector("input[name='end__time']").value = `${padWithZero(event.endTime.hour, 2)}:${padWithZero(
            event.endTime.minute,
            2
        )}`;
    }

    const date = findDateOfEvent(event.id);
    if (date)
        form.querySelector("input[name='date']").value =
            date.year + "-" + padWithZero(date.month, 2) + "-" + padWithZero(date.date, 2);
}

/**
 * Deletes a specific event
 */
function deleteEvent() {
    const form = document.querySelector("div.modal.edit__event .container form");
    const eventId = form.querySelector("input[name='id']").value;

    const date = findDateOfEvent(eventId);
    if (date) {
        calendarData[date.year][date.month][date.date] = calendarData[date.year][date.month][date.date].filter(
            (event) => event.id !== eventId
        );

        if (date.month == currentDate["month-num"] && date.year == currentDate.yyyy) {
            const dayEventsElement = calendarElement.querySelector(`.day:nth-child(${date.date}) .events`);
            dayEventsElement.innerHTML = "";
            addEventsToDay(date.date, calendarData[date.year][date.month][date.date]);
        }
    }

    closeModal("edit__event");

    resetBanner();
    loadBanner();
}

/**
 * Finds and returns the event date with the given id
 * @param {string} eventId - The id of the event to find
 */
function findDateOfEvent(eventId) {
    for (const year in calendarData) {
        for (const month in calendarData[year]) {
            for (const date in calendarData[year][month]) {
                for (const event of calendarData[year][month][date]) {
                    if (event.id === eventId) return { year, month, date };
                }
            }
        }
    }
}

/**
 * A utility function to add the correct suffix to a number
 * @param {Number} number The number to pad
 * @param {Number} length The length to pad to
 */
function padWithZero(number, length) {
    return String(number).padStart(length, "0");
}

/**
 * Edits an event
 * @param {HTMLFormElement} form
 */
function editEvent(form) {
    const formData = new FormData(form);

    const newEventDay = formData.get("date") || `${currentDate.yyyy}-${currentDate["month-num"]}-${currentDate.dd}`; // Make sure to set defaults in none is set by user

    console.log(newEventDay);

    /**
     * @type {CalendarEvent}
     */
    const newEvent = {
        id: formData.get("id"),
        title: formData.get("title") || "Untitled",
        description: formData.get("description"),
        startTime: undefined,
        endTime: undefined,
        urgent: formData.get("urgent") === "on",
        allDay: formData.get("all__day") === "on",
        color: formData.get("color"),
    };

    if (!newEvent.allDay) {
        let startTimeH = currentDate.hh;
        let startTimeM = currentDate.mm;
        let endTimeH = currentDate.hh;
        let endTimeM = currentDate.mm;

        try {
            startTimeH = parseInt(formData.get("start__time").slice(0, 2));
            startTimeM = parseInt(formData.get("start__time").slice(3, 5));

            endTimeH = parseInt(formData.get("endTime").slice(0, 2));
            endTimeM = parseInt(formData.get("endTime").slice(3, 5));
        } catch {}

        newEvent.startTime = { hour: startTimeH, minute: startTimeM };
        newEvent.endTime = { hour: endTimeH, minute: endTimeM };
    }

    const [newEventYear, newEventMonth, newEventDate] = newEventDay.split("-").map((x) => parseInt(x));

    const oldEventDate = findDateOfEvent(newEvent.id);

    calendarData[oldEventDate.year][oldEventDate.month][oldEventDate.date] = calendarData[oldEventDate.year][oldEventDate.month][
        oldEventDate.date
    ].filter((event) => event.id !== newEvent.id);

    if (calendarData[newEventYear][newEventMonth][newEventDate])
        calendarData[newEventYear][newEventMonth][newEventDate].push(newEvent);
    else calendarData[newEventYear][newEventMonth][newEventDate] = [newEvent];

    document.querySelector(`.day .events li[data-event-id='${newEvent.id}']`).remove();
    addEventToCalender(newEvent, document.querySelector(`.day:nth-child(${newEventDate}) .events`));

    resetBanner();
    loadBanner();

    // Close the modal
    closeModal("edit__event");
}

/**
 * Wipes the day of events on the calender
 * @param {Date} date - The date to wipe
 */
function wipeDay(date) {
    document.querySelector(`.day:nth-child(${date}) .events`).innerHTML = "";
}

/**
 * Finds the event based on the event id
 * @param {string} eventId - The id of the event to find
 */
function findEvent(eventId) {
    for (const year in calendarData) {
        for (const month in calendarData[year]) {
            for (const date in calendarData[year][month]) {
                for (const event of calendarData[year][month][date]) {
                    if (event.id === eventId) return event;
                }
            }
        }
    }
}

/**
 * Create an event from the form data
 * @param {HTMLFormElement} form
 */
function newEvent(form) {
    const formData = new FormData(form);

    const newEventDay = formData.get("date") || `${currentDate.yyyy}-${currentDate["month-num"]}-${currentDate.dd}`; // Make sure to set defaults in none is set by user

    /**
     * @type {CalendarEvent}
     */
    const newEvent = {
        id: crypto.randomUUID(),
        title: formData.get("title") || "Untitled",
        description: formData.get("description"),
        startTime: undefined,
        endTime: undefined,
        urgent: formData.get("urgent") === "on",
        allDay: formData.get("all__day") === "on",
        color: formData.get("color"),
    };

    if (!newEvent.allDay) {
        let startTimeH = currentDate.hh;
        let startTimeM = currentDate.mm;
        let endTimeH = currentDate.hh;
        let endTimeM = currentDate.mm;

        try {
            startTimeH = parseInt(formData.get("start__time").slice(0, 2));
            startTimeM = parseInt(formData.get("start__time").slice(3, 5));

            endTimeH = parseInt(formData.get("endTime").slice(0, 2));
            endTimeM = parseInt(formData.get("endTime").slice(3, 5));
        } catch {}

        newEvent.startTime = { hour: startTimeH, minute: startTimeM };
        newEvent.endTime = { hour: endTimeH, minute: endTimeM };
    }

    const [newEventYear, newEventMonth, newEventDate] = newEventDay.split("-").map((x) => parseInt(x));

    // If day already exists then add it to day
    if (calendarData[newEventYear][newEventMonth][newEventDate])
        calendarData[newEventYear][newEventMonth][newEventDate].push(newEvent);
    // Else create the day and add the event to it
    else calendarData[newEventYear][newEventMonth][newEventDate] = [newEvent];

    // If event is in current month add it to calender
    if (newEventMonth == currentDate["month-num"] && newEventYear == currentDate.yyyy)
        addEventToCalender(newEvent, calendarElement.querySelector(`.day:nth-child(${newEventDate}) .events`));

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
