import './App.css';
import axios from 'axios'
import { useState, useEffect } from 'react'

const Home  = () => {
  const port = process.env.REACT_APP_API_PORT | 5000
  console.log(port)
  const [apiCall, setApiCall] = useState({})
  useEffect(() => {
    axios.get(`http://localhost:${port}/recentalbums`)
      .then(res => {
        console.log(res)
        setApiCall(res.data)
      }, err => {
        console.log(err)
        setApiCall({})
      }
      )
  }, [port])

  return (
    <div>
        <h2>Test!</h2>
        <div>
          {JSON.stringify(apiCall)}
        </div>
    </div>
  );
}

export default Home;
