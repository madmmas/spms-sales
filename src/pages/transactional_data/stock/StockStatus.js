import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';

import { HRService } from '../../../services/HRService';
import { TransactionService } from '../../../services/TransactionService';
import { STOCK_MODEL } from '../../../constants/models';

const StockStatus = () => {

    const modelName = STOCK_MODEL;

    const toast = useRef(null);
    const dt = useRef(null);

    let defaultFilters = {
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
    const hrManagementService = new HRService();

    let loadLazyTimeout = null;

    const transactionService = new TransactionService();

    useEffect(() => {
        initFilters();
        // transactionService.getAllWithoutParams(BANK_MODEL).then(data => {
        //     setStockStatus(data);
        // });
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

        if (loadLazyTimeout) {
            clearTimeout(loadLazyTimeout);
        }

        loadLazyTimeout = setTimeout(() => {
            hrManagementService.getAll(modelName, { params: JSON.stringify(lazyParams) }).then(data => {
                console.log(data)
                setTotalRecords(data.total);
                setStockStatus(data.rows);
                setLoading(false);
            });
        }, Math.random() * 500 );
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
                {rowData.dtProduct_id_shortname}
            </>
        );
    };
    const currentStockBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.currentStock}
            </>
        );
    };

    const lowStockQtyBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.lowStockQty}
            </>
        );
    };

    const totalStockInBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.totalStockIn}
            </>
        );
    };

    const totalStockOutBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.totalStockOut}
            </>
        );
    };

    const totalDamagedStockBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.totalDamagedStock}
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

    const totalTradePriceBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.totalTradePrice}
            </>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <h5 className="m-0">Current Stock</h5>
                <Button type="button" icon="pi pi-filter-slash" label="Refresh" className="p-button-outlined" onClick={clearFilter} />
            </div>
        )
    }

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" right={rightToolbarTemplate}></Toolbar>

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
                        <Column field="dtProduct_id" header="Product Name" filter filterPlaceholder="Search by Product Name" sortable body={productNameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>                        
                        <Column field="currentStock" header="currentStock" filter filterPlaceholder="Search by currentStock" sortable body={currentStockBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>                        
                        <Column field="lowStockQty" header="lowStockQty" filter filterPlaceholder="Search by lowStockQty" sortable body={lowStockQtyBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>                        
                        <Column field="totalStockIn" header="totalStockIn" filter filterPlaceholder="Search by totalStockIn" sortable body={totalStockInBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>                        
                        <Column field="totalStockOut" header="totalStockOut" filter filterPlaceholder="Search by totalStockOut" sortable body={totalStockOutBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>                        
                        <Column field="totalDamagedStock" header="totalDamagedStock" filter filterPlaceholder="Search by totalDamagedStock" sortable body={totalDamagedStockBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>                        
                        <Column field="totalPurchaseCost" header="totalPurchaseCost" filter filterPlaceholder="Search by totalPurchaseCost" sortable body={totalPurchaseCostBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>                        
                        <Column field="totalTradePrice" header="totalTradePrice" filter filterPlaceholder="Search by totalTradePrice" sortable body={totalTradePriceBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>                        
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default StockStatus;