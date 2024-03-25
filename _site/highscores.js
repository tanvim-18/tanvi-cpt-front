// script.js
// Function to fetch and display high scores
function fetchHighScores() {
    fetch('/api/memory_highscores') // Replace with your API endpoint
      .then(response => response.json())
      .then(data => {
        const highscoreList = document.getElementById('highscoreList');
        highscoreList.innerHTML = ''; // Clear existing high scores
  
        data.forEach(score => {
          const listItem = document.createElement('li');
          listItem.textContent = `${score.username}: ${score.completion_time} seconds`;
          highscoreList.appendChild(listItem);
        });
      })
      .catch(error => {
        console.error('Error fetching high scores:', error);
      });
  }
  
  // Event listener for form submission
  document.getElementById('submitForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission
  
    const formData = new FormData(this);
    const username = formData.get('username');
    const completionTime = formData.get('completionTime');
  
    fetch('/api/memory_highscores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username: username, completion_time: completionTime }) // Adjust field names as per your backend
    })
    .then(response => {
      if (response.ok) {
        console.log('High score submitted successfully');
        fetchHighScores(); // Refresh leaderboard after submission
      } else {
        console.error('Failed to submit high score:', response.statusText);
      }
    })
    .catch(error => {
      console.error('Error submitting high score:', error);
    });
  });
  
  // Fetch and display high scores when the page loads
  window.addEventListener('load', fetchHighScores);
  