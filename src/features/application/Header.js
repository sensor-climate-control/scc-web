import './Header.css';
import { useState } from 'react';
import { RxHamburgerMenu } from 'react-icons/rx';
import { NavLink } from 'react-router-dom';
import { useStore } from 'react-redux';
import { tokenReducer } from '../redux/tokenSlice';

export default function Header(props) {
  const [showDropdown, setShowDropdown] = useState(false);

  const store = useStore()

  function handleLogout(e) {
    e.preventDefault();

    store.dispatch(tokenReducer.actions.logout());
  }

  return (
    <div className="outer-header-wrapper">
      <div className="inner-header-wrapper">
        <h2 className="header-brand-name header-text"><NavLink to="/">Liquidity</NavLink></h2>
        <h1 className="header-page-name header-text">{props.page_name}</h1>

        <button className='header-user-dropdown-button' onClick={() => setShowDropdown(!showDropdown)}>
            <div className="outer-header-user-dropdown">
              <RxHamburgerMenu className='header-hamburger-icon' size={43} />
              <div className="inner-header-user-dropdown">
                <p className='header-dropdown-first-name header-text'>Hello {props.user_first_name}!</p>
              </div>

              <div className="inner-header-dropdown-items" style={showDropdown ? {display: "block"} : {display: "none"}}>
                <p className='header-dropdown-option-text'><NavLink to="/">Dashboard</NavLink></p>
                <p className='header-dropdown-option-text'><NavLink to="/user">Account</NavLink></p>
                <p className='header-dropdown-option-text'><NavLink to="/home">Home Information</NavLink></p>
                <p className='header-dropdown-option-text' onClick={handleLogout}><NavLink to="/login">Logout</NavLink></p>
              </div>
            </div>
        </button>
      </div>
    </div>
  );
}