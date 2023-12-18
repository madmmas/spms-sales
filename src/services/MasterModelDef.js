// dtBank
export const banks_fields = ["id", "name", "description", "status"];
// dtCustomerCategory
export const customer_category_fields = ["id", "name", "description", "status"];
// dtExpenseType
export const expense_type_fields = ["id", "name", "description", "status"];
// dtIncomeType
export const extra_income_type_fields = ["id", "name", "description", "status"];
// dtPaymentType
export const payment_type_fields = ["id", "name", "description", "status"];
// dtProductBrand
export const product_brand_fields = ["id", "name", "description", "status"];
// dtProductCategory
export const product_category_fields = ["id", "name", "description", "status"];
// dtProductModel
export const product_model_fields = ["id", "name", "description", "status"];
// dtMFS
export const mfs_fields = ["id", "name", "description", "status"];
// dtMFSAccount
export const mfs_account_fields = ["id", "dtMFS_id", "refNumber", "accName", "initBalance", "balance", "phone", "address", "note", "status", "last_trx_id"];
// dtRoute
export const route_fields = ["id", "name", "description", "status"];
// dtSupplierCategory
export const supplier_category_fields = ["id", "name", "description", "status"];
// dtBankAccount
export const bank_accounts_fields = ["id", "dtBank_id", "branch", "accNumber", "accName", "initBalance", "balance", "phone", "address", "note", "status", "last_trx_id"];
// dtCustomer
export const customer_fields = ["id", "dtCustomerCategory_id", "name", "contact_name", "phone", "address", "description", "email", "district", "route", "documents", "status", "last_trx_id"];
// dtSupplier
export const supplier_fields = ["id", "dtSupplierCategory_id", "name", "address", "phone", "contactPersonName", "contactPersonDesignation", "contactPersonPhone", "currency", "status", "last_trx_id"];
// dtWarehouse
export const warehouse_fields = ["id", "name", "description", "address", "status", "_default"];


