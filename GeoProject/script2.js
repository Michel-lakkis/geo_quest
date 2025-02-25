// Stores the names of all countries fetched from the API
let countryNames = [];

// Stores the correct answer for the current round
let correctCountry = "";

// Stores the player's score
let score = 0;

// Tracks the number of attempts per round
let attempts = 0;

// Timer variables
let timer;
let timeLeft = 60; // Game duration in seconds

// Unsplash API Access Key (replace with your key if needed)
const UNSPLASH_ACCESS_KEY = "emXIGcrQsIAaK5kaD0RS8tOmMjk-5bIU2ys6pH70g5g";

// Tracks whether buttons are disabled (to prevent multiple clicks)
let buttonsDisabled = false;

// Last displayed message to prevent repetition
let lastMessage = "";

// Retrieve high score from localStorage or set it to 0
let highScore = localStorage.getItem("highScore") ? parseInt(localStorage.getItem("highScore")) : 0;

// Track when the current question was displayed
let questionStartTime = 0;

// Predefined messages to ensure variety
const correctMessages = ["Well done! 🎉", "Nice job! ✅"];
const wrongMessages = ["Not quite, try again. ❌", "Oops! Wrong choice. 🚫", "Give it another shot. ❌"];

// Display initial high score on page load
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("highScoreDisplay").textContent = "High Score: " + highScore;
});

/**
 * Starts or restarts the game.
 * - Fetches country data
 * - Resets game state
 * - Starts the timer
 */
function startGame() {
    document.getElementById("startButton").textContent = "Restart Game";
    resetGame();
    
    // Fetch the list of countries from the API
    fetch("https://restcountries.com/v3.1/all?fields=name")
        .then(response => response.json())
        .then(data => {
            countryNames = data.map(country => country.name.common);
            selectRandomCountry();
            startTimer();
        })
        .catch(error => console.error("Error fetching country data:", error));
}

/**
 * Resets the game state but retains the high score.
 * - Resets attempts, score, and time
 * - Clears messages, choices, and images
 */
function resetGame() {
    attempts = 0;
    score = 0;
    timeLeft = 60;
    clearInterval(timer);

    document.getElementById("scoreDisplay").textContent = "Score: " + score;
    document.getElementById("timer").textContent = "Time: " + timeLeft;
    document.getElementById("message").textContent = "";
    document.getElementById("choices").innerHTML = "";
    document.getElementById("countryImage").src = "";
    document.getElementById("gameOver").style.display = "none";
    document.getElementById("countryImage").style.display = "block";
}

/**
 * Starts the game timer.
 * - Updates the timer every second
 * - Ends the game when time runs out
 */
function startTimer() {
    clearInterval(timer);
    document.getElementById("timer").textContent = "Time: " + timeLeft;

    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").textContent = "Time: " + timeLeft;
        
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

/**
 * Selects a random country from the list.
 * - Stores it as the correct answer
 * - Fetches a relevant image
 */
function selectRandomCountry() {
    correctCountry = countryNames[Math.floor(Math.random() * countryNames.length)];
    fetchImage(correctCountry);
    questionStartTime = Date.now(); // Record start time of the question
}

/**
 * Fetches an image of the selected country from Unsplash.
 * - Uses a query to find a relevant image
 * - Displays a placeholder if no image is found
 * 
 * @param {string} country - The country name to search for images
 */
function fetchImage(country) {
    let unsplashUrl = `https://api.unsplash.com/photos/random?query=${country}&client_id=${UNSPLASH_ACCESS_KEY}`;
    
    fetch(unsplashUrl)
        .then(response => response.json())
        .then(data => {
            if (data.urls && data.urls.regular) {
                let imageUrl = data.urls.regular;

                // Set the main country image
                document.getElementById("countryImage").src = imageUrl;

                // Set the background image (used by ::before to apply blur)
                document.getElementById("imgBackground").style.backgroundImage = `url('${imageUrl}')`;
            } else {
                document.getElementById("countryImage").src = "https://via.placeholder.com/400x300?text=No+Image";
            }
            generateChoices();
        })
        .catch(error => {
            document.getElementById("countryImage").src = "https://via.placeholder.com/400x300?text=No+Image";
            generateChoices();
        });
}


/**
 * Generates four country choices, ensuring one is correct.
 * - Shuffles the choices before displaying
 */
function generateChoices() {
    attempts = 0;
    buttonsDisabled = false;

    let choices = new Set([correctCountry]);
    
    // Ensure we get 3 random incorrect choices
    while (choices.size < 4) {
        let randomCountry = countryNames[Math.floor(Math.random() * countryNames.length)];
        choices.add(randomCountry);
    }

    let choicesArray = Array.from(choices).sort(() => Math.random() - 0.5);
    displayChoices(choicesArray);
}

/**
 * Displays the generated choices as buttons.
 * 
 * @param {Array} choicesArray - Array of country choices
 */
function displayChoices(choicesArray) {
    let choicesDiv = document.getElementById("choices");
    choicesDiv.innerHTML = "";

    choicesArray.forEach(choice => {
        let button = document.createElement("button");
        button.textContent = choice;
        button.onclick = () => handleClick(button, choice);
        choicesDiv.appendChild(button);
    });
}

/**
 * Handles button clicks for guesses.
 * - Prevents multiple clicks per round
 * - Disables clicked button
 * 
 * @param {HTMLElement} button - The clicked button element
 * @param {string} choice - The country choice made by the player
 */
function handleClick(button, choice) {
    if (buttonsDisabled) return;
    button.disabled = true;
    checkAnswer(choice);
}

/**
 * Checks if the player's guess is correct.
 * - Awards points based on response time.
 * - Deducts 25 points for incorrect guesses.
 * - Prevents repeated messages in a row.
 * - Moves to the next round on a correct guess.
 * 
 * @param {string} choice - The country choice made by the player.
 */
function checkAnswer(choice) {
    let message = document.getElementById("message");

    if (choice === correctCountry) {
        // Calculate time taken in seconds
        let timeTaken = (Date.now() - questionStartTime) / 1000;
        console.log("Time taken:", timeTaken);

        // Score based on response time (faster = more points)
        let pointsEarned = Math.max(10, 100 - timeTaken * 8);
        console.log("Points earned:", pointsEarned);
        score += Math.round(pointsEarned);
        console.log("Total score:", score);
        message.textContent = getRandomMessage(correctMessages);
        document.getElementById("scoreDisplay").textContent = `Score: ${score}`;
        buttonsDisabled = true;

        setTimeout(selectRandomCountry, 1000);
    } else {
        // Deduct 15 points for a wrong guess
        score -= 15;
        document.getElementById("scoreDisplay").textContent = `Score: ${score}`;

        message.textContent = getRandomMessage(wrongMessages);
    }
}

/**
 * Selects a random message, ensuring it is different from the last one displayed.
 * 
 * @param {Array} messages - Array of possible messages
 * @returns {string} A randomly selected message
 */
function getRandomMessage(messages) {
    let newMessage;
    do {
        newMessage = messages[Math.floor(Math.random() * messages.length)];
    } while (newMessage === lastMessage);
    
    lastMessage = newMessage;
    return newMessage;
}

/**
 * Ends the game and updates the high score if necessary.
 * - Displays final score
 * - Saves new high score if higher than previous
 */
function endGame() {
    clearInterval(timer);
    document.getElementById("choices").innerHTML = "";
    document.getElementById("countryImage").style.display = "none";
    document.getElementById("gameOver").style.display = "block";
    document.getElementById("gameOver").textContent = "Game Over! Final Score: " + score;
    document.getElementById("imgBackground").style.backgroundImage = "none";
    document.getElementById("message").textContent = "";

    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
        document.getElementById("highScoreDisplay").textContent = "High Score: " + highScore;
    }
}
