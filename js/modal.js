/**
 * Loads the update event modal with the event data
 * @param {CalendarEvent} event - The event to edit
 */
function loadUpdateEventModal(event) {
    const modal = document.querySelector("div.modal.update-event");
    const form = modal.querySelector("form");

    form.querySelector("input[name='id']").value = event.id;
    form.querySelector("input[name='title']").value = event.title;
    form.querySelector("input[name='color']").value = hslToHex(event.hue, 80, 60);
    form.querySelector("select[name='priority']").value = event.priority;
    form.querySelector("input[name='begin-date']").value = new Date(event.begin).toISOString().split("T")[0];
    form.querySelector("input[name='begin-time']").value = new Date(event.begin).toISOString().split("T")[1].slice(0, 5);
    form.querySelector("input[name='end-date']").value = new Date(event.end).toISOString().split("T")[0];
    form.querySelector("input[name='end-time']").value = new Date(event.end).toISOString().split("T")[1].slice(0, 5);
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

    /** @type {CalendarEvent} */
    const newEvent = {
        id: inputs.id,
        title: inputs.title || "Untitled Event",
        description: inputs.description,
        hue: hexToHsl(inputs.color).hue,
        priority: Number(inputs.priority),
        begin:
            inputs["begin-date"] && inputs["begin-time"]
                ? new Date(inputs["begin-date"] + " " + inputs["begin-time"])
                : new Date(),
        end:
            inputs["end-date"] && inputs["end-time"]
                ? new Date(inputs["end-date"] + " " + inputs["end-time"])
                : new Date(new Date().getTime() + 1000 * 60 * 60),
    };

    calendarData.events = calendarData.events.map((event) => {
        if (event.id !== newEvent.id) return event;

        return newEvent;
    });

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
