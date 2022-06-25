import './App.css';
import axios from 'axios'
import { useState, useEffect, useRef } from 'react'
import Recent from './Recent';
import { Link, Navigate, useNavigate } from 'react-router-dom';

const AlbumList  = () => {
  const port = process.env.REACT_APP_API_PORT | 5000

  const [albums, setAlbums] = useState([])
  const albumref = useRef([])
  const navigate = useNavigate();
  albumref.current = albums
  useEffect(() => {

    const fetchdata = async () => {
      
      if ( albumref.current.length === 0 ) {
        const result = await axios.get(`http://localhost:${port}/albums`)
        setAlbums(result.data.albums)
      }
    }

    fetchdata()
    // console.log(albums)
    // if ( albums !== []) {
    //   axios.get(`http://localhost:${port}/albums`)
    //   .then(res => {
    //     setAlbums(res.data.albums)
    //   }, err => {
    //     console.log(err)
    //     setAlbums({})
    //   }
    // )
    // }
  
  }, [port])

  return (
    <div>
        <h2>AlbumList!</h2>
        <div>
            <ul>
          { albums ? albums.map(album => {
            
            return (
                <li key={album._id}>
                    <Link to={`/home/entries/${album._id}`} state={album}>
                        {album.author} - {album.title}
                    </Link>
                    <button onClick={() => navigate("../edit", { replace: false, state: {album}})} >
                      Edytuj
                    </button>
                </li>
            )
          }) : <></>}
          </ul>
        </div>
        <div>
        </div>
    </div>
  );
}

export default AlbumList;
