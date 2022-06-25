import './App.css';
import { Link, Navigate, Outlet } from 'react-router-dom'
import Recent from './Recent';
import Home from './Home';
function App() {
  return (
    <div className="App">
      <nav>
        <ul>
          <li>
            <Link to="/home">Strona domowa</Link>
          </li>
          <li>
            <Link to="entries">Lista albumów</Link>
          </li>
          <li>
            <Link to="add">Dodaj album</Link>
          </li>
        </ul>
      </nav>
      <h1>Kącik muzyczny</h1>
      <div>
          <Recent />
        </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
}

export default App;
