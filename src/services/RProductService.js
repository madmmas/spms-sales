import { axiosInstance } from "./AxiosService";
import moment from 'moment';

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
    localStorage.setItem("products", JSON.stringify(allProducts));
}

const loadAllProductsFromLocalStorage = async () => {
    let products = JSON.parse(localStorage.getItem("products"));
    if (products) {        
        window['__all_products'] = products;
        // await db.addProducts(products);
    } else {
        await loadAllProducts();
    }
}    

const loadUpdatedProducts = async (productCacheUpdatedTime) => {
    let resp = {data: {rows: []}};
    resp = await axiosInstance.get(`/allproducts/` + productCacheUpdatedTime, {
        timeout: 15000,
        cache: {
            ttl: 1000 * 20 // 1 minute.
        }
    });        
    return resp.data;
}

const checkAndLoadAllProducts = async (products) => {
    let productCacheUpdatedTime = JSON.parse(localStorage.getItem("productCacheUpdatedTime"));
    if (!productCacheUpdatedTime && (!products || products.length == 0)) {
        productCacheUpdatedTime = 0;
    } else {
        if (productCacheUpdatedTime && moment(productCacheUpdatedTime).isAfter(moment().subtract(10, 'seconds'))) {
            // console.log("product cache is updated less than 10 seconds ago")
            return products;
        }    
    }

    let data = await loadUpdatedProducts(productCacheUpdatedTime);

    if(productCacheUpdatedTime == 0) {
        window['__all_products'] = data.rows;
        localStorage.setItem("products", JSON.stringify(data.rows));
        return data.rows;
    }

    let rows = data.rows;
    if (rows && rows.length > 0) {
        for (var i = 0; i < rows.length; i++) {
            let found = false;
            for (var j = 0; j < products.length; j++) {
                if (rows[i].id == products[j].id) {
                    products[j] = rows[i];
                    found = true;
                    break;
                }
            }
            if (!found) {
                products.push(rows[i]);
            }
        }
        localStorage.setItem("products", JSON.stringify(products));
    }
    // get momentjs datetime in yyyy-MM-dd HH:mm:ss format
    let updatedTime = moment().format('YYYY-MM-DD HH:mm:ss');
    localStorage.setItem("productCacheUpdatedTime", JSON.stringify(updatedTime));

    return products;
}

// clear cache and load products from server
const clearCacheAndLoadAllProducts = async () => {
    localStorage.removeItem("products");
    localStorage.removeItem("productCacheUpdatedTime");
    await loadAllProducts();
}

const filterProducts = (products, filters) => {
// apply global filter on all columns
    // product fields are: name, brand_name, model_no, part_number, code
    let globalFilter = filters ? filters.global.value : null;
    if (globalFilter) {
        products = products.filter((product) => {
            return product.name && product.name.toLowerCase().includes(globalFilter.toLowerCase()) ||
                product.brand_name && product.brand_name.toLowerCase().includes(globalFilter.toLowerCase()) ||
                product.model_no && product.model_no.toLowerCase().includes(globalFilter.toLowerCase()) ||
                product.part_number && product.part_number.toLowerCase().includes(globalFilter.toLowerCase()) ||
                product.code && product.code.toLowerCase().includes(globalFilter.toLowerCase());
        });
    }
    // apply filters on specific columns and null check
    let nameFilter = filters && filters.name ? filters.name.value : null;
    if (nameFilter) {
        products = products.filter((product) => {
            return product.name && product.name.toLowerCase().includes(nameFilter.toLowerCase());
        });
    }
    let brandNameFilter = filters && filters.brand_name ? filters.brand_name.value : null;
    if (brandNameFilter) {
        products = products.filter((product) => {
            return product.brand_name && product.brand_name.toLowerCase().includes(brandNameFilter.toLowerCase());
        });
    }
    let modelNoFilter = filters && filters.model_no ? filters.model_no.value : null;
    if (modelNoFilter) {
        products = products.filter((product) => {
            return product.model_no && product.model_no.toLowerCase().includes(modelNoFilter.toLowerCase());
        });
    }
    let partNumberFilter = filters && filters.part_number ? filters.part_number.value : null;
    if (partNumberFilter) {
        products = products.filter((product) => {
            return product.part_number && product.part_number.toLowerCase().includes(partNumberFilter.toLowerCase());
        });
    }
    let typeFilter = filters && filters.type ? filters.type.value : null;
    if (typeFilter) {
        products = products.filter((product) => {
            return product.type && product.type.toLowerCase().includes(typeFilter.toLowerCase());
        });
    }

    return products;
}

const getProducts = () => {

    let products = window['__all_products'];

    if (!products || products.length == 0) {
        return [];
    }

    return products;
}

const getProductsByBrandId = (brandId) => {
    
    let products = window['__all_products'];

    if (!products || products.length == 0) {
        return [];
    }

    products = products.filter((product) => {
        return product.brand_id == brandId;
    });

    return products;
}

const getAllProducts = async (filters, limit, offset) => {

    let products = window['__all_products'];
    products = await checkAndLoadAllProducts(products);

    if (!products || products.length == 0) {
        return [];
    }

    products = filterProducts(products, filters);
    
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

const getProductMapByIds = async (ids) => {
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
    let foundProducts = {};
    for (var i = 0; i < products.length; i++) {
        if (ids.includes(products[i].id)) {
            // foundProducts.push(products[i]);
            foundProducts[products[i].id] = products[i];
        }
    }

    // if not found send empty product
    return foundProducts;
}

export default {
    getProducts,
    getAllProducts,
    getProductById,
    getProductByIds,
    loadAllProducts,
    getProductMapByIds,
    getProductsByBrandId,
    clearCacheAndLoadAllProducts,
    loadAllProductsFromLocalStorage,
};
