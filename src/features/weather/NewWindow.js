import './NewWindow.css'
import './WindowSection.css'
import { useState } from 'react';
import { AiOutlinePlusCircle } from 'react-icons/ai'

export default function NewWindow() {
    const [toggle, setToggle] = useState(false);

    return (
        <button className="window-section-wrapper" onClick={() => setToggle(!toggle)}>
            {toggle ? (
                <div className='toggled-window-section-wrapper'>
                    <div className='toggled-window-header'>
                    </div>
                </div>
            ):(
                <div className="inner-window-section-wrapper">
                    <div className="plus-sign-icon">
                        <AiOutlinePlusCircle size={43} />
                    </div>

                    <div className="window-section-header">
                        <h1 className="window-section-header-text">Add a new window...</h1>
                    </div>
                </div>
            )}
        </button>
    );
}