function init() {
    // Start the updateDate function every second to stay up to date
    setInterval(updateDate, 1e3);
    // You have to call it as well because interval will wait 1 second before actually calling it
    updateDate();
    // Load the calendar to have the right columns and rows and days in the month
    loadCalendar();
}

// On the document load call the init function to set everything up
document.addEventListener("DOMContentLoaded", init, { once: true });

document.addEventListener("scroll", () => {
    document.body.dataset.scrolled = window.scrollY > 0;
});
