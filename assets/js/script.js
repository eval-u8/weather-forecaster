var cities = [];
var cityForm = document.querySelector("#city-search-form");
var cityInput = document.querySelector("#city");
var weatherDiv = document.querySelector("#current-weather-container");
var inputCitySearch = document.querySelector("#searched-city");
var forecastTitle = document.querySelector("#forecast");
var firecastDiv = document.querySelector("#fiveday-container");
var historyButton = document.querySelector("#past-search-buttons");

var formSubmitHandler = function (event) {
    event.preventDefault();
    var city = cityInput.value.trim();
    if (city) {
        getCityWeather(city);
        cityInput.value = "";
    } else {
        alert("Please type in a city");
    }
    saveSearch();
};

var getCityWeather = function (city) {
    var apiKey = "c5dfbb0bb56b3372d04b20a7d9e58214";
    var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

    fetch(apiURL).then(function (response) {
        response.json().then(function (data) {
            displayWeather(data, city);
        });
    });
};

var saveSearch = function () {
    localStorage.setItem("cities", JSON.stringify(cities));
};

var displayWeather = function (weather, searchCity) {
    //clear old content
    weatherDiv.textContent = "";
    inputCitySearch.textContent = searchCity;

    //console.log(weather);

    //create date element
    var currentDate = document.createElement("span");
    currentDate.textContent =
        " (" + moment(weather.dt.value).format("MMM D, YYYY") + ") ";
    inputCitySearch.appendChild(currentDate);

    //create an image element
    var weatherIcon = document.createElement("img");
    weatherIcon.setAttribute(
        "src",
        `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`
    );
    inputCitySearch.appendChild(weatherIcon);

    //create a span element to hold temperature data
    var temperatureEl = document.createElement("span");
    temperatureEl.textContent = "Temperature: " + weather.main.temp + " °F";
    temperatureEl.classList = "list-group-item";

    //create a span element to hold Humidity data
    var humidityEl = document.createElement("span");
    humidityEl.textContent = "Humidity: " + weather.main.humidity + " %";
    humidityEl.classList = "list-group-item";

    //create a span element to hold Wind data
    var windSpeedEl = document.createElement("span");
    windSpeedEl.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
    windSpeedEl.classList = "list-group-item";

    //append to container
    weatherDiv.appendChild(temperatureEl);

    //append to container
    weatherDiv.appendChild(humidityEl);

    //append to container
    weatherDiv.appendChild(windSpeedEl);

};



cityForm.addEventListener("submit", formSubmitHandler);

