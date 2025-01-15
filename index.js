const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
const API_KEY = "5b9ed6ad9b8e057ab646b8bf2021bda9";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// Event listener for form submission
weatherForm.addEventListener("submit", async event => {
    event.preventDefault();
    const city = cityInput.value.trim();
    if (city) {
        try {
            const weatherData = await getWeatherData(city);
            displayWeatherInfo(weatherData);
        } catch (error) {
            console.error(error);
            displayError(error.message);
        }
    } else {
        displayError("Please enter a city");
    }
});

// Fetch weather data from API
async function getWeatherData(city) {
    const apiUrl = `${BASE_URL}?q=${city}&appid=${API_KEY}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
        let errorMessage = "Could not fetch data";
        if (response.status === 404) {
            errorMessage = "City not found";
        }
        throw new Error(errorMessage);
    }
    return await response.json();
}

// Display weather information
function displayWeatherInfo(weatherData) {
    const {
        name: city,
        main: { temp, humidity },
        weather: [{ description, id }]
    } = weatherData;

    // Create elements
    const cityDisplay = document.createElement("h1");
    const tempDisplay = document.createElement("p");
    const humidityDisplay = document.createElement("p");
    const weatherEmojiDisplay = document.createElement("p");
    const descriptionDisplay = document.createElement("p");

    // Assign values to elements
    cityDisplay.textContent = city.toUpperCase();
    tempDisplay.textContent = `${(temp - 273.15).toFixed(1)}°C`;
    humidityDisplay.textContent = `Humidity: ${humidity}%`;
    weatherEmojiDisplay.textContent = getWeatherEmoji(id);
    descriptionDisplay.textContent = description;

    // Clear previous data and style the card
    card.textContent = "";
    card.style.display = "flex";
    card.style.flexDirection = "column";
    card.style.alignItems = "center";

    // Add classes for styling
    cityDisplay.classList.add("cityDisplay");
    tempDisplay.classList.add("tempDisplay");
    humidityDisplay.classList.add("humidityDisplay");
    weatherEmojiDisplay.classList.add("weatherEmojiDisplay");
    descriptionDisplay.classList.add("descriptionDisplay");

    // Append elements to card
    card.appendChild(cityDisplay);
    card.appendChild(tempDisplay);
    card.appendChild(humidityDisplay);
    card.appendChild(weatherEmojiDisplay);
    card.appendChild(descriptionDisplay);
}

// Get weather emoji based on weather ID
function getWeatherEmoji(weatherId) {
    if (weatherId >= 200 && weatherId < 300) return "⛈️";
    if (weatherId >= 300 && weatherId < 400) return "🌦️";
    if (weatherId >= 500 && weatherId < 600) return "🌧️";
    if (weatherId >= 600 && weatherId < 700) return "❄️";
    if (weatherId >= 700 && weatherId < 800) return "🌫️";
    if (weatherId === 800) return "☀️";
    if (weatherId > 800 && weatherId < 900) return "☁️";
    return "❓";
}

function displayError(message) {
    if (document.querySelector(".errorPopup")) return;
    const popup = document.createElement("div");
    popup.className = "errorPopup";
    popup.innerHTML = `
        <p>${message}</p>
    `;
    document.body.appendChild(popup);
    setTimeout(() => {  
        popup.classList.add("hide");
        setTimeout(() => popup.remove(), 300); // Wait for fade-out animation to finish
    }, 1500);
}
