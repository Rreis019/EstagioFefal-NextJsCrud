import React, { Component } from 'react';

export default class Sidebar extends Component {
    render() 
    {
        return (
            <div className="sidebar">
                <div className="sidebar-content">
                <h1 id="sideBarCaption">{this.props.title}</h1>
                <h3 id="sideBarDesc">{this.props.p1}<br/>{this.props.p2}<br/>{this.props.p3}</h3>    
    
                <a href={this.props.href} className="btn_lightblue"  >{this.props.btn_name}</a>       
                </div>
            </div>
        )
    }
}