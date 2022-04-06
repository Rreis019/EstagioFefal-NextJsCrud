import React, { Component } from 'react';
import Axios from 'axios';

export default class Header extends Component {
    render() 
    {
        const logout = () =>  
        {
            localStorage.removeItem('sessionUser');
            window.location.href = "/";
        };

        return (
            <div className='header'>
                <div className='header-left'>
                    <h1>{this.props.title}</h1>
                </div>

                <div className='header-right'>

                    {this.props.items && this.props.items.map(item => (
                          <a href={item.href}>{item.name}</a>
                    ))}
                    <button onClick={logout}>Logout</button>
                </div>
            </div>
        )
    }
}