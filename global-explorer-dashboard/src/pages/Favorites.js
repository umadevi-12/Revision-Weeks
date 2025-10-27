import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import CountryCard from '../components/CountryCard';

const Favorites = () => {
  const { favorites } = useApp();

  return (
    <div className="favorites">
      <div className="container">
        <h1>Favorite Countries</h1>
        
        {favorites.length === 0 ? (
          <div className="no-favorites">
            <p>You haven't added any favorite countries yet.</p>
            <Link to="/" className="explore-link">
              Explore Countries
            </Link>
          </div>
        ) : (
          <>
            <p className="favorites-count">
              {favorites.length} favorite {favorites.length === 1 ? 'country' : 'countries'}
            </p>
            
            <div className="countries-grid">
              {favorites.map(country => (
                <CountryCard key={country.cca3} country={country} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Favorites;