//This is the start of highscores.js

function deleteRow(button) {
    const row = button.closest('tr');
    const userTime = row.cells[0].textContent; // Get the userTime from the first cell
    removeScoreFromStorage(userTime); // Remove the score from local storage
    row.remove(); // Remove the row from the table
}
// This function is responsible for deleting a row from the table when the delete button is clicked. 
//It extracts the userTime from the first cell of the row being deleted, removes the corresponding score 
//from local storage using the removeScoreFromStorage function, and then removes the row from the table.


// Function to remove a score from local storage based on userTime
function removeScoreFromStorage(userTime) {
    let highscores = JSON.parse(localStorage.getItem('highscores')) || [];
    highscores = highscores.filter(score => score.userTime !== userTime); // Remove the score with matching userTime
    localStorage.setItem('highscores', JSON.stringify(highscores));
}

//This function removes a score from local storage based on its userTime. 
//It retrieves the array of highscores from local storage, filters out the score with the matching userTime, 
//and updates the local storage with the filtered array.
// I got this code from AI (chatgpt), as I needed help to make a local storage for usertimes

document.addEventListener("DOMContentLoaded", function () {
    const API_URL = 'http://127.0.0.1:8086/api/score/';
    const scoreTableBody = document.querySelector('#scoreTable tbody');

    const getScoreButton = document.getElementById("get_score");
    if (getScoreButton) {
        getScoreButton.addEventListener("click", getScore);
    } else {
        console.log("Get Score Button Not Found");
    }
//This event listener ensures that the code inside it is executed when the DOM content is fully loaded.
//It contains the main logic of the program.
// I asked chatgpt for the DOM code, but I wrote the if else statement


    // Load existing highscores from local storage when the page loads
    loadHighscoresFromStorage();

    function getScore(event) {
        event.preventDefault();

        const userTimes = document.getElementById("UserTime").value;
        const userName = prompt("Please enter your name:");

        // Check if userTimes are less than 1
        if (checkUserTimes(userTimes)) {
            alert("Please enter a time greater than or equal to 1.");
            return; // Stop further execution
        }

        console.log("User Time:", userTimes);

        fetch(API_URL)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                console.log("API Response:", data);
                const feedback = findFeedback(data, userTimes);
                console.log("Feedback:", feedback);
                displayFeedback(feedback);
                addToScoreTable(userTimes, feedback, userName);
                // Save the new highscore to local storage
                saveHighscoreToStorage(userTimes, feedback, userName);
            })
            .catch((error) => console.error("Error:", error));
    }

//getScore function: This function is called when the "Get Score" button is clicked. 
//It retrieves the user input for userTimes and userName, performs validation to check if 
//userTimes are valid, sends a fetch request to the API to get score data, and then displays 
//the feedback and adds the score to the table and local storage.


    function findFeedback(data, userTime) {
        const score = data.find((item) => item.user_time === parseInt(userTime));
        return score ? score.feedback : "Time is missing, or less than 1 characters";
    }
// This function searches for feedback corresponding to a given userTime in the fetched data.

    function displayFeedback(feedback) {
        const feedbackDiv = document.getElementById("getScoreResponse");
        if (feedbackDiv) {
            feedbackDiv.innerText = `Feedback: ${feedback}`;
        } else {
            console.log("Feedback Div Not Found");
        }
    }
//This function displays the feedback retrieved from the API response on the webpage.


    function addToScoreTable(userTime, feedback, userName) {
        const newRow = scoreTableBody.insertRow();
        newRow.innerHTML = `
            <td>${userTime}</td>
            <td>${userName}</td>
            <td>${feedback}</td>
            <td><button onclick="deleteRow(this)">Delete</button></td>
        `;
    }
//This function adds a new row to the table with the provided userTime, userName, feedback, and a delete button.


    // Function to save highscore to local storage
    function saveHighscoreToStorage(userTime, feedback, userName) {
        let highscores = JSON.parse(localStorage.getItem('highscores')) || [];
        highscores.push({ userTime, feedback, userName });
        localStorage.setItem('highscores', JSON.stringify(highscores));
    }

    // Function to load highscores from local storage
    function loadHighscoresFromStorage() {
        const highscores = JSON.parse(localStorage.getItem('highscores')) || [];
        highscores.forEach(score => {
            addToScoreTable(score.userTime, score.feedback, score.userName);
        });
    }

    function checkUserTimes(userTimes) {
        // Procedure to check if all user times are valid
        const validTimes = [];
        const invalidTimes = [];

        // Iteration: Iterate over each userTime in the array
        userTimes.split(',').forEach(userTime => {
            // Sequence: Convert userTime to an integer
            const time = parseInt(userTime);

            // Selection: Check if time is less than 1
            if (time < 1 || time === 0) {
                invalidTimes.push(userTime); // Add to invalidTimes array
            } else {
                validTimes.push(userTime); // Add to validTimes array
            } 
        });

        // Return the results
        return invalidTimes.length > 0;
    }
})

//This function checks if all userTimes provided are valid (greater than or equal to 1).
//It iterates over each userTime, converts it to an integer, and checks if it's less than 1.
//If any userTime is less than 1, it returns true; otherwise, it returns false.

//basecode for everything given by teacher


//This is the end of highscores.js
