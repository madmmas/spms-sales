import * as moment from 'moment';
import Dexie from 'dexie';
import axiosInstance from "./AxiosService";
import { FilterMatchMode } from 'primereact/api';

import modelDef from './ModelDef';

const DB_NAME = "spms_org_v1";

const DEL_DB_NAME = "spms_org_v2";
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

    setModelLastUpdated(modelName) {
        // set to cache
        let updatedTime = moment().format('YYYY-MM-DD HH:mm:ss');
        // 2 minutes before
        updatedTime = moment().subtract(1, 'minutes').format('YYYY-MM-DD HH:mm:ss');
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
        console.log("openDB:::dtBankAccount:::", modelDef.getJoinedFields('dtBankAccount'));
        this.db = new Dexie(DB_NAME);
        this.db.version(1).stores({
            dtBank: modelDef.getJoinedFields('dtBank'),
            dtBankAccount: modelDef.getJoinedFields('dtBankAccount'),
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

            trxLedger: modelDef.getJoinedFields('trxLedger'),
        });
        this.db.open().then(function (db) {
            // Database opened successfully
            console.log("Dixie DB version", db.verno);
        }).catch (function (err) {
            // Error occurred
            console.log("Dixie DB Failed::", err);
        });
    }

    async updateModelTable(modelName, data) {
        this.openDB();
        let table = this.db.table(modelName);

        console.log("updateCustomerTable result:::", data);
        if (data.rows) {
            let self = this;
            data.rows.forEach(row => {
                let doc = JSON.parse(row.doc);
                let result = self.buildData(modelName, doc);
                result.last_trx_id = row.last_trx_id;
                result.shortname = row.shortname;
                result.deleted = row.deleted;
                table.update(row.id, result);
            });
        }

        // set the last updated time
        this.setModelLastUpdated(modelName);
    }

    async addToModelTable(modelName, data) {
        this.openDB();
        let table = this.db.table(modelName);

        // clear the table
        await table.clear();

        console.log("addToCustomerTable result:::", data);
        if (data.rows) {
            let self = this;
            data.rows.forEach(row => {
                let doc = JSON.parse(row.doc);
                let result = self.buildData(modelName, doc);
                result.id = row.id;
                result.last_trx_id = row.last_trx_id;
                result.shortname = row.shortname;
                result.deleted = row.deleted;
                table.put(result);
            });
        }

        // set the last updated time
        this.setModelLastUpdated(modelName);
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

            // clear the table
            await table.clear();
        }
        console.log("getAllUpto:::", upto);
        let uri = `/all_products/${upto}`;
        let limit = 500;
        let offset = 0;
        let result = await axiosInstance.get(uri + "/" + limit + "/" + offset).then(res => res.data);
        if(upto === "0") {
            result.rows.forEach(row => {
                table.put(row);
            });
        } else {
            result.rows.forEach(row => {
                table.update(row.id, row);
            });
        }
        let total = result.total;

        while(result.rows.length > 0 && result.rows.length == limit && offset < total) {
            offset += limit;
            result = await axiosInstance.get(uri + "/" + limit + "/" + offset).then(res => res.data);
            if(upto === "0") {
                result.rows.forEach(row => {
                    table.put(row);
                });
            } else {
                result.rows.forEach(row => {
                    table.update(row.id, row);
                });
            }
        }

        // set the last updated time
        this.setModelLastUpdated("dtProduct");
    }

    async getAllMasterDataUpto(modelName) {
        let upto = this.getModelLastUpdated(modelName);
        if (upto === null || !upto) {
            upto = "0"
        }
        console.log("getAllUpto:::", upto);
        let uri = `/all/${modelName}/${upto}`;
        let result = await axiosInstance.get(uri, {
            timeout: 15000,
            id: uri,
            cache: {
                ttl: 1000 * 1 // 10 seconds.
            }
        }).then(res => res.data);

        if(upto === "0") {
            // save the result in indexedDB
            await this.addToModelTable(modelName, result);
        } else {
            // save the result in indexedDB
            this.updateModelTable(modelName, result);
        }
    }

    async applyFilter(table, filters) {

        for(const filter in filters) {
            let filterField = filter;
            let filterValue = filters[filter].value;    
            let filterMatchMode = filters[filter].matchMode;

            if(filterValue===null || filterValue===undefined || filterValue==="") {
                continue;
            }

            console.log("getAll filter:::", filterField, filterValue, filterMatchMode);

            switch (filterMatchMode) {
                case FilterMatchMode.STARTS_WITH:
                    table = table.filter(row => row[filterField] && row[filterField].startsWith(filterValue));
                    break;
                case FilterMatchMode.ENDS_WITH:
                    table = table.filter(row => row[filterField] && row[filterField].endsWith(filterValue));
                    break;
                case FilterMatchMode.CONTAINS:
                    table = table.filter(row => row[filterField] && row[filterField].includes(filterValue));
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
                case FilterMatchMode.GTE:
                    table = table.filter(row => row[filterField] >= filterValue);
                    break;
                case FilterMatchMode.LTE:
                    table = table.filter(row => row[filterField] <= filterValue);
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
        await this.getAllMasterDataUpto("dtBank");
        await this.getAllMasterDataUpto("dtCustomerCategory");
        await this.getAllMasterDataUpto("dtExpenseType");
        await this.getAllMasterDataUpto("dtIncomeType");
        await this.getAllMasterDataUpto("dtMFS");
        await this.getAllMasterDataUpto("dtPaymentType");
        await this.getAllMasterDataUpto("dtProductBrand");
        await this.getAllMasterDataUpto("dtProductCategory");
        await this.getAllMasterDataUpto("dtProductModel");
        await this.getAllMasterDataUpto("dtSupplierCategory");
        await this.getAllMasterDataUpto("dtRoute");
        await this.getAllMasterDataUpto("dtWarehouse");
        await this.loadProductData()
    }

    async getAll(modelName, params) {

        // check if the model is updated
        await this.getAllUpto(modelName);

        let first = params.first;
        let limit = params.rows;
        let name = params.nameField || "name";
        console.log("getAll params:::", first, limit);
        console.log("getAll params:::", modelName, params);
        
        await this.openDB();
        let table = await this.db.table(modelName).orderBy(name);
        
        // apply filter on the table
        table = await this.applyFilter(table, params.filters);
        let total = await table.count();
        let result = await table.offset(first).limit(limit).toArray();
        
        // apply filter on the result
        // let result = await table.toArray();
        // result = await this.applyFilter(result, params.filters);
        // let total = await table.count();
        // result = result.slice(first, first + limit);
        
        console.log("getAll result:::", result);
        // need to populate the shortname fields here
        let fields = modelDef.getFields(modelName);
        for (let i = 0; i < fields.length; i++) {
            let field = fields[i];
            if(field.startsWith("dt") && field.endsWith("_id")) {
                let fieldModelName = field.substring(0, field.length - 3);
                await this.populateFieldData(fieldModelName, field, result);
            }
        }        
        return {
            rows: result,
            total: total,
        };
    }

    // get model data by id
    async getById(modelName, id) {
        await this.openDB();
        let table = this.db.table(modelName);
        let result = await table.get(id);
        console.log("getById result:::", result);
        return result;
    }

    // get model shortname by id
    async getShortnameById(modelName, id) {
        await this.openDB();
        let table = this.db.table(modelName);
        let result = await table.get(id);
        console.log("getShortnameById result:::", result);
        return result.shortname;
    }

    async populateFieldData(modelName, fieldName, rows) {
        let prevId = null;
        let shortname = null;
        console.log("populateFieldData:::", modelName, fieldName, rows);
        for (let i = 0; i < rows.length; i++) {
            let row = rows[i];
            if (row[fieldName] != undefined && row[fieldName] != null) {
                if(row[fieldName] != prevId) {
                    shortname = await this.getShortnameById(modelName, row[fieldName]);
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
}