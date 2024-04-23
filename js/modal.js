/**
 * Loads the update event modal with the event data
 * @param {CalendarEvent} event - The event to edit
 */
function loadUpdateEventModal(event) {
    const modal = document.querySelector("div.modal.update-event");
    const form = modal.querySelector("form");

    const begin = new Date(event.begin);
    const end = new Date(event.end);

    form.querySelector("input[name='id']").value = event.id;
    form.querySelector("input[name='title']").value = event.title;
    form.querySelector("textarea[name='description']").value = event.description;
    form.querySelector("input[name='color']").value = hslToHex(event.hue, 80, 60);
    form.querySelector("select[name='priority']").value = event.priority;
    form.querySelector("input[name='begin-date']").value =
        begin.getFullYear() +
        "-" +
        (begin.getMonth() + 1).toFixed().padStart(2, 0) +
        "-" +
        begin.getDate().toFixed().padStart(2, 0);
    form.querySelector("input[name='begin-time']").value =
        begin.getHours().toFixed().padStart(2, 0) + ":" + begin.getMinutes().toFixed().padStart(2, 0);
    form.querySelector("input[name='end-date']").value =
        end.getFullYear() + "-" + (end.getMonth() + 1).toFixed().padStart(2, 0) + "-" + end.getDate().toFixed().padStart(2, 0);
    form.querySelector("input[name='end-time']").value =
        end.getHours().toFixed().padStart(2, 0) + ":" + end.getMinutes().toFixed().padStart(2, 0);
}

/**
 * Deletes a specific event
 * @param {HTMLButtonElement} button - The button that was clicked
 */
function deleteCalendarEvent(button) {
    const eventId = button.parentElement.parentElement.querySelector("input[name='id']").value;

    calendarData.events = calendarData.events.filter((event) => event.id !== eventId);

    loadBannerUI();
    loadCalendarUI(Number(datePickerYear.value), Number(datePickerMonth.value));
}

/**
 * Edits an event, is called when the user submits the form
 * @param {HTMLFormElement} form
 */
function updateCalendarEvent(form) {
    const formData = new FormData(form);
    const inputs = Object.fromEntries(formData.entries());

    const now = currentDateTime.year + "-" + currentDateTime.month + "-" + currentDateTime.date;

    const beginDate = inputs["begin-date"] || now;
    const beginTime = inputs["begin-time"] || "12:00";
    const newBegin = new Date(beginDate + " " + beginTime);

    const endDate = inputs["end-date"] || now;
    const endTime = inputs["end-time"] || "13:00";
    const newEnd = new Date(endDate + " " + endTime);

    /** @type {CalendarEvent} */
    const newEvent = {
        id: inputs.id,
        title: inputs.title || "Untitled Event",
        description: inputs.description,
        hue: hexToHsl(inputs.color).hue,
        priority: Number(inputs.priority),
        begin: newBegin,
        end: newEnd,
    };

    // Replace the old event with the new
    calendarData.events = calendarData.events.map((event) => (event.id === newEvent.id ? newEvent : event));

    loadBannerUI();
    loadCalendarUI(Number(datePickerYear.value), Number(datePickerMonth.value));
}

/**
 * Creates a new event, is called when the user submits the form
 * @param {HTMLFormElement} form
 */
function createCalendarEvent(form) {
    const formData = new FormData(form);
    const inputs = Object.fromEntries(formData.entries());

    const beginDate = inputs["begin-date"] || new Date().toISOString().split("T")[0];
    const beginTime = inputs["begin-time"] || "00:00";
    const endDate = inputs["end-date"] || new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    const endTime = inputs["end-time"] || "00:00";

    /** @type {CalendarEvent} */
    const newEvent = {
        id: crypto.randomUUID(),
        title: inputs.title || "Untitled Event",
        description: inputs.description,
        hue: hexToHsl(inputs.color).hue,
        priority: Number(inputs.priority),
        begin: beginDate + "T" + beginTime,
        end: endDate + "T" + endTime,
    };

    if (isEventOverlapping(newEvent)) alert("Warning: Event overlaps with another event!");

    // Needs to be this because of the proxy
    calendarData.events = [...calendarData.events, newEvent];

    loadBannerUI();
    loadCalendarUI(Number(datePickerYear.value), Number(datePickerMonth.value));
}

/**
 * Open a specific modal
 * @param {string} modalClass - The modals class name specific to that one
 */
function openModal(modalClass) {
    document.querySelector(`.modal.${modalClass}`).dataset.hidden = "false";
}

/**
 * Close a specific modal
 * @param {string} modalClass - The modals class name specific to that one
 */
function closeModal(modalClass) {
    document.querySelector(`.modal.${modalClass}`).dataset.hidden = "true";
}

/**
 * Converts a hsl value to a hue value
 * @param {number} h the hue value
 * @param {number} s the saturation value
 * @param {number} l the lightness value
 */
function hslToHex(h, s, l) {
    s /= 100;
    l /= 100;

    let c = (1 - Math.abs(2 * l - 1)) * s,
        x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
        m = l - c / 2,
        r = 0,
        g = 0,
        b = 0;

    if (0 <= h && h < 60) {
        r = c;
        g = x;
        b = 0;
    } else if (60 <= h && h < 120) {
        r = x;
        g = c;
        b = 0;
    } else if (120 <= h && h < 180) {
        r = 0;
        g = c;
        b = x;
    } else if (180 <= h && h < 240) {
        r = 0;
        g = x;
        b = c;
    } else if (240 <= h && h < 300) {
        r = x;
        g = 0;
        b = c;
    } else if (300 <= h && h < 360) {
        r = c;
        g = 0;
        b = x;
    }
    // Having obtained RGB, convert channels to hex
    r = Math.round((r + m) * 255).toString(16);
    g = Math.round((g + m) * 255).toString(16);
    b = Math.round((b + m) * 255).toString(16);

    // Prepend 0s, if necessary
    if (r.length == 1) r = "0" + r;
    if (g.length == 1) g = "0" + g;
    if (b.length == 1) b = "0" + b;

    return "#" + r + g + b;
}

/**
 * Turns a hex value into hsl value
 * @param {number} hex
 */
function hexToHsl(hex) {
    // Convert hex to RGB first
    let r = 0,
        g = 0,
        b = 0;
    if (hex.length == 4) {
        r = "0x" + hex[1] + hex[1];
        g = "0x" + hex[2] + hex[2];
        b = "0x" + hex[3] + hex[3];
    } else if (hex.length == 7) {
        r = "0x" + hex[1] + hex[2];
        g = "0x" + hex[3] + hex[4];
        b = "0x" + hex[5] + hex[6];
    }
    // Then to HSL
    r /= 255;
    g /= 255;
    b /= 255;
    let cmin = Math.min(r, g, b),
        cmax = Math.max(r, g, b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;

    if (delta == 0) h = 0;
    else if (cmax == r) h = ((g - b) / delta) % 6;
    else if (cmax == g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;

    h = Math.round(h * 60);

    if (h < 0) h += 360;

    l = (cmax + cmin) / 2;
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return { hue: h, saturation: s, lightness: l };
}

/**
 * Opens and loads the day view modal with the specific date
 * @param {number} year - The year to open the modal with
 * @param {number} month - The month to open the modal with
 * @param {number} date - The date to open the modal with
 */
function openAndLoadDayViewModal(year, month, date) {
    openModal("day-view");

    const formatter = new Intl.DateTimeFormat("en", { dateStyle: "full" });

    document.querySelector(".modal.day-view .date").textContent = formatter
        .format(new Date(year, month - 1, date))
        .replace(/,/g, " ");

    const events = findEvents(year, month, date);

    document.querySelector(".modal.day-view .count").textContent = events.length
        ? `You have ${events.length} event${events.length > 1 ? "s" : ""}`
        : "You have no events";

    /** @typedef {HTMLOListElement} */
    const eventsList = document.querySelector(".modal.day-view ol.events");

    eventsList.innerHTML = "";

    let runningHighest = 0;

    events.forEach((e1, i) => {
        const checkAgainst = events.slice(i + 1);

        let currentHighest = 0;

        checkAgainst.forEach((e2) => {
            if (areEventsOverlapping(e1, e2)) currentHighest++;
        });

        if (currentHighest > runningHighest) runningHighest = currentHighest;
    });

    const columns = runningHighest + 1;

    eventsList.style.setProperty("--columns", columns);

    /** Keep track of which column to add the next event too */
    let currentColumn = 1;

    function nextColumn() {
        currentColumn++;
        if (currentColumn > columns) currentColumn = 1;
    }

    sortEvents(events).forEach((e, i) => {
        const event = document.createElement("li");
        event.textContent = e.title;
        event.className = "event";
        event.dataset.priority = e.priority;
        event.style.setProperty("--hue", e.hue);

        // 1440 minutes in a day
        // Get start time of event
        // per 14.4 minutes add 1%
        const start = new Date(e.begin);
        const startHours = start.getHours();
        const totalMinutes = start.getMinutes() + startHours * 60;
        console.log(totalMinutes / 14.4);
        event.style.setProperty("--y", totalMinutes / 14.4 + "%");

        // get duration of event in hours
        const duration = (new Date(e.end) - new Date(e.begin)) / (1000 * 60 * 60);
        event.style.setProperty("--height", (duration / 24) * 100 + "%");

        // somehow figure out if the event is overlapping and if so by how many and set --x to % of that
        // if it's not overlapping set --x to 0

        /** Starting at 1 what column to be in */
        const percent = (currentColumn - 1) / columns;
        event.style.setProperty("--x", percent * 100 + "%");

        if (events[i + 1] && areEventsOverlapping(e, events[i + 1])) nextColumn();
        else currentColumn = 1;

        event.addEventListener("dblclick", () => {
            closeModal("day-view");

            loadUpdateEventModal(e);

            openModal("update-event");
        });

        eventsList.appendChild(event);
    });
}
