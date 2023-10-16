import React, { useEffect, useRef, useState } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';

import { RegisterService } from '../../../services/RegisterService';

const DispatchPayment = () => {

    const dt = useRef(null);

    let defaultFilters = {
        fields: ["id", "register_date", "register_details"],
        first: 0,
        rows: 10,
        page: 1,
        sortField: null,
        sortOrder: null,
        filters: {
            'name': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },            
        }
    };

    const [loading, setLoading] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const [lazyParams, setLazyParams] = useState(defaultFilters);

    const [paymentData, setPaymentData] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);

    const registerService = new RegisterService();

    useEffect(() => {
        initFilters();
    }, []);
    
    const clearFilter = () => {
        initFilters();
    }

    const initFilters = () => {
        setLazyParams(defaultFilters);
    }

    useEffect(() => {
        loadLazyData();
    }, [lazyParams]);

    const loadLazyData = async () => {
        setLoading(true);

        registerService.getAll("trxReceivePayment", { params: JSON.stringify(lazyParams) }).then(data => {
            console.log(data)
            setTotalRecords(data.total);
            setPaymentData(data.rows);
            setLoading(false);
        });
    }

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const onPage = (event) => {
        let _lazyParams = { ...lazyParams, ...event };
        setLazyParams(_lazyParams);
    }

    const onSort = (event) => {
        let _lazyParams = { ...lazyParams, ...event };
        setLazyParams(_lazyParams);
    }

    const onFilter = (event) => {
        let _lazyParams = { ...lazyParams, ...event };
        _lazyParams['first'] = 0;
        setLazyParams(_lazyParams);
    }

    const onGlobalFilterChange = (e) => {
        let _lazyParams = { ...lazyParams};
        console.log(_lazyParams);

        const value = e.target.value;

        setGlobalFilterValue(value);

        if(value === null || value === undefined || value === '' || value.length < 1) {
            return;
        }

        _lazyParams['filters']['global'].value = value;
        _lazyParams['first'] = 0;
        setLazyParams(_lazyParams);

    };

    const expenseTypeFilterTemplate = (options) => {
        // return <Dropdown value={options.value} optionValue="_id" optionLabel="name" options={expenseType} onChange={(e) => options.filterCallback(e.value, options.index)} placeholder="Select One" className="p-column-filter" showClear />;
    };

    const expenseBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.dtExpenseType_id_shortname}
            </>
        );
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <div>
                <Button type="button" icon="pi pi-filter-slash" label="Refresh" outlined onClick={clearFilter} />
                <Button label="Export" icon="pi pi-upload" className="p-button-help" outlined onClick={exportCSV} />
                </div>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
                </span>
            </div>
        );
    };

    return (
        <div className="grid crud-demo">
            
            <div className="col-12">
                <div className="card">
                    
                    <DataTable
                        ref={dt} value={paymentData} dataKey="_id" 
                        className="datatable-responsive" responsiveLayout="scroll"
                        lazy loading={loading} rows={lazyParams.rows}
                        onSort={onSort} sortField={lazyParams.sortField} sortOrder={lazyParams.sortOrder}
                        onFilter={onFilter} filters={lazyParams.filters} filterDisplay="menu"
                        scrollable columnResizeMode="expand" resizableColumns showGridlines
                        paginator totalRecords={totalRecords} onPage={onPage} first={lazyParams.first}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" 
                        rowsPerPageOptions={[5,10,25,50]}
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                        emptyMessage="No data found." header={renderHeader} 
                    >
                        <Column field="payment_no" header="Trx No" filter filterElement={expenseTypeFilterTemplate} sortable  headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="payment_date" header="Payment Date" filter filterElement={expenseTypeFilterTemplate} sortable  headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="payment_method" header="Payment Method" filter filterElement={expenseTypeFilterTemplate} sortable  headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="cash_amount" header="Payment Amount" filter filterElement={expenseTypeFilterTemplate} sortable  headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="mfs_amount" header="Payment Amount" filter filterElement={expenseTypeFilterTemplate} sortable  headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="bank_amount" header="Payment Amount" filter filterElement={expenseTypeFilterTemplate} sortable  headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="amount" header="Payment Amount" filter filterElement={expenseTypeFilterTemplate} sortable  headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="party_name" header="Party" filter filterElement={expenseTypeFilterTemplate} sortable  headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="bank_name" header="Bank Account" filter filterElement={expenseTypeFilterTemplate} sortable  headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default DispatchPayment;