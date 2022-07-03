const API_ID = "e1dacde58f37a6f191f5579359752095";
const weekday = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const month = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
// ---------------------- Default ----------------------
defaulLat = 21.0333318;
defaulLon = 105.7847728;
getDetailPolution(defaulLat, defaulLon);
getDetailMain(defaulLat, defaulLon);
getDetailHourDay(defaulLat, defaulLon);

// ---------------------- Search ----------------------
const searchInput = document.querySelector(".search__input--input");
searchInput.addEventListener("change", (e) => {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${e.target.value}&units=metric&&appid=${API_ID}`
  ).then(async (res) => {
    const data = await res.json();
    // console.log(data);
    const placeLat = data.coord.lat;
    const placeLon = data.coord.lon;
    // console.log(placeLat, placeLon);
    getDetailPolution(placeLat, placeLon);
    getDetailMain(placeLat, placeLon);
    getDetailHourDay(placeLat, placeLon);
  });
});

// ---------------------- Current Location ----------------------
const iconNow = document.querySelector(".inForstatus__icon");
const userLocation = document.querySelector(".search__user");
userLocation.addEventListener("click", currentLocation);
function currentLocation() {
  navigator.geolocation.getCurrentPosition(success, error, options);
  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };
  function success(pos) {
    let latCurrent = Number(pos.coords.latitude);
    let lonCurrent = Number(pos.coords.longitude);
    console.log(latCurrent, lonCurrent);
    getDetailPolution(latCurrent, lonCurrent);
    getDetailMain(latCurrent, lonCurrent);
    getDetailHourDay(latCurrent, lonCurrent);
  }
  function error(err) {
    alert("Allow Access Address - Geolocation not available");
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }
}

// ---------------------- API polution ----------------------
const Pm25 = document.querySelector(".PM25");
const O3 = document.querySelector(".O3");
const PM10 = document.querySelector(".PM10");
const NO2 = document.querySelector(".NO2");
function getDetailPolution(latApi, lonApi) {
  urlPolution = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${latApi}&lon=${lonApi}&appid=${API_ID}`;
  fetch(urlPolution)
    .then((res) => res.json())
    .then((dataPolution) => {
      // console.log(dataPolution);
      Pm25.innerHTML = Math.floor(dataPolution.list[0].components.pm2_5);
      O3.innerHTML = Math.floor(dataPolution.list[0].components.o3);
      PM10.innerHTML = Math.floor(dataPolution.list[0].components.pm10);
      NO2.innerHTML = Math.floor(dataPolution.list[0].components.no2);
    });
}

// ---------------------- API main - features - hours - nextDay ----------------------

function getDetailMain(latApi, lonApi) {
  urlApiMain = `https://api.openweathermap.org/data/2.5/weather?lat=${latApi}&lon=${lonApi}&appid=${API_ID}&units=metric`;
  fetch(urlApiMain)
    .then((res) => res.json())
    .then((dataMain) => {
      // console.log(dataMain);
      // -------------- Get Place + Time --------------
      const placeTrack = document.querySelector(
        ".inFortoday__location--value1"
      );
      placeTrack.innerHTML = dataMain.name;

      // -------------- Wind - Uv - HUmidity - visibility --------------
      const numberWind = document.querySelector(".number--wind");
      const numberHumidity = document.querySelector(".number--humidity");
      const numberVisibility = document.querySelector(".number--Visibility");
      numberVisibility.innerHTML = Math.round(
        Number(dataMain.visibility) / 1000
      );
      numberWind.innerHTML = dataMain.wind.speed;

      // -------------- HUmidity Status--------------
      const statusHumi = document.querySelector(".statusHumi");
      numberHumidity.innerHTML = dataMain.main.humidity;
      function conpareHumi(humidity) {
        if (humidity < 40) return "Low";
        else if (humidity > 40 && humidity < 60) return "Normal";
        else if (humidity > 60) return "High";
      }
      statusHumi.innerHTML = conpareHumi(dataMain.main.humidity);

      // -------------- Icon - Temp - Status NOW  --------------
      const tempNow = document.querySelector(".inForstatus__value--Celcius");
      const description = document.querySelector(".inFor__description");
      const main = document.querySelector(".inFor__main");
      tempNow.innerHTML = Math.floor(dataMain.main.temp);
      description.innerHTML = dataMain.weather[0].description;
      main.innerHTML = dataMain.weather[0].main;

      // -------------- Sunrise - sunset  --------------
      const sunrise = document.querySelector(".sunrise");
      const sunset = document.querySelector(".sunset");
      sunrise.innerHTML = converTime(dataMain.sys.sunrise);
      sunset.innerHTML = converTime(dataMain.sys.sunset);
    });
}

function getDetailHourDay(latApi, lonApi) {
  urlPredict = `https://api.openweathermap.org/data/2.5/onecall?lat=${latApi}&lon=${lonApi}&appid=${API_ID}&exclude=minutely&units=metric`;
  fetch(urlPredict)
    .then((res) => res.json())
    .then((dataPredict) => {
      console.log(dataPredict);
      // -------------- TIME : MONTH YEAR SLICE--------------
      const monthY = document.querySelector(".about__date--month");
      const fullDayMY = document.querySelector(".about__date--day");
      const d = new Date();
      monthY.innerHTML =
        month[sliceS(12, 13, dataPredict.timezone_offset / 3600) - 1] +
        " " +
        d.getFullYear();
      fullDayMY.innerHTML =
        convertDay(dataPredict.daily[0].dt) +
        ", " +
        d.toString().slice(4, 7) +
        " " +
        sliceS(10, 11, dataPredict.timezone_offset / 3600) +
        ", " +
        d.getFullYear();

      // -------------- TIME UTC CONVERT --------------
      const timeTrack = document.querySelector(".inFortoday__hour--value");
      timeTrack.innerHTML = calculateDateTime(
        dataPredict.timezone_offset / 3600
      ).slice(0, 5);

      // -------------- UV VALUE --------------
      const statusUV = document.querySelector(".statusUV");
      function compareUV(uv) {
        if (uv < 3) return "Low";
        else if (uv >= 3 && uv <= 5) return "Medium";
        else if (uv >= 6 && uv <= 7) return "High";
        else if (uv >= 8) return "Very High";
      }
      const numberUv = document.querySelector(".number--uv");
      numberUv.innerHTML = dataPredict.current.uvi;
      statusUV.innerHTML = compareUV(dataPredict.current.uvi);

      // -------------- HOURS VALUE --------------
      const tempHourNext = document.getElementsByClassName(
        "hourValue__feature--value--number"
      );
      const hourNext = document.getElementsByClassName(
        "hourValue__feature--text"
      );
      for (i = 0; i < 6; i++) {
        tempHourNext[i].innerHTML = floorFc(dataPredict.hourly[i].temp);
        hourNext[i].innerHTML = converTime(dataPredict.hourly[i].dt);
      }

      // -------------- DAYS VALUE --------------
      const next1Day = document.getElementsByClassName("inForDays__days--day");
      const tempMin = document.getElementsByClassName(
        "inForDays__day--temp--min"
      );
      const tempMax = document.getElementsByClassName(
        "inForDays__day--temp--max"
      );
      for (i = 0; i < 7; i++) {
        next1Day[i].innerHTML = convertDay(dataPredict.daily[i].dt);
        tempMin[i].innerHTML = floorFc(dataPredict.daily[i].temp.min);
        tempMax[i].innerHTML = floorFc(dataPredict.daily[i].temp.max);
      }

      // -------------- Icon VALUE --------------
      const iconMain = document.querySelector(".inForstatus__icon");
      iconMain.setAttribute(
        "src",
        `http://openweathermap.org/img/wn/${dataPredict.current.weather[0].icon}@2x.png`
      );
      const icon6H = document.getElementsByClassName(
        "hourValue__feature--icon"
      );
      const icon7D = document.getElementsByClassName("inForDays__days--icon");
      for (i = 0; i < 7; i++) {
        icon7D[i].setAttribute(
          "src",
          `https://openweathermap.org/img/wn/${dataPredict.daily[i].weather[0].icon}@2x.png`
        );
      }
      for (j = 0; j < 6; j++) {
        icon6H[j].setAttribute(
          "src",
          `https://openweathermap.org/img/wn/${dataPredict.hourly[j].weather[0].icon}@2x.png`
        );
      }
    });
}

function converTime(time) {
  let date = new Date(time * 1000);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let formatTime = hours + ":" + minutes.toString().padStart(2, "0");
  return formatTime;
}

function convertDay(day) {
  let newDay = new Date(day * 1000);
  return (day = weekday[newDay.getDay()]);
}
function floorFc(temp) {
  return Math.floor(temp);
}

function calculateDateTime(offset) {
  // get current local time in milliseconds
  var date = new Date();
  var localTime = date.getTime();
  // get local timezone offset and convert to milliseconds
  var localOffset = date.getTimezoneOffset() * 60000;
  // obtain the UTC time in milliseconds
  var utc = localTime + localOffset;
  var newDateTime = utc + 3600000 * offset;
  var convertedDateTime = new Date(newDateTime);
  return convertedDateTime.toLocaleString();
}
function sliceS(from, to, offset) {
  return calculateDateTime(offset).slice(from, to);
}
