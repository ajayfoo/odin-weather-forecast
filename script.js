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
const errorModal = document.getElementById("error-modal");
const errorMessageText = document.getElementById("error-message");
const closeErrorModalBtn = document.getElementById("close-error-modal");
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

const setEmptyWeatherInfo = () => {
  weather.condition = "";
  weather.temp_c = "";
  weather.temp_f = "";
  weatherCondition.textContent = weather.condition;
  weatherConditionImage.src = "";
  weatherTemperature.textContent = "";
};
const setWeatherInfo = () => {
  if (!weather.condition) {
    setEmptyWeatherInfo();
    return;
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

const handleError = () => {
  locationTextbox.value = "";
  if (window.navigator.onLine) {
    errorMessageText.textContent = "Location Not found";
  } else {
    errorMessageText.textContent = "Internet not accessible";
  }
  setEmptyWeatherInfo();
  errorModal.showModal();
};

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
    try {
      weather = await getCurrentWeatherForCity(locationTextbox.value);
    } catch (err) {
      handleError();
      return;
    }
    setWeatherInfo();
  });
  document.getElementById("close-error-modal").addEventListener("click", () => {
    console.log("hi");
    errorModal.close();
  });
};
const runApp = async () => {
  const emptyImageColor = "rgba(0,0,0,0.4)";
  setSolidColorToImage(gif, emptyImageColor);
  try {
    weather = await getCurrentWeatherForCity("mumbai");
  } catch (err) {
    handleError();
    return;
  }
  setWeatherInfo();
  setupEventListeners();
};

runApp();
