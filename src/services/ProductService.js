import axiosInstance from "./AxiosService";
import { TransactionService } from './TransactionService';
import { MasterDataDBService } from "./MasterDataDBService";

export class ProductService {

    constructor() {
        this.masterDataDBService = new MasterDataDBService();
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

    async isProductNameBrandAndPartNumberExist(name, brandId, partNumber) {
        let products = await this.masterDataDBService.getByFields("dtProduct", { name: name, dtProductBrand_id: brandId, part_number: partNumber });
        console.log("name:::", name);
        console.log("brandId:::", brandId);
        console.log("partNumber:::", partNumber);
        if(products.length > 0) {
            return true;
        }
        return false;
    }

    async isProductNameExist(id, name) {
        let products = await this.masterDataDBService.getByFieldName("dtProduct", "name", name);
        console.log("name:::", name);
        if(products.length > 0) {
            for (var i = 0; i < products.length; i++) {
                if (products[i].id !== id && products[i].name === name) {
                    console.log("found product-name ::: ", products[i].name, name);
                    return true;
                }
            }
        }
        return false;
    }

    async isProductCodeExist(id, code) {
        let products = await this.masterDataDBService.getByFieldName("dtProduct", "code", code);
        console.log("code:::", code);
        for (var i = 0; i < products.length; i++) {
            if (products[i].id !== id && products[i].code === code) {
                console.log("found product-code ::: ", products[i].code, code);
                return true;
            }
        }
        return false;
    }

    // check part number exist for product by brand_id
    async isProductPartNumberExist(id, partNumber, brandId) {
        let products = await this.masterDataDBService.getByFieldName("dtProduct", "dtProductBrand_id", brandId);   
        let found = false;
        for (var i = 0; i < products.length; i++) {
            if (products[i].id !== id && products[i].part_number === partNumber) {
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
        const resp = await axiosInstance.get(`/products/` + id, {
            timeout: 15000,
            id: `/products/` + id,
            cache: {
                ttl: 1000 * 10 // 20 seconds.
            }
        });
        return resp.data.current_stock;
    }

    async addPackageToStock(id, data) {
        const resp = await axiosInstance.post(`/products/stock/` + id, data);
        console.log(resp.data);
        return resp.data;
    }
}