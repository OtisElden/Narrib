//JS file for writing narritives

console.log("STARTING SCRIPT")


document.getElementById('makebig').addEventListener('click', makeIntoWindow);




//Grab data from the popup.html page
let currentString = document.getElementById('currentString').value;




//Split current sentance from the rest of the text by using periods
function splitSentance() {

    let splitString = currentString.split('.');

    return splitString;
}


//Split the curreent sentance into wets of words
function splitWords() {

    let splitString = currentString.split(' ');

    return splitString;
}


//Check the split words for the DDS mark. Then take that word and based off info inside DDS mark bring up list of suggestions
function checkDDS() {

    //Once checked capture keys for selecting choice, once selected let go of keys and continue on

}


//Write out suggestions to the html page
function writeSuggestions() {

    let suggestions = checkDDS();

    document.getElementById("suggestions").innerHTML = suggestions;

}






//Imports sections of the prewritten narritive into the current text slot
function importSections() {

    //

}


//




//Calls and updates json variables

var suggestionsJson = [];
var sectionsJson = [];

fetch(chrome.runtime.getURL('suggestions.json'))
    .then(response => response.json())
    .then(data => {
        suggestionsJson = data;
        console.log(jsonData);
    })
    .catch(error => {
        console.error('Error loading JSON:', error);
    });

fetch(chrome.runtime.getURL('sections.json'))
    .then(response => response.json())
    .then(data => {
        sectionsJson = data;
        console.log(jsonData);
    })
    .catch(error => {
        console.error('Error loading JSON:', error);
    });


//Function here to move popup to a window
function makeIntoWindow() {

    chrome.windows.create({
        url: chrome.runtime.getURL("popup.html"),
        type: "popup",
        width: 400,
        height: 400
    }, function (window) {
        // window is created
    });
}