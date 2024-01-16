//Modular function to check for similar strings in an array
function stringSeeker(currentString, arrayToCompare) {

    //Define current array
    let workingCurrentString = stringPrepper(currentString);


    //Set up new array to stroe filtered entries
    let filteredEntries = [];

    //For each loop to run through arrayToCompare. Filters each string into words, checks against current string to see if all the words in the current string are in the arrayToCompare string then pushes the string into filteredEntries
    arrayToCompare.forEach(item => {

        //Prep the string for comparison
        let workingArray = stringPrepper(item);

        //Compare the two arrays
        let results = workingCurrentString.every(val => workingArray.includes(val));

        //If the results are true, then return the string
        if (results === true) {
            filteredEntries.push(item);
        }
    });


    // Calculate Levenshtein distance for each filtered entry and sort top suggestions
    const topSuggestions = filteredEntries
        .map(item => ({ ...item, distance: levenshteinDistance(currentString, item.sentence) }))
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


    //Preps and removes random bits from the string to compare
    function stringPrepper(inputString) {
        //Prep the string for comparison
        inputString = inputString.toLowerCase();

        //Split string into individual words
        let wordsArray = inputString.split(" ");

        //Create a new array to store filtered words
        let filteredWordsArray = [];

        //Define characters and symbols to filter out
        let thingsToFilter = [".", ",", "!", "?", ":", ";", "(", ")", "-", " ", "\n", ""];

        //Iterate through wordsArray and filter out unwanted characters
        for (let i = 0; i < wordsArray.length; i++) {

            let word = wordsArray[i];

            //Check if the word is not in thingsToFilter
            if (!thingsToFilter.includes(word)) {
                filteredWordsArray.push(word);
            }
        }

        return filteredWordsArray;
    }
}