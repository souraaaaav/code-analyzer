import { toast } from 'react-toastify';
import axios from "../helper/axios-helper";
import * as actionTypes from './types';


export const forget_password = ({ email }) => (dispatch) => {
    dispatch({ type: actionTypes.LOADING_START });
    const config = {
        headers: {
            'Content-Type': 'application/json',
        }
    };
    const body = JSON.stringify({ email });
    axios.post('/password-change-request/', body, config)
        .then(response => {

            dispatch({
                type: actionTypes.PASSWORD_CHANGE_REQUEST_SUCCESS,
                payload: response.data
            });

            toast.success("Verify your request from email");

        }).catch(err => {

            dispatch({
                type: actionTypes.PASSWORD_CHANGE_REQUEST_FAILED
            });
            toast.error("please enter correct email address", err);
        });
};

export const forget_password_confirm = ({ token, password }) => (dispatch) => {
    dispatch({ type: actionTypes.LOADING_START });
    const config = {
        headers: {
            'Content-Type': 'application/json',
        }
    };
    const body = JSON.stringify({ 'token': token, 'password': password });
    axios.post('/password-change-confirm/', body, config)
        .then(response => {
            dispatch({
                type: actionTypes.PASSWORD_CHANGE_CONFIRM_REQUEST_SUCCESS,
                payload: response.data
            });
            toast.success("successfully changed the password");
        }).catch(err => {
            dispatch({
                type: actionTypes.PASSWORD_CHANGE_CONFIRM_REQUEST_FAILED
            });
            toast.error("Something went wrong");
        });
};

export const login = (email, password) => (dispatch) => {
    dispatch({ type: actionTypes.LOADING_START });
    const config = {
        headers: {
            'Content-Type': 'application/json',
        }
    };
    const body = JSON.stringify({ email, password });
    console.log(body);
    axios.post('/login/', body, config)
        .then(response => {
            dispatch({
                type: actionTypes.LOGIN_SUCCESS,
                payload: response.data
            });
            if (response.data.user.is_verified === false) {
                toast.error("Please verify your account first!");
            }
        }).catch(err => {
            dispatch({
                type: actionTypes.LOGIN_FAILED
            });
            toast.error("login failed");
        });

};

export const check_continuous_auth = () => (dispatch) => {
    const token = localStorage.getItem("token");
    if (!token) {
        dispatch(logout);
    }
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
        }
    };
    axios.get('/checkauth/', config)
        .then(response => {
            dispatch({
                type: actionTypes.CONTINUOUS_USER_AUTH_SUCCESS,
                payload: response.data
            });
        }).catch(err => {
            dispatch({
                type: actionTypes.CONTINUOUS_USER_AUTH_FAILED
            });
        });
};

export const logout = () => (dispatch) => {
    dispatch({ type: actionTypes.LOADING_START });
    localStorage.removeItem("token");
    dispatch({ type: actionTypes.AUTH_LOGOUT });
    toast.success("logout success");
};