import './Header.css';
import HamburgerIcon from '../icons/hamburger';

export default function Header(props) {
    return (
        <div className="outer-header-wrapper">
            <div className="inner-header-wrapper">
                <h2 className="header-brand-name header-text">Liquidity</h2>
                <h1 className="header-page-name header-text" header-text>{props.page_name}</h1>

                <button className='header-user-dropdown-button' onClick={props.accountCallback}>
                    <div className="outer-header-user-dropdown">
                        <HamburgerIcon class="header-hamburger-icon" />
                        <div className="inner-header-user-dropdown">
                            <p className='header-dropdown-first-name header-text'>Welcome back, {props.user_first_name}!</p>
                        </div>
                    </div>
                </button>
            </div>
        </div>
    );
}