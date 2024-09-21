
import * as actionTypes from '../actions/types';


const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    passwordResetRequest: "",
    isLoading: false,
    user: null,
};

export const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.LOADING_START:
            return {
                ...state,
                isLoading: true,
            };

        case actionTypes.REGISTER_USER_SUCCESS:

            return {
                ...state,
                ...action.payload,
                isAuthenticated: true,
                isLoading: false,
                user: action.payload.user,
                passwordResetRequest: "",

            };
        case actionTypes.LOGIN_SUCCESS:
            localStorage.setItem('token', action.payload.token);

            return {
                ...state,
                ...action.payload,
                isAuthenticated: true,
                isLoading: false,
                user: action.payload.user,
                passwordResetRequest: ""
            };
        case actionTypes.CONTINUOUS_USER_AUTH_SUCCESS:
            return {
                ...state,
                isAuthenticated: true,
                isLoading: false,
                user: action.payload,
                passwordResetRequest: ""
            };

        case actionTypes.REGISTER_USER_FAILED:
        case actionTypes.LOGIN_FAILED:
        case actionTypes.CONTINUOUS_USER_AUTH_FAILED:

            return {
                ...state,
                token: null,
                isAuthenticated: false,
                isLoading: false,
                user: null
            };
        case actionTypes.AUTH_LOGOUT:
            localStorage.removeItem("token");

            return {
                ...state,
                token: null,
                isAuthenticated: false,
                isLoading: false,
                user: null,
                passwordResetRequest: "",
                user_type: null

            };
        case actionTypes.PASSWORD_CHANGE_REQUEST_SUCCESS:
            return {
                ...state,
                isLoading: false,
                passwordResetRequest: "email found"
            };
        case actionTypes.PASSWORD_CHANGE_REQUEST_FAILED:
            return {
                ...state,
                isLoading: false,
                passwordResetRequest: "email not found"
            };
        case actionTypes.PASSWORD_CHANGE_CONFIRM_REQUEST_SUCCESS:
            return {
                ...state,
                isLoading: false,
                passwordResetRequest: "reset done"
            };
        case actionTypes.PASSWORD_CHANGE_CONFIRM_REQUEST_FAILED:
            return {
                ...state,
                isLoading: false
            };
        case actionTypes.PRODUCT_ADD:
            return {
                ...state,
                totalCart: state.totalCart + 1,
            };
        case actionTypes.PRODUCT_REMOVE:
            return {
                ...state,
                totalCart: state.totalCart - 1,
            };

        default:
            return state;
    }
};
