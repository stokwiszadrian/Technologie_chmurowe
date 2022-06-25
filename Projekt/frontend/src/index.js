import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Home from './Home';
import Form from './Form';
import AlbumList from './AlbumList';
import AlbumDetails from './AlbumDetails';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/home" element={<App />} >
          <Route index element={<Home />} />
          <Route path="edit" element={<Form />} />
          <Route path="add" element={<Form />} />
          <Route path="entries" element={<AlbumList />} />
          <Route path="entries/:id" element={<AlbumDetails />} />
        </Route>
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
