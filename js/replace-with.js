/**
 * Updates the date variable and replaces all the elements text with the data-replace-with attribute
 */
function updateReplaceWith() {
    // Replace all the elements text with the data-replace-with attribute
    [...document.querySelectorAll("[data-replace-with]")].forEach(replaceWith);
}

/**
 * Replace the elements text content with something to do with the date
 * @param {HTMLElement} element
 */
function replaceWith(element) {
    const format = element.getAttribute("data-replace-with");
    if (!format) return;

    let currentText = element.textContent;
    let newText = format;

    Object.entries(currentDateTime).forEach(([key, value]) => {
        newText = newText.replace(new RegExp(key, "g"), value);
    });

    // Only update the text if it has changed
    if (currentText !== newText) element.textContent = newText;
}
