import React, { Component } from 'react';
import Axios from 'axios';

export default class Header extends Component {

    
    render() 
    {
        const logout = () =>  
        {
            Axios.get("http://localhost:3001/logout/").then((response) => 
            {
                    window.location.href = "/";
            });
        };



        return (
            <div className='header'>
                <div className='header-left'>
                    <h1>{this.props.title}</h1>
                </div>

                <div className='header-right'>
                    <button onClick={logout}>Logout</button>
                </div>
            </div>
        )
    }

}