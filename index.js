const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const weatherCard = document.querySelector(".card");
const API_KEY = "5b9ed6ad9b8e057ab646b8bf2021bda9";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const GEO_API_URL = "https://wft-geo-db.p.rapidapi.com/v1/geo/cities";
const GEO_API_KEY = "b58102de0a1925e6e0934902c50c07f06469ccf5"; // Replace with your GeoDB API key

// Event listener for form submission
weatherForm.addEventListener("submit", async event => {
    event.preventDefault();
    const city = cityInput.value.trim();
    if (city) {
        try {
            const validatedCity = await validateCity(city);
            if (validatedCity) {
                const weatherData = await fetchWeatherData(validatedCity);
                renderWeatherInfo(weatherData);
            } else {
                throw new Error("City not found. Please try again.");
            }
        } catch (error) {
            console.error(error);
            renderError(error.message);
        }
    } else {
        renderError("Please enter a city");
    }
});

// Validate city using GeoDB API
async function validateCity(city) {
    const response = await fetch(`${GEO_API_URL}?namePrefix=${city}`, {
        method: "GET",
        headers: {
            "X-RapidAPI-Key": GEO_API_KEY,
            "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com"
        }
    });
    if (!response.ok) {
        throw new Error("Could not validate city");
    }
    const data = await response.json();
    return data.data.length > 0 ? data.data[0].name : null;
}

// Fetch weather data from API
async function fetchWeatherData(city) {
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

// Render weather information
function renderWeatherInfo(weatherData) {
    const {
        name: cityName,
        main: { temp: temperature, humidity },
        weather: [{ description, id: weatherId }]
    } = weatherData;

    // Create elements for displaying weather data
    const cityElement = document.createElement("h1");
    const tempElement = document.createElement("p");
    const humidityElement = document.createElement("p");
    const weatherIconElement = document.createElement("p");
    const descriptionElement = document.createElement("p");

    // Assign values to elements
    cityElement.textContent = cityName.toUpperCase();
    tempElement.textContent = `${(temperature - 273.15).toFixed(1)}°C`;
    humidityElement.textContent = `Humidity: ${humidity}%`;
    weatherIconElement.textContent = getWeatherIcon(weatherId);
    descriptionElement.textContent = description;

    // Clear previous data and style the weather card
    weatherCard.textContent = "";
    weatherCard.style.display = "flex";
    weatherCard.style.flexDirection = "column";
    weatherCard.style.alignItems = "center";

    // Add classes for styling
    cityElement.classList.add("cityDisplay");
    tempElement.classList.add("tempDisplay");
    humidityElement.classList.add("humidityDisplay");
    weatherIconElement.classList.add("weatherEmojiDisplay");
    descriptionElement.classList.add("descriptionDisplay");

    // Append elements to the weather card
    weatherCard.appendChild(cityElement);
    weatherCard.appendChild(tempElement);
    weatherCard.appendChild(humidityElement);
    weatherCard.appendChild(weatherIconElement);
    weatherCard.appendChild(descriptionElement);
}

// Get weather icon based on weather ID
function getWeatherIcon(weatherId) {
    if (weatherId >= 200 && weatherId < 300) return "⛈️";
    if (weatherId >= 300 && weatherId < 400) return "🌦️";
    if (weatherId >= 500 && weatherId < 600) return "🌧️";
    if (weatherId >= 600 && weatherId < 700) return "❄️";
    if (weatherId >= 700 && weatherId < 800) return "🌫️";
    if (weatherId === 800) return "☀️";
    if (weatherId > 800 && weatherId < 900) return "☁️";
    return "❓";
}

// Render error message
function renderError(message) {
    const errorElement = document.createElement("p");
    errorElement.textContent = message;
    errorElement.classList.add("errorDisplay");
    weatherCard.textContent = "";
    weatherCard.style.display = "flex";
    weatherCard.style.justifyContent = "center";
    weatherCard.appendChild(errorElement);
}
