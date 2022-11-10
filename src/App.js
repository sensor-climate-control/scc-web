import './App.css';
import { Stack } from 'react-bootstrap';
import Header from './features/application/Header'
import CurrentAqi from './features/weather/CurrentAqi';
import CurrentWeather from './features/weather/CurrentWeather';

function App() {
  return (
    <div className="App">
      <Header />
      <header className="App-header">
        <Stack direction="vertical" gap={3}>
          <br />
          <Stack direction="horizontal" gap={3}>
            <br />
            <CurrentAqi />
            <CurrentWeather />
          </Stack>
        </Stack>
      </header>
    </div>
  );
}

export default App;
