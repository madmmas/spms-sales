import React, { useEffect, useRef, useState } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Toast } from 'primereact/toast';


import { ProductService } from '../../../services/ProductService';

import { STOCK_MODEL } from '../../../constants/models';

const StockStatus = () => {

    const modelName = STOCK_MODEL;

    const toast = useRef(null);
    const dt = useRef(null);

    let defaultFilters = {
        fields: ['name', 'code', 'price', 'cost', 'unit', 'current_stock', 'prev_stock', 'total_stock_in', 'total_stock_out', 'low_stock_qty'],
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
    const [dtStockStatus, setStockStatus] = useState(null);
    const [lazyParams, setLazyParams] = useState(defaultFilters);

    const productService = new ProductService();

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

        productService.getAll({ params: JSON.stringify(lazyParams) }).then(data => {
            console.log(data)
            setTotalRecords(data.total);
            setStockStatus(data.rows);
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

    const productNameBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.name}
            </>
        );
    };

    const currentStockBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.current_stock}
            </>
        );
    };

    const prevStockBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.prev_stock}
            </>
        );
    };

    const lowStockQtyBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.low_stock_qty}
            </>
        );
    };

    const totalStockInBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.total_stock_in}
            </>
        );
    };

    const totalStockOutBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.total_stock_out}
            </>
        );
    };

    const totalDamagedStockBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.total_damaged_stock}
            </>
        );
    };

    const costBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.cost}
            </>
        );
    };

    const totalCostBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.cost * rowData.current_stock}
            </>
        );
    };

    const priceBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.price}
            </>
        );
    };

    const totalPriceBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.price * rowData.current_stock}
            </>
        );
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <h5 className="m-0">Current Stock</h5>
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
                        ref={dt} value={dtStockStatus} dataKey="_id" 
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
                        <Column field="name" header="Product Name" filter filterPlaceholder="Search by Product Name" sortable body={productNameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>                        
                        <Column field="current_stock" header="Current Stock" filter filterPlaceholder="Search by Current Stock" sortable body={currentStockBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>                        
                        <Column field="prev_stock" header="Previous Stock" filter filterPlaceholder="Search by Previous Stock" sortable body={prevStockBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>                        
                        <Column field="low_stock_qty" header="Low Stock Qty" filter filterPlaceholder="Search by lowStockQty" sortable body={lowStockQtyBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>                        
                        <Column field="total_stock_in" header="totalStockIn" filter filterPlaceholder="Search by totalStockIn" sortable body={totalStockInBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>                        
                        <Column field="total_stock_out" header="totalStockOut" filter filterPlaceholder="Search by totalStockOut" sortable body={totalStockOutBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>                        
                        {/* <Column field="total_damage_stock" header="totalDamagedStock" filter filterPlaceholder="Search by totalDamagedStock" sortable body={totalDamagedStockBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>                         */}
                        <Column field="cost" header="Unit Cost" filter filterPlaceholder="Search by cost" sortable body={costBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>                        
                        <Column field="total_cost" header="Total Cost" filter filterPlaceholder="Search by cost" sortable body={totalCostBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>                        
                        <Column field="price" header="Trade Price" filter filterPlaceholder="Search by totalTradePrice" sortable body={priceBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>                        
                        <Column field="total_price" header="Total Price" filter filterPlaceholder="Search by totalTradePrice" sortable body={totalPriceBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>                        
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default StockStatus;