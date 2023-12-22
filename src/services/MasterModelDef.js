// dtBank
export const banks_fields = ["id", "name", "description", "status", "shortname", "_default", "updated_at"];
// dtCustomerCategory
export const customer_category_fields = ["id", "name", "description", "status", "shortname", "_default", "updated_at"];
// dtExpenseType
export const expense_type_fields = ["id", "name", "description", "status", "shortname", "_default", "updated_at"];
// dtIncomeType
export const extra_income_type_fields = ["id", "name", "description", "status", "shortname", "_default", "updated_at"];
// dtPaymentType
export const payment_type_fields = ["id", "name", "description", "status", "shortname", "_default", "updated_at"];
// dtProductBrand
export const product_brand_fields = ["id", "name", "description", "status", "shortname", "_default", "updated_at"];
// dtProductCategory
export const product_category_fields = ["id", "name", "description", "status", "shortname", "_default", "updated_at"];
// dtProductModel
export const product_model_fields = ["id", "name", "description", "status", "shortname", "_default", "updated_at"];
// dtMFS
export const mfs_fields = ["id", "name", "description", "status", "shortname", "_default", "updated_at"];
// dtMFSAccount
export const mfs_account_fields = ["id", "dtMFS_id", "refNumber", "accName", "initBalance", "balance", "phone", "address", "note", "status", "last_trx_id", "shortname", "_default", "updated_at"];
// dtRoute
export const route_fields = ["id", "name", "description", "status", "shortname", "_default", "updated_at"];
// dtSupplierCategory
export const supplier_category_fields = ["id", "name", "description", "status", "shortname", "_default", "updated_at"];
// dtBankAccount
export const bank_accounts_fields = ["id", "dtBank_id", "branch", "accNumber", "accName", "initBalance", "balance", "phone", "address", "note", "status", "last_trx_id", "shortname", "_default", "updated_at"];
// dtCustomer
export const customer_fields = ["id", "dtCustomerCategory_id", "name", "contact_name", "phone", "address", "description", "email", "district", "route", "documents", "status", "last_trx_id", "shortname", "_default", "updated_at"];
// dtSupplier
export const supplier_fields = ["id", "dtSupplierCategory_id", "name", "address", "phone", "contactPersonName", "contactPersonDesignation", "contactPersonPhone", "currency", "status", "last_trx_id", "shortname", "_default", "updated_at"];
// dtWarehouse
export const warehouse_fields = ["id", "name", "description", "address", "status", "shortname", "_default", "updated_at"];


