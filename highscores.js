// JavaScript code goes here
const API_URL = '/api/highscores/';

document.addEventListener("DOMContentLoaded", function () {
    loadItems();
    document.getElementById("closeModal").addEventListener("click", function () {
        document.getElementById("editModalBackdrop").style.display = "none"; // close pop up edit form
    });
});

// Get all highscore items
function loadItems() {
    fetch(API_URL, {
        method: 'GET'
    })
    .then((response) => response.json())
    .then(data => {
        displayItems(data);
    })
    .catch(error => {
        console.error("Error calling get all highscores:", error)
    });
}

function displayItems(items) {
    const table = document.getElementById("HighscoreTable");

    items.forEach((highscore) => {
        const row = table.insertRow();
        row.setAttribute("data-id", highscore.id);

        ["user_time", "score"].forEach((field) => {
            const cell = row.insertCell();
            cell.innerText = highscore[field];
        });

        const editCell = row.insertCell();
        const editButton = document.createElement("button");
        editButton.innerHTML = "Edit";
        editButton.addEventListener("click", () => editHighscore(highscore.user_time, highscore.score));
        editCell.appendChild(editButton);

        const deleteCell = row.insertCell();
        const deleteButton = document.createElement("button");
        deleteButton.innerText = "Delete";
        deleteButton.addEventListener("click", () => deleteHighscore(highscore.user_time, row));
        deleteCell.appendChild(deleteButton);
    });
}

// Edit highscore
function editHighscore(user_time, score) {
    console.log('Edit Highscore:', user_time);

    const form = document.getElementById("editForm");
    form.querySelector("#editUserTime").value = user_time;
    form.querySelector("#editScore").value = score;

    document.getElementById("editModalBackdrop").style.display = "block"; // show pop up edit modal
}

// Delete highscore
function deleteHighscore(user_time, row) {
    console.log('Delete Highscore:', user_time);

    const confirmation = prompt('Type "DELETE" to confirm.');
    if (confirmation === "DELETE") {
        const payload = {
            user_time
        };

        fetch(API_URL, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload)
        })
        .then((response) => {
            if (response.ok) {
                console.log("Successfully deleted", user_time);
                location.reload();
                return response.json();
            } else {
                alert("Server error");
                throw new Error("Server");
            }
        });
    }
}

// Create highscore
document.getElementById("create_highscore").addEventListener("click", submitForm);

function submitForm(event) {
    event.preventDefault();

    const form = document.getElementById('myForm');
    const user_time = parseInt(form.elements['UserTime'].value);
    const score = form.elements['Score'].value;

    const payload = {
        user_time,
        score
    };

    fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    })
    .then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            alert("Server error");
            throw new Error("Server");
        }
    })
    .then((data) => {
        location.reload();
    })
    .catch((error) => console.error("Error:", error));
}
