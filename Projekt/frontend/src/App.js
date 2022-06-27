import './styles/App.css';
import logo from "./result.svg"
import { Link, Outlet } from 'react-router-dom'
import { useState } from 'react'
import Recent from './Recent';
function App() {

  const [stateSwitch, setStateSwitch] = useState(false)

  const handleSwitch = () => {
    setStateSwitch(!stateSwitch)
  }

  return (
    <div className="App">
      <nav>
      <img src={logo} alt="Vinyl" />
      <span>Kącik muzyczny</span>
      <img src={logo} alt="Vinyl" />
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
      <div className='main'>
        <div className='recent'>
          <Recent stateSwitch={stateSwitch}/>
        </div>
        <div className='outlet'>
          <Outlet context={handleSwitch}/>
        </div>
      </div>
    </div>
  );
}

export default App;
