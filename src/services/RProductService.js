import { axiosInstance } from "./AxiosService";


const loadAllProducts = async () => {
    let allProducts = [];
    let page = 0;
    let pageSize = 10000;
    let fetched = 0;
    do {
        let resp = await axiosInstance.get(`/allproducts/${pageSize}/${page * pageSize}`,{
            timeout: 15000,
            id: `list-products-${pageSize}-${page * pageSize}`,
            cache: {
                ttl: 1000 * 60 // 1 minute.
            }
        });
        console.log(resp.data);
        fetched = resp.data.rows.length;
        allProducts = allProducts.concat(resp.data.rows);
        page++;
    } while (fetched == pageSize);

    window['__all_products'] = allProducts;
    // load all brands

    // load all models
}

const getAllProducts = async (limit, offset) => {
    let products = window['__all_products'];

    // if products undefined or empty load all from server limit 1000 until no more
    if (!products || products.length == 0) {
        await loadAllProducts();
        products = window['__all_products'];
    }

    // if products still undefined or empty return empty array
    if (!products || products.length == 0) {
        return [];
    }

    // if products found return products based on limit and offset
    let data = products.slice(offset, offset + limit);
    return {
        rows: data,
        total: products.length,
    };
}

const getProductById = async (id) => {
    // dispatch product from products
    let products = window['__all_products'];

    // if products undefined or empty load all from server limit 1000 until no more
    if (!products || products.length == 0) {
        await loadAllProducts();
        products = window['__all_products'];
    }

    // if products still undefined or empty return empty array
    if (!products || products.length == 0) {
        return {};
    }

    // if products found return products based on limit and offset
    for (var i = 0; i < products.length; i++) {
        console.log(products[i].id, id);
        if (products[i].id == id) {
            return products[i];
        }
    }

    // if not found send empty product
    return {};
}

const getProductByIds = async (ids) => {
    // dispatch product from products
    let products = window['__all_products'];

    // if products undefined or empty load all from server limit 1000 until no more
    if (!products || products.length == 0) {
        await loadAllProducts();
        products = window['__all_products'];
    }

    // if products still undefined or empty return empty array
    if (!products || products.length == 0) {
        return [];
    }

    // if products found return products based on limit and offset
    let foundProducts = [];
    for (var i = 0; i < products.length; i++) {
        if (ids.includes(products[i].id)) {
            foundProducts.push(products[i]);
        }
    }

    // if not found send empty product
    return foundProducts;
}

export default {
    loadAllProducts,
    getAllProducts,
    getProductById,
    getProductByIds,
};
