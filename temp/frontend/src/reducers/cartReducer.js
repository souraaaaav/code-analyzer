
import * as actionTypes from '../actions/types';


const initialState = {
    totalCart: 0
};



export const cartReducer = (state = initialState, action) => {
    switch (action.type) {
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

        case actionTypes.SET_PRODUCT_COUNT:
            return {
                ...state,
                totalCart: action.payload,
            };

        default:
            return state;
    }
};
