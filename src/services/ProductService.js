import axiosInstance from "./AxiosService";
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { TransactionService } from './TransactionService';
import RProductService from './RProductService';

export class ProductService {

    constructor() {
        this.transactionService = new TransactionService();
    }

    async getById(id) {
        let uri = `/products/${id}`;
        const resp = await axiosInstance.get(uri, {
            timeout: 15000,
            id: uri,
            cache: {
                ttl: 1000 * 10 // 10 seconds.
            }
        });
        console.log(resp.data);
        return resp.data;
    }

    async getStockStatus(params) {
        console.log("PARAMS::", params);
        // params = { params: JSON.stringify(params) };

        const queryParams = params ? Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&') : '';
        let uri = `/cur_stock?` + queryParams;
        return axiosInstance.get(uri, {
            timeout: 15000,
            id: uri,
            cache: {
                ttl: 1000 * 10 // 10 seconds.
            },
        }).then(res => res.data);
    }

    async getAll(params) {
        console.log("PARAMS::", params);
        // params = { params: JSON.stringify(params) };

        // const queryParams = params ? Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&') : '';

        // return axiosInstance.get(`/products?` + queryParams).then(res => res.data);
        // let globalFilter = params ? params.filters.global : null;
        // let nameFilter = params ? params.filters.name.constraints[0] : null;

        let limit = params ? params.rows : 1000;
        let offset = params ? params.first : 0;
        console.log(limit, offset);
        const resp = await RProductService.getAllProducts(params.filters, limit, offset);
        console.log(resp);
        return resp;
    }

    async clearCache() {
        await RProductService.clearCacheAndLoadAllProducts();
    }

    isProductNameExist(id, name) {
        let products = RProductService.getProducts();
        console.log("name:::", name);
        for (var i = 0; i < products.length; i++) {
            if (products[i].id !== id && products[i].name === name) {
                console.log("found product-name ::: ", products[i].name, name);
                return true;
            }
        }
        console.log("not found product-name ::: ", name);
        return false;
    }

    isProductCodeExist(id, code) {
        let products = RProductService.getProducts();
        console.log("code:::", code);
        for (var i = 0; i < products.length; i++) {
            if (products[i].id !== id && products[i].code == code) {
                console.log("found product-code ::: ", products[i].code, code);
                return true;
            }
        }
        return false;
    }

    isProductBarcodeExist(id, barcode) {
        let products = RProductService.getProducts();
        console.log("barcode:::", barcode);
        for (var i = 0; i < products.length; i++) {
            if (products[i].id !== id && products[i].barcode == barcode) {
                console.log("found product-barcode ::: ", products[i].barcode, barcode);
                return true;
            }
        }
        return false;
    }

    // check part number exist for product by brand_id
    isProductPartNumberExist(id, partNumber, brandId) {
        let products = RProductService.getProductsByBrandId(brandId);

        let found = false;
        for (var i = 0; i < products.length; i++) {
            if (products[i].id !== id && products[i].part_number == partNumber) {
                found = true;
                break;
            }
        }
        return found;
    }

    async create(data) {
        const resp = await axiosInstance.post(`/products`, data);
        console.log(resp.data);
        return resp.data;
    }

    async update(id, data) {
        const resp = await axiosInstance.put(`/products/` + id, data);
        console.log(resp.data);
        return resp.data;
    }

    async getProductCurrentStock(id) {
        // let filters = {
        //     'dtProduct_id': { "operator": FilterOperator.AND, "constraints": [{ "value": id, "matchMode": FilterMatchMode.EQUALS }] },
        // }

        // let data = await this.masterDataService.getByFilters("dtStock", filters)
        // console.log(data)
        // return data.currentStock
        const resp = await axiosInstance.get(`/products/` + id, {
            timeout: 15000,
            id: `/products/` + id,
            cache: {
                ttl: 1000 * 10 // 20 seconds.
            }
        });
        console.log(resp.data);
        return resp.data.current_stock;
    }

    async addPackageToStock(id, data) {
        // let res = await this.transactionService.processTransaction(ON_STOCK_IN_PACKAGE_PRODUCT, data)
        // console.log(res)
        // return res
        const resp = await axiosInstance.post(`/products/stock/` + id, data);
        console.log(resp.data);
        return resp.data;
    }
}