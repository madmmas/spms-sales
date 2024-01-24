const banks_ui_config = {
    dialogTitle: "Bank",
    headerTitle: "Manage Banks",
    createMsg: "Bank created successfully",
    updateMsg: "Bank updated successfully",
    deleteMsg: "Bank deleted successfully",
}
const customer_category_ui_config = {
    dialogTitle: "Customer Category",
    headerTitle: "Manage Customer Categories",
    createMsg: "Customer Category created successfully",
    updateMsg: "Customer Category updated successfully",
    deleteMsg: "Customer Category deleted successfully",
}
const expense_type_ui_config = {
    dialogTitle: "Expense Type",
    headerTitle: "Manage Expense Types",
    createMsg: "Expense Type created successfully",
    updateMsg: "Expense Type updated successfully",
    deleteMsg: "Expense Type deleted successfully",
}
const extra_income_type_ui_config = {
    dialogTitle: "Extra Income Type",
    headerTitle: "Manage Extra Income Types",
    createMsg: "Extra Income Type created successfully",
    updateMsg: "Extra Income Type updated successfully",
    deleteMsg: "Extra Income Type deleted successfully",
}
const payment_type_ui_config = {
    dialogTitle: "Payment Type",
    headerTitle: "Manage Payment Types",
    createMsg: "Payment Type created successfully",
    updateMsg: "Payment Type updated successfully",
}
const product_brand_ui_config = {
    dialogTitle: "Product Brand",
    headerTitle: "Manage Product Brands",
    createMsg: "Product Brand created successfully",
    updateMsg: "Product Brand updated successfully",
    deleteMsg: "Product Brand deleted successfully",
}
const product_category_ui_config = {
    dialogTitle: "Product Category",
    headerTitle: "Manage Product Categories",
    createMsg: "Product Category created successfully",
    updateMsg: "Product Category updated successfully",
    deleteMsg: "Product Category deleted successfully",
}
const product_model_ui_config = {
    dialogTitle: "Product Model",
    headerTitle: "Manage Product Models",
    createMsg: "Product Model created successfully",
    updateMsg: "Product Model updated successfully",
    deleteMsg: "Product Model deleted successfully",
}
const mfs_ui_config = {
    dialogTitle: "MFS",
    headerTitle: "Manage MFS",
    createMsg: "MFS created successfully",
    updateMsg: "MFS updated successfully",
    deleteMsg: "MFS deleted successfully",
}
const route_ui_config = {
    dialogTitle: "Route",
    headerTitle: "Manage Routes",
    createMsg: "Route created successfully",
    updateMsg: "Route updated successfully",
    deleteMsg: "Route deleted successfully",
}

const supplier_category_ui_config = {
    dialogTitle: "Supplier Category",
    headerTitle: "Manage Supplier Categories",
    createMsg: "Supplier Category created successfully",
    updateMsg: "Supplier Category updated successfully",
    deleteMsg: "Supplier Category deleted successfully",
}

const courier_ui_config = {
    dialogTitle: "Courier",
    headerTitle: "Manage Courier",
    createMsg: "Courier created successfully",
    updateMsg: "Courier updated successfully",
    deleteMsg: "Courier deleted successfully",
}

const default_ui_config = {
    dialogTitle: "Data",
    headerTitle: "Manage Data",
    createMsg: "Data created successfully",
    updateMsg: "Data updated successfully",
    deleteMsg: "Data deleted successfully",
}

export const getModelDef = (modelName) => {
    switch(modelName) {
        case "dtBank":
            return banks_ui_config;
        case "dtCustomerCategory":
            return customer_category_ui_config;
        case "dtExpenseType":
            return expense_type_ui_config;
        case "dtIncomeType":
            return extra_income_type_ui_config;
        case "dtPaymentType":
            return payment_type_ui_config;
        case "dtProductBrand":
            return product_brand_ui_config;
        case "dtProductCategory":
            return product_category_ui_config;
        case "dtProductModel":
            return product_model_ui_config;
        case "dtMFS":
            return mfs_ui_config;
        case "dtRoute":
            return route_ui_config;
        case "dtSupplierCategory":
            return supplier_category_ui_config;
        case "dtCourier":
            return courier_ui_config;
        default:
            return default_ui_config;
    }
}
