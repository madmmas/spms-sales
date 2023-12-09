import * as moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Toast } from 'primereact/toast';

import { TransactionService } from '../../../services/TransactionService';
import { ACC_RECEIVABLE } from '../../../constants/models';

const ACRecievable = () => {

    const modelName = ACC_RECEIVABLE;

    const toast = useRef(null);
    const dt = useRef(null);

    let defaultFilters = {
        fields: [],
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
    const [totalRecords, setTotalRecords] = useState(0);
    const [dtACRecievable, setACRecievable] = useState(null);
    const [lazyParams, setLazyParams] = useState(defaultFilters);

    const transactionService = new TransactionService();

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

    const loadLazyData = () => {
        setLoading(true);

        transactionService.getAll(modelName, { params: JSON.stringify(lazyParams) }).then(data => {
            console.log(data)
            setTotalRecords(data.total);
            setACRecievable(data.rows);
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

    const getDate = (date) => {
        return moment(parseInt(date)).format('DD/MM/YYYY hh:mm:ss');
    }

    const dateBodyTemplate = (rowData) => {
        return (
            <>
                {getDate(rowData.date)}
            </>
        );
    };

    const dtCustomer_idBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.dtCustomer_id}
            </>
        );
    };

    const trxSales_idBodyTemplate = (rowData) => {
        return (
            <>
            <a href={`#/transactional_data/sales/${rowData.trxSales_id}`}>
                {rowData.trxSales_id}
            </a>
            </>
        );
    };

    const amountBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.amount}
            </>
        );
    };

    const totalPurchaseCostBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.totalPurchaseCost}
            </>
        );
    };

    const dueAmountBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.dueAmount}
            </>
        );
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <h5 className="m-0">AC Recievable</h5>
                <div className="p-toolbar-group-right">
                    <Button type="button" icon="pi pi-filter-slash" label="Refresh" className="p-button-outlined" onClick={clearFilter} />
                    <Button label="Export" icon="pi pi-upload" className="p-button-help m-2" onClick={exportCSV} />
                </div>
            </div>
        )
    }

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <DataTable
                        ref={dt} value={dtACRecievable} dataKey="id" 
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
                        <Column field="date" header="Transaction Datetime" filter filterPlaceholder="Search by name" sortable body={dateBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>                        
                        <Column field="trxSales_id" header="Sales Ref" filter filterPlaceholder="Search by Sales Ref" sortable body={trxSales_idBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>                        
                        <Column field="dtCustomer_id" header="Customer Ref" filter filterPlaceholder="Search by name" sortable body={dtCustomer_idBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>                        
                        <Column field="amount" header="amount" filter filterPlaceholder="Search by name" sortable body={amountBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>                        
                        <Column field="dueAmount" header="dueAmount" filter filterPlaceholder="Search by dueAmount" sortable body={dueAmountBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>                        
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default ACRecievable;