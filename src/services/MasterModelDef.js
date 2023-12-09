// dtBank
export const banks_fields = ["id", "name", "description", "status", "shortname", "deleted"];
// dtCustomerCategory
export const customer_category_fields = ["id", "name", "description", "status", "shortname", "deleted"];
// dtExpenseType
export const expense_type_fields = ["id", "name", "description", "status", "shortname", "deleted"];
// dtIncomeType
export const extra_income_type_fields = ["id", "name", "description", "status", "shortname", "deleted"];
// dtPaymentType
export const payment_type_fields = ["id", "name", "description", "status", "shortname", "deleted"];
// dtProductBrand
export const product_brand_fields = ["id", "name", "description", "status", "shortname", "deleted"];
// dtProductCategory
export const product_category_fields = ["id", "name", "description", "status", "shortname", "deleted"];
// dtProductModel
export const product_model_fields = ["id", "name", "description", "status", "shortname", "deleted"];
// dtMFS
export const mfs_fields = ["id", "name", "description", "status", "shortname", "deleted"];
// dtMFSAccount
export const mfs_account_fields = ["id", "dtMFS_id", "refNumber", "accName", "initBalance", "balance", "phone", "address", "note", "status", "last_trx_id", "shortname", "deleted"];
// dtRoute
export const route_fields = ["id", "name", "description", "status", "shortname", "deleted"];
// dtSupplierCategory
export const supplier_category_fields = ["id", "name", "description", "status", "shortname", "deleted"];
// dtBankAccount
export const bank_accounts_fields = ["id", "dtBank_id", "branch", "accNumber", "accName", "initBalance", "balance", "phone", "address", "note", "status", "last_trx_id", "shortname", "deleted"];
// dtCustomer
export const customer_fields = ["id", "dtCustomerCategory_id", "name", "contact_name", "phone", "address", "description", "email", "district", "route", "documents", "status", "last_trx_id", "shortname", "deleted"];
// dtSupplier
export const supplier_fields = ["id", "dtSupplierCategory_id", "name", "address", "phone", "contactPersonName", "contactPersonDesignation", "contactPersonPhone", "currency", "status", "last_trx_id", "shortname", "deleted"];
// dtWarehouse
export const warehouse_fields = ["id", "name", "description", "address", "status", "_default", "shortname", "deleted"];


