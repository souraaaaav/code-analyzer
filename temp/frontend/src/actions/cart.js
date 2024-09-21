import * as actionTypes from './types';

export const add_product = () => (dispatch) => {
    dispatch({ type: actionTypes.PRODUCT_ADD });
};

export const remove_product = () => (dispatch) => {
    dispatch({ type: actionTypes.PRODUCT_REMOVE });
};
export const set_product_count = ({ email }) => (dispatch) => {


    const cartData = email ? localStorage.getItem(email) : null;
    console.log('yaya', cartData);

    dispatch({
        type: actionTypes.SET_PRODUCT_COUNT,
        payload: cartData ? cartData.totalCount : 0
    });
};