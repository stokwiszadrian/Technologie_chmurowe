import { useCallback, useEffect, useState } from "react"
import { connect } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import { getPersonsList } from "../../ducks/persons/operations"
import { useFormik, FormikProvider } from 'formik'
import { selectPersons, selectPersonsError, selectPersonsLoaded, selectPersonsLoading } from "../../ducks/persons/selectors"
import ErrorModal from "../modals/ErrorModal"
import { Button, IconButton, Select, Snackbar, TextField, MenuItem, InputLabel, FormControl, Grid, ListItemButton, ListItemAvatar, ListItemText, Autocomplete, Avatar, ListItemIcon, Box, Typography } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close'
import DatePicker from '@mui/lab/DatePicker'
import LocalizationProvider from "@mui/lab/LocalizationProvider"
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';

const PersonList = ({persons, loaded, loading, error, getPersonsList}, props) => {

    const countries = require('../../countryData/en/countries.json')
    const navigate = useNavigate()
    const location = useLocation()
    const [openSnack, setOpenSnack] = useState(false)
    const [page, setPage] = useState(1)
    const [entries, setEntries] = useState(4)
    const [listPaginated, setListPaginated] = useState({})
    const [filterState, setFilterState] = useState({
        name: '',
        sorting: 'az',
        nationality: '',
        yearfrom: null,
        yearto: null
    })


    const filtering = useCallback((list, values) => {
        let personlist = list
        switch (values.sorting) {
            case 'az':
                personlist.sort((a, b) => (a.last_name > b.last_name) ? 1 : -1)
                break;

            case 'za':
                personlist.sort((a, b) => (a.last_name > b.last_name) ? -1 : 1)
                break;

            case 'oldest':
                personlist.sort((a, b) => (a.birth_date > b.birth_date) ? 1 : -1)
                break;

            case 'youngest':
                personlist.sort((a, b) => (a.birth_date > b.birth_date) ? -1 : 1)
                break;
            
            default:
                personlist.sort((a, b) => (a.last_name > b.last_name) ? 1 : -1)
        }
        if (values.name !== '') {
            personlist = personlist
                .filter((person) => 
                `${person.first_name.toLowerCase()} ${person.last_name.toLowerCase()}`.includes(values.name.toLowerCase())
                )
        }
        if (values.nationality !== '') {
            personlist = personlist.filter((person) => person.nationality === values.nationality)
            }
        if (values.yearfrom !== null) {
            personlist = personlist.filter(
                (person) => 
                    person.birth_date >= new Date(values.yearfrom).toISOString()
                
            )
        }
        if (values.yearto !== null) {
            personlist = personlist.filter(
                (person) => {
                    return person.birth_date <= new Date(values.yearto).toISOString()
                }
            )
        }
        return [...personlist]
    }, [])

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

    const handleSnackClose = (event, reason) => {
        if (reason === 'clickaway') {
            return
          }
          setOpenSnack(false)
          navigate("/persons", {
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


    useEffect(() => {
        if (!loaded && !loading) {
            getPersonsList()
        }
        if (loaded) {
                listPaginator(persons, filterState)
        }
    }, [persons, loaded, loading, getPersonsList, filtering, listPaginator, filterState])

    

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

    const formik = useFormik({
        initialValues: {
            name: '',
            sorting: 'az',
            nationality: '',
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
                                name="name"
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
                                <MenuItem value="oldest">Data urodzenia, rosnąco</MenuItem>
                                <MenuItem value="youngest">Data urodzenia, malejąco</MenuItem>
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
                    <Grid item xs={7} sm={6} md={4} lg={3} xl={2}>
                    <Autocomplete
                        fullWidth
                        options={countries}
                        autoHighlight
                        name="nationality"
                        onChange={value => formik.setFieldValue("nationality", value.target.textContent)}
                        getOptionLabel={(option) => option.name}
                        renderOption={(props, option) => (
                            <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                            <img
                                loading="lazy"
                                width="20"
                                src={`https://flagcdn.com/w20/${option.alpha2.toLowerCase()}.png`}
                                srcSet={`https://flagcdn.com/w40/${option.alpha2.toLowerCase()}.png 2x`}
                                alt=""
                            />
                            {option.name}
                            </Box>
                        )}
                        renderInput={(params) => (
                            <TextField
                            {...params}
                            label="Wybierz kraj"
                            name="nationality"
                            size="small"
                            
                            inputProps={{
                                ...params.inputProps,
                                autoComplete: 'new-password'
                            }}
                            />
                        )}
                    />


                    </Grid>
                    <Grid item xs={5} sm={2} lg={1.5}>
                        <Button type="submit" variant="contained" color="primary" sx={{ width: '100%'}}>Filtruj</Button>
                    </Grid>
                    </Grid>
                </form>
            </FormikProvider>
            </Box>
            <Grid container>
                {listPaginated[page -1] ? listPaginated[page-1].map(person => {
                        return (
                            <Grid item xs={12} md={6} xl={3}>
                            <ListItemButton
                                onClick={() => navigate(`/persons/${person.id}`)}
                                sx={{
                                    border: 1,
                                    minHeight: 150,
                                    margin: 1
                                }}>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <ListItemIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={`${person.first_name} ${person.last_name}`}
                                        secondary={`Narodowość: ${person.nationality}`}
                                    />
                            </ListItemButton>
                            </Grid>
                        )
                }) : <></>}
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
                        <Button disabled={entries === 4} onClick={() => setEntries(4)} sx={{ color: '#600075' }}>Mniej wyników</Button>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                        <Button disabled={entries === 8} onClick={() => setEntries(8)} sx={{ color: '#600075' }}>Więcej wyników</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    )
}

const mapStateToProps = (state) => ({
    persons: selectPersons(state),
    loaded: selectPersonsLoaded(state),
    loading: selectPersonsLoading(state),
    error: selectPersonsError(state)
})

const mapDispatchToProps = {
    getPersonsList
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonList)