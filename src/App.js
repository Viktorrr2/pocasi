import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const cities = [
  { name: 'Žatec', image: 'https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcQJL4TJAssazISSeJcC7csxW0u1BZ-XBxQVNIt0_V2mxS3k6uKHrLF6mUD4le-TfPBM4IPS_HqaB-i8Yp47B3O__U0GAg7GL2_j4I-otw' },
  { name: 'Praha', image: 'https://lh5.googleusercontent.com/p/AF1QipP07f3xwuCsoJBnztcDHtoAu7ncK47MYhQqDTsh=w540-h312-n-k-no' },
  { name: 'Most', image: 'https://lh5.googleusercontent.com/p/AF1QipNSJH9WMPapkK9n3Gc4FXgwfB_uEkbExogsy8pI=w540-h312-n-k-no' },
  { name: 'Liberec', image: 'https://lh5.googleusercontent.com/proxy/hi18irFEwgjOUtK3kobR6Z991xz8ZKN8agTxfqujX6yVv9tB4zM07ZWbKguyOU4uSbbUdf9Yipe2aMgA-F2GVYtwuu3uwnKEEyqO60Q2z4ppKfFaxRpujhp6htZGa-YknWMZWGG1Xm1yF5UDABVLY-eHys-8_g=w540-h312-n-k-no' },
  { name: 'Plzen', image: 'https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcRK7qIKiWY4U9kH3BNaDpfO7nx6E0z2J8UGyxOBej6rcO2hEL_ehmUD0940dizxZDVHUebkCADzynOp4CNjYmYHEfh-60-F2ktigVRfPA' }
];
const API_KEY = '978dc3e1f98c287e0a110ba6b379ded9';

function App() {
  const [selectedCity, setSelectedCity] = useState(null);
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedCity) {
        try {
          const response = await axios.get(`http://api.openweathermap.org/data/2.5/forecast?q=${selectedCity}&appid=${API_KEY}&units=metric`);
          setWeatherData(response.data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };

    fetchData();
  }, [selectedCity]);

  const handleCityClick = (cityName) => {
    setSelectedCity(cityName);
  };

  const filterWeekdays = (data) => {
    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const filteredData = [];
    data.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
      if (weekdays.includes(dayOfWeek) && !filteredData.find(entry => entry.day === dayOfWeek)) {
        filteredData.push({
          day: dayOfWeek,
          weather: item.weather[0].main,
          temperature: item.main.temp,
          humidity: item.main.humidity,
          windSpeed: item.wind.speed,
          frost: item.main.temp < 0 ? 'Yes' : 'No',
          precipitation: item.weather[0].main
        });
      }
    });
    return filteredData;
  };

  return (
    <div className="App">
      <h1>Weather</h1>
      <div className="navbar">
        {cities.map((city, index) => (
          <div key={index} className={`nav-item ${city.name === selectedCity ? 'selected' : ''}`} onClick={() => handleCityClick(city.name)}>
            {city.name}
          </div>
        ))}
      </div>
      <div className="dashboard">
        {selectedCity && weatherData && (
          <div className="city-box">
            <h2>{selectedCity}</h2>
            <img src={cities.find(city => city.name === selectedCity).image} alt={selectedCity} />
            <h3>Forecast:</h3>
            <ul>
              {filterWeekdays(weatherData).map((forecast, forecastIndex) => (
                <li key={forecastIndex}>
                  {forecast.day}: {forecast.weather}, {forecast.temperature}°C
                </li>
              ))}
            </ul>
            <p>Humidity: {filterWeekdays(weatherData)[0].humidity}%</p>
            <p>Wind Speed: {filterWeekdays(weatherData)[0].windSpeed} m/s</p>
            <p>Frost: {filterWeekdays(weatherData)[0].frost}</p>
            <p>Precipitation: {filterWeekdays(weatherData)[0].precipitation}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

