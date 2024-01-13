import * as masterDef from './MasterModelDef';
import * as transDef from './TrxModelDef';
import * as productDef from './ProductModelDef';

const getFields = function(modelName) {
    switch (modelName) {
        case "dtBank":
            return masterDef.banks_fields;
        case "dtBankAccount":
            return masterDef.bank_accounts_fields;
        case "dtCourier":
            return masterDef.courier_fields;
        case "dtCustomer":
            return masterDef.customer_fields;
        case "dtCustomerCategory":
            return masterDef.customer_category_fields;
        case "dtExpenseType":
            return masterDef.expense_type_fields;
        case "dtIncomeType":
            return masterDef.extra_income_type_fields;
        case "dtMFS":
            return masterDef.mfs_fields;
        case "dtMFSAccount":
            return masterDef.mfs_account_fields;
        case "dtPaymentType":
            return masterDef.payment_type_fields;
        case "dtProductBrand":
            return masterDef.product_brand_fields;
        case "dtProductCategory":
            return masterDef.product_category_fields;
        case "dtProductModel":
            return masterDef.product_model_fields;
        case "dtRoute":
            return masterDef.route_fields;
        case "dtSupplier":
            return masterDef.supplier_fields;
        case "dtSupplierCategory":
            return masterDef.supplier_category_fields;
        case "dtWarehouse":
            return masterDef.warehouse_fields;         
        case "dtProduct":
            return productDef.product_fields;
        case "dtProductSearch":
            return productDef.product_search_fields;
        case "trxLedger":
            return transDef.ledger_fields;   

        default:
            return [];
    }
}

const getJoinedFields = function(modelName) {
    let fields = getFields(modelName);
    return fields.join(',');
}

export default {
    getFields,
    getJoinedFields,
}