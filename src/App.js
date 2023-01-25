import './App.css';
import { Stack } from 'react-bootstrap';
import Header from './features/application/Header'
import CurrentWeather from './features/weather/CurrentWeather';
import CurrentAuth from './features/auth';
import Login from './features/Login'
import { useGetAuthQuery } from './reduxApi';
import Logout from './features/Logout';

const baseurl = process.env.REACT_APP_BASEURL || "http://localhost:3001"

function App() {
  const { error, isLoading } = useGetAuthQuery();

  return (
    <div className="App">
      <Header />
      <header className="App-header">
        <Stack direction="vertical" gap={3}>
          <br />
            {(isLoading || error) ? (
              <Stack direction="horizontal" gap={3}>
                <br />
                <Login />
              </Stack>
            ) : (
              <Stack direction="horizontal" gap={3}>
                <br />
                <CurrentWeather />
                <CurrentAuth />
                <Logout />
              </Stack>
            )}
        </Stack>
      </header>
    </div>
  );
}

export const endpoint = `${baseurl}/api/`;
export default App;
