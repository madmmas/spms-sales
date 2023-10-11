import AppMenuitem from './AppMenuitem';
import { MenuProvider } from './context/menucontext';

const AppMenu = () => {
    const model = [
        {
            items: [
                { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' },
                { label: 'New Purchase', icon: 'pi pi-fw pi-home', to: '/purchases/new' },
                { label: 'New Sales Order', icon: 'pi pi-fw pi-home', to: '/sales/new' },
            ]
        },
        {
            label: 'Data',
            items: [
                {
                    label: 'Master Data',
                    icon: 'pi pi-fw pi-list',
                    items: [
                        { label: 'Bank Accounts', icon: 'pi pi-fw pi-list', to: '/bank_accounts' },
                        { label: 'MFS Accounts', icon: 'pi pi-fw pi-list', to: '/mfs_accounts' },
                        { label: 'Customers', icon: 'pi pi-fw pi-list', to: '/customers' },
                        { label: 'Employees', icon: 'pi pi-fw pi-list', to: '/employees' },
                        { label: 'Package-Products', icon: 'pi pi-fw pi-list', to: '/packages' },
                        { label: 'Products', icon: 'pi pi-fw pi-list', to: '/products' },
                        { label: 'Suppliers', icon: 'pi pi-fw pi-list', to: '/suppliers' },
                        { label: 'Warehouses', icon: 'pi pi-fw pi-list', to: '/warehouses' },
                    ]
                },
                {
                    label: 'Transactions',
                    icon: 'pi pi-fw pi-list',
                    items: [
                        { label: 'Accounts', icon: 'pi pi-fw pi-list', to: '/accounts' },
                        { label: 'Attendance', icon: 'pi pi-fw pi-list', to: '/attendance' },
                        { label: 'Expenses', icon: 'pi pi-fw pi-list', to: '/expenses' },
                        { label: 'Extra Income', icon: 'pi pi-fw pi-list', to: '/extra_income' },
                        { label: 'Payments', icon: 'pi pi-fw pi-list', to: '/payments' },
                        { label: 'Payroll', icon: 'pi pi-fw pi-list', to: '/payroll' },
                        { label: 'Purchases', icon: 'pi pi-fw pi-list', to: '/purchases' },
                        { label: 'Purchase-Packages', icon: 'pi pi-fw pi-list', to: '/purchase_packages' },
                        { label: 'Sales', icon: 'pi pi-fw pi-list', to: '/sales' },
                        { label: 'Stock', icon: 'pi pi-fw pi-list', to: '/stocks' },
                        { label: 'Transfer Money', icon: 'pi pi-fw pi-list', to: '/transfer' },
                    ]
                },
            ]
        },
        {
            label: 'Reports',
            items: [
                {
                    label: 'Ledger',
                    icon: 'pi pi-fw pi-list',
                    items: [
                        { label: 'Purchase Ledger', icon: 'pi pi-fw pi-list', to: '/ledger/purchase' },
                        { label: 'Sales Ledger', icon: 'pi pi-fw pi-list', to: '/ledger/sales' },
                        { label: 'Supplier Ledger', icon: 'pi pi-fw pi-list', to: '/ledger/supplier' },
                        { label: 'Customer Ledger', icon: 'pi pi-fw pi-list', to: '/ledger/customer' },
                        { label: 'A/C Payable', icon: 'pi pi-fw pi-list', to: '/ledger/accpayable' },
                        { label: 'A/C Receiveable', icon: 'pi pi-fw pi-list', to: '/ledger/accreceivable' },
                        { label: 'Bank', icon: 'pi pi-fw pi-list', to: '/ledger/bank' },
                        { label: 'Cash', icon: 'pi pi-fw pi-list', to: '/ledger/cash' },
                    ]
                }
            ]
        },      
        {
            label: 'Setup',
            items: [
                {
                    label: 'Configurations',
                    icon: 'pi pi-fw pi-list',
                    items: [
                        { label: 'Banks', icon: 'pi pi-fw pi-list', to: '/banks' },
                        { label: 'Customer Category', icon: 'pi pi-fw pi-list', to: '/customer_category' },
                        { label: 'Department', icon: 'pi pi-fw pi-list', to: '/department' },
                        { label: 'Designation', icon: 'pi pi-fw pi-list', to: '/designation' },
                        { label: 'Expense Type', icon: 'pi pi-fw pi-list', to: '/expense_type' },
                        { label: 'Extra Income Type', icon: 'pi pi-fw pi-list', to: '/extra_income_type' },
                        { label: 'Grade', icon: 'pi pi-fw pi-list', to: '/grade' },
                        { label: 'Group', icon: 'pi pi-fw pi-list', to: '/group' },
                        { label: 'MFS Companies', icon: 'pi pi-fw pi-list', to: '/mfs_types' },
                        { label: 'Office Time', icon: 'pi pi-fw pi-list', to: '/office_time' },
                        { label: 'Payment Type', icon: 'pi pi-fw pi-list', to: '/payment_type' },
                        { label: 'Product Category', icon: 'pi pi-fw pi-list', to: '/product_category' },
                        { label: 'Product Brand', icon: 'pi pi-fw pi-list', to: '/product_brand' },
                        { label: 'Product Model', icon: 'pi pi-fw pi-list', to: '/product_model' },
                        { label: 'Route', icon: 'pi pi-fw pi-list', to: '/route' },
                        { label: 'Supplier Category', icon: 'pi pi-fw pi-list', to: '/supplier_category' },
                    ]
                }
            ]
        },
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
