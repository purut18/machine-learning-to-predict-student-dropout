import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

import * as actions from '../../redux/actions/authActions';
import './Header.css';

class Header extends Component {

    logout = e => {
        e.preventDefault();
        this.props.logout();
    }

    render() {
        return (
            <div className="headerDiv">
                <NavLink to="/">
                    <div className="titleDiv float-left">
                        <i className="fa fa-leaf mr-2" aria-hidden="true"></i>Edulysis
                    </div>
                </NavLink>
                <div className="logoutDiv float-right">
                    <i className="fa fa-sign-out mr-2" aria-hidden="true"></i><span onClick={this.logout}>Logout</span>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        logout: () => dispatch(actions.logout())
    };
};

export default connect(null, mapDispatchToProps)(Header);