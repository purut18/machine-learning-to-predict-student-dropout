import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router} from "react-router-dom";


import * as actions from './redux/actions/authActions';

import './App.css';

import Login from './containers/Auth/Login';
import Dashboard from './containers/Dashboard/Dashboard';
import Predict from './components/Predict/Predict';

class App extends React.Component {

  componentDidMount() {
    this.props.onTryAuthSignup();
  }

  render() {
    let routesAre = (
      <Login />
    );

    if(this.props.isAuth) {
      routesAre = (
        <Dashboard />
      );
    }

    return (
        <div className="App">
          <Router>
            {routesAre}
          </Router>
        </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuth: state.authReducer.token !== null
  };
};

const mapDispatchToProps = dispatch => {
 return {
   onTryAuthSignup: () => dispatch(actions.authCheckState())
 };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);