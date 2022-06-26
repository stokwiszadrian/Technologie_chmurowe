
import axios from 'axios'
import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom';

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
  }, [port])

  return (
    <div className='Albumlist'>
      <span>Wszystkie albumy</span>
            <ul>
          { albums ? albums.map(album => {
            
            return (
                <li key={album._id}>
                    <Link to={`/home/entries/${album._id}`} state={album}>
                        <div>
                        {album.author} - <b>{album.title}</b>
                        </div>
                        <div className='albumyear'>
                          {album.year}
                        </div>
                    </Link>
                </li>
            )
          }) : <></>}
          </ul>
    </div>
  );
}

export default AlbumList;
