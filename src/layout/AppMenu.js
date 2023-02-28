import AppMenuitem from './AppMenuitem';
import { MenuProvider } from './context/menucontext';

const AppMenu = () => {
    const model = [
        {
            items: [
                { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' },
                { label: 'POS', icon: 'pi pi-fw pi-home', to: '/pos' },
            ]
        },
        {
            label: 'Data',
            items: [
                {
                    label: 'Master Data',
                    icon: 'pi pi-fw pi-list',
                    items: [
                        { label: 'Employees', icon: 'pi pi-fw pi-list', to: '/employees' },
                        { label: 'Suppliers', icon: 'pi pi-fw pi-list', to: '/suppliers' },
                        { label: 'Customers', icon: 'pi pi-fw pi-list', to: '/customers' },
                        { label: 'Products', icon: 'pi pi-fw pi-list', to: '/products' },
                        { label: 'Packages', icon: 'pi pi-fw pi-list', to: '/packages' },
                        { label: 'Banks', icon: 'pi pi-fw pi-list', to: '/banks' },
                        { label: 'Cash', icon: 'pi pi-fw pi-list', to: '/cash' },
                        { label: 'Warehouses', icon: 'pi pi-fw pi-list', to: '/warehouses' },
                    ]
                },
                {
                    label: 'Transactional Data',
                    icon: 'pi pi-fw pi-list',
                    items: [
                        { label: 'Sales', icon: 'pi pi-fw pi-list', to: '/sales' },
                        { label: 'Purchases', icon: 'pi pi-fw pi-list', to: '/purchases' },
                        { label: 'Stock', icon: 'pi pi-fw pi-list', to: '/stocks' },
                        { label: 'Damaged Goods', icon: 'pi pi-fw pi-list', to: '/damaged_goods' },
                        { label: 'Expenses', icon: 'pi pi-fw pi-list', to: '/expenses' },
                        { label: 'Extra Income', icon: 'pi pi-fw pi-list', to: '/extra_income' },
                        { label: 'Bank Transaction', icon: 'pi pi-fw pi-list', to: '/bank_transation' },
                        { label: 'Attendance', icon: 'pi pi-fw pi-list', to: '/attendance' },
                        { label: 'Payroll', icon: 'pi pi-fw pi-list', to: '/payroll' },
                    ]
                },
            ]
        },
        {
            label: 'Setup',
            items: [
                {
                    label: 'Configurations',
                    icon: 'pi pi-fw pi-list',
                    items: [
                        { label: 'Customer Category', icon: 'pi pi-fw pi-list', to: '/customer_category' },
                        { label: 'Supplier Category', icon: 'pi pi-fw pi-list', to: '/supplier_category' },
                        { label: 'Product Category', icon: 'pi pi-fw pi-list', to: '/product_category' },
                        { label: 'Designation', icon: 'pi pi-fw pi-list', to: '/designation' },
                        { label: 'Office Time', icon: 'pi pi-fw pi-list', to: '/office_time' },
                        { label: 'Department', icon: 'pi pi-fw pi-list', to: '/department' },
                        { label: 'Payment Type', icon: 'pi pi-fw pi-list', to: '/payment_type' },
                        { label: 'Grade', icon: 'pi pi-fw pi-list', to: '/grade' },
                        { label: 'Group', icon: 'pi pi-fw pi-list', to: '/group' },
                        { label: 'Expense Type', icon: 'pi pi-fw pi-list', to: '/expense_type' },
                    ]
                },
                {
                    label: 'Demo',
                    icon: 'pi pi-fw pi-list',
                    items: [
                        { label: 'Demo Data', icon: 'pi pi-fw pi-list', to: '/demodata' },
                        { label: 'Demo Form', icon: 'pi pi-fw pi-list', to: '/form' },
                        { label: 'Demo Crud', icon: 'pi pi-fw pi-list', to: '/crud' },
                        { label: 'About', icon: 'pi pi-fw pi-home', to: '/about' },
                    ]
                },
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
