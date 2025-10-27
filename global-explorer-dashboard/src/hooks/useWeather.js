import { useState, useEffect } from 'react';

const WEATHER_API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

export const useWeather = (city, country) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!city || !WEATHER_API_KEY) return;

    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${WEATHER_API_KEY}&units=metric`
        );

        if (!response.ok) {
          throw new Error('Weather data not available');
        }

        const data = await response.json();
        setWeather(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city, country]);

  return { weather, loading, error };
};