import { combineReducers } from "redux";
import { authReducer } from "../reducers/authReducer";
import { cartReducer } from "../reducers/cartReducer";


const rootReducer = combineReducers({
    auth: authReducer,
    cart: cartReducer
});

export default rootReducer;