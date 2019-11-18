import * as actionTypes from './authActionTypes';

import axios from 'axios';

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
};

export const authSuccess = (token, userId) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        userId: userId,
        token: token
    };
};

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    };
};

export const authLogout = () => {
    return {
        type: actionTypes.LOGOUT
    };
};

export const auth = (email, password) => {
    return dispatch => {
        dispatch(authStart());
        axios.post('http://127.0.0.1:5000/login', {
            email: email,
            password: password
        }).then(response => {
            if(response.data.status === 403) {
                dispatch(authFail(response.data.message));
            } else {
                localStorage.setItem('token', response.data.access_token);
                localStorage.setItem('data', JSON.stringify(response.data.userData));
                dispatch(authSuccess(response.data.access_token, response.data._id));
            }
        }).catch(err => {
            dispatch(authFail('There was an error on our side logging you in, please try again later.'));
        });
    };
};

export const logout = () => {
    return dispatch => {
        console.log({
            headers : {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json'
            }
        });
        axios.post('http://127.0.0.1:5000/logout/access', {
            key: "value"
         },
         {
            headers : {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json'
            }
        }).then(response => {            
            localStorage.removeItem('token');
            localStorage.removeItem('data');
            dispatch(authLogout())
        }).catch(err => {
            localStorage.removeItem('token');
            localStorage.removeItem('data');
            dispatch(authLogout())        
        });
    }
};

export const authCheckState = () => {
    return dispatch => {
        const token = localStorage.getItem('token');
        const id = localStorage.getItem('data');
        if (!token || !id) {
             dispatch(logout());
        } else {
            dispatch(authSuccess(token, id));
        }
    };
};