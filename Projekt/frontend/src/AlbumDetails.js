import './App.css';
import axios from 'axios'
import { useState, useEffect } from 'react'
import { useLocation, useParams } from 'react-router';

const AlbumDetails  = () => {
  const port = process.env.REACT_APP_API_PORT | 5000

  const [state, setState] = useState({})

  const locstate = useLocation().state
  const { id } = useParams()
  useEffect(() => {
    if ( locstate === null ) {
      axios.get(`http://localhost:${port}/album/${id}`)
        .then(res => setState(res.data.album))
        .catch(rej => console.log(rej))
    }
    else {
      setState(locstate)
    }
  }, [id, locstate, port])

  return (
    <div>
        <h2>Details</h2>
        <h3>{state.author} - {state.title}</h3>
        <ul>

        {state.songs ? state.songs.map(song => {
            return (
                <li key={song}>
                    {song}
                </li>
            )
        }): <></>}
        </ul>
    </div>
  );
}

export default AlbumDetails;
