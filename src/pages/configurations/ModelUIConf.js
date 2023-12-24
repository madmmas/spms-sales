const banks_ui_config = {
    headerTitle: "Manage Banks",
}
const customer_category_ui_config = {
    headerTitle: "Manage Customer Categories",
}
const expense_type_ui_config = {
    headerTitle: "Manage Expense Types",
}
const extra_income_type_ui_config = {
    headerTitle: "Manage Extra Income Types",
}
const payment_type_ui_config = {
    headerTitle: "Manage Payment Types",
}
const product_brand_ui_config = {
    headerTitle: "Manage Product Brands",
}
const product_category_ui_config = {
    headerTitle: "Manage Product Categories",
}
const product_model_ui_config = {
    headerTitle: "Manage Product Models",
}
const mfs_ui_config = {
    headerTitle: "Manage MFS",
}
const route_ui_config = {
    headerTitle: "Manage Routes",
}
const supplier_category_ui_config = {
    headerTitle: "Manage Supplier Categories",
}

const default_ui_config = {
    headerTitle: "Manage Data",
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
        default:
            return default_ui_config;
    }
}
