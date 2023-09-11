import { GET_PRODUCTS, GET_PRODUCT_BY_ID } from "../actions/types";
const initialState = { products: [], product: {} };
export default function (state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case GET_PRODUCTS:
        return { ...state, products: payload };
        case GET_PRODUCT_BY_ID:
        return { ...state, product: payload };
        default:
        return state;
    }
}
