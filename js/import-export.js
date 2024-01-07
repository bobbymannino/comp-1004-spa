/**
 * Takes the current calender and saves it as a json file for the user
 */
function exportCalender() {
    const str = JSON.stringify(calendarData);
    const blob = new Blob([str], { type: "application/json" });

    const anchor = document.createElement("a");
    anchor.download = "calender.json";
    anchor.href = window.URL.createObjectURL(blob);
    anchor.target = "_blank";
    anchor.click();
}

/** @type {HTMLInputElement} */
const importCalenderInput = document.querySelector(
    "input[type='file'][name='import__calender__file']"
);
function importCalender() {
    importCalenderInput.click();
}

importCalenderInput.addEventListener("input", (e) => {
    if (e.target.files.length == 0) return;

    const newCalendar = e.target.files[0];

    const reader = new FileReader();

    reader.onload = async () => {
        try {
            const json = JSON.parse(reader.result);
            calendarData = json;
            resetCalendar();
            resetBanner();
            await loadCalendar(json);
        } catch {
            alert("Invalid file");
        }
    };

    reader.readAsText(newCalendar);
});
