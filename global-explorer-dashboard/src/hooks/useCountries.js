import { useState, useEffect } from 'react';

// Fallback data in case API fails
const fallbackCountries = [
  {
    name: { common: "United States", official: "United States of America" },
    flags: { png: "https://flagcdn.com/w320/us.png" },
    capital: ["Washington, D.C."],
    region: "Americas",
    population: 329484123,
    cca3: "USA",
    cca2: "US"
  },
  {
    name: { common: "United Kingdom", official: "United Kingdom of Great Britain and Northern Ireland" },
    flags: { png: "https://flagcdn.com/w320/gb.png" },
    capital: ["London"],
    region: "Europe",
    population: 67215293,
    cca3: "GBR",
    cca2: "GB"
  },
  {
    name: { common: "Canada", official: "Canada" },
    flags: { png: "https://flagcdn.com/w320/ca.png" },
    capital: ["Ottawa"],
    region: "Americas",
    population: 38005238,
    cca3: "CAN",
    cca2: "CA"
  },
  {
    name: { common: "Australia", official: "Commonwealth of Australia" },
    flags: { png: "https://flagcdn.com/w320/au.png" },
    capital: ["Canberra"],
    region: "Oceania",
    population: 25687041,
    cca3: "AUS",
    cca2: "AU"
  },
  {
    name: { common: "Japan", official: "Japan" },
    flags: { png: "https://flagcdn.com/w320/jp.png" },
    capital: ["Tokyo"],
    region: "Asia",
    population: 125836021,
    cca3: "JPN",
    cca2: "JP"
  }
];

const useCountries = () => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching countries...');
      
      // Try multiple endpoints for better compatibility
      const endpoints = [
        'https://restcountries.com/v3.1/all',
        'https://restcountries.com/v3.1/all?fields=name,flags,capital,region,population,cca3,cca2',
        'https://restcountries.com/v2/all'
      ];
      
      let data;
      let lastError;
      
      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint);
          if (response.ok) {
            data = await response.json();
            console.log(`Success with endpoint: ${endpoint}`);
            break;
          }
        } catch (err) {
          lastError = err;
          console.log(`Failed with endpoint: ${endpoint}`, err);
        }
      }
      
      if (!data) {
        throw new Error(lastError?.message || 'All API endpoints failed');
      }
      
      // Ensure data is an array and has required fields
      const validCountries = Array.isArray(data) ? data : [];
      
      if (validCountries.length === 0) {
        throw new Error('No country data received');
      }
      
      const sortedData = validCountries.sort((a, b) => 
        a.name?.common?.localeCompare(b.name?.common) || 0
      );
      
      setCountries(sortedData);
      setFilteredCountries(sortedData);
      
    } catch (err) {
      console.error('API failed, using fallback data:', err);
      // Use fallback data
      setCountries(fallbackCountries);
      setFilteredCountries(fallbackCountries);
      setError('Using demo data (API temporarily unavailable)');
    } finally {
      setLoading(false);
    }
  };

  const searchCountries = (query) => {
    if (!query.trim()) {
      setFilteredCountries(countries);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = countries.filter(country => 
      country.name?.common?.toLowerCase().includes(lowerQuery) ||
      (country.capital && country.capital[0]?.toLowerCase().includes(lowerQuery))
    );
    
    setFilteredCountries(filtered);
  };

  const filterByRegion = (region) => {
    if (!region) {
      setFilteredCountries(countries);
      return;
    }
    
    const filtered = countries.filter(country => 
      country.region === region
    );
    
    setFilteredCountries(filtered);
  };

  const sortCountries = (sortBy) => {
    let sorted = [...filteredCountries];
    
    switch (sortBy) {
      case 'population':
        sorted.sort((a, b) => (b.population || 0) - (a.population || 0));
        break;
      case 'area':
        sorted.sort((a, b) => (b.area || 0) - (a.area || 0));
        break;
      case 'name':
        sorted.sort((a, b) => (a.name?.common || '').localeCompare(b.name?.common || ''));
        break;
      default:
        break;
    }
    
    setFilteredCountries(sorted);
  };

  return {
    countries: filteredCountries,
    loading,
    error,
    searchCountries,
    filterByRegion,
    sortCountries,
    refetch: fetchCountries
  };
};

export default useCountries;