import './App.css';
import axios from 'axios'
import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router';

const Form  = () => {
  const port = process.env.REACT_APP_API_PORT | 5000
  const locstate = useLocation().state
  const path = useLocation().pathname
  const navigate = useNavigate()
  const [songFields, setSongFields] = useState([])
  const [initialValues, setInitialValues] = useState({
    title: "",
    author: "",
    songs: []
  })

  if ( locstate !== null && initialValues.title === "" ) {
    setInitialValues({
      title: locstate.album.title,
      author: locstate.album.author,
      songs: locstate.album.songs
    })
    const newSongFields = locstate.album.songs.map((song, index) => index )
    setSongFields(newSongFields)
  }

  const handleChange = (e) => {
    const field = e.target.name
    const value = e.target.value
    console.log(field.indexOf("song"))
    if ( field.indexOf("song") !== -1) {
        const index = parseInt(field.split("song")[1])
        var newSongs = initialValues.songs
        newSongs[index] = value
        setInitialValues({
            ...initialValues,
            songs: newSongs
        })
        console.log(initialValues)
    }
    else {
        setInitialValues({
            ...initialValues,
            [field]: value
        })
        console.log(initialValues)
    }
  }

  const handleSubmit = async (e) => {

    e.preventDefault()
    console.log(path)
    if ( path.indexOf("add") !== -1) {
      console.log("adding...")
      await axios.post(`http://localhost:${port}/albums/add`, initialValues)
        .then(res => {
            console.log(res)
        }, err => console.log(err))
    navigate("/home/entries", { replace: false })
    }

    else if (path.indexOf("edit") !== -1) {
      console.log("editing...")
      await axios.put(`http://localhost:${port}/albums/edit/${locstate.album._id}`, initialValues)
        .then(res => {
            console.log(res)
        }, err => console.log(err))
    navigate("/home/entries", { replace: false })
    }
  }
  
  const addFields = () => {

    setSongFields([...songFields, songFields.length])

  }

  const deleteField = (index) => {

    var newSongFields = songFields
    newSongFields.splice(index, 1)
    setSongFields(newSongFields)
    var newSongs = initialValues.songs
    newSongs.splice(index, 1)
    setInitialValues({
        ...initialValues,
        songs: newSongs
    })
    console.log(initialValues)

  }

  return (
    <div>
        <h2>Dodaj album</h2>
        <form onSubmit={values => handleSubmit(values)} >
            <label>
                Tytuł
            </label>
            <input type="text" name="title" value={initialValues.title} onChange={e => handleChange(e)}/>
            <label>
                Autor
            </label>
            <input type="text" name="author" value={initialValues.author} onChange={e => handleChange(e)} />
            {songFields.map(songField => {
                return (
                    <>
                    <label>
                        Piosenka {songField}
                    </label>
                    <input type="text" name={`song${songField}`} value={initialValues.songs[songField]} onChange={e => handleChange(e)}/>
                    <button type="button" onClick={() => deleteField(songField)}>Usuń piosenkę</button>
                    </>
                )
            })}
            <button type="button" onClick={() => addFields()}>Dodaj piosenkę</button>
            <button type="submit">Wyślij</button>
        </form>
    </div>
  );
}

export default Form;
