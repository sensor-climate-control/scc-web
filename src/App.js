import './App.css';
import Home from './views/Home';
import Auth from './features/login/Auth';
import {
  Routes,
  Route,
} from 'react-router-dom';
import UserInfo from './features/login/UserInfo';

const baseurl = process.env.REACT_APP_BASEURL || "http://localhost:3001"

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/user" element={<UserInfo />} />
      </Routes>
      
    </div>
  );
}

export const endpoint = `${baseurl}/api/`;
export default App;
