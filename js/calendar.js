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

    const eventTitle = document.createElement("p");
    eventTitle.className = "title";
    eventTitle.textContent = event.title;

    eventContainer.appendChild(eventTitle);

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

        if (date.month == Number(currentDate["month-num"]) && date.year == Number(currentDate.yyyy)) {
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
 * Edits an event
 * @param {HTMLFormElement} form
 */
function editEvent(form) {
    const formData = new FormData(form);

    const newEventDay = formData.get("date") || `${currentDate.yyyy}-${currentDate["month-num"]}-${currentDate.dd}`; // Make sure to set defaults in none is set by user

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

            endTimeH = parseInt(formData.get("end__time").slice(0, 2));
            endTimeM = parseInt(formData.get("end__time").slice(3, 5));
        } catch {}

        newEvent.startTime = { hour: startTimeH, minute: startTimeM };
        newEvent.endTime = { hour: endTimeH, minute: endTimeM };
        newEvent.allDay = undefined;
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

    // If day already exists then add it to day otherwise create the day
    if (calendarData[newEventYear]) {
        if (calendarData[newEventYear][newEventMonth]) {
            if (calendarData[newEventYear][newEventMonth][newEventDate])
                calendarData[newEventYear][newEventMonth][newEventDate].push(newEvent);
            else calendarData[newEventYear][newEventMonth][newEventDate] = [newEvent];
        } else calendarData[newEventYear][newEventMonth] = { [newEventDate]: [newEvent] };
    } else calendarData[newEventYear] = { [newEventMonth]: { [newEventDate]: [newEvent] } };

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
