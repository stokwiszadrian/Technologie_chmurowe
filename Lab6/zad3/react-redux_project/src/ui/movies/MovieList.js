import { useEffect, useState, useCallback } from "react"
import { connect } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import { getMoviesList } from "../../ducks/movies/operations"
import { selectMovieError, selectMovieGenres, selectMovies, selectMoviesLoaded, selectMoviesLoading } from "../../ducks/movies/selectors"
import { Formik, Field, useFormik, FormikProvider } from 'formik'
import ErrorModal from "../modals/ErrorModal"
import { Button, IconButton, Select, Snackbar, TextField, MenuItem, InputLabel, FormControl, FormLabel, FormGroup, Typography, Grid, Box, ImageListItem, ImageListItemBar, useTheme, useMediaQuery } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close'
import DatePicker from '@mui/lab/DatePicker'
import LocalizationProvider from "@mui/lab/LocalizationProvider"
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';


const MovieList = ({movies, loaded, loading, error, genres, getMoviesList}, props) => {
    const navigate = useNavigate()
    const location = useLocation()
    const [openSnack, setOpenSnack] = useState(false)
    const [entries, setEntries] = useState(4)
    const [listPaginated, setListPaginated] = useState({})
    const [page, setPage] = useState(1)
    const [filterState, setFilterState] = useState({
        title: '',
        sorting: 'az',
        genre: [],
        yearfrom: null,
        yearto: null
    })

    const theme = useTheme()
    const imgXl = useMediaQuery(theme.breakpoints.up('xl'))
    const imgLarge = useMediaQuery(theme.breakpoints.up('lg'))
    const imgMedium = useMediaQuery(theme.breakpoints.up('md'))
    const imgSmall = useMediaQuery(theme.breakpoints.up('sm'))

    const MovieImg = ({movie}) => {
        let styles = {
            width: '100%',
            height: '550px'
        }

        if (imgXl) {
            styles.height = '425px'
        }
        else if (imgLarge) {
            styles.height = '325px'
        }
        else if (imgMedium) {
            styles.height = '300px'
        }
        else if (imgSmall) {
            styles.height = '475px'

        }
        return (
            (
                <img
                    src={movie.image_url ? movie.image_url : "./default_camera.jpg"}
                    alt={movie.title}
                    style={styles}
                    loading="lazy"
                    onClick={() => navigate(`/movies/${movie.id}`)}
                />
            )
        )
    }


    // funkcja zwracająca przefiltrowane i posortowane elementy

    const filtering = useCallback((list, values) => {
        let movielist = list
        switch (values.sorting) {
            case 'az':
                movielist.sort((a, b) => (a.title.toLowerCase() > b.title.toLowerCase()) ? 1 : -1)
                break;

            case 'za':
                movielist.sort((a, b) => (a.title.toLowerCase() > b.title.toLowerCase()) ? -1 : 1)
                break;

            case 'oldest':
                movielist.sort((a, b) => (a.release_date > b.release_date) ? 1 : -1)
                break;

            case 'youngest':
                movielist.sort((a, b) => (a.release_date > b.release_date) ? -1 : 1)
                break;
            
            default:
                movielist.sort((a, b) => (a.title.toLowerCase() > b.title.toLowerCase()) ? 1 : -1)
        }

        if (values.name !== '') {
            movielist = movielist
                .filter((movie) => {
                return movie.title.toLowerCase().includes(values.title.toLowerCase())
                })
        }

        if (values.genre.length !== 0) {
            movielist = movielist.filter(
                (movie) => 
                    values
                    .genre
                    .some(n => movie.genre.includes(n))
                    )
        }

        if (values.yearfrom !== null) {
            movielist = movielist.filter(
                (movie) => 
                    movie.release_date >= new Date(values.yearfrom).toISOString()
            )
        }

        
        if (values.yearto !== null) {
            movielist = movielist.filter(
                (movie) => 
                    movie.release_date <= new Date(values.yearto).toISOString()
            )
        }
        return [...movielist]
    }, [])

    // Funkcja dzieląca obiekty na poszczególne strony

    const listPaginator = useCallback((list, filter) => {
        setListPaginated(filtering(list, filter).reduce((acc, cur, index) => {
            const pageIndex = Math.floor(index/entries)
            if(!acc[pageIndex]) {
                acc[pageIndex] = []
            }
            acc[pageIndex].push(cur)
            return acc
        }, {}))
    }, [entries, filtering])

    // Ładowanie danych, gdy nie są w storze; jeśli dane są załadowane, są one wstępnie "paginowane"

    useEffect(() => {
        if (!loaded && !loading) {
            getMoviesList()
        }
        if (loaded) {
            listPaginator(movies, filterState)
        }
    }, [loaded, loading, getMoviesList, movies, filterState, listPaginator])

    // Gdy przy zmianie ilości elementów na stronie, obecny numer jest większy niż ostatni numer w nowym podziale,
    // ten efekt ustawi stronę na ostatnią w nowym podziale

    useEffect(() => {
        if (page > Object.keys(listPaginated).length && Object.keys(listPaginated).length > 0) {
            setPage(Object.keys(listPaginated).length)
        }
    }, [page, listPaginated])

    const pageSetter = (n) => {
        if (n > 0 && n <= Object.keys(listPaginated).length){
            setPage(n)
        }
    }

    useEffect(() => {
        if (imgXl) {
            setEntries(6)
        }
        else if (imgLarge) {
            setEntries(5)
        }
        else if (imgMedium) {
            setEntries(4)
        }
        else if (imgSmall) {
            setEntries(6)
        }
        else {
            setEntries(6)
        }
    }, [imgXl, imgLarge, imgMedium, imgSmall])

    const handleSnackClose = (event, reason) => {
        if (reason === 'clickaway') {
            return
          }
          setOpenSnack(false)
          navigate("/movies", {
              state: null,
              replace: true
          })
    }

    const snackHandling = (open, message) => {
        if (!openSnack) {
            setOpenSnack(open)
        }
        return (
            <Snackbar
                open={openSnack}
                autoHideDuration={5000}
                onClose={handleSnackClose}
                message={message}
                action={(
                    <IconButton
                        size="small"
                        color="inherit"
                        onClick={handleSnackClose}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                    )}
            />)
        }

    const formik = useFormik({
            initialValues: {
                title: '',
                sorting: 'az',
                genre: [],
                yearfrom: null,
                yearto: null
            },
            onSubmit: (values) => setFilterState(values),
            validateOnChange: false,
            validateOnBlur: false
        })

    return (

        <div>
            <ErrorModal error={error} />
            {location.state ? snackHandling(location.state.open, location.state.message) : null}
            <Formik
                initialValues={
                    {
                        title: '',
                        sorting: 'az',
                        genre: [],
                        yearfrom: null,
                        yearto: null
                    }
                }
                onSubmit={
                    (values) => setFilterState(values)
                    }
                    validateOnChange={false}
                    validateOnBlur={false}>

<Box
                sx={{
                    padding: 2,
                    border: 2,
                    borderColor: "#770091"
                }}
                >
            <FormikProvider value={formik}>

                <form onSubmit={formik.handleSubmit}>
                    <Grid container direction="row" spacing={2} alignItems="center">
                        <Grid item xs={12} sm={6} md={6} lg={4} xl={2}>
                            <TextField
                                label="Imię"
                                name="title"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                size="small"
                                fullWidth
                            />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                        <FormControl variant="outlined" fullWidth>
                            <InputLabel id="sorting-label">Sortowanie</InputLabel>
                            <Select
                                labelId="sorting-label"
                                id="sorting"
                                name="sorting"
                                value={formik.values.sorting}
                                onChange={formik.handleChange}
                                label="Sortowanie"
                                size="small"
                            >
                                <MenuItem value="az">Sortowanie A-Z</MenuItem>
                                <MenuItem value="za">Sortowanie Z-A</MenuItem>
                                <MenuItem value="oldest">Data wydania, rosnąco</MenuItem>
                                <MenuItem value="youngest">Data wydania, malejąco</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6} md={3} lg={2}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        label="Od"
                        name="yearfrom"
                        value={formik.values.yearfrom}
                        inputFormat="yyyy/MM/dd"
                        onChange={value => formik.setFieldValue("yearfrom", value)}
                        renderInput={(params) => <TextField {...params} size="small" fullWidth/>}
                    />
                    </LocalizationProvider>
                    </Grid>
                    <Grid item xs={6} md={3} lg={2}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        label="Do"
                        name="yearto"
                        value={formik.values.yearto}
                        inputFormat="yyyy/MM/dd"
                        onChange={value => formik.setFieldValue("yearto", value)}
                        renderInput={(params) => <TextField {...params} size="small" fullWidth/>}
                    />
                    </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl component="fieldset" style={{ display: "flex", flexDirection: "column"}}>
                            <FormLabel component="legend">Gatunki</FormLabel>
                            <FormGroup>
                                <Grid container spacing={0} alignItems="flex-start" direction="row">
                                    {genres.map(n => (
                                    <Grid item xs={6} sm={4} md={3} lg={2} xl={1} sx={{ width: '100%'}}>
                                        <Field
                                            type="checkbox"
                                            name="genre"
                                            value={n}
                                            onChange={formik.handleChange}
                                            aria-labelledby={`label-${n}`}
                                        />
                                        <label id={`label-${n}`}>{n}</label>
                                    </Grid>
                                    ))}
                                </Grid>
                            </FormGroup>
                        </FormControl>
                    </Grid>
                    <Grid item xs={5} sm={2} lg={1.5}>
                        <Button type="submit" variant="contained" color="primary" sx={{ width: '100%'}}>Filtruj</Button>
                    </Grid>
                    </Grid>
                </form>
            </FormikProvider>
            </Box>
            </Formik>

            <Grid container spacing={1} marginTop={1}>
                {listPaginated[page - 1] ? listPaginated[page - 1].map(movie => {
                    return (
                        <Grid item xs={12} sm={6} md={3} lg={2.4} xl={2} >
                        <ImageListItem
                            key={movie.image_url}
                            sx={{
                                "&:hover": {
                                boxShadow: 10,
                                cursor: 'pointer'
                                },
                                width: '100%',
                            }}
                            >
                            <MovieImg movie={movie} />
                            <ImageListItemBar
                                title={movie.title}
                                subtitle={movie.genre}
                                
                            />
                            </ImageListItem>
                        </Grid>
                    )
                }
                ) : <></>}
            </Grid>
            <Grid container direction='row' justifyContent='space-between' alignItems='center'>
                <Grid item xs={6}>
                    <Grid container>
                        <Grid item xs={12}>
                        <Typography variant='subtitle1'>
                        Strona {page} z {Math.ceil(Object.keys(listPaginated).length*4/entries) < 1 ? 1 : Math.ceil(Object.keys(listPaginated).length*4/entries)}
                        </Typography>
                        </Grid>
                        <Grid item xs={12}>
                        <IconButton onClick={() => pageSetter(page-1)}>
                            <ArrowCircleLeftIcon fontSize='large' sx={{ color: 'black' }} />
                        </IconButton>
                        <IconButton onClick={() => pageSetter(page+1)}>
                            <ArrowCircleRightIcon fontSize='large' sx={{ color: 'black' }} />
                        </IconButton>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={5} sm={4.5} md={3} xl={2.5}>
                    <Grid container justifyContent="flex-end" alignItems='flex-end'>
                        <Grid item xs={12} sm={6}>
                        <Button disabled={entries <= 6} onClick={() => setEntries(entries/2)} sx={{ color: '#600075' }}>Mniej wyników</Button>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                        <Button disabled={entries > 6} onClick={() => setEntries(entries*2)} sx={{ color: '#600075' }}>Więcej wyników</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    )
}

const mapStateToProps = (state) => ({
    movies: selectMovies(state),
    loaded: selectMoviesLoaded(state),
    loading: selectMoviesLoading(state),
    error: selectMovieError(state),
    genres: selectMovieGenres(state)
})

const mapDispatchToProps = {
    getMoviesList
}

export default connect(mapStateToProps, mapDispatchToProps)(MovieList)