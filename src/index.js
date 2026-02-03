//index.js
import "./styles.css";
import { greeting } from "./greeting.js";
import { parse } from "date-fns";

const weatherDiv = document.querySelector("#weather-spot");

let jsonResponse = undefined;
let usableWeatherObj = undefined;

//parseWeather: take in a JSONified weather response and spit out an object containing relevant data.
const parseWeather = (jsonResponse) => {
    //where response is json returned in a promise...
    console.log("Getting weather info for " + jsonResponse.address);
    
    //let newJSON = response;
    
    const loc = jsonResponse.address;
    const desc = jsonResponse.description;

    const returnedObj = {
        location: loc,
        description: desc
    };

    return returnedObj;
};

const printData = (weatherObject) => {
    //Clear weather data div:
    weatherDiv.textContent = "";

    const locationDiv = document.createElement("div");
    locationDiv.textContent = "Location: " + weatherObject.location;

    const descDiv = document.createElement("div");
    descDiv.textContent = "Forecast: " + weatherObject.description;

    weatherDiv.appendChild(locationDiv);
    weatherDiv.appendChild(descDiv);
}

//Initial weather call for my city using fetch:
const getUtrechtWeather = () => {
    console.log("Fetching Utrecht's weather data!");
    fetch('https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Utrecht?unitGroup=us&key=F7BQYXYL2XX3BSLVVM55CJND4&contentType=json')
        .then(function (response) {
            //console.log(response); //Log the raw response, before
            return response.json(); //turning it into readable JSON
        })
        .then(function(response) { //This is taking in the now-JSONified response! 
            //console.log(response); //Thus this gives a different result than in the first .then step
            //console.log(response.address); //And this gives the location queried!
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
        const response = await fetch('https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/' + searchLocation  + '?unitGroup=us&key=F7BQYXYL2XX3BSLVVM55CJND4&contentType=json');
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

const getNewGif = () => {
    const search = searchField.value;
    console.log("Searching for " + search);

    fetch('https://api.giphy.com/v1/gifs/translate?api_key=YalzJSIhPzvLn4Gxy90lSOoEBsGbSoPU&s=' + search)
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            img.src = response.data.images.original.url;
        })
        .catch(function (error) {
            console.log(error);
            console.log("Oh no! Can't search for " + search);
        })
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