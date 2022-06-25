import './App.css';
import axios from 'axios'
import { useState, useEffect } from 'react'

const Recent  = () => {
  const port = process.env.REACT_APP_API_PORT | 5000
  const [recentAlbums, setRecentAlbums] = useState({})
  useEffect(() => {
    axios.get(`http://localhost:${port}/recentalbums`)
      .then(res => {
        console.log(res)
        setRecentAlbums(res.data)
      }, err => {
        console.log(err)
        setRecentAlbums({})
      }
      )
  }, [port])

  return (
    <div>
        <h2>Recent albums</h2>
        <div>
        {JSON.stringify(recentAlbums)}
        </div>
    </div>
  );
}

export default Recent;
