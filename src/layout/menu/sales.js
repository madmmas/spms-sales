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
                label: 'Transactions',
                icon: 'pi pi-fw pi-list',
                items: [
                    { label: 'Sales', icon: 'pi pi-fw pi-list', to: '/sales' },
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
                    { label: 'Customer Ledger', icon: 'pi pi-fw pi-list', to: '/ledger/customer' },
                ]
            }
        ]
    },      
    // {
    //     label: 'Setup',
    //     items: [
    //         {
    //             label: 'Configurations',
    //             icon: 'pi pi-fw pi-list',
    //             items: [
    //                 // { label: 'Banks', icon: 'pi pi-fw pi-list', to: '/banks' },
    //                 // { label: 'Courier', icon: 'pi pi-fw pi-list', to: '/courier' },
    //                 // { label: 'Customer Category', icon: 'pi pi-fw pi-list', to: '/customer_category' },
    //                 // // { label: 'Department', icon: 'pi pi-fw pi-list', to: '/department' },
    //                 // // { label: 'Designation', icon: 'pi pi-fw pi-list', to: '/designation' },
    //                 // { label: 'Expense Type', icon: 'pi pi-fw pi-list', to: '/expense_type' },
    //                 // { label: 'Extra Income Type', icon: 'pi pi-fw pi-list', to: '/extra_income_type' },
    //                 // // { label: 'Grade', icon: 'pi pi-fw pi-list', to: '/grade' },
    //                 // // { label: 'Group', icon: 'pi pi-fw pi-list', to: '/group' },
    //                 // { label: 'MFS Companies', icon: 'pi pi-fw pi-list', to: '/mfs_types' },
    //                 // // { label: 'Office Time', icon: 'pi pi-fw pi-list', to: '/office_time' },
    //                 // { label: 'Payment Type', icon: 'pi pi-fw pi-list', to: '/payment_type' },
    //                 // { label: 'Product Brand', icon: 'pi pi-fw pi-list', to: '/product_brand' },
    //                 // { label: 'Product Model', icon: 'pi pi-fw pi-list', to: '/product_model' },
    //                 // { label: 'Route', icon: 'pi pi-fw pi-list', to: '/route' },
    //                 // { label: 'Supplier Category', icon: 'pi pi-fw pi-list', to: '/supplier_category' },
    //             ]
    //         }
    //     ]
    // },
];

export default menu;