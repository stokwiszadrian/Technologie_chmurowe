import './App.css';
import axios from 'axios'
import { useState, useEffect } from 'react'

const Form  = () => {
  const port = process.env.REACT_APP_API_PORT | 5000

  const [initialValues, setInitialValues] = useState({
    title: "",
    author: "",
    songs: []
  })

  const [songFields, setSongFields] = useState([])

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

  const handleSubmit = (e) => {
    console.log(initialValues)
    e.preventDefault()
  }

  const addFields = () => {
    setSongFields([...songFields, songFields.length])
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
