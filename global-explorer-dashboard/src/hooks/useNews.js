import { useState, useEffect } from 'react';

const NEWS_API_KEY = process.env.REACT_APP_NEWS_API_KEY;

export const useNews = (countryCode) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!countryCode || !NEWS_API_KEY) return;

    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(
          `https://newsapi.org/v2/top-headlines?country=${countryCode}&pageSize=3&apiKey=${NEWS_API_KEY}`
        );

        if (!response.ok) {
          throw new Error('News data not available');
        }

        const data = await response.json();
        setNews(data.articles || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [countryCode]);

  return { news, loading, error };
};