//real
const WEATHER_API_KEY = "44d0e90098b5404081e123835241204";

// fake
// const WEATHER_API_KEY = "44d0e90098b5404081e121234567890";

const WEATHER_API_URL = `
http://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=
`;
const locationTextbox = document.getElementById("location-text");
const weatherCondition = document.getElementById("weather-condition");
const weatherConditionImage = document.getElementById(
  "weather-condition-image"
);
const weatherTemperature = document.getElementById("weather-temperature");
const weatherTemperatureScaleCelsius = document.getElementById(
  "weather-temperature-scale-celsius"
);
const gif = document.getElementById("gif-image");
weather = {};

const currentTemperatureScaleIsCelsius = () =>
  weatherTemperatureScaleCelsius.checked;
const getWeatherConditionIconSrc = async (url, weather) => {
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "image/png",
      },
    });
    const blob = await response.blob();
    return { conditionIconSrc: URL.createObjectURL(blob), weather };
  } catch (err) {
    console.error(err);
    return null;
  }
};

const getCurrentWeatherForCity = async (city) => {
  return fetch(WEATHER_API_URL + city)
    .catch(console.error)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Fetching data failed");
      }
      return response.json();
    })
    .then((json) => {
      const weather = {};
      if (!json.current.condition) return weather;
      console.log(json);
      weather.condition = json.current.condition.text;
      weather.temp_c = json.current.temp_c;
      weather.temp_f = json.current.temp_f;
      return getWeatherConditionIconSrc(json.current.condition.icon, weather);
    })
    .then((weatherAndIcon) => {
      if (!weatherAndIcon.weather.condition) return weatherAndIcon;
      const weather = weatherAndIcon.weather;
      weather.conditionIconSrc = weatherAndIcon.conditionIconSrc;
      console.log(weather);
      return weather;
    });
};

const setTemperature = () => {
  if (!weather.temp_c) {
    weather.temp_c = "45";
    weather.temp_f = "100";
  }
  if (currentTemperatureScaleIsCelsius()) {
    weatherTemperature.textContent = weather.temp_c + "\u00B0" + "C";
  } else {
    weatherTemperature.textContent = weather.temp_f + "\u00B0" + "F";
  }
};
const setWeatherInfo = () => {
  if (!weather.condition) {
    weather.condition = "Windy";
  }
  weatherCondition.textContent = weather.condition;
  weatherConditionImage.src = weather.conditionIconSrc;
  setTemperature(weather);
};

const setSolidColorToImage = (img, color) => {
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;

  const ctx = canvas.getContext("2d");
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, img.width, img.height);

  img.src = canvas.toDataURL();
};

const getColorForTemperature = (tempInCelsius) => {};
const changeBackgroundsForWeather = (weather) => {};
const setupEventListeners = () => {
  const weatherTemperatureScales = document.querySelectorAll(
    ".weather-temperature-scale>input"
  );
  const getWeatherBtn = document.getElementById("get-weather-button");

  weatherTemperatureScales.forEach((weatherTemperatureScale) => {
    weatherTemperatureScale.addEventListener("change", () => {
      setTemperature();
    });
  });
  getWeatherBtn.addEventListener("click", async () => {
    weather = await getCurrentWeatherForCity(locationTextbox.value);
    setWeatherInfo();
  });
};
const runApp = async () => {
  const emptyImageColor = "rgba(0,0,0,0.4)";
  setSolidColorToImage(gif, emptyImageColor);
  weather = await getCurrentWeatherForCity("mumbai");
  setWeatherInfo();
  setupEventListeners();
};

runApp();
