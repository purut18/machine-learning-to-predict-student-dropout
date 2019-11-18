import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Header from '../../components/Header/Header';
import Main from '../../components/Main/Main';
import Predict from '../../components/Predict/Predict';


class Dashboard extends Component {

    render() {
        return(
            <div className="dashboardDiv">
                <Header />
                <Switch>
                    <Route path='/' exact>
                        <Main />
                    </Route>
                    <Route path='/predict' exact>
                        <Predict />
                    </Route>
                </Switch>
            </div>
        );
    }
}

export default Dashboard;