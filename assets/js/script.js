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
        get5Days(city);
        cities.unshift({ city });
        cityInput.value = "";
    } else {
        alert("Please type in a city");
    }
    saveSearch();
    pastSearch(city);
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
    var temperatureElmnt = document.createElement("span");
    temperatureElmnt.textContent = "Temperature: " + weather.main.temp + " °F";
    temperatureElmnt.classList = "list-group-item";

    //create a span element to hold Humidity data
    var humidityElmnt = document.createElement("span");
    humidityElmnt.textContent = "Humidity: " + weather.main.humidity + " %";
    humidityElmnt.classList = "list-group-item";

    //create a span element to hold Wind data
    var windSpeedElmnt = document.createElement("span");
    windSpeedElmnt.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
    windSpeedElmnt.classList = "list-group-item";

    //append to container
    weatherDiv.appendChild(temperatureElmnt);

    //append to container
    weatherDiv.appendChild(humidityElmnt);

    //append to container
    weatherDiv.appendChild(windSpeedElmnt);

    var lat = weather.coord.lat;
    var lon = weather.coord.lon;
    getUvIndex(lat, lon);
};

var getUvIndex = function (lat, lon) {
    var apiKey = "844421298d794574c100e3409cee0499";
    var apiURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`;
    fetch(apiURL).then(function (response) {
        response.json().then(function (data) {
            displayUvIndex(data);
        });
    });
};

var displayUvIndex = function (index) {
    var uvIndexElmnt = document.createElement("div");
    uvIndexElmnt.textContent = "UV Index: ";
    uvIndexElmnt.classList = "list-group-item";

    uvIndexValue = document.createElement("span");
    uvIndexValue.textContent = index.value;

    if (index.value <= 2) {
        uvIndexValue.classList = "favorable";
    } else if (index.value > 2 && index.value <= 8) {
        uvIndexValue.classList = "moderate ";
    } else if (index.value > 8) {
        uvIndexValue.classList = "severe";
    }

    uvIndexElmnt.appendChild(uvIndexValue);

    //append index to current weather
    weatherDiv.appendChild(uvIndexElmnt);
};

var get5Days = function (city) {
    var apiKey = "c5dfbb0bb56b3372d04b20a7d9e58214";
    var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`;

    fetch(apiURL).then(function (response) {
        response.json().then(function (data) {
            display5Day(data);
        });
    });
};

var display5Day = function (weather) {
    firecastDiv.textContent = "";
    forecastTitle.textContent = "5-Day Forecast:";

    var forecast = weather.list;
    for (var i = 5; i < forecast.length; i = i + 8) {
        var dailyForecast = forecast[i];

        var forecastElmnt = document.createElement("div");
        forecastElmnt.classList = "card bg-primary text-light m-2";

        //create date element
        var forecastDate = document.createElement("h5");
        forecastDate.textContent = moment
            .unix(dailyForecast.dt)
            .format("MMM D, YYYY");
        forecastDate.classList = "card-header text-center";
        forecastElmnt.appendChild(forecastDate);

        //create an image element
        var weatherIcon = document.createElement("img");
        weatherIcon.classList = "card-body text-center";
        weatherIcon.setAttribute(
            "src",
            `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`
        );

        //append to forecast card
        forecastElmnt.appendChild(weatherIcon);

        //create temperature span
        var forecastTempElmnt = document.createElement("span");
        forecastTempElmnt.classList = "card-body text-center";
        forecastTempElmnt.textContent = dailyForecast.main.temp + " °F";

        //append to forecast card
        forecastElmnt.appendChild(forecastTempElmnt);

        var forecastHumElmnt = document.createElement("span");
        forecastHumElmnt.classList = "card-body text-center";
        forecastHumElmnt.textContent = dailyForecast.main.humidity + "  %";

        //append to forecast card
        forecastElmnt.appendChild(forecastHumElmnt);

        // console.log(forecastElmnt);
        //append to five day container
        firecastDiv.appendChild(forecastElmnt);
    }
};

var pastSearch = function (pastSearch) {

    pastSearchElmnt = document.createElement("button");
    pastSearchElmnt.textContent = pastSearch;
    pastSearchElmnt.classList = "d-flex w-100 btn-light border p-2";
    pastSearchElmnt.setAttribute("data-city", pastSearch);
    pastSearchElmnt.setAttribute("type", "submit");

    historyButton.prepend(pastSearchElmnt);
};

var historySearchHandler = function (event) {
    var city = event.target.getAttribute("data-city");
    if (city) {
        getCityWeather(city);
        get5Days(city);
    }
};

// pastSearch();

cityForm.addEventListener("submit", formSubmitHandler);
historyButton.addEventListener("click", historySearchHandler);
