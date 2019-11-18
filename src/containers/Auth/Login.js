import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../redux/actions/authActions';

import './Login.css';

class Login extends Component {

    state = {
        email: '',
        password: '',
        passBlur: null,
        emailBlur: null
    }

    handleEmailChange = (event) => {
        this.setState({
            email: event.target.value
        })
    }

    handlePassChange = (event) => {
        this.setState({
            password: event.target.value
        })
    }

    handlePassBlur = event => {
        this.setState({
            passBlur: true
        })
    }

    handleEmailBlur = event => {
        this.setState({
            emailBlur: true
        })
    }

    login = event => {
        event.preventDefault();
        this.props.onAuth(this.state.email, this.state.password);
    }
    
    render() {
        return(
            <div className="loginDiv">
                <h3>Welcome Back</h3>
                <p>Login into your account to continue</p>
                <form>
                    <span className="text-info">{this.props.loading ? "Loading..." : null}</span>                    
                    <span className="text-danger">{this.props.error}</span>       
                    <br />             
                    <div className="form-group">
                        <label>Email address:</label>
                        <input type="email" className={this.state.email === "" && this.state.emailBlur ? "is-invalid form-control" : this.state.emailBlur ? "is-valid form-control" : "form-control"} id="email" placeholder="yourname@example.com" value={this.state.email} onChange={this.handleEmailChange} onBlur={this.handleEmailBlur} required />
                    </div>
                    <div className="form-group">
                        <label>Password:</label>
                        <input type="password" className={this.state.password === "" && this.state.passBlur ? "is-invalid form-control" : this.state.passBlur ? "is-valid form-control" : "form-control"} id="pwd" placeholder="enter your password" value={this.state.password} onChange={this.handlePassChange} onBlur={this.handlePassBlur} required />
                    </div>
                    <button className="btn btn-primary" onClick={this.login}>Login</button>
                </form>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        loading: state.authReducer.loading,
        error: state.authReducer.error
    };
  };
  
  
  const mapDispatchToProps = dispatch => {
    return {
        onAuth: (role, username, password) => dispatch(actions.auth(role, username, password))
    };
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(Login);