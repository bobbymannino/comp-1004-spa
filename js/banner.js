/** @type {HTMLOListElement} */
const bannerList = document.querySelector("header[role='banner'] ol");

/**
 * Loads the banner element with today's events
 */
function loadBannerUI() {
    // Make sure banner is empty each time
    bannerList.innerHTML = "";

    let todaysEvents = sortEvents(findEvents(currentDateTime.year, currentDateTime.month, currentDateTime.date));

    todaysEvents.forEach((event) => {
        bannerList.appendChild(createEventElement(event));
    });
}
