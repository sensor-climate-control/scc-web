import logo from './logo.svg';
import './App.css';
import Header from './features/application/Header'

function App() {
  return (
    <div className="App">
      <Header />
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Sensor-Based Climate Control Frontend
        </p>
        <a
          className="App-link"
          href="https://github.com/sensor-climate-control"
          target="_blank"
          rel="noopener noreferrer"
        >
          Github
        </a>
      </header>
    </div>
  );
}

export default App;
