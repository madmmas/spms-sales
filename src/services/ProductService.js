import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { MasterDataService } from './MasterDataService';

export class ProductService {

    constructor() {
        this.masterDataService = new MasterDataService();
    }

    async getProductCurrentStock(id) {
        let filters = {
            'dtProduct_id': { "operator": FilterOperator.AND, "constraints": [{ "value": id, "matchMode": FilterMatchMode.EQUALS }] },
        }

        let data = await this.masterDataService.getByFilters("dtStock", filters)
        console.log(data)
        return data.currentStock
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