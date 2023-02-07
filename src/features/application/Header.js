import './Header.css';
import { useState } from 'react';
import { RxHamburgerMenu } from 'react-icons/rx';

export default function Header(props) {
    const [showDropdown, setShowDropdown] = useState(false);

    return (
        <div className="outer-header-wrapper">
            <div className="inner-header-wrapper">
                <h2 className="header-brand-name header-text">Liquidity</h2>
                <h1 className="header-page-name header-text">{props.page_name}</h1>

                <button className='header-user-dropdown-button' onClick={() => setShowDropdown(!showDropdown)}>
                    <div className="outer-header-user-dropdown">
                        <RxHamburgerMenu className='header-hamburger-icon' size={43} />
                        <div className="inner-header-user-dropdown">
                            <p className='header-dropdown-first-name header-text'>Welcome back, {props.user_first_name}!</p>
                        </div>

                        <div className="inner-header-dropdown-items" style={showDropdown ? {display: "block"} : {display: "none"}}>
                            <p className='header-dropdown-option-text'>Account Summary</p>
                            <p className='header-dropdown-option-text'>Dropdown Item 3</p>
                            <p className='header-dropdown-option-text'>Dropdown Item 4</p>
                        </div>
                    </div>
                </button>
            </div>
        </div>
    );
}