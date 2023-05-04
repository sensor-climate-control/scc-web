import './App.css';
import Home from './views/Home';
import Auth from './features/login/Auth';
import {
  Routes,
  Route,
} from 'react-router-dom';
// import UserInfo from './features/login/UserInfo';
import { useStore } from 'react-redux';
import UserPage from './features/login/UserPage';
import { useEffect } from 'react';
import { tokenReducer } from './features/redux/tokenSlice';
import HomeDetailPage from './features/home/HomeDetailPage';

const baseurl = process.env.REACT_APP_BASEURL || "http://localhost:3001"

function App() {
  const store = useStore()
  useEffect(() => {
    const expires = localStorage.getItem("expires");

    if(Date.now() < expires) {
      store.dispatch(tokenReducer.actions.addToken())
    }
  })

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/home" element={<HomeDetailPage />} />
      </Routes>
      
    </div>
  );
}

export const endpoint = `${baseurl}/api/`;
export default App;
