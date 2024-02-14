/** @type {HTMLSelectElement} */
const datePickerYear = document.querySelector(".date-picker select[name='year']");
/** @type {HTMLSelectElement} */
const datePickerMonth = document.querySelector(".date-picker select[name='month']");
/** @type {HTMLButtonElement} */
const goToCurrentDateButton = document.querySelector('header button[data-replace-with="month-text year"]');

[datePickerMonth, datePickerYear].forEach((picker) => {
    picker.addEventListener("change", () => {
        const selectedYear = Number(datePickerYear.value);
        const selectedMonth = Number(datePickerMonth.value);

        loadCalendarUI(selectedYear, selectedMonth);

        if (selectedYear === currentDateTime.year && selectedMonth === currentDateTime.month)
            goToCurrentDateButton.classList.add("hidden");
        else goToCurrentDateButton.classList.remove("hidden");
    });
});

// On the document load call the init function to set everything up
document.addEventListener("DOMContentLoaded", init, { once: true });

// On scroll if scrolled past the top add the data attribute to the body
document.addEventListener("scroll", () => {
    document.body.dataset.scrolled = window.scrollY > 0;
});

/**
 * Sets up all the initial data and events
 */
async function init() {
    updateDateTime();
    updateReplaceWith();

    // Start the updateDate function every second to stay up to date
    setInterval(() => {
        updateDateTime();
        updateReplaceWith();
    }, 1e3);

    // Load the calendar data
    await loadCalendarData();

    // Load the calendar & banner UI
    loadCalendarUI(currentDateTime.year, currentDateTime.month);
    loadBannerUI();
}
