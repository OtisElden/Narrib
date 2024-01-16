//JS file for writing narritives


//Global variables

//Declare suggestions list
let globalSuggestions;

//Declares and stores the current sentence starting period/beginning of sentence
let currentSentenceGlobalStart;

//Declares and stores the current sentence ending period
let currentSentenceGlobalEnd;

//Declares and stores the current cursor position for updating after suggestions are inserted
let lastCursorSpot;

//Setup for current string area
currentStringField = document.getElementById("currentString");


//Listeners for the current string field
document.getElementById('currentString').addEventListener('input', autoResizeTextarea);
document.getElementById('currentString').addEventListener('keyup', suggestionSupplier);


//Main function
function suggestionSupplier(){

    //Desctrcutres the array into the start and end of the sentence
    let [sentenceStartPos, sentenceEndPos] = smolGrabber();

    //Grabs the words from the sentence, returns as an array of words
    let wordsArray = textGrabber(sentenceStartPos, sentenceEndPos);

    //Checks words array against prefill suggestions
    let checkedArray = checkSuggestions(wordsArray);

    //Update the global suggestions array - UPDATE WHEN FUNCTION FOR POSITING SUGGESTIONS IS MADE
    globalSuggestions = checkedArray;

    //Post them to the the suggestion fields
    listSuggestions.value = globalSuggestions;
}


//Grabs the position of the current sentence and returns it
function smolGrabber(){

    //Grabs text from current string field
    let currentStringValue = currentStringField.value;

    //Gimme that length
    let currentStringLength = currentStringValue.length;

    //Current position of the cursor
    let cursorPosition = currentStringField.selectionStart;

    //Update global variable for cursor position
    lastCursorSpot = cursorPosition;

    //Set up for looping periods grabbers
    let periodPositions = [0];

    //Grab them little dots
    for(let i = 0; i < currentStringLength; i++){

        if(currentStringValue[i] === "."){

            periodPositions.push(i);
        }
    }


    //Takes current text caret pos and determines which periods it's between.
    let startOfSentence
    let endOfSentence

    for (let i = 0; i < periodPositions.length; i++) {
        if (periodPositions[i] === cursorPosition) {
          // If the current number is equal to the target, return it as both below and above.
          startOfSentence = endOfSentence = periodPositions[i];
          break;
        }
    
        if (periodPositions[i] < cursorPosition) {
          startOfSentence = periodPositions[i]; // Update the closest number below.
        } else {
          endOfSentence = periodPositions[i]; // Update the closest number above.
          break; // Since the array is sorted, no need to continue checking further.
        }
      }

      //Update global variables on the stenence start and stops
      currentSentenceGlobalStart = startOfSentence;
      currentSentenceGlobalEnd = endOfSentence;

      return [startOfSentence, endOfSentence];
}


//Grabs the sentence from smolGrabber positions. Returns array of words from sentence
function textGrabber(startingPos, endingPos){

    //Grab all text and return it based on string positions supplied
    let extractedText = currentStringField.value.substring(startingPos, endingPos);

    //Split string into induvidual words
    let wordsArray = extractedText.split(" ");

    //Filters out list of words
    return filterKilter(wordsArray);
}


//Calculates and sorts the suggestions based on the words supplied
function checkSuggestions(wordsArray) {

    // Function for Levenshtein distance
    function levenshteinDistance(str1, str2) {
        const m = str1.length;
        const n = str2.length;
        const dp = Array.from(Array(m + 1), () => Array(n + 1).fill(0));

        for (let i = 0; i <= m; i++) {
            for (let j = 0; j <= n; j++) {
                if (i === 0) dp[i][j] = j;
                else if (j === 0) dp[i][j] = i;
                else {
                    const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
                    dp[i][j] = Math.min(
                        dp[i - 1][j - 1] + cost,
                        dp[i][j - 1] + 1,
                        dp[i - 1][j] + 1
                    );
                }
            }
        }

        return dp[m][n];
    }


    //Combining the words into a single string for comparison
    const currentString = wordsArray.join(" ");


    //Filters entries in the fillerJsonArray that contain all the words in wordsArray
    const filteredEntries = fillerJsonArray
        .map((sentenceArray, index) => {
            const sentence = sentenceArray.join(" ");
            const words = sentence.split(/\s+/);
            const matchingWords = wordsArray.filter(word => words.includes(word));
            return { index, matchingWords, sentence };
        })
        .filter(item => item.matchingWords.length === wordsArray.length);

    //Calculating Levenshtein distance for each filtered entry
    const suggestionList = filteredEntries.map(item => {
        const distance = levenshteinDistance(currentString, item.sentence);
        return { ...item, distance };
    });

    //Sorts top suggestion by levenstein distance
    const topSuggestions = suggestionList
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 5)
        .map(item => item.sentence);

    return topSuggestions;
}


// //Write out suggestions to the html page
// function writeSuggestions(passthrough) {

   

//     document.getElementById("listSuggestions").innerHTML = suggestionsJson[0]["DDSpatientlocationDDS"]["suggestions"];

// }


//Stores keyboard shortcuts
function shortcutKeys() {
    currentStringField.addEventListener("keydown", function (event) {

        //Updates/grabs keypress
        const keyPressed = event.key;

        //Moves text caret to the next DDS mark and hightlights it
        if (event.key === "Tab") {

            event.preventDefault();

            const [ddsStart, ddsEnd] = searchDDS();

            if (ddsStart !== -1 && ddsEnd !== -1) {
                currentStringField.setSelectionRange(ddsStart, ddsEnd);
            }
        }


        //Cycle down through suggestions
         if (event.ctrlKey && event.key === ".") {

            event.preventDefault();
        }


        //Cycle up through suggestions
        if (event.ctrlKey && event.key === ",") {

            event.preventDefault();
        }


        //Push the current working string into the overall narritive, then clear the current string
        if (event.ctrlKey && event.key === "Enter") {

            event.preventDefault();

            document.getElementById('narrative').value = document.getElementById('narrative').value + document.getElementById('currentString').value + '\n\n';
            document.getElementById('currentString').value = '';
        }


        //For inserting suggestions into the current string
        if (event.ctrlKey && event.key === " ") {

            event.preventDefault();

            // // Replace highlighted text with first suggestion and add a space
            // if (currentStringField[currentSentenceGlobalEnd] === ".") {
                currentStringField.value = currentStringField.value.replace(currentStringField.value.substring(currentSentenceGlobalStart + 1, currentSentenceGlobalEnd), " " + globalSuggestions[0]);
            // } else {
            //     currentStringField.value = currentStringField.value.replace(currentStringField.value.substring(currentSentenceGlobalStart + 1, currentSentenceGlobalEnd), " " + globalSuggestions[0] + ". ");
            // }

            // Find position of next period
            for (let i = lastCursorSpot; i < currentStringField.value.length; i++) {
                if (currentStringField.value[i] === ".") {
                    console.log(i);
                    currentStringField.setSelectionRange(i + 2, i + 2);
                    break; // Exit the loop when a period is found
                }
                currentStringField.setSelectionRange(i + 1, i + 1);
            }

    };
})}


// Searches strings for DDS mark and retusn the position of the DDS as well as the ending position of that word
function searchDDS() {

    let DDS = currentStringField.value.search("DDS");

    if (DDS !== -1) {

        let posData = findEndOfWord(currentStringField.value, DDS);

        return [DDS, posData];

    } else {

        return [-1, -1];
    }

    function findEndOfWord(text, startIndex) {

        //Initialize variables to store the end position and the characters to check for
        let endPosition = startIndex;
        const validChars = [' ', '.'];

        //Iterate from the startIndex to the end of the string
        while (endPosition < text.length) {
            const currentChar = text[endPosition];

            //Check if the current character is a space or a period
            if (validChars.includes(currentChar)) {
                break; // Stop when a space or period is found
            }

            //Move to the next character
            endPosition++;
        }

        return endPosition;
    }
}


//Calls and updates json variables
var suggestionsJson = [];
var sectionsJson = [];
var fillerJson = [];
var fillerJsonArray = [];

fetch(chrome.runtime.getURL('suggestions.json'))
    .then(response => response.json())
    .then(data => {
        suggestionsJson = data;
        //console.log(suggestionsJson);
    })
    .catch(error => {
        console.error('Error loading JSON:', error);
    });

fetch(chrome.runtime.getURL('sections.json'))
    .then(response => response.json())
    .then(data => {
        sectionsJson = data;
        //console.log(sectionsJson);
    })
    .catch(error => {
        console.error('Error loading JSON:', error);
    });

fetch(chrome.runtime.getURL('filler.json'))
    .then(response => response.json())
    .then(data => {
        fillerJson = data;
        fillerJsonArray = jsonStringToArray(fillerJson);
    })
    .catch(error => {
        console.error('Error loading JSON:', error);
    });


//Imports sections of the prewritten narritive into the current text slot
document.querySelectorAll('.section-button').forEach(function (button) {

    button.addEventListener('click', function () {
        let sectionKey = this.getAttribute('data-section');
        let id = this.getAttribute('id');
        importSections(sectionKey, id);
    });
});


//Setup for importing values
function importSections(section, id) {

    switch (section) {

        case "911Dispatch":
            console.log("buttonWorking");
            document.getElementById("currentString").value = sectionsJson[0]["911"][id];
            //writeSuggestions();
            //shortcutKeys();
            break;

        case "transfer":
            console.log("buttonWorking");
            document.getElementById("currentString").value = sectionsJson[1]["Transfer"][id];
            //writeSuggestions();
            //shortcutKeys();
            break;

        case "refusal":
            console.log("buttonWorking");
            document.getElementById("currentString").value = sectionsJson[2]["Refusal"][id];
            //writeSuggestions();
            //shortcutKeys();
            break;

        case "liftassist":
            console.log("buttonWorking");
            document.getElementById("currentString").value = sectionsJson[3]["Lift Assist"][id];
            //writeSuggestions();
            //shortcutKeys();
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


// Function to auto-resize the textarea based on its content
function autoResizeTextarea() {
    var textarea = document.getElementById('currentString');
    textarea.style.height = 'auto'; // Reset the height to auto
    textarea.style.height = textarea.scrollHeight + 'px'; // Set the height to the scrollHeight
}




shortcutKeys();
autoResizeTextarea();








//------------------------------Function that are setups for others------------------------------//







//Converts filler strings into arrays of words from each string. So entry 0 will go from a string to an array of words of that same string
function jsonStringToArray(array){

    // Create a new array by mapping over the input array
    let newArray = array.map(item => {
        // Split each string into an array of words and filter it
        return filterKilter(item.split(" "));
    });

    return newArray;
}


//Filter out bits and pieces from the words such as periods and commas and extra spaces
function filterKilter(wordsArray){

    let thingsToFilter = [".", ",", "!", "?", ":", ";", "(", ")", "-", " ", "\n", ""];

    for(let i = 0; i < wordsArray.length; i++){
            
            for(let j = 0; j < thingsToFilter.length; j++){
    
                if(wordsArray[i] === thingsToFilter[j]){
    
                    wordsArray.splice(i, 1);
                }
            }
        }


        return wordsArray;
}