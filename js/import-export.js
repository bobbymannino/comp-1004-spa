/**
 * Takes the current calender and saves it as a json file for the user
 */
function exportCalender() {
    downloadFile("calender.json", JSON.stringify(calendarData), "application/json");
}

/**
 * Download a string as a file
 * @param {string} fileName
 * @param {string} fileContents
 * @param {"application/json"} fileType
 */
function downloadFile(fileName, fileContents, fileType) {
    const blob = new Blob([fileContents], { type: fileType });

    const anchor = document.createElement("a");
    anchor.download = fileName;
    anchor.href = window.URL.createObjectURL(blob);
    anchor.target = "_blank";
    anchor.click();
}

/** @type {HTMLInputElement} */
const importCalenderInput = document.querySelector("input[type='file'][name='import__calender__file']");

function importCalender() {
    importCalenderInput.click();
}

importCalenderInput.addEventListener("input", (e) => {
    if (e.target.files.length == 0) return;

    const eventsFile = e.target.files[0];

    const reader = new FileReader();

    reader.onload = async () => {
        try {
            const json = JSON.parse(reader.result);

            await loadCalendarData(json);

            loadCalendarUI(currentDateTime.year, currentDateTime.month);
            loadBannerUI();
        } catch {
            alert("Invalid file contents");
        }
    };

    reader.readAsText(eventsFile);
});
