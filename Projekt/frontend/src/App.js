import './App.css';
import { Link, Outlet } from 'react-router-dom'
function App() {
  return (
    <div className="App">
      <nav>
        <ul>
          <li>
            <Link to="/">Strona domowa</Link>
          </li>
          <li>
            <Link to="/entries">Lista albumów</Link>
          </li>
          <li>
            <Link to="/newalbum">Dodaj album</Link>
          </li>
        </ul>
      </nav>
      <h1>Kącik muzyczny</h1>
      <Outlet />
    </div>
  );
}

export default App;
