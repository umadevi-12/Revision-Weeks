import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const CountryCard = ({ country }) => {
  const { toggleFavorite, isFavorite } = useApp();
  const isFav = isFavorite(country.cca3);

  const formatPopulation = (population) => {
    return new Intl.NumberFormat().format(population);
  };

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(country);
  };

  return (
    <Link to={`/country/${country.cca3}`} className="country-card">
      <div className="card-header">
        <img 
          src={country.flags.png} 
          alt={`${country.name.common} flag`}
          className="flag"
        />
        <button 
          className={`favorite-btn ${isFav ? 'favorited' : ''}`}
          onClick={handleFavoriteClick}
        >
          {isFav ? '❤️' : '🤍'}
        </button>
      </div>

      <div className="card-content">
        <h3 className="country-name">{country.name.common}</h3>
        <div className="country-info">
          <p><strong>Capital:</strong> {country.capital?.[0] || 'N/A'}</p>
          <p><strong>Region:</strong> {country.region}</p>
          <p><strong>Population:</strong> {formatPopulation(country.population)}</p>
        </div>
      </div>
    </Link>
  );
};

export default CountryCard;