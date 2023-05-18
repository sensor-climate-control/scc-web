import './NewWindow.css'
import './WindowSection.css'
import { useState } from 'react';
import { AiOutlinePlusCircle } from 'react-icons/ai'
import { RxCross2 } from 'react-icons/rx'
import { NavLink } from 'react-router-dom';

export default function NewWindow() {
    const [toggle, setToggle] = useState(false);

    return (
        <div className="window-section-wrapper">
            {toggle ? (
                <div className='toggled-window-section-wrapper'>
                    <div className='toggled-window-header'>
                        <div className='toggled-window-header-bar'>
                            <p className='toggled-window-header-text'>Add Sensor</p>
                            <div className='header-close-icon-wrapper'>
                                <RxCross2 className='header-close-icon' size={30} onClick={() => setToggle(false)}/>
                            </div>
                        </div>

                        <hr className='toggled-window-header-line' />

                        {/* <form onSubmit={() => {
                            // TODO: Send data to backend
                            setToggle(false);
                        }}>
                            <div className='toggled-window-input-wrapper'>
                                <p className='toggled-window-input-text'>Window Name</p>
                                <input className='toggled-window-header-input' type='text' placeholder='Living Room' />
                            </div>
                            <div className='toggled-window-input-wrapper'>
                                <p className='toggled-window-input-text'>Select Sensor</p>
                                <select className='toggled-window-header-input'>
                                    <option value='Sensor 1'>Sensor 1</option>
                                    <option value='Sensor 2'>Sensor 2</option>
                                    <option value='Sensor 3'>Sensor 3</option>
                                </select>
                            </div>

                            <button className='toggled-window-header-button' type='submit'>Create</button>
                        </form> */}
                        <h4>To add a sensor, follow the instructions on <NavLink to="https://github.com/sensor-climate-control/scc-sensor/wiki" target="_blank" rel="noopener noreferrer">our Wiki</NavLink></h4>
                    </div>
                </div>
            ):(
                <div className="inner-window-section-wrapper" onClick={() => setToggle(true)}>
                    <div className="plus-sign-icon">
                        <AiOutlinePlusCircle size={43} />
                    </div>

                    <div className="window-section-header">
                        <h1 className="window-section-header-text">Add a new sensor</h1>
                    </div>
                </div>
            )}
        </div>
    );
}