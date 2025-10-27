import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import CountryDetails from '../components/CountryDetails';
import Loading from '../components/Loading';
import Error from '../components/Error';

const CountryDetailsPage = () => {
  const { countryCode } = useParams();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCountry();
  }, [countryCode]);

  const fetchCountry = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching country:', countryCode);
      
      const response = await fetch(
        `https://restcountries.com/v3.1/alpha/${countryCode}`
      );

      if (!response.ok) {
        throw new Error('Country not found');
      }

      const data = await response.json();
      setCountry(data[0]);
    } catch (err) {
      console.error('Error fetching country:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading message="Loading country details..." />;
  
  if (error) return <Error message={error} onRetry={fetchCountry} />;

  return (
    <div className="country-details-page">
      <div className="container">
        <Link to="/" className="back-button">
          ← Back to Countries
        </Link>
        
        {country && <CountryDetails country={country} />}
      </div>
    </div>
  );
};

export default CountryDetailsPage;