document.addEventListener("DOMContentLoaded", function () {
    const API_URL = 'http://127.0.0.1:8086/api/score/';
    const scoreTableBody = document.querySelector('#scoreTable tbody');

    const getScoreButton = document.getElementById("get_score");
    if (getScoreButton) {
        getScoreButton.addEventListener("click", getScore);
    } else {
        console.log("Get Score Button Not Found");
    }

    function getScore(event) {
        event.preventDefault();

        const userTime = document.getElementById("UserTime").value;
        const userName = prompt("Please enter your name:");
        console.log("User Time:", userTime);

        fetch(API_URL)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                console.log("API Response:", data);
                const feedback = findFeedback(data, userTime);
                console.log("Feedback:", feedback);
                displayFeedback(feedback);
                addToScoreTable(userTime, feedback, userName);
            })
            .catch((error) => console.error("Error:", error));
    }

    function findFeedback(data, userTime) {
        const score = data.find((item) => item.user_time === parseInt(userTime));
        return score ? score.feedback : "Time is missing, or is less than 1 characters";
    }

    function displayFeedback(feedback) {
        const feedbackDiv = document.getElementById("getScoreResponse");
        if (feedbackDiv) {
            feedbackDiv.innerText = `Feedback: ${feedback}`;
        } else {
            console.log("Feedback Div Not Found");
        }
    }

    function addToScoreTable(userTime, feedback, userName) {
        const newRow = scoreTableBody.insertRow();
        newRow.innerHTML = `
            <td>${userTime}</td>
            <td>${userName}</td>
            <td>${feedback}</td>
            <td><button onclick="deleteRow(this)">Delete</button></td>
        `;
    }

    function deleteRow(button) {
        const row = button.closest('tr');
        row.remove();
    }
});

