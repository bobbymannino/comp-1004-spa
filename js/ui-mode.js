// On init check for clean UI mode in local storage
if (localStorage.getItem("cleanUIMode") === null) localStorage.setItem("cleanUIMode", false);
else {
    if (localStorage.getItem("cleanUIMode") === "true") {
        document.querySelector("#clean-ui-checkbox").checked = true;
        changeUIMode();
    }
}

/**
 * Toggled change for the UI mode
 */
function changeUIMode() {
    const cleanUI = document.querySelector("#clean-ui-checkbox").checked;

    document.body.setAttribute("data-clean-ui", cleanUI);
}
