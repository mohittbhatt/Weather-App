const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const message = document.getElementById("message");
const weatherResult = document.getElementById("weatherResult");

const cityName = document.getElementById("cityName");
const weatherCondition = document.getElementById("weatherCondition");
const temperature = document.getElementById("temperature");
const windSpeed = document.getElementById("windSpeed");
const humidity = document.getElementById("humidity");
const feelsLike = document.getElementById("feelsLike");
const weatherEmoji = document.getElementById("weatherEmoji");

function getWeatherEmoji(code) {
  if (code === 0) return "☀️";
  if (code === 1 || code === 2) return "🌤️";
  if (code === 3) return "☁️";
  if (code === 45 || code === 48) return "🌫️";
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return "🌧️";
  if ([71, 73, 75].includes(code)) return "❄️";
  if (code === 95) return "⛈️";
  return "🌍";
}

function getWeatherText(code) {
  const weatherCodes = {
    0: "Clear Sky",
    1: "Mainly Clear",
    2: "Partly Cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Rime Fog",
    51: "Light Drizzle",
    53: "Moderate Drizzle",
    55: "Dense Drizzle",
    61: "Slight Rain",
    63: "Moderate Rain",
    65: "Heavy Rain",
    71: "Slight Snowfall",
    73: "Moderate Snowfall",
    75: "Heavy Snowfall",
    80: "Rain Showers",
    81: "Moderate Showers",
    82: "Violent Showers",
    95: "Thunderstorm"
  };

  return weatherCodes[code] || "Unknown Weather";
}

async function getWeather(city) {
  message.textContent = "Loading...";
  weatherResult.classList.add("hidden");

  try {
    const geoResponse = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`
    );
    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      message.textContent = "City not found.";
      return;
    }

    const place = geoData.results[0];
    const latitude = place.latitude;
    const longitude = place.longitude;

    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`
    );
    const weatherData = await weatherResponse.json();

    cityName.textContent = `${place.name}, ${place.country}`;
    weatherCondition.textContent = getWeatherText(weatherData.current.weather_code);
    temperature.textContent = `${weatherData.current.temperature_2m}°C`;
    windSpeed.textContent = `${weatherData.current.wind_speed_10m} km/h`;
    humidity.textContent = `${weatherData.current.relative_humidity_2m}%`;
    feelsLike.textContent = `${weatherData.current.apparent_temperature}°C`;
    weatherEmoji.textContent = getWeatherEmoji(weatherData.current.weather_code);

    message.textContent = "";
    weatherResult.classList.remove("hidden");
  } catch (error) {
    message.textContent = "Something went wrong. Please try again.";
  }
}

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city === "") {
    message.textContent = "Please enter a city name.";
    weatherResult.classList.add("hidden");
    return;
  }
  getWeather(city);
});

cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const city = cityInput.value.trim();
    if (city === "") {
      message.textContent = "Please enter a city name.";
      weatherResult.classList.add("hidden");
      return;
    }
    getWeather(city);
  }
});