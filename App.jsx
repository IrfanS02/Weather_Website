import { useEffect, useState } from "react";
import "./App.css";
// Images
import searchIcon from "./assets/search.png";
import CloudIcon from "./assets/cloudy.gif";
import sunIcon from "./assets/sun.gif";
import windIcon from "./assets/wind.gif";
import humidityIcon from "./assets/humidity.gif";
import snowIcon from "./assets/snow.gif";
import drizzle from "./assets/drizzle.gif";
import clouds from "./assets/clouds.png";
import moonIcon from "./assets/full-moon.gif";
import nightmoonIcon from "./assets/crescent-moon.png";
import cloudy from "./assets/stratuscumulus.png";
import dayrainIcon from "./assets/weather.gif";
import nightrainIcon from "./assets/raining.png";
import thunderstromIcon from "./assets/storm.gif";
import MistIcon from "./assets/haze.png";

const WeatherDetails = ({ icon, temp, city, country, latitude, longitude, humidity, wind }) => {
  return (
    <>
      <div className="image" >
        <img src={icon} alt="Image" />
      </div>
      <div className="temp">{temp}°C</div>
      <div className="location">{city}</div>
      <div className="country">{country}</div>
      <div className="cord">
        <div>
          <span className="lat">Latitude:</span>
          <span>{latitude}</span>
        </div>
        <div>
          <span className="log">Longitude:</span>
          <span>{longitude}</span>
        </div>
      </div>
      <div className="data-container">
        <div className="element">
             <img src= {humidityIcon} alt = "humidity" className="icon" />
             <div className="data">
              <div className="humidity-percent">{humidity} %</div>
              <div className="text">Humiditiy</div>
             </div>
        </div>
        <div className="element">
             <img src= {windIcon} alt = "wind" className="icon" />
             <div className="data">
              <div className="wind-percent">{wind} km/h</div>
              <div className="text">Wind Speed</div>
             </div>
        </div>
      </div>
    </>
  );
};

function App() {
  
  let api_key = "42623bd3613bbc98cca767e48dde8c75";

  const [text, setText] = useState("");
  const [icon, setIcon] = useState(sunIcon);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [latitude, setLatitude] = useState("0");
  const [longitude, setLongitude] = useState("0");
  const [humidity, setHumidity] = useState(0);
  const [wind, setWind] = useState(0);
  const [cityNotfound , setCitynotfound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const weatherIconMap = {
    "01d" : sunIcon,
    "01n" : moonIcon,
    "02d" : CloudIcon,
    "02n" : nightmoonIcon,
    "03d" : clouds,
    "03n" : clouds,
    "04d" : cloudy,
    "04n" : cloudy,
    "09d" : drizzle,
    "09n" : drizzle,
    "10d" : dayrainIcon,
    "10n" : nightrainIcon,
    "11d" : thunderstromIcon,
    "11n" : thunderstromIcon,
    "13d" : snowIcon,
    "13n" : snowIcon,
    "50d" : MistIcon,
    "50n" : MistIcon
  }
  
  const getCountryName = async (countryCode) => {
    try {
      let res = await fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`);
      let data = await res.json();
      return data[0]?.name?.common || countryCode; // Return full name or fallback to code
    } catch (error) {
      return countryCode; // Fallback if API fails
    }
  };
  
  const search = async () => {
    if (!text.trim()) {
      setError("Please enter a city name.");
      setCitynotfound(false);
      return;
    }
  
    setError(null);
    setCitynotfound(false);
    setLoading(true);
  
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=metric`;
  
    try {
      let res = await fetch(url);
      let data = await res.json();
  
      if (data.cod === "404") {
        setCitynotfound(true);
        setCity("");
        setText(""); 
        return;
      }
  
      let fullCountryName = await getCountryName(data.sys.country); // Fetch full country name
  
      setCity(data.name);
      setCountry(fullCountryName); // Set full country name
      setLatitude(data.coord.lat);
      setLongitude(data.coord.lon);
      setTemp(Math.floor(data.main.temp));
      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      setIcon(weatherIconMap[data.weather[0].icon] || sunIcon);
  
      setText(""); 
    } catch (error) {
      setError("An error occurred while fetching weather data.");
    } finally {
      setLoading(false);
    }
  };
  

  const HandleCity = (e) =>{
    setText(e.target.value);
  }

  const HandleKeyDown = (e) =>{
    if(e.key === "Enter"){
      search();
    }
  }
  useEffect(() => {
    if (text.trim()) {
      search();
    }
  }, []);  // Runs only once when the component mounts
  
  return (
    <>
      <div className="container">
        <div className="input-container">
          <input type="text"
           className="cityInput"
          placeholder="Enter the city name" 
          onChange={HandleCity}
          value = {text} onKeyDown={HandleKeyDown}/>
          <div className="search-icon"
          onClick ={() => search()}>
            <img src={searchIcon} alt="Search"/>
          </div>
        </div>

        {loading && <div className="loading-message"> Loading..... </div>}
        {error && <div className="error-message" > {error} </div>}
        {cityNotfound &&<div className="city-not-found" >City not found</div>}

       { !loading && !cityNotfound && <WeatherDetails
          icon={icon}
          temp={temp}
          city={city}
          country={country}
          latitude={latitude}
          longitude={longitude}
          humidity={humidity}
          wind={wind}
        />}
       
        <p className="design">Designed by Irfan</p>
      </div>
    </>
  );
}

export default App;
