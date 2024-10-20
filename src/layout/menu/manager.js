const menu = [
    {
        items: [
            { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' },
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
                    { label: 'Customers', icon: 'pi pi-fw pi-list', to: '/customers' },
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
                    { label: 'Expenses', icon: 'pi pi-fw pi-list', to: '/expenses' },
                    { label: 'Extra Income', icon: 'pi pi-fw pi-list', to: '/extra_income' },
                    { label: 'Payments', icon: 'pi pi-fw pi-list', to: '/payments' },
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
            { label: 'Cash flow', icon: 'pi pi-fw pi-list', to: '/report/cashflow' },
            {
                label: 'Ledger',
                icon: 'pi pi-fw pi-list',
                items: [
                    { label: 'Sales Ledger', icon: 'pi pi-fw pi-list', to: '/ledger/sales' },
                    { label: 'Supplier Ledger', icon: 'pi pi-fw pi-list', to: '/ledger/supplier' },
                    { label: 'Customer Ledger', icon: 'pi pi-fw pi-list', to: '/ledger/customer' },
                    { label: 'Bank Ledger', icon: 'pi pi-fw pi-list', to: '/ledger/bank' },
                    { label: 'MFS Ledger', icon: 'pi pi-fw pi-list', to: '/ledger/mfs' },
                    { label: 'Cash Ledger', icon: 'pi pi-fw pi-list', to: '/ledger/cash' },
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
                    { label: 'Courier', icon: 'pi pi-fw pi-list', to: '/courier' },
                    { label: 'Expense Type', icon: 'pi pi-fw pi-list', to: '/expense_type' },
                    { label: 'Extra Income Type', icon: 'pi pi-fw pi-list', to: '/extra_income_type' },
                ]
            }
        ]
    },
];

export default menu;