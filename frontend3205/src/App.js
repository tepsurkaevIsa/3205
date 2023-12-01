import React, { useState, useRef } from "react";
import InputMask from "react-input-mask";

function App() {
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [results, setResults] = useState([]);
  const [userNotFound, setUserNotFound] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const abortControllerRef = useRef(null);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleNumberChange = (e) => {
    const cleanedValue = e.target.value.replace(/-/g, "");
    setNumber(cleanedValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    const signal = abortController.signal;

    setIsFetching(true);

    try {
      const response = await fetch("https://three205-team.onrender.com", {
        method: "POST",
        body: JSON.stringify({ email, number }),
        headers: {
          "Content-Type": "application/json",
        },
        signal,
      });

      if (!response.ok) {
        throw new Error(`Fetch Error: ${response.statusText}`);
      }

      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        setResults(data);
        setUserNotFound(false);
      } else {
        setResults([]);
        setUserNotFound(true);
      }
    } catch (error) {
      console.error("Fetch Error:", error.message);
      setResults({ error: error.message });
    } finally {
      if (!signal.aborted) {
        setIsFetching(false);
      }
    }
  };

  return (
    <div className="App">
      <h1>3205.team</h1>
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={handleEmailChange}
          required
        />

        <label>Number:</label>
        <InputMask
          mask="99-99-99"
          value={number}
          onChange={handleNumberChange}
          maskChar="_"
        />

        <button type="submit">Submit</button>
      </form>
      {isFetching ? (
        <div>Загрузка...</div>
      ) : (
        <div>
          {(results.length || userNotFound) && (
            <div className="result-container">
              {userNotFound ? (
                <p>User not found.</p>
              ) : (
                <>
                  <h2>Users:</h2>
                  {results.map((item) => (
                    <ul key={item.number} className="result-list">
                      <li>Email: {item.email}</li>
                      <li>Number: {item.number}</li>
                    </ul>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
