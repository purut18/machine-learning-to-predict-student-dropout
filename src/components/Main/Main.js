import React, { Component } from 'react'
import { NavLink } from 'react-router-dom';

import './Main.css';

class Main extends Component {
    render() {
        return(
            <div className="mainDiv">
                <h2>Welcome {JSON.parse(localStorage.getItem('data')).name}</h2>
                <h4>{JSON.parse(localStorage.getItem('data')).schoolName}</h4>
                <div className="optionsBox">
                    <NavLink to="/predict">
                        <div className="singleOption animated fadeIn">
                            <p>
                                <i className="fa fa-line-chart"></i>
                            </p>
                            <h5>Predict Dropouts</h5>
                        </div>
                    </NavLink>
                    <div className="singleOption coming-soon animated fadeIn">
                        <p>
                            <i className="fa fa-video-camera"></i>
                        </p>
                        <h5>Predict Depression and Career Counselling Needs</h5>
                    </div>
                </div>
            </div>
        );
    }
}

export default Main;