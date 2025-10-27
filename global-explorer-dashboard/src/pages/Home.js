import React, { useState } from 'react';
import useCountries from '../hooks/useCountries';
import CountryCard from '../components/CountryCard';
import Filters from '../components/Filters';
import Loading from '../components/Loading';
import Error from '../components/Error';

const Home = () => {
  const { countries, loading, error, searchCountries, filterByRegion, sortCountries, refetch } = useCountries();
  const [currentPage, setCurrentPage] = useState(1);
  const countriesPerPage = 12;

  const indexOfLastCountry = currentPage * countriesPerPage;
  const indexOfFirstCountry = indexOfLastCountry - countriesPerPage;
  const currentCountries = countries.slice(indexOfFirstCountry, indexOfLastCountry);
  const totalPages = Math.ceil(countries.length / countriesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  if (loading) return <Loading message="Loading countries..." />;
  
  if (error) return <Error message={error} onRetry={refetch} />;

  return (
    <div className="home">
      <div className="container">
        <h1>Explore Countries</h1>
        
        <Filters 
          onSearch={searchCountries}
          onFilter={filterByRegion}
          onSort={sortCountries}
        />

        <div className="countries-grid">
          {currentCountries.map(country => (
            <CountryCard key={country.cca3} country={country} />
          ))}
        </div>

        {countries.length === 0 && (
          <div className="no-results">
            <p>No countries found matching your search criteria.</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="pagination">
            <button 
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="pagination-btn"
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(page => 
                page === 1 || 
                page === totalPages || 
                Math.abs(page - currentPage) <= 1
              )
              .map((page, index, array) => {
                if (index > 0 && page - array[index - 1] > 1) {
                  return (
                    <React.Fragment key={`ellipsis-${page}`}>
                      <span className="pagination-ellipsis">...</span>
                      <button
                        onClick={() => handlePageChange(page)}
                        className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  );
                }
                
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                  >
                    {page}
                  </button>
                );
              })}
            
            <button 
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="pagination-btn"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;