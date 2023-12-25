import {
    GET_PRODUCTS,
    GET_PRODUCT_BY_ID,
} from "./types";

export const getProducts = (limit=1000, offset=0) => (dispatch) => {

    let products = window['__products_data'];
    if (products) {
        console.log("products loaded from cache");
        dispatch({
            type: GET_PRODUCTS,
            payload: products,
        });
        return Promise.resolve();
    }

}

export const getProductById = (id) => (dispatch) => {
    // dispatch product from products
    let products = window['__products_data'];
    if(products) {
        
        for (var i = 0; i < products.length; i++) {
            console.log(products[i].id, id);
            if (products[i].id == id) {
                dispatch({
                    type: GET_PRODUCT_BY_ID,
                    payload: products[i],
                });
                return Promise.resolve();
            }
        }
    } else {
        // if not found send empty product
        dispatch({
            type: GET_PRODUCT_BY_ID,
            payload: {},
        });
        
        return Promise.resolve();
    }
}