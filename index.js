const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
const apiKey = "10a5440ebc1164cf4f668800e792f415";

weatherForm.addEventListener("submit", async event => {
    event.preventDefault();
    const city = cityInput.value;
    if (city) {
        try {
            const weatherData = await getWeatherData(city);
            displayWeatherInfo(weatherData);
        } catch (error) {
            console.error(error);
            displayError(error);
        }
    }else{
        displayError("Please enter a city");
    }
});

async function getWeatherData(city){
   const apiUrl =`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
   const response = await fetch(apiUrl);

    if (!response.ok) {
        throw new Error("Could not fetch data");
    }
    return await response.json();
}

function displayWeatherInfo(weatherData){
    const {
        name: city, 
        main: {temp, humidity},
        weather: [{description, id}]
    } = weatherData;



    const cityDisplay = document.createElement("h1");
    const tempDisplay = document.createElement("p");
    const humidityDisplay = document.createElement("p");
    const weatherEmojiDisplay = document.createElement("p");
    const descriptionDisplay = document.createElement("p");

    cityDisplay.textContent = city.toUpperCase();
    tempDisplay.textContent = `${(temp - 273.15).toFixed(1)}°C`;
    humidityDisplay.textContent = `humidity is: ${humidity}%`;
    weatherEmojiDisplay.textContent = getWeatherEmoji(id);
    descriptionDisplay.textContent = description;

    card.textContent = "";
    card.classList.add("card");
    card.style.display = "flex"; 

    cityDisplay.classList.add("cityDisplay");
    tempDisplay.classList.add("tempDisplay");
    humidityDisplay.classList.add("humidityDisplay");
    weatherEmojiDisplay.classList.add("weatherEmojiDisplay");
    descriptionDisplay.classList.add("descriptionDisplay");

    card.appendChild(cityDisplay);
    card.appendChild(tempDisplay);
    card.appendChild(humidityDisplay);
    card.appendChild(weatherEmojiDisplay);
    card.appendChild(descriptionDisplay);
    
}

function getWeatherEmoji(weatherId){
    switch (true) {
        case (weatherId >= 200 && weatherId < 300):
                return "⛈️";
            break;
        case (weatherId >= 300 && weatherId < 400):
            return "🌦️";
        break;    
        case (weatherId >= 500 && weatherId < 600):
            return "🌧️";
        break; 
        case (weatherId >= 600 && weatherId < 700):
            return "❄️";
        break;  
        case (weatherId >= 700 && weatherId < 800):
            return "🌫️";
        break;    
        case (weatherId === 800):
            return "☀️";
        case (weatherId > 800 && weatherId < 900):
            return "☁️";
        break;    
        break;  
        default: return "❓";
            break;
    }
}

function displayError(message){
    const errorDisplay = document.createElement("p");
    errorDisplay.textContent = message;
    errorDisplay.classList.add("errorDisplay");
    card.textContent = "";
    card.style.display = "flex";
    card.appendChild(errorDisplay);
}