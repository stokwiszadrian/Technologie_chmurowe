
import axios from 'axios'
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router';

const Recent  = ( { stateSwitch } ) => {
  const navigate = useNavigate()
  const port = process.env.REACT_APP_API_PORT
  const [recentAlbums, setRecentAlbums] = useState([])
  const myState = useRef(false)
  myState.current = stateSwitch
  const recentAlbumRef = useRef([])
  recentAlbumRef.current = recentAlbums
  useEffect(() => {

    const fetchdata = async () => {
        const result = await axios.get(`http://localhost:${port}/recentalbums`)
        setRecentAlbums(result.data.albums)
    }

    fetchdata()
  }, [port, stateSwitch])

  const handleClick = async (title) => {
    const result = await axios.get(`http://localhost:${port}/album/bytitle/${title}`)
    navigate(`/home/entries/${result.data.album._id}`, { replace: true, state: result.data.album })
  }

  return (
    <div className='Recent'>
        <span>Ostatnio dodane</span>
          <ol>
        {recentAlbums.length > 0 ? recentAlbums.map(album => {
          return (
            <li>
              <button onClick={() => handleClick(album.title)}>
              {album.author} - <b>{album.title}</b>
              </button>
            </li>
          )
        }) : (
          <li>
            Brak nowych albumów
          </li>
        )}
        </ol>
    </div>
  );
}

export default Recent;
