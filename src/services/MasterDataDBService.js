import Dexie from 'dexie';
import axiosInstance from "./AxiosService";
import { FilterMatchMode } from 'primereact/api';

import { getFormattedNumber } from '../utils';

import modelDef from './ModelDef';

const DB_NAME = "indx_spms_org_final_v4";

const DEL_DB_NAME = "indx_spms_org_final_v3";
const DBDeleteRequest = window.indexedDB.deleteDatabase(DEL_DB_NAME);
DBDeleteRequest.onerror = (event) => {
  console.error("Error deleting database. May be it doesn't exist named: " + DB_NAME);
};
DBDeleteRequest.onsuccess = (event) => {
  console.log("Database deleted successfully");
  console.log(event.result);
};

export class MasterDataDBService {
    db = null;

    getModelLastUpdated(modelName) {
        // read from cache
        let updatedTime = localStorage.getItem(modelName + "_last_updated");
        return updatedTime;
    }

    setModelLastUpdated(modelName, updatedTime) {
        // set to cache
        // let updatedTime = moment().format('YYYY-MM-DD HH:mm:ss');
        // 2 minutes before
        // updatedTime = moment().subtract(1, 'minutes').format('YYYY-MM-DD HH:mm:ss');
        // updatedTime = moment(updatedTime).format('YYYY-MM-DD HH:mm:ss');
        console.log("setModelLastUpdated:::", modelName, updatedTime);
        localStorage.setItem(modelName + "_last_updated", updatedTime);
    }

    buildData(modelName, data) {
        let fields = modelDef.getFields(modelName);
        let result = {};

        if (data) {
            fields.forEach(field => {
                result[field] = data[field];
            });
        }

        return result;
    }

    async openDB() {
        this.db = new Dexie(DB_NAME);
        this.db.version(1).stores({
            dtBank: modelDef.getJoinedFields('dtBank'),
            dtBankAccount: modelDef.getJoinedFields('dtBankAccount'),
            dtCourier: modelDef.getJoinedFields('dtCourier'),
            dtCustomer: modelDef.getJoinedFields('dtCustomer'),
            dtCustomerCategory: modelDef.getJoinedFields('dtCustomerCategory'),
            dtExpenseType: modelDef.getJoinedFields('dtExpenseType'),
            dtIncomeType: modelDef.getJoinedFields('dtIncomeType'),
            dtMFS: modelDef.getJoinedFields('dtMFS'),
            dtMFSAccount: modelDef.getJoinedFields('dtMFSAccount'),
            dtPaymentType: modelDef.getJoinedFields('dtPaymentType'),
            dtProductBrand: modelDef.getJoinedFields('dtProductBrand'),
            dtProductCategory: modelDef.getJoinedFields('dtProductCategory'),
            dtProductModel: modelDef.getJoinedFields('dtProductModel'),
            dtSupplier: modelDef.getJoinedFields('dtSupplier'),
            dtSupplierCategory: modelDef.getJoinedFields('dtSupplierCategory'),
            dtRoute: modelDef.getJoinedFields('dtRoute'),
            dtWarehouse: modelDef.getJoinedFields('dtWarehouse'),

            dtProduct: modelDef.getJoinedFields('dtProduct'),
            dtProductSearch: modelDef.getJoinedFields('dtProductSearch'),

            trxLedger: modelDef.getJoinedFields('trxLedger'),
            users: "id, username",
        });
        this.db.open().then(function (db) {
            // Database opened successfully
            console.log("Dixie DB version", db.verno);
        }).catch (function (err) {
            // Error occurred
            console.log("Dixie DB Failed::", err);
        });
    }

    async addToModelTable(modelName, data) {
        this.openDB();
        let table = this.db.table(modelName);

        console.log("addToCustomerTable result:::", data);
        if (data && data.rows) {
            let self = this;
            let result = [];
            let deleted = [];
            data.rows.forEach(row => {
                let doc = JSON.parse(row.doc);
                let _result = self.buildData(modelName, doc);
                _result.id = row.id;
                _result.last_trx_id = row.last_trx_id;
                _result.shortname = row.shortname;
                _result.deleted = row.deleted;
                _result._default = row._default;
                // _result.parent_id = row.parent_id;
                if(row.deleted) {
                    deleted.push(row.id);
                } else {
                    result.push(_result);
                }
            });
            table.bulkPut(result);
            table.bulkDelete(deleted);
            let _last_updated = data.last_updated;
            console.log("addToCustomerTable_last_updated:::", _last_updated);
            if(_last_updated) {
                this.setModelLastUpdated(modelName, _last_updated);
            }
            // await this.populateShortnameInMemory(modelName, result);
        }
    }

    async populateAllShortnameInMemory() {
        this.openDB();
        let tables = [ 
            "dtBank", "dtCourier", "dtCustomerCategory", "dtExpenseType", "dtIncomeType", 
            "dtMFS", "dtPaymentType", "dtProductBrand", "dtProductCategory", 
            "dtProductModel", "dtSupplierCategory", "dtRoute", "dtWarehouse", 
            "dtBankAccount", "dtMFSAccount", "dtCustomer", "dtSupplier", "users"
        ];

        for(let i=0; i<tables.length; i++) {
            let table = this.db.table(tables[i]);
            let result = await table.toArray();
            if (result && result.length > 0) {
                this.populateShortnameInMemory(tables[i], result);
            }
        }
    }

    async populateShortnameInMemory(modelName, rows) {
        let masterData = window['__all_shortname_' + modelName] || {};
        if (rows && rows.length > 0) {
            rows.forEach(row => {
                masterData[row.id+"-"+modelName] = row.shortname;
            });
            window['__all_shortname_' + modelName] = masterData;
        }
        window['__all_shortname_' + modelName] = masterData;
    }

    async create(modelName, data) {
        const resp = await axiosInstance.post(`/data/${modelName}`, data);
        console.log(resp.data);
        return resp.data;
    }

    async update(modelName, id, data) {
        const resp = await axiosInstance.put(`/data/${modelName}/` + id, data);
        console.log(resp.data);
        return resp.data;
    }

    async delete(modelName, id) {
        // let uri = `/data/${modelName}/` + id;
        // if(modelName === "dtProduct") {
        //     uri = `/products/` + id;
        // }
        // const resp = await axiosInstance.delete(uri);
        // await this.deleteFromModelTable(modelName, id);
        // return resp.data;
        return {};
    }

    async deleteFromModelTable(modelName, id) {
        this.openDB();
        let table = this.db.table(modelName);
        table.delete(id);
    }

    async getAllMD(modelName, params) {
        let uri = `/all/${modelName}`;
        let result = await axiosInstance.get(uri, {
            timeout: 15000,
            id: uri,
            cache: {
                ttl: 1000 * 1 // 10 seconds.
            }
        }).then(res => res.data);

        // save the result in indexedDB
        await this.addToModelTable(modelName, result);

        let tblResult = this.getAll(modelName, params);
        return tblResult;
    }

    async getAllProductDataUpto() {
        this.openDB();
        let table = this.db.table('dtProduct');

        let upto = this.getModelLastUpdated("dtProduct");
        if (upto === null || !upto) {
            upto = "0"
            // clear the model table
            await this.clearDBTableByModel("dtProduct");
        }

        let uri = `/all_products/${upto}`;
        let limit = 1000;
        let offset = 0;
        let result = await axiosInstance.get(uri + "/" + limit + "/" + offset, {
            timeout: 30000,
            cache: false,
        }).then(res => res.data);

        //
        if(result && result.rows) {
            table.bulkPut(result.rows);
            let total = result.total;

            while(result && result.rows && result.rows.length > 0 && result.rows.length === limit && offset < total) {
                offset += limit;
                result = await axiosInstance.get(uri + "/" + limit + "/" + offset, {
                    timeout: 30000,
                    cache: false,
                }).then(res => res.data);
                if(result && result.rows) {
                    // TODO here will some changes
                    table.bulkPut(result.rows);
                }
            }

            // set the last updated time
            let _last_updated = result.last_updated;
            console.log("getAllUpto_last_updated:::", _last_updated);
            if(_last_updated) {
                this.setModelLastUpdated("dtProduct", _last_updated);
            }
        }
    }

    async populateProductSearch() {
        this.openDB();
        let brand_names = {};
        let brandTable = this.db.table('dtProductBrand');
        let brands = await brandTable.toArray();
        for(let i=0; i<brands.length; i++) {
            brand_names[brands[i].id] = brands[i].name;
        }
        let model_names = {};
        let modelTable = this.db.table('dtProductModel');
        let models = await modelTable.toArray();
        for(let i=0; i<models.length; i++) {
            model_names[models[i].id] = models[i].name;
        }

        let table = this.db.table('dtProduct');

        let result = await table.toArray();
        let productSearch = [];
        for(let i=0; i<result.length; i++) {
            let brand_name = brand_names[result[i].dtProductBrand_id] || "";
            let model_no = model_names[result[i].dtProductModel_id] || "";
            let code = result[i].code || "";
            let part_number = result[i].part_number || "";
            let search = result[i].name + " " + 
                code + " " + part_number + " " + brand_name + " " + model_no;
            productSearch.push({
                id: result[i].id,
                search: search.toLowerCase(),
            });
        }
        console.log("populateProductSearch:::", productSearch);
        let productSearchTable = this.db.table('dtProductSearch');
        productSearchTable.bulkPut(productSearch);
    }

    async getAllUsers() {
        // get all the users and save in indexedDB
        let uri = `/users`;
        let result = await axiosInstance.get(uri, {
            timeout: 30000,
            cache: false,
        }).then(res => res.data);

        // save the result in indexedDB

        this.openDB();
        let table = this.db.table('users');

        if(result) {
            table.bulkPut(result);
        }

        // save result in memory
        let users = {};
        for(let i=0; i<result.length; i++) {
            users[result[i].id] = result[i].username;
        }
        window['__all_shortname_users'] = users;

        return result;
    }

    getUsernameById(id) {
        let users = window['__all_shortname_users'];
        if(users) {
            return users[id] || "";
        }
        return "";
    }

    async getAllMasterDataUpto(modelName, init=false) {
        let upto = this.getModelLastUpdated(modelName);
        if (upto === null || !upto) {
            upto = "0"
            // clear the model table
            await this.clearDBTableByModel(modelName);
        }

        let uri = `/all/${modelName}/${upto}`;
        let result = await axiosInstance.get(uri, {
            timeout: 30000,
            cache: false,
        }).then(res => res.data);
        //
        if(result && result.rows) {
            await this.addToModelTable(modelName, result);
            if(init===false){
                await this.populateShortnameInMemory(modelName, result.rows);
            }          
        }

        // load all data and populate shortname memory
        if(init) {
            let table = this.db.table(modelName);
            let _result = await table.toArray();
            await this.populateShortnameInMemory(modelName, _result);
        }        
    }

    async applyFilter(table, filters) {
        console.log("getAll filter:::", filters);
        for(const filter in filters) {
            if(filters[filter].value===null || filters[filter].value==="") {
                continue;
            }

            let filterField = filter;
            let filterValue = filters[filter].value;    
            let filterMatchMode = filters[filter].matchMode;

            if(typeof filterValue === 'string') {
                filterValue = filterValue.toLowerCase();
            }

            console.log("getAll filter:::", filterField, filterValue, filterMatchMode);

            // STARTS_WITH = 'startsWith',
            // CONTAINS = 'contains',
            // NOT_CONTAINS = 'notContains',
            // ENDS_WITH = 'endsWith',
            // EQUALS = 'equals',
            // NOT_EQUALS = 'notEquals',
            // IN = 'in',
            // LESS_THAN = 'lt',
            // LESS_THAN_OR_EQUAL_TO = 'lte',
            // GREATER_THAN = 'gt',
            // GREATER_THAN_OR_EQUAL_TO = 'gte',
            // BETWEEN = 'between',
            // DATE_IS = 'dateIs',
            // DATE_IS_NOT = 'dateIsNot',
            // DATE_BEFORE = 'dateBefore',
            // DATE_AFTER = 'dateAfter',

            switch (filterMatchMode) {
                case FilterMatchMode.STARTS_WITH:
                    table = table.filter(row => row[filterField] && row[filterField].toLowerCase().startsWith(filterValue));
                    break;
                case FilterMatchMode.ENDS_WITH:
                    table = table.filter(row => row[filterField] && row[filterField].toLowerCase().endsWith(filterValue));
                    break;
                case FilterMatchMode.CONTAINS:
                    table = table.filter(row => row[filterField] && row[filterField].toLowerCase().includes(filterValue));
                    break;
                case FilterMatchMode.EQUALS:
                    table = table.filter(row => row[filterField] === filterValue);
                    break;
                case FilterMatchMode.NOT_EQUALS:
                    table = table.filter(row => row[filterField] !== filterValue);
                    break;
                case FilterMatchMode.IN:
                    table = table.filter(row => row[filterField] && filterValue.includes(row[filterField]));
                    break;
                case FilterMatchMode.GREATER_THAN:
                    table = table.filter(row => row[filterField] && row[filterField] > filterValue);
                    break;
                case FilterMatchMode.GREATER_THAN_OR_EQUAL_TO:
                    table = table.filter(row => row[filterField] && row[filterField] >= filterValue);
                    break;
                case FilterMatchMode.LESS_THAN:
                    table = table.filter(row => row[filterField] && row[filterField] < filterValue);
                    break;
                case FilterMatchMode.LESS_THAN_OR_EQUAL_TO:
                    table = table.filter(row => row[filterField] && row[filterField] <= filterValue);
                    break;
                default:
                    break;
            }
        } // end of for loop

        return table;
    }

    async getAllUpto(modelName) {
        var data = [];
        switch(modelName) {
            case "dtProduct":
                data = await this.getAllProductDataUpto();
                break;
            // case "trxLedger":
            //     data = await this.getAllLedgerDataUpto();
            //     break;
            default:
                data = await this.getAllMasterDataUpto(modelName);
        }

        return data;
    }

    async loadProductData() {
        await this.getAllProductDataUpto();
        await this.openDB();
        await this.db.table("dtProduct").orderBy("name");
    }

    async loadAllInitData() {
        await this.getAllMasterDataUpto("dtProductBrand", true);
        await this.getAllMasterDataUpto("dtProductModel", true);
        await this.loadProductData()

        this.populateProductSearch();

        this.getAllMasterDataUpto("dtBank", true);
        this.getAllMasterDataUpto("dtCourier", true);
        this.getAllMasterDataUpto("dtCustomerCategory", true);
        this.getAllMasterDataUpto("dtExpenseType", true);
        this.getAllMasterDataUpto("dtIncomeType", true);
        this.getAllMasterDataUpto("dtMFS", true);
        this.getAllMasterDataUpto("dtPaymentType", true);
        this.getAllMasterDataUpto("dtProductCategory", true);
        this.getAllMasterDataUpto("dtSupplierCategory", true);
        this.getAllMasterDataUpto("dtRoute", true);
        this.getAllMasterDataUpto("dtWarehouse", true);
        
        this.getAllMasterDataUpto("dtBankAccount", true);
        this.getAllMasterDataUpto("dtMFSAccount", true);
        this.getAllMasterDataUpto("dtCustomer", true);
        this.getAllMasterDataUpto("dtSupplier", true);
        
        this.getAllUsers();
        // this.populateAllShortnameInMemory();
    }

    async clearCache() {
        // clear specific model cache
        localStorage.removeItem("dtBank_last_updated");
        localStorage.removeItem("dtCustomerCategory_last_updated");
        localStorage.removeItem("dtExpenseType_last_updated");
        localStorage.removeItem("dtIncomeType_last_updated");
        localStorage.removeItem("dtMFS_last_updated");
        localStorage.removeItem("dtPaymentType_last_updated");
        localStorage.removeItem("dtProductBrand_last_updated");
        localStorage.removeItem("dtProductCategory_last_updated");
        localStorage.removeItem("dtProductModel_last_updated");
        localStorage.removeItem("dtSupplierCategory_last_updated");
        localStorage.removeItem("dtRoute_last_updated");
        localStorage.removeItem("dtWarehouse_last_updated");
        localStorage.removeItem("dtCourier_last_updated");

        localStorage.removeItem("dtBankAccount_last_updated");
        localStorage.removeItem("dtMFSAccount_last_updated");

        localStorage.removeItem("dtCustomer_last_updated");
        localStorage.removeItem("dtSupplier_last_updated");

        localStorage.removeItem("dtProduct_last_updated");

        localStorage.removeItem("trxLedger_last_updated");
    }
    
    async clearDBTableByModel(modelName) {
        await this.openDB();
        await this.db.table(modelName).clear();
    }

    async clearAllDBTables() {

        await this.openDB();
        await this.db.dtBank.clear();
        await this.db.dtCourier.clear();
        await this.db.dtCustomerCategory.clear();
        await this.db.dtExpenseType.clear();
        await this.db.dtIncomeType.clear();
        await this.db.dtMFS.clear();
        await this.db.dtPaymentType.clear();
        await this.db.dtProductBrand.clear();
        await this.db.dtProductCategory.clear();
        await this.db.dtProductModel.clear();
        await this.db.dtSupplierCategory.clear();
        await this.db.dtRoute.clear();
        await this.db.dtWarehouse.clear();

        await this.db.dtBankAccount.clear();
        await this.db.dtMFSAccount.clear();

        await this.db.dtCustomer.clear();
        await this.db.dtSupplier.clear();

        await this.db.dtProduct.clear();

        await this.db.trxLedger.clear();
    }

    async getAllByIds(modelName, ids) {
        await this.openDB();
        let table = this.db.table(modelName);
        let result = await table.where('id').anyOf(ids).toArray();
        console.log("getAllByIds:::", modelName, ids, result);
        await this.populateShornames(modelName, result);
        return result;
    }

    async getAllByIdsInMap(modelName, ids) {
        await this.openDB();
        let table = this.db.table(modelName);
        let result = await table.where('id').anyOf(ids).toArray();
        console.log("getAllByIds:::", modelName, ids, result);
        await this.populateShornames(modelName, result);
        // convert to map
        let map = {};
        for (let i = 0; i < result.length; i++) {
            let row = result[i];
            map[row.id] = row;
        }
        return map;
    }
    
    async getAll(modelName, params) {
        let first = params && params.first || 0;
        let limit = params && params.rows || 10;

        // let name = params && params.nameField || "name";
        
        await this.openDB();
        // let table = await this.db.table(modelName).orderBy(name);
        let table = await this.db.table(modelName);
        
        let total = 0;
        let result = [];
        // apply filter on the table
        if (params && params.filters) {
            // check global filter
            if (params.filters.global && params.filters.global.value) {
                //
                if(modelName === "dtProduct") {
                    // search in dtProductSearch table
                    let filterValue = params.filters.global.value.toLowerCase();
                    let productSearchTable = this.db.table('dtProductSearch');
                    let productIds = await productSearchTable.filter(row => row.search.includes(filterValue)).primaryKeys();
                    // console.log("getAll_productIds:::", productIds);
                    total = await table.count();
                    result = await table.where('id').anyOf(productIds).offset(first).limit(limit).toArray();
                } else {
                    console.log("getAll globalFilterFields:::", params.filters.global, params.globalFilterFields);
                    let filterValue = params.filters.global.value.toLowerCase();
                    table = table.filter(row => {
                        for (let i = 0; i < params.globalFilterFields.length; i++) {
                            let field = params.globalFilterFields[i];
                            if(row[field] && row[field].toLowerCase().includes(filterValue)) {
                                return true;
                            }
                        }
                        return false;
                    });
                    total = await table.count();
                    result = await table.offset(first).limit(limit).toArray();  
                }
            } else  {
                table = await this.applyFilter(table, params.filters);
                total = await table.count();
                result = await table.offset(first).limit(limit).toArray();  
            }
        } else {
            total = await table.count();
            result = await table.offset(first).limit(limit).toArray();    
        }
                
        // console.log("getAll_result:::", result);
        // console.log("getAll_result:::", modelName, first, limit, params, result);

        await this.populateShornames(modelName, result);
        return {
            rows: result,
            total: total,
        };
    }

    async populateShornames(modelName, result) {
        let fields = modelDef.getFields(modelName);
        for (let i = 0; i < fields.length; i++) {
            let field = fields[i];
            if(field.startsWith("dt") && field.endsWith("id")) {
                let fieldModelName = field.substring(0, field.length - 3);
                await this.populateFieldData(fieldModelName, field, result);
            }
        }
    }
    // get model data by id
    async getById(modelName, id) {
        let _id = parseInt(id);
        if(_id===null || _id===undefined || isNaN(_id) || _id===0) {
            return null;
        }
        await this.openDB();
        let result = await this.db.table(modelName).get(_id);
        console.log("getById:::", modelName, id, result);
        return result;
    }

    // get model shortname by id
    async getShortnameByIdFromDB(modelName, id) {
        let _id = parseInt(id);
        if(_id===null || _id===undefined || isNaN(_id) || _id===0) {
            return null;
        }
        await this.openDB();
        let result = await this.db.table(modelName).get(_id);
        if(result) {
            return result.shortname || "";
        }
        return "";
    }

    async getShortnameByIdFromAPI(modelName, id) {
        let _id = parseInt(id);
        if(_id===null || _id===undefined || isNaN(_id) || _id===0) {
            return null;
        }
        let uri = `/shortname/${modelName}/${_id}`;
        let result = await axiosInstance.get(uri).then(res => res.data);
        if(result) {
            return result.shortname || "";
        }
        return "";
    }

    // get model shortname by id
    getShortnameById(modelName, id) {
        if(id===null || id===undefined) {
            return "";
        }
        let key = id+"-"+modelName;
        // console.log("getShortnameById:::", key);
        let masterData = window['__all_shortname_' + modelName];
        if (masterData) {
            if(masterData[key]) {
                console.log("getShortnameById:::", key, masterData[key]);
                return masterData[key];
            }
        }

        return "";
    }

    // get default value by table name
    async getDefaultItem(modelName) {
        await this.openDB();
        let table = this.db.table(modelName);
        let productIds = await table.filter(row => row['_default']===1).primaryKeys();
        let result = await table.where('id').anyOf(productIds).first();
        console.log("getDefaultItem:::", modelName, result);
        return result;
    }

    // get default value by table name
    async getByFieldName(modelName, fieldName, fieldValue) {
        await this.openDB();
        let table = this.db.table(modelName);
        let result = await table.where(fieldName).equals(fieldValue).toArray();
        console.log("getByFieldName:::", modelName, fieldName, fieldValue, result);
        return result;
    }

    // get default value by table name
    async getByFields(modelName, fields) {
        await this.openDB();
        let table = this.db.table(modelName);
        let result = await table.where(fields).toArray();
        console.log("getByFields:::", modelName, fields, result);
        return result;
    }

    async populateFieldData(modelName, fieldName, rows) {
        let prevId = null;
        let shortname = null;
        console.log("populateFieldData:::", modelName, fieldName, rows);
        for (let i = 0; i < rows.length; i++) {
            let row = rows[i];
            if (row[fieldName] !== undefined && row[fieldName] !== null) {
                if(row[fieldName] !== prevId) {
                    shortname = this.getShortnameById(modelName, row[fieldName]);
                    if(shortname === "") {
                        shortname = await this.getShortnameByIdFromDB(modelName, row[fieldName]);
                    }
                    rows[i][fieldName + '_shortname'] = shortname;
                } else {    
                    rows[i][fieldName + '_shortname'] = shortname;
                }
                prevId = row[fieldName];
            } else {
                rows[i][fieldName + '_shortname'] = "";
            }
        }
    }

    async sessionPing() {
        let uri = `/ping`;
        // check if 401 status code sent
        let response = await axiosInstance.get(uri).then(res => res).catch(err => err.response);
        console.log("sessionPing:::", response);

        return response.status === 200;
    }

    async getAllProductStock() {
        // get the brand and model name
        let brands = window['__all_shortname_dtProductBrand'];
        let models = window['__all_shortname_dtProductModel'];

        await this.openDB();
        // get only fields
        let table = this.db.table('dtProduct');

        let result = await table.orderBy("dtProductBrand_id").toArray();

        let finalResult = [];
        for(let i=0; i<result.length; i++) {
            let row = result[i];
            let brand_name = brands[row.dtProductBrand_id+"-dtProductBrand"] || "";
            let model_no = models[row.dtProductModel_id+"-dtProductModel"] || "";
            finalResult.push({
                "Item Name": row.name,
                "Item Code": row.code,
                "Brand": brand_name,
                "Model": model_no,
                "Part Number": row.part_number,
                "Closing Stock": row.current_stock,
                "Unit": row.unit,
                "Unit Sell Price": getFormattedNumber(row.price),
                "Average Unit Cost": getFormattedNumber(row.cost),
                "Total Cost": getFormattedNumber(row.cost*row.current_stock),
                "Total Sell Price": getFormattedNumber(row.price*row.current_stock),
                // id: row.id,
                // low_stock_qty: row.low_stock_qty,
                // prev_stock: row.prev_stock,
                // total_stock_in: row.total_stock_in,
                // total_stock_out: row.total_stock_out,
                // total_damage_stock: row.total_damage_stock,
            });
        }

        return finalResult;
    }

    async getAllProductStockAndBrandStock() {
        // get the brand and model name
        let brands = window['__all_shortname_dtProductBrand'];
        let models = window['__all_shortname_dtProductModel'];

        await this.openDB();
        // get only fields
        let table = this.db.table('dtProduct');

        let result = await table.orderBy("dtProductBrand_id").toArray();

        let productStock = [];
        let brandStock = {};
        for(let i=0; i<result.length; i++) {
            let row = result[i];
            let brand_name = brands[row.dtProductBrand_id+"-dtProductBrand"] || "";
            let model_no = models[row.dtProductModel_id+"-dtProductModel"] || "";
            productStock.push({
                "Item Name": row.name,
                "Item Code": row.code,
                "Brand": brand_name,
                "Model": model_no,
                "Part Number": row.part_number,
                "Closing Stock": row.current_stock,
                "Unit": row.unit,
                "Unit Sell Price": getFormattedNumber(row.price),
                "Average Unit Cost": getFormattedNumber(row.cost),
                "Total Cost": getFormattedNumber(row.cost*row.current_stock),
                "Total Sell Price": getFormattedNumber(row.price*row.current_stock),
                // id: row.id,
                // low_stock_qty: row.low_stock_qty,
                // prev_stock: row.prev_stock,
                // total_stock_in: row.total_stock_in,
                // total_stock_out: row.total_stock_out,
                // total_damage_stock: row.total_damage_stock,
            });
            let brand_stock = brandStock[brand_name]?.stock || 0;
            brandStock[brand_name] = {
                stock: brand_stock + row.current_stock,
                total_cost: brand_stock + (row.cost*row.current_stock),
                total_price: brand_stock + (row.price*row.current_stock),
            }
        }
        // convert brandStock map to array
        let brandStockArr = [];
        for (const key in brandStock) {
            if (brandStock.hasOwnProperty(key)) {
                const element = brandStock[key];
                brandStockArr.push({
                    "Brand": key,
                    "Closing Stock": element.stock,
                    "Total Cost": getFormattedNumber(element.total_cost),
                    "Total Sell Price": getFormattedNumber(element.total_price),
                });
            }
        }

        return {
            productStock: productStock,
            brandStock: brandStockArr,
        };
    }

    async getAllProductStockByFldId(fld, id) {
        // get the brand and model name
        let brands = window['__all_shortname_dtProductBrand'];
        let models = window['__all_shortname_dtProductModel'];

        await this.openDB();
        // get only fields
        let table = this.db.table('dtProduct');

        let result = await table.where(fld).equals(id).toArray();

        let finalResult = [];
        for(let i=0; i<result.length; i++) {
            let row = result[i];
            let brand_name = brands[row.dtProductBrand_id+"-dtProductBrand"] || "";
            let model_no = models[row.dtProductModel_id+"-dtProductModel"] || "";
            finalResult.push({
                "Item Name": row.name,
                "Item Code": row.code,
                "Brand": brand_name,
                "Model": model_no,
                "Part Number": row.part_number,
                "Closing Stock": row.current_stock,
                "Unit": row.unit,
                "Unit Sell Price": getFormattedNumber(row.price),
                "Average Unit Cost": getFormattedNumber(row.cost),
                "Total Cost": getFormattedNumber(row.cost*row.current_stock),
                "Total Sell Price": getFormattedNumber(row.price*row.current_stock),
                // id: row.id,
                // low_stock_qty: row.low_stock_qty,
                // prev_stock: row.prev_stock,
                // total_stock_in: row.total_stock_in,
                // total_stock_out: row.total_stock_out,
                // total_damage_stock: row.total_damage_stock,
            });
        }

        return finalResult;
    }

    async getTotalStock() {
        await this.openDB();
        // get only fields
        let table = this.db.table('dtProduct');
        
        let totalStock = {
            stock: 0,
            total_cost: 0,
            total_price: 0,
        };
        await table.each(row => {
            totalStock.stock += row.current_stock;
            totalStock.total_cost += row.current_stock * row.cost;
            totalStock.total_price += row.current_stock * row.price;
        });

        return totalStock;
    }

    async getTotalStockByParams(params) {
        await this.openDB();
        // get only fields
        let table = this.db.table('dtProduct');
        
        let totalStock = {
            stock: 0,
            total_cost: 0,
            total_price: 0,
        };

        // apply filter on the table
        if (params && params.filters) {
            table = await this.applyFilter(table, params.filters);
        }

        await table.each(row => {
            totalStock.stock += row.current_stock;
            totalStock.total_cost += row.current_stock * row.cost;
            totalStock.total_price += row.current_stock * row.price;
        });

        return totalStock;
    }

    async getTotalStockByFldName(fld) {
        await this.openDB();
        // get only fields
        let table = this.db.table('dtProduct');
        
        let totalStock = {};
        await table.orderBy(fld).each(row => {
            totalStock[row[fld]] = {
                stock: (totalStock[row[fld]]?.stock || 0) + row.current_stock,
                total_cost: (totalStock[row[fld]]?.stock || 0) + (row.current_stock * row.cost),
                total_price: (totalStock[row[fld]]?.stock || 0) + (row.current_stock * row.price),
            };
        })

        return totalStock;
    }

    async getTotalStockQty() {
        await this.openDB();
        // get only fields
        let table = this.db.table('dtProduct');
        
        let totalStock = 0;
        await table.each(row => {
            totalStock += row.current_stock;
        })

        return totalStock;
    }

    async getTotalStockPrice() {
        await this.openDB();
        // get only fields
        let table = this.db.table('dtProduct');
        
        let totalStock = 0;
        await table.each(row => {
            totalStock += row.current_stock * row.prce;
        })

        return totalStock;
    }

    async getTotalStockCost() {
        await this.openDB();
        // get only fields
        let table = this.db.table('dtProduct');
        
        let totalStock = 0;
        await table.each(row => {
            totalStock += row.current_stock * row.cost;
        })

        return totalStock;
    }
}