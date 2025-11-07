import React, { useState, useEffect, useRef } from "react";

const JokesFetcher = () => {
  const [joke, setJoke] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [count, setCount] = useState(1);
  const controllerRef = useRef(null); 

  const fetchJokes = async (num = 1) => {
    setLoading(true);
    setError("");
    if (controllerRef.current) controllerRef.current.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      let jokesArray = [];
      for (let i = 0; i < num; i++) {
        const res = await fetch("https://official-joke-api.appspot.com/random_joke", {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        jokesArray.push(data);
      }

      setJoke(jokesArray[jokesArray.length - 1]);

      setHistory((prev) => {
        const updated = [...jokesArray, ...prev];
        return updated.slice(0, 5);
      });
    } catch (err) {
      if (err.name !== "AbortError") setError("Failed to fetch joke.");
    } finally {
      setLoading(false);
    }
  };

  const handleFetch = () => {
    const num = Math.min(Math.max(parseInt(count) || 1, 1), 5);
    fetchJokes(num);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const longestSetup =
    history.length > 0
      ? history.reduce((max, curr) =>
          curr.setup.length > max.setup.length ? curr : max
        )
      : null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">🎭 Random Joke Generator</h1>

      <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-md text-center">
        <div className="flex justify-center gap-2 mb-4">
          <input
            type="number"
            min="1"
            max="5"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            className="border rounded-md px-2 py-1 w-16 text-center"
          />
          <button
            onClick={handleFetch}
            className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition"
          >
            Get Random Joke
          </button>
        </div>

        {loading && <p className="text-gray-500">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {joke && !loading && !error && (
          <div className="mt-4 bg-blue-50 rounded-xl p-3">
            <p className="font-semibold">{joke.setup}</p>
            <p className="text-gray-700 mt-1">{joke.punchline}</p>
          </div>
        )}

        <hr className="my-4" />
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-semibold text-gray-700">History (Last 5)</h2>
          <button
            onClick={clearHistory}
            className="text-sm text-red-500 underline"
          >
            Clear History
          </button>
        </div>

        <ul className="text-left">
          {history.length === 0 && <p className="text-gray-400 text-center">No jokes yet</p>}
          {history.map((item, index) => (
            <li
              key={index}
              className={`p-2 rounded-lg mb-2 ${
                longestSetup && item.setup === longestSetup.setup
                  ? "bg-yellow-100"
                  : "bg-gray-100"
              }`}
            >
              <p className="font-medium">{item.setup}</p>
              <p className="text-gray-600">{item.punchline}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default JokesFetcher;
