//JS file for writing narritives

//Global variables
currentStringField = document.getElementById("currentString");


shortcut();








//Write out suggestions to the html page
function writeSuggestions(passthrough) {

   

    document.getElementById("listSuggestions").innerHTML = suggestionsJson[0]["DDSpatientlocationDDS"]["suggestions"];

}


// For storing keyboard shortcuts
function shortcut() {
    currentStringField.addEventListener("keydown", function (event) {

        // Grab keypress
        const keyPressed = event.key;

        //// Console log keypress for testing
        //console.log(`Key Pressed: ${keyPressed}`);

        // Tab key for moving to the next DDS
        if (event.key === "Tab") {

            event.preventDefault();

            console.log("Tab key pressed!");
            const [ddsStart, ddsEnd] = searchDDS();

            if (ddsStart !== -1 && ddsEnd !== -1) {
                currentStringField.setSelectionRange(ddsStart, ddsEnd);
            }
        }

        //Cycle down through suggestions
         if (event.key === "ArrowDown") {
            console.log("Arrow Down key pressed!");
        }

        //Push the current working string into the overall narritive, then clear the current string
        if (event.ctrlKey && event.key === "Enter") {

            document.getElementById('narrative').value = document.getElementById('currentString').value + '\n\n';
            document.getElementById('currentString').value = '';
        }

        //For inserting suggestions into the current string
        if (event.ctrlKey && event.key === " ") {
            event.preventDefault();

            console.log("inserting new suggestion");
            //let currentString = document.getElementById('currentString').value;
            //let currentSuggestion = document.getElementById('listSuggestions').value;
            //document.getElementById('currentString').value = currentString + currentSuggestion;
        }


    });
}


// Searches strings for DDS mark
function searchDDS() {

    let DDS = currentStringField.value.search("DDS");

    if (DDS !== -1) {
        console.log("DDS found");
        console.log(DDS);

        let posData = findEndOfWord(currentStringField.value, DDS);

        return [DDS, posData];
    } else {

        console.log("DDS not found");
        return [-1, -1]; // Return an array with both values set to -1 to indicate not found
    }

    function findEndOfWord(text, startIndex) {
        // Initialize variables to store the end position and the characters to check for
        let endPosition = startIndex;
        const validChars = [' ', '.'];

        // Iterate from the startIndex to the end of the string
        while (endPosition < text.length) {
            const currentChar = text[endPosition];

            // Check if the current character is a space or a period
            if (validChars.includes(currentChar)) {
                break; // Stop when a space or period is found
            }

            // Move to the next character
            endPosition++;
        }

        return endPosition;
    }
}











//Calls and updates json variables

var suggestionsJson = [];
var sectionsJson = [];

fetch(chrome.runtime.getURL('suggestions.json'))
    .then(response => response.json())
    .then(data => {
        suggestionsJson = data;
        console.log(suggestionsJson);
    })
    .catch(error => {
        console.error('Error loading JSON:', error);
    });

fetch(chrome.runtime.getURL('sections.json'))
    .then(response => response.json())
    .then(data => {
        sectionsJson = data;
        console.log(sectionsJson);
    })
    .catch(error => {
        console.error('Error loading JSON:', error);
    });


//Imports sections of the prewritten narritive into the current text slot

document.querySelectorAll('.section-button').forEach(function (button) {
    button.addEventListener('click', function () {
        const sectionKey = this.getAttribute('data-section');
        importSections(sectionKey);
    });
});



//THIS BELOW IS THE OLD CODE, NEED TO UPDATE IT TO BE DYNAMIC.

function importSections(section, id) {

    switch (section) {

        case "911Dispatch":
            console.log("buttonWorking");
            document.getElementById("currentString").value = sectionsJson[0]["911"][id];
            //writeSuggestions();
            //shortcut();
            break;

        default:
            console.log("test");
            break;
    }


}


//Function here to move popup to a window

document.getElementById('makebig').addEventListener('click', makeIntoWindow);

function makeIntoWindow() {

    console.log("Turning into window");

    chrome.windows.create({
        url: chrome.runtime.getURL("popup.html"),
        type: "popup",
        width: 1200,
        height: 800
    }, function (window) {
        // window is created
    });
}