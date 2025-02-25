
let guessNum = 0;
let target = "";
let countryDataStore = {};
let score = 0;

/**
 * Initializes the game when the DOM content is loaded.
 */
document.addEventListener("DOMContentLoaded", function () {
    startGame();
    document.getElementById("Submit").addEventListener("click", handleGuess);
    document.getElementById("Surrender").addEventListener("click", () => endGame("surrender"));
    document.getElementById("guess").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            handleGuess();
        }
    });
});


/**
 * Starts a new game by selecting a target country and making a list that has every country name.
 */
let countryNames = [];

function startGame() {

    resetGame(); // Reset the game state and UI elements

    let request = new XMLHttpRequest();
    request.open("GET", "https://restcountries.com/v3.1/all?fields=name", true);

    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            let data = JSON.parse(request.responseText);

            // Extract common names of all countries
            countryNames = data.map(country => country.name.common);

            // Randomly select a target country
            target = countryNames[Math.floor(Math.random() * countryNames.length)];

            console.log("Target Country:", target);
            console.log("All Available Countries:", countryNames);

        } else {
            console.error("Error: Unable to fetch country data.");
        }
    };

    request.onerror = function () {
        console.error("Error: Network request failed.");
    };

    request.send();
}

/**
 * Handles the user's guess by validating it and comparing it to the target country.
 */
function handleGuess() {
    let guessInput = document.getElementById("guess").value.trim();
    guessInput = guessInput.charAt(0).toUpperCase() + guessInput.slice(1);

    if (!checkValidity(guessInput)) {
        alert("Enter a valid country name!");
        return;
    }

    document.getElementById("guess").value = ""; // Clear input field
    guessNum++;
    score++;
    document.getElementById("score").textContent = score;

    // Fetch target country data first if not already fetched
    if (!countryDataStore[target]) {
        fetchCountryData(target, () => {
            // Fetch guess country data after target is available
            fetchCountryData(guessInput, () => {
                compareCountries(target, guessInput);
            });
        });
    } else {
        fetchCountryData(guessInput, () => {
            compareCountries(target, guessInput);
        });
    }
}

/**
 * Fetches data for a given country from the REST Countries API and stores it in the countryDataStore.
 * @param {string} country - The name of the country to fetch data for.
 * @param {function} callback - The callback function to execute after fetching the data.
 */
function fetchCountryData(country, callback) {
    if (countryDataStore[country]) {
        callback();
        return;
    }

    let encodedCountry = encodeURIComponent(country);

    fetch(`https://restcountries.com/v3.1/name/${encodedCountry}`)
        .then(response => response.json())
        .then(data => {
            if (!Array.isArray(data) || data.status === 404) {
                console.error(`Error: No data found for ${country}`);
                return;
            }

            // Find the exact country match
            let exactMatch = data.find(c => c.name.common.toLowerCase() === country.toLowerCase());

            if (!exactMatch) {
                console.error(`Error: No exact match found for ${country}`);
                return;
            }

            countryDataStore[country] = {
                lat: exactMatch.latlng?.[0] || 0,
                lng: exactMatch.latlng?.[1] || 0,
                continent: exactMatch.region || "Unknown",
                area: exactMatch.area || "Unknown",
                population: exactMatch.population || "Unknown",
                flag: exactMatch.flags?.png || exactMatch.flags?.svg || "No flag available",
                flagAlt: exactMatch.flags?.alt || "Flag image",
            };

            callback();
        })
        .catch(error => console.error(`Error fetching data for ${country}:`, error));
}




/**
 * Checks if the given country name is valid.
 * @param {string} country - The name of the country to check.
 * @returns {boolean} - True if the country name is valid, false otherwise.
 */
function checkValidity(country) {
    // Normalize user input
    let normalizedGuess = country.toLowerCase().replace(/\s+/g, " ").trim();

    // Normalize country list and check for match
    return countryNames.some(c => c.toLowerCase().replace(/\s+/g, " ").trim() === normalizedGuess);
}

/**
 * Compares the guessed country with the target country and provides feedback to the user.
 * @param {string} target - The name of the target country.
 * @param {string} guess - The name of the guessed country.
 */
function compareCountries(target, guess) {
    if (!countryDataStore[target] || !countryDataStore[guess]) {
        console.error("Missing data for comparison");
        return;
    }
    
    if (guess === target) {
        endGame("win");
        return;
    }

    let targetData = countryDataStore[target];
    let guessData = countryDataStore[guess];

    document.getElementById("continent").textContent = guessData.continent === targetData.continent ? "Same continent" : "Different continent";
    document.getElementById("population").textContent = guessData.population > targetData.population ? "Your guess has a higher population" : "Your guess has a lower population";
    document.getElementById("area").textContent = guessData.area > targetData.area ? "Your guess has a bigger area" : "Your guess has a smaller area";
    
    let direction = "";
    if (targetData.lat > guessData.lat) direction += "North";
    if (targetData.lat < guessData.lat) direction += "South";
    if (targetData.lng > guessData.lng) direction += "East";
    if (targetData.lng < guessData.lng) direction += "West";
    
    document.getElementById("coordinates").textContent = "Try heading " + direction;
    document.getElementById("flag").src = guessData.flag;
    document.getElementById("flag").alt = guessData.flagAlt;
}

/**
 * Ends the game and displays the result to the user.
 * @param {string} result - The result of the game ("win" or "surrender").
 */
function endGame(result) {
    let resultDiv = document.getElementById("gameResult");
    resultDiv.innerHTML = result === "win" 
        ? `<h2>Congratulations! You guessed the correct country!</h2>` 
        : `<h2>Game Over! The correct country was ${target}.</h2>`;
    
    resultDiv.innerHTML += `
        <button onclick="location.href='menu.html'">Return to Menu</button>
        <button onclick="startGame()">Play Again</button>
    `;

    let targetData = countryDataStore[target];

    document.getElementById("guess").value = "";
    document.getElementById("continent").textContent = "";
    document.getElementById("population").textContent = "";
    document.getElementById("coordinates").textContent = "";
    document.getElementById("area").textContent = "";
    document.getElementById("flag").src = targetData.flag;
    document.getElementById("flag").alt = targetData.flagAlt;
    document.getElementById("Submit").disabled = true;
    document.getElementById("Surrender").disabled = true;
}

/**
 * Resets the game state and UI elements for a new game.
 */
function resetGame() {
    document.getElementById("gameResult").innerHTML = "";
    document.getElementById("score").textContent = "0";
    document.getElementById("flag").src = "";
    document.getElementById("flag").alt = "";
    guessNum = 0;
    score = 0;
    document.getElementById("Submit").disabled = false;
    document.getElementById("Surrender").disabled = false;
}


let posX = 0; // Declare posX globally outside the function
function moveBackground() {
    const Maindiv = document.getElementById("Maindiv");
    if (!Maindiv) return; // Ensure the element exists
    posX -= 0.2; // Move left
    Maindiv.style.backgroundPosition = `${posX}px 0`; // Apply new position
    requestAnimationFrame(moveBackground); // Keep animating
}
// calling the moveBackground function
moveBackground();

