import './App.css';
import Home from './views/Home';
import Login from './features/login/Login';
import {
  Routes,
  Route,
} from 'react-router-dom';

const baseurl = process.env.REACT_APP_BASEURL || "http://localhost:3001"

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      
    </div>
  );
}

export const endpoint = `${baseurl}/api/`;
export default App;
