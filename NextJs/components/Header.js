import React, { Component,useState } from 'react';
import Axios from 'axios';

export default function Header(props) {

    const [isOpen, setIsOpen] = useState(false);
    const toggleMenu = () => setIsOpen(!isOpen);

    const logout = () =>  
    {
        localStorage.removeItem('sessionUser');
        window.location.href = "/";
    };


    return (
        <div>
            <div className='header'>
                <div className='header-left'>
                    <h1>{props.title}</h1>
                </div>

                <div className='header-right'>

                    {props.items && props.items.map(item => (
                        <a className='header-right-hide' href={item.href}>{item.name}</a>
                    ))}
                    <button className='header-right-hide' onClick={logout}>Logout</button>

                    <button className={`btn_hamburger ${isOpen ? 'btn_hamburger-active' : ''}`} onClick={toggleMenu}>
                        <div className='bar1'></div>
                        <div className='bar2'></div>
                        <div className='bar3'></div>
                    </button>
                </div>
            </div>
            
            <div className={`navbar_hamburger  ${isOpen ? 'h-full pointer-events-auto' : 'h-0 pointer-events-none'}`}>
                {props.items && props.items.map(item => (
                        <a href={item.href}>{item.name}</a>
                ))}
                <button onClick={logout}>Logout</button>
            </div>

        </div>
    )

}