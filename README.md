GeoQuest - A Geography Game Website


Overview

GeoQuest is an interactive geography-based web application designed to test and enhance users' geographical knowledge through engaging mini-games. The website consists of multiple sections: a main page (index.html), a menu page (menu.html), and two games: Guess the Country and Geo Locator.




Website Layout


1. Main Page (index.html)

Features a navigation bar with links to the home page and menu.

Contains a compass animation at the center, reinforcing the geography theme.

Introduces the website with a brief description of the games available.

2. Menu Page (menu.html)

Displays flipping cards for each game.

Each card has a front (title and image) and back (detailed description of the game mechanics).

Clicking the flip button reveals the back side of the card.

3. Guess the Country (game.html)

A challenging game where users guess a mystery country.

After each incorrect guess, hints are provided to help narrow down the options.

Uses the Rest Countries API for country data .

4. Geo Locator (game2.html)

A fast-paced game where users identify the correct country from an image.

Players have one minute to score as many correct answers as possible.

Uses the Unsplash API to fetch country images.




Color Palette

The website follows a geography-inspired color scheme:

Teal Green (#2a9d8f) – Represents nature and exploration.

Dark Gray (#264653) – Symbolizes the depth of knowledge and mystery.

Golden Sand (#e9c46a) – Adds contrast and highlights key elements.


This palette reinforces the adventurous and educational theme of the website.





Game Functionality :



Guess the Country (game.html)


How It Works:

    The game randomly selects a mystery country.

    Users enter country names as guesses.

    After each incorrect guess, the game provides hints:

        Same Continent? – Whether the guessed country shares the continent with the target.
        Population Difference – The numerical difference in population.
        Land Area Difference – Comparison of sizes between the guessed country and the target.
        Directional Hint – Guidance based on latitude/longitude.

    The game continues until the correct country is guessed.

APIs Used:

    Rest Countries API – Provides country-related data such as population, area, and coordinates.
 

JavaScript Breakdown:


Fetching Country Data:

    Uses fetch() to get country information.
    Stores country names in an array.

Handling User Input:

    Listens for the user’s guess.
    Compares it to the mystery country.

Providing Hints:

    Uses mathematical calculations to determine the closest match.
    Updates UI dynamically to show hints.



Geo Locator (game2.html)

How It Works:

    The game displays a random image of a country.
    Users select the correct country from four choices.
    Faster responses earn more points.
    The game lasts one minute, and the score is recorded.

APIs Used:

Unsplash API – Retrieves random country images.
Rest Countries API – Provides an array of all countries.



JavaScript Breakdown:


Fetching Country Image:

    Calls the Unsplash API to get a random country image.
    Ensures variety by selecting from a diverse dataset.

Generating Choices:

    Randomly selects four country names.
    Ensures one is correct and shuffles the order.

Scoring System:

    Awards points based on speed.
    Deducts points for incorrect answers.

Game Timer:

    Uses setInterval() to count down from 60 seconds.
    Ends the game when time runs out.

Design Features & Effects

1. Compass Animation (Home Page)

Uses CSS keyframes to rotate smoothly.
The speed dynamically changes to create a natural motion effect.

2. Flipping Cards (Menu Page)

Uses CSS perspective and rotateY(180deg) to flip.
JavaScript toggles the flipped class on click to switch between front and back.

3. Floating Icons Background

Random geography-related icons appear and move dynamically.
JavaScript assigns random positions and applies CSS animations for movement.

4. Moving Background in Guess the Country

Uses an animation effect where the background (world map) moves slightly from right to left constantly.The game container has la low opacity to clear the way for the background.

5. Repeated Background in Geo Locator

The background changes constantly with the image shown in the game.
The game container has la low opacity to clear the way for the background.
