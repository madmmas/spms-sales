import axiosInstance from "./AxiosService";
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { MasterDataService } from './MasterDataService';
import { TransactionService } from './TransactionService';

import { ON_STOCK_IN_PACKAGE_PRODUCT } from '../constants/transactions';

export class ProductService {

    constructor() {
        this.masterDataService = new MasterDataService();
        this.transactionService = new TransactionService();
    }

    async getById(id) {
        const resp = await axiosInstance.get(`/products/` + id);
        console.log(resp.data);
        return resp.data;
    }

    async getAll(params) {
        const queryParams = params ? Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&') : '';

        return axiosInstance.get(`/products?` + queryParams).then(res => res.data);
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
        let filters = {
            'dtProduct_id': { "operator": FilterOperator.AND, "constraints": [{ "value": id, "matchMode": FilterMatchMode.EQUALS }] },
        }

        let data = await this.masterDataService.getByFilters("dtStock", filters)
        console.log(data)
        return data.currentStock
    }

    async addPackageToStock(id, data) {
        // let res = await this.transactionService.processTransaction(ON_STOCK_IN_PACKAGE_PRODUCT, data)
        // console.log(res)
        // return res
        const resp = await axiosInstance.post(`/products/stock/` + id, data);
        console.log(resp.data);
        return resp.data;
    }

    async getProductCustomerLastPrice(productId, customerId) {
        let filters = {
            'dtProduct_id': { "operator": FilterOperator.AND, "constraints": [{ "value": productId, "matchMode": FilterMatchMode.EQUALS }] },
            'dtCustomer_id': { "operator": FilterOperator.AND, "constraints": [{ "value": customerId, "matchMode": FilterMatchMode.EQUALS }] },
        }

        let data = await this.masterDataService.getByFilters("dtProductSalesCustomer", filters)
        console.log(data)
        return data.lastTradePrice
    }
}