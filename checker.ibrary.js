//I feel like I use this function enoguh that I should just turn it into a modular bit/library for suture use. 
//Should send in string being evaluated from the current text and an array of strings to compare against.
//Returns and array of strings that are suggestions. Might make a setting to swtich to postions if need be.


//Calculates and sorts the suggestions based on the words supplied
function stringSeeker(currentString, symphonicStringsArray) {

    

    


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





    //Calculates the Levenshtein distance between two strings, returns the distance.
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
}



//Down here be the functions to split and filter the text

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


//Grabs the sentence from smolGrabber positions. Returns array of words from sentence
function textGrabber(startingPos, endingPos){

    //Grab all text and return it based on string positions supplied
    let extractedText = currentStringField.value.substring(startingPos, endingPos);

    //Split string into induvidual words
    let wordsArray = extractedText.split(" ");

    //Filters out list of words
    return filterKilter(wordsArray);
}