import './App.css';
import { Stack } from 'react-bootstrap';
import Header from './features/application/Header'
import CurrentWeather from './features/weather/CurrentWeather';

const baseurl = process.env.REACT_APP_BASEURL || "http://localhost:3001"

function App() {
  return (
    <div className="App">
      <Header />
      <header className="App-header">
        <Stack direction="vertical" gap={3}>
          <br />
          <Stack direction="horizontal" gap={3}>
            <br />
            <CurrentWeather />
          </Stack>
        </Stack>
      </header>
    </div>
  );
}

export const endpoint = `${baseurl}/api/`;
export default App;
