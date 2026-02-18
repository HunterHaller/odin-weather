//index.js
import "./styles.css";
import { format } from "date-fns"; // for time formatting

//images:
//import rainPartlyCloudyDay from "./img/day/partly_cloudy_rain_day.png";

const weatherDiv = document.querySelector("#weather-spot");

let jsonResponse = undefined;
let usableWeatherObj = undefined;

const createTimestamp = () => {
    console.log("Printing timestamp...");

    const timestampDiv = document.querySelector("#timestamp");
    timestampDiv.textContent = ""; //clear content

    const now = Date.now();
    timestampDiv.textContent = "Last updated " + format(now, 'p') + ", " + format(now, 'LL/dd');
}

const showDays = () => {
    const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

    const currentDate = new Date();
    let todayIndex = currentDate.getDay();

    //Fill text for each day banner:
    for (let i = 0; i < 5; i++) {
        let dayCount = i + 1;
        let workingDay = document.querySelector("#day-" + dayCount + "-banner");
        workingDay.textContent = days[todayIndex + i];
    }
}

const getIcon = (dayNumber, weatherObject) => {
    let imgUrl;

    console.log("Getting icon for conditions: " + weatherObject["day" + dayNumber + "conditions"]);

    if ((dayNumber == 0) && (rightNow.getHours() >= weatherObject.todaySunsetHour)) { //if it's past sunset today,
        console.log("It's night time today! Use a night-time icon");
    } else {
        console.log("Show the daytime icon!");
        switch (weatherObject["day" + dayNumber + "conditions"]) {
            case "Rain, Partially cloudy":
                console.log("Case met!");
                import("./img/day/partly_cloudy_rain_day.png").then((image) => {
                    imgUrl = image.default;
                    //document.querySelector("#day-" + dayNumber + "-icon").src = image.default;
                });
                break;
            case "Snow, Rain, Overcast":
                import("./img/cloud_rain_snow.png").then((image) => {
                    console.log("Case met!");
                    imgUrl = image.default;
                    //    document.querySelector("#day-" + dayNumber + "-icon").src = image.default;
                })
                break;
        }
        //document.querySelector("#day-" + dayNumber + "-icon").src = imgUrl;
    };
    //document.querySelector("#day-" + dayNumber + "-icon").src = imgUrl;
}

//parseWeather: take in a JSONified weather response and spit out an object containing relevant data.
const parseWeather = (jsonResponse) => {
    //where response is json returned in a promise...
    console.log("Getting weather info for " + jsonResponse.address);

    createTimestamp();

    const returnedObj = {
        location: jsonResponse.address,
        description: jsonResponse.description,
        todaySunsetHour: jsonResponse.days[0].sunset.substring(0, 2),
        day1high: jsonResponse.days[0].tempmax.toFixed(0),
        day1low: jsonResponse.days[0].tempmin.toFixed(0),
        day2high: jsonResponse.days[1].tempmax.toFixed(0),
        day2low: jsonResponse.days[1].tempmin.toFixed(0),
        day3high: jsonResponse.days[2].tempmax.toFixed(0),
        day3low: jsonResponse.days[2].tempmin.toFixed(0),
        day4high: jsonResponse.days[3].tempmax.toFixed(0),
        day4low: jsonResponse.days[3].tempmin.toFixed(0),
        day5high: jsonResponse.days[4].tempmax.toFixed(0),
        day5low: jsonResponse.days[4].tempmin.toFixed(0),
        day1conditions: jsonResponse.days[0].conditions,
        day2conditions: jsonResponse.days[1].conditions,
        day3conditions: jsonResponse.days[2].conditions,
        day4conditions: jsonResponse.days[3].conditions,
        day5conditions: jsonResponse.days[4].conditions,
    };

    console.log(returnedObj.todaySunsetHour);

    return returnedObj;
};

const printData = (weatherObject) => {
    //Clear weather data div:

    console.log("Printing data for " + weatherObject.location);

    const locationDiv = document.querySelector("#location-name-display");
    locationDiv.textContent = weatherObject.location;

    showDays();

    for (let i = 1; i < 6; i++) {
        document.querySelector("#day-" + i + "-high").textContent = weatherObject["day" + i + "high"];
        document.querySelector("#day-" + i + "-low").textContent = weatherObject["day" + i + "low"];

        getIcon(i, weatherObject);
    }
}

//Initial weather call for my city using fetch:
const getUtrechtWeather = () => {
    console.log("Fetching Utrecht's weather data!");
    fetch('https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Utrecht?unitGroup=us&key=F7BQYXYL2XX3BSLVVM55CJND4&contentType=json')
        .then(function (response) {
            return response.json(); //turning it into readable JSON
        })
        .then(function (response) { //This is taking in the now-JSONified response! 
            console.log(response); //Thus this gives a different result than in the first .then step
            console.log(response.address); //And this gives the location queried!
            usableWeatherObj = parseWeather(response); //Pass the JSON into a function and return an object with the data we want
            console.log(usableWeatherObj); //Log the object!
            printData(usableWeatherObj);
        });
}

getUtrechtWeather();

//getNewWeather: Allows users to search for weather data for anywhere in the world! Uses the async method.
const getNewWeather = async () => {
    const searchLocation = searchField.value;
    console.log("Executing a new search for data from " + searchLocation);
    try {
        const response = await fetch('https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/' + searchLocation + '?unitGroup=us&key=F7BQYXYL2XX3BSLVVM55CJND4&contentType=json');
        if (!response.ok) {
            throw new Error('Reponse status: ${response.status}');
        }

        const jsonResponse = await response.json();
        console.log("Parsing weather data for " + jsonResponse.address);
        usableWeatherObj = parseWeather(jsonResponse);
        printData(usableWeatherObj);
    } catch (e) {
        console.error(e);
    }
}

const searchField = document.querySelector("#search-field");
const weatherButton = document.querySelector("#weather-button");

weatherButton.addEventListener("click", getNewWeather);

searchField.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        getNewWeather();
    }
});