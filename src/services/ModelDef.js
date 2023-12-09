
// dtBank
const banks_fields = ["id", "name", "description", "status"];
// dtCustomerCategory
const customer_category_fields = ["id", "name", "description", "status"];
// dtExpenseType
const expense_type_fields = ["id", "name", "description", "status"];
// dtExtraIncomeType
const extra_income_type_fields = ["id", "name", "description", "status"];
// dtPaymentType
const payment_type_fields = ["id", "name", "description", "status"];
// dtProductBrand
const product_brand_fields = ["id", "name", "description", "status"];
// dtProductCategory
const product_category_fields = ["id", "name", "description", "status"];
// dtProductModel
const product_model_fields = ["id", "name", "description", "status"];
// dtMFS
const mfs_fields = ["id", "name", "description", "status"];
// dtMFSAccount
const mfs_account_fields = ["id", "dtMFS_id", "refNumber", "accName", "initBalance", "balance", "phone", "address", "note", "status", "last_trx_id"];
// dtRoute
const route_fields = ["id", "name", "description", "status"];
// dtSupplierCategory
const supplier_category_fields = ["id", "name", "description", "status"];

// dtBankAccount
const bank_accounts_fields = ["id", "dtBank_id", "branch", "accNumber", "accName", "initBalance", "balance", "phone", "address", "note", "status", "last_trx_id"];
// dtCustomer
const customer_fields = ["id", "dtCustomerCategory_id", "name", "contact_name", "phone", "address", "description", "email", "district", "route", "documents", "status", "last_trx_id"];
// dtSupplier
const supplier_fields = ["id", "dtSupplierCategory_id", "name", "address", "phone", "contactPersonName", "contactPersonDesignation", "contactPersonPhone", "currency", "status", "last_trx_id"];
// dtWarehouse
const warehouse_fields = ["id", "name", "description", "address", "status", "_default"];

const getFields = function(modelName) {
    switch (modelName) {
        case "dtBank":
            return banks_fields;
        case "dtBankAccount":
            return bank_accounts_fields;
        case "dtCustomer":
            return customer_fields;
        case "dtCustomerCategory":
            return customer_category_fields;
        case "dtExpenseType":
            return expense_type_fields;
        case "dtExtraIncomeType":
            return extra_income_type_fields;
        case "dtMFS":
            return mfs_fields;
        case "dtMFSAccount":
            return mfs_account_fields;
        case "dtPaymentType":
            return payment_type_fields;
        case "dtProductBrand":
            return product_brand_fields;
        case "dtProductCategory":
            return product_category_fields;
        case "dtProductModel":
            return product_model_fields;
        case "dtRoute":
            return route_fields;
        case "dtSupplier":
            return supplier_fields;
        case "dtSupplierCategory":
            return supplier_category_fields;
        case "dtWarehouse":
            return warehouse_fields;            
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
