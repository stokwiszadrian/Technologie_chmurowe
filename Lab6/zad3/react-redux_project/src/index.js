import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import store from './ducks/store'
import { Provider } from 'react-redux';
import { Routes, Route, BrowserRouter} from 'react-router-dom';
import PersonList from './ui/persons/PersonList'
import MovieList from './ui/movies/MovieList';
import PersonDetails from './ui/persons/PersonDetails';
import MovieDetails from './ui/movies/MovieDetails';
import MovieForm from './ui/movies/MovieForm';
import PersonForm from './ui/persons/PersonForm';
import Stats from './ui/Stats';

ReactDOM.render(
  <Provider store={store}>
  <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} >
          <Route path="movies" element={<MovieList />} />
          <Route path="movies/addmovie" element={<MovieForm />} />
          <Route path="movies/:id" element={<MovieDetails />} >
              <Route path="editmovie" element={<MovieForm />} />
          </Route>
          <Route path="persons" element={<PersonList />} />
          <Route path="persons/addperson" element={<PersonForm />} />
          <Route path="persons/:id" element={<PersonDetails />} >
            <Route path="editperson" element={<PersonForm />} />
          </Route>
          <Route path="stats" element={<Stats />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
