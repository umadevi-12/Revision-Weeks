import React, { useState, useEffect } from 'react';
import Loading from './Loading';
import Error from './Error';

const CountryDetails = ({ country }) => {
  const [weather, setWeather] = useState(null);
  const [news, setNews] = useState([]);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [newsLoading, setNewsLoading] = useState(false);
  const [weatherError, setWeatherError] = useState(null);
  const [newsError, setNewsError] = useState(null);


  const demoWeather = {
    weather: [{ icon: '01d', description: 'sunny' }],
    main: { temp: 25, feels_like: 27, humidity: 65 },
    wind: { speed: 3.5 }
  };

  const demoNews = [
    {
      title: "Latest developments in the country",
      description: "Stay updated with the current events and news from this region.",
      url: "#"
    },
    {
      title: "Economic growth report published",
      description: "Recent economic indicators show positive trends in the region.",
      url: "#"
    },
    {
      title: "Cultural festival announced",
      description: "Annual cultural celebration to take place next month.",
      url: "#"
    }
  ];

  useEffect(() => {
    if (country.capital?.[0]) {
      fetchWeather();
    }
  }, [country.capital]);

  useEffect(() => {
    if (country.cca2) {
      fetchNews();
    }
  }, [country.cca2]);

  const fetchWeather = async () => {
    const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
    
    if (!apiKey) {
    
      setTimeout(() => {
        setWeather(demoWeather);
      }, 1000);
      return;
    }

    try {
      setWeatherLoading(true);
      setWeatherError(null);
      
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${country.capital[0]},${country.cca2}&appid=${apiKey}&units=metric`
      );

      if (!response.ok) {
        throw new Error('Weather data not available');
      }

      const data = await response.json();
      setWeather(data);
    } catch (err) {
      setWeatherError(err.message);
      // Fallback to demo data on error
      setWeather(demoWeather);
    } finally {
      setWeatherLoading(false);
    }
  };

  const fetchNews = async () => {
    const apiKey = process.env.REACT_APP_NEWS_API_KEY;
    
    if (!apiKey) {
      // Show demo data if no API key
      setTimeout(() => {
        setNews(demoNews);
      }, 1000);
      return;
    }

    try {
      setNewsLoading(true);
      setNewsError(null);
      
      const response = await fetch(
        `https://newsapi.org/v2/top-headlines?country=${country.cca2}&pageSize=3&apiKey=${apiKey}`
      );

      if (!response.ok) {
        throw new Error('News data not available');
      }

      const data = await response.json();
      setNews(data.articles || []);
    } catch (err) {
      setNewsError(err.message);
      // Fallback to demo data on error
      setNews(demoNews);
    } finally {
      setNewsLoading(false);
    }
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };

  const getLanguages = () => {
    return country.languages ? Object.values(country.languages).join(', ') : 'N/A';
  };

  const getCurrencies = () => {
    if (!country.currencies) return 'N/A';
    
    return Object.values(country.currencies)
      .map(currency => `${currency.name} (${currency.symbol})`)
      .join(', ');
  };

  const getCoordinates = () => {
    if (!country.latlng) return 'N/A';
    return `${country.latlng[0].toFixed(2)}, ${country.latlng[1].toFixed(2)}`;
  };

  return (
    <div className="country-details">
      <div className="details-header">
        <img 
          src={country.flags.png} 
          alt={`${country.name.common} flag`}
          className="details-flag"
        />
        <div className="details-title">
          <h1>{country.name.common}</h1>
          <p className="official-name">{country.name.official}</p>
        </div>
      </div>

      <div className="details-grid">
        <div className="details-section">
          <h2>Basic Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <strong>Capital:</strong> {country.capital?.[0] || 'N/A'}
            </div>
            <div className="info-item">
              <strong>Region:</strong> {country.region}
            </div>
            <div className="info-item">
              <strong>Subregion:</strong> {country.subregion || 'N/A'}
            </div>
            <div className="info-item">
              <strong>Population:</strong> {formatNumber(country.population)}
            </div>
            <div className="info-item">
              <strong>Area:</strong> {formatNumber(country.area || 0)} km²
            </div>
            <div className="info-item">
              <strong>Languages:</strong> {getLanguages()}
            </div>
            <div className="info-item">
              <strong>Currencies:</strong> {getCurrencies()}
            </div>
          </div>
        </div>

        <div className="details-section">
          <h2>Location</h2>
          <div className="info-item">
            <strong>Coordinates:</strong> {getCoordinates()}
          </div>
          {country.latlng && (
            <div className="map-container">
              <iframe
                title="country-map"
                width="100%"
                height="200"
                loading="lazy"
                allowFullScreen
                src={`https://maps.google.com/maps?q=${country.latlng[0]},${country.latlng[1]}&z=5&output=embed`}
              ></iframe>
            </div>
          )}
        </div>

        {country.borders && country.borders.length > 0 && (
          <div className="details-section">
            <h2>Border Countries</h2>
            <div className="borders-list">
              {country.borders.map(border => (
                <span key={border} className="border-country">
                  {border}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Weather Section */}
      <div className="details-section">
        <h2>Weather in {country.capital?.[0] || 'the capital'}</h2>
        {weatherLoading && <Loading message="Loading weather..." />}
        {weatherError && (
          <div className="demo-notice">
            <Error message="Using demo weather data" />
            {weather && (
              <div className="weather-info">
                <div className="weather-main">
                  <div className="weather-icon">☀️</div>
                  <div className="weather-temp">
                    <h3>{Math.round(weather.main.temp)}°C</h3>
                    <p>{weather.weather[0].description}</p>
                  </div>
                </div>
                <div className="weather-details">
                  <p><strong>Feels like:</strong> {Math.round(weather.main.feels_like)}°C</p>
                  <p><strong>Humidity:</strong> {weather.main.humidity}%</p>
                  <p><strong>Wind:</strong> {weather.wind.speed} m/s</p>
                </div>
              </div>
            )}
          </div>
        )}
        {weather && !weatherError && (
          <div className="weather-info">
            <div className="weather-main">
              {process.env.REACT_APP_WEATHER_API_KEY ? (
                <img 
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                  alt={weather.weather[0].description}
                />
              ) : (
                <div className="weather-icon">☀️</div>
              )}
              <div className="weather-temp">
                <h3>{Math.round(weather.main.temp)}°C</h3>
                <p>{weather.weather[0].description}</p>
              </div>
            </div>
            <div className="weather-details">
              <p><strong>Feels like:</strong> {Math.round(weather.main.feels_like)}°C</p>
              <p><strong>Humidity:</strong> {weather.main.humidity}%</p>
              <p><strong>Wind:</strong> {weather.wind.speed} m/s</p>
            </div>
          </div>
        )}
        {!weatherLoading && !weatherError && !weather && (
          <p>Weather data not available.</p>
        )}
      </div>

      {/* News Section */}
      <div className="details-section">
        <h2>Latest News</h2>
        {newsLoading && <Loading message="Loading news..." />}
        {newsError && (
          <div className="demo-notice">
            <Error message="Using demo news data" />
            {news.length > 0 && (
              <div className="news-list">
                {news.map((article, index) => (
                  <div key={index} className="news-item">
                    <h4>{article.title}</h4>
                    <p>{article.description}</p>
                    <span className="demo-link">Demo news article</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {news.length > 0 && !newsError && (
          <div className="news-list">
            {news.map((article, index) => (
              <div key={index} className="news-item">
                <h4>{article.title}</h4>
                <p>{article.description}</p>
                {process.env.REACT_APP_NEWS_API_KEY ? (
                  <a href={article.url} target="_blank" rel="noopener noreferrer">
                    Read more →
                  </a>
                ) : (
                  <span className="demo-link">Demo news article</span>
                )}
              </div>
            ))}
          </div>
        )}
        {!newsLoading && !newsError && news.length === 0 && (
          <p>No news available for this country.</p>
        )}
      </div>
    </div>
  );
};

export default CountryDetails;