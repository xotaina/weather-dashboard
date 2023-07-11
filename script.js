
// Declaring necessary variables
var API_KEY = "2969e907435e4b1a3e5fe5f96ff45d10";
var searchFormEl = document.querySelector("#search-form");
var searchInputEl = document.querySelector("#search-input");
var searchHistoryEl = document.querySelector("#search-history");
var currentWeatherEl = document.querySelector("#current-weather");
var forecastEls = document.querySelectorAll("#forecast");
var searchBtnEl = document.querySelector("#search-btn");
const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
// Set Variables
var searchHistory = [];

// Search 
function searchHandler(event) {
    event.preventDefault();
    const searchInputEl = document.querySelector("#search-input");
    const city = searchInputEl.value.trim();

    if (!city) {
        return;
    }

    getWeather(city);
    searchInputEl.value = "";
}

searchBtnEl.addEventListener('click',searchHandler)

// getWeather

async function getWeather(city){
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("City not found");
        }

        const weatherData = await response.json();
        const coords = {
            lat: weatherData.coord.lat,
            lon: weatherData.coord.lon,
        };
        saveCity(city);
        displayWeather(weatherData, city);
        getForecast(coords); 
    } catch (error) {
        alert("Could not load city./n Try Another City")
    }
}

// getCurrendate 
function getCurrentDate(){
    const currentDate = new Date();
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    return currentDate.toLocaleDateString("en-US", options);
}

// Displays the current weather data for a city 
function displayWeather(data) {
    // Update the HTML elements with the weather data
    const cityNameEl = document.getElementById("city-name");
    const currentIconEl = document.getElementById("weather-icon");
    const currentTempEl = document.getElementById("temperature");
    const currentHumidityEl = document.getElementById("humidity");
    const currentWindEl = document.getElementById("wind-speed");
    cityNameEl.textContent = `${data.name} (${getCurrentDate()})`;
    currentIconEl.setAttribute("src", `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`);
    currentTempEl.textContent = `Temperature: ${data.main.temp} °F`;
    currentHumidityEl.textContent = `Humidity: ${data.main.humidity}%`;
    currentWindEl.textContent = `Wind Speed: ${data.wind.speed} MPH`;

    // Get the 5-day forecast for the city
    getForecast({ lat: data.coord.lat, lon: data.coord.lon });
}

// Retrieves the 5-day forecast data for a city
function getForecast(coords){
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&units=metric&appid=${API_KEY}`;
  
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        // Select the forecast element and clear its contents
        const forecastEl = document.querySelector('#forecast');
        forecastEl.innerHTML = '';
  
        // Get the date for today and the next four days
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const today = new Date();
        let currentDay = today.getDay();
  
        // Loop through the forecast data for the next 5 days and create an element for each day
        for (let i = 0; i < 5; i++) {
          const forecastData = data.list[i * 8]; // Data for each day is every 8th item in the list
          const forecastDay = daysOfWeek[currentDay];
          const forecastIcon = forecastData.weather[0].icon;
          const forecastTemp = Math.round(forecastData.main.temp);
          const forecastWind = Math.round(forecastData.wind.speed);
          const forecastHumidity = Math.round(forecastData.main.humidity);
  
          // Create the HTML for the forecast element
          const forecastElement = `
            <div class="forecast-single">
                  <h5 class="day">${forecastDay}</h5>
                  <p class="temp">
                    <img src="http://openweathermap.org/img/wn/${forecastIcon}.png" alt="${forecastData.weather[0].description}" />
                  </p>
                  <p class="temp">Temp: ${forecastTemp}&deg;C</p>
                  <p class="temp">Wind: ${forecastWind} km/h</p>
                  <p class="temp">Humidity: ${forecastHumidity}%</p>
            </div>
          `;
  
          // Add the forecast element to the forecast element container
          forecastEl.insertAdjacentHTML('beforeend', forecastElement);
  
          // Increment the day counter
          currentDay = (currentDay + 1) % 7;
        }
      })
      .catch((error) => {
        console.error('Error fetching forecast data:', error);
      });
}

// Saves a city to local storage
function saveCity(city){
    let cities = JSON.parse(localStorage.getItem("cities")) || [];
    if (!cities.includes(city.toLowerCase())) {
        cities.unshift(city.toLowerCase());
        localStorage.setItem("cities", JSON.stringify(cities));
        displaySearchHistory();
    }
} 

// Display search history
function displaySearchHistory() {
    var history = document.querySelector("#history-list");
    history.innerHTML = "";

    var cities = JSON.parse(localStorage.getItem("cities")) || [];

    for (var i = 0; i < cities.length; i++) {
        var city = cities[i];

        var liEl = document.createElement("li");
        liEl.classList.add("list-group-item", "history-item");
        liEl.textContent = city;
        liEl.setAttribute("data-city", city);
        liEl.addEventListener("click", function () {
            getWeather(this.getAttribute("data-city"));
        });

        history.appendChild(liEl);
    }
}
 
 

displaySearchHistory()