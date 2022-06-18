import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';

function App() {
  
  const[response, setResponse] = useState("");

  useEffect(() => {
    const fetch = async () => {
      const x = await axios.get("localhost:30500")
      return x;
    }
    setResponse(fetch());
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Don't Learn React
        </a>
        <code>{response}</code>
      </header>
    </div>
  );
}

export default App;
