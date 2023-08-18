import * as moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Toast } from 'primereact/toast';

import { RegisterService } from '../../../services/RegisterService';
import { STOCK_IN_MODEL } from '../../../constants/models';

const StockIn = () => {

    const modelName = STOCK_IN_MODEL;

    const toast = useRef(null);
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
    const [totalRecords, setTotalRecords] = useState(0);
    const [dtStockIn, setStockIn] = useState(null);
    const [lazyParams, setLazyParams] = useState(defaultFilters);

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

    const loadLazyData = () => {
        setLoading(true);

        registerService.getAll(modelName, { params: JSON.stringify(lazyParams) }).then(data => {
            console.log(data)
            setTotalRecords(data.total);
            setStockIn(data.rows);
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
        return moment(date).format('DD/MM/YYYY');
        // let d = new Date(parseInt(date));
        // return d.toDateString();
    }

    const dateBodyTemplate = (rowData) => {
        return (
            <>
                {getDate(rowData.register_date)}
            </>
        );
    };

    const nameBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.product_name}
            </>
        );
    };

    const voucherNoTemplate = (rowData) => {
        return (
            <>
                {rowData.voucher_no}
            </>
        );
    };
    const operationTypeTemplate = (rowData) => {
        return (
            <>
                {rowData.operation_type}
            </>
        );
    };

    const quantityBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.qty}
            </>
        );
    };

    const unitCostBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.unit_cost}
            </>
        );
    };

    const totalCostBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.unit_cost*rowData.qty}
            </>
        );
    };

    const tradePriceBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.trade_price}
            </>
        );
    };

    const totalPriceBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.trade_price*rowData.qty}
            </>
        );
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <h5 className="m-0">Stock In</h5>
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
                        ref={dt} value={dtStockIn} dataKey="_id" 
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
                        <Column field="date" header="Transaction Date" filter filterPlaceholder="Search by name" sortable body={dateBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>                        
                        <Column field="voucher_no" header="Voucher No" filter filterPlaceholder="Search by name" sortable body={voucherNoTemplate} headerStyle={{ minWidth: '15rem' }}></Column>                        
                        <Column field="operation_type" header="Opt" filter filterPlaceholder="Search by name" sortable body={operationTypeTemplate} headerStyle={{ minWidth: '15rem' }}></Column>                        
                        <Column field="product_name" header="Product Name" filter filterPlaceholder="Search by name" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>                        
                        <Column field="quantity" header="Quantity" filter filterPlaceholder="Search by name" sortable body={quantityBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>                        
                        <Column field="unit_cost" header="Unit Cost" filter filterPlaceholder="Search by totalPurchaseCost" sortable body={unitCostBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>                        
                        <Column field="total_unit_cost" header="Total Cost Value" filter filterPlaceholder="Search by totalPurchaseCost" sortable body={totalCostBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>                        
                        <Column field="trade_price" header="Trade Price" filter filterPlaceholder="Search by totalTradePrice" sortable body={tradePriceBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>                        
                        <Column field="total_trade_price" header="Total Trade Value" filter filterPlaceholder="Search by totalTradePrice" sortable body={totalPriceBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>                        
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default StockIn;