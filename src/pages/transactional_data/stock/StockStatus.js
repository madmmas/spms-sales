import React, { useEffect, useRef, useState } from 'react';
import { FilterMatchMode } from 'primereact/api';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';

import { getFormattedNumber, exportSheetDataInExcel } from '../../../utils';

import { PRODUCT_MODEL, PRODBRAND_MODEL, PRODMODEL_MODEL } from '../../../constants/models';

import { MasterDataDBService } from '../../../services/MasterDataDBService';

const StockStatus = () => {

    const modelName = PRODUCT_MODEL;

    const toast = useRef(null);
    const dt = useRef(null);

    let defaultFilters = {
        fields: ['id', 'name', 'dtCategory_id', 'dtWarehouse_id', 'code', 'dtProductBrand_id', 'dtProductModel_id', 'part_number', 'unit', 'cost', 'price', 'active'],
        first: 0,
        rows: 10,
        page: 1,
        sortField: null,
        sortOrder: null,
        filters: {
            name: { value: null, matchMode: FilterMatchMode.CONTAINS },
            dtCategory_id: { value: 1, matchMode: FilterMatchMode.EQUALS },
            dtWarehouse_id: { value: null, matchMode: FilterMatchMode.EQUALS },
            code: { value: null, matchMode: FilterMatchMode.CONTAINS },
            dtProductBrand_id: { value: null, matchMode: FilterMatchMode.EQUALS },
            dtProductModel_id: { value: null, matchMode: FilterMatchMode.EQUALS },
            part_number: { value: null, matchMode: FilterMatchMode.CONTAINS },
            unit: { value: null, matchMode: FilterMatchMode.CONTAINS },
            cost: { value: null, matchMode: FilterMatchMode.GREATER_THAN_OR_EQUAL_TO },
            price: { value: null, matchMode: FilterMatchMode.EQUALS },
            low_stock_qty: { value: null, matchMode: FilterMatchMode.EQUALS },
            min_trade_price: { value: null, matchMode: FilterMatchMode.EQUALS },
            active: { value: null, matchMode: FilterMatchMode.EQUALS },
        }
    };

    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [dtProducts, setProducts] = useState(null);
    const [dtProductBrands, setDtProductBrands] = useState(null);
    const [dtProductModels, setDtProductModels] = useState(null);

    const [totalStock, setTotalStock] = useState(0);
    const [totalStockCost, setTotalStockCost] = useState(0);
    const [totalStockPrice, setTotalStockPrice] = useState(0);

    const [lazyParams, setLazyParams] = useState(defaultFilters);
    const [loadCount, setLoadCount] = useState(0);

    const masterDataDBService = new MasterDataDBService();

    const clearFilter = () => {
        initFilters();
    }

    const initFilters = () => {
        setLazyParams(defaultFilters);
    }

    useEffect(() => {
        setLoadCount(loadCount+1);
    }, []);

    useEffect(() => {
        if(loadCount==1){
            masterDataDBService.getAll(PRODBRAND_MODEL).then(data => {
                setDtProductBrands(data.rows);
            });
            masterDataDBService.getAll(PRODMODEL_MODEL).then(data => {
                setDtProductModels(data.rows);
            });
            reloadData();
            setLoadCount(loadCount+1);
            console.log("getTotalStock");  
        }
    }, [loadCount]);

    useEffect(() => {
        if(loadCount>1){
            loadLazyData();
        }
    }, [lazyParams]);

    const loadLazyData = () => {
        setLoading(true);

        if(lazyParams.filters.active.value === true) {
            lazyParams.filters.active.value = 1;
        } else if(lazyParams.filters.active.value === false) {
            lazyParams.filters.active.value = 0;
        }

        masterDataDBService.getAll(modelName, lazyParams).then(data => {
            setTotalRecords(data.total);
            setProducts(data.rows);
            console.log(data.rows)
            setLoading(false);
        });
    }

    const reloadData = () => {
        masterDataDBService.getAllUpto(modelName).then(()=> {
            loadLazyData();
            masterDataDBService.getTotalStock().then(data => {
                console.log("getTotalStock", data);
                setTotalStock(data.stock);
                setTotalStockCost(data.total_cost);
                setTotalStockPrice(data.total_price);
            });
        });
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

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button type="button" label="Download Stock Report" icon="pi pi-file-excel" severity="success" rounded onClick={exportExcel} data-pr-tooltip="XLS" />
            </React.Fragment>
        );
    };

    const codeBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.code}
            </>
        );
    };

    const nameBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.name}
            </>
        );
    };

    const brandNameBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.dtProductBrand_id_shortname}
            </>
        );
    };

    const modelNoBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.dtProductModel_id_shortname}
            </>
        );
    };

    const partNumberBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.part_number}
            </>
        );
    };

    const lowStockQtyBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.lowStockQty||0}
            </>
        );
    };

    const unitCostBodyTemplate = (rowData) => {
        return (
            <>
                {getFormattedNumber(rowData.cost||0)}
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

    const totalStockInBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.total_stock_in}
            </>
        );
    };

    const tradePriceBodyTemplate = (rowData) => {
        return (
            <>
                {getFormattedNumber(rowData.price||0)}
            </>
        );
    };

    const totalCostBodyTemplate = (rowData) => {
        return (
            <>
                {getFormattedNumber(rowData.cost * rowData.current_stock)}
            </>
        );
    };

    const totalPriceBodyTemplate = (rowData) => {
        return (
            <>
                {getFormattedNumber(rowData.price * rowData.current_stock)}
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

    const tradePriceFilterTemplate = (options) => {
        return <InputNumber value={options.value} 
                    onChange={(e) => options.filterApplyCallback(e.value)} 
                    min={0} maxFractionDigits={2}
                />;
    };

    const costFilterTemplate = (options) => {
        return <InputNumber value={options.value} onChange={(e) => options.filterApplyCallback(e.value, options.index)} />;
    };

    const lowStockQtyFilterTemplate = (options) => {
        return <InputNumber value={options.value} onChange={(e) => options.filterApplyCallback(e.value, options.index)} />;
    };

    const brandFilterTemplate = (options) => {
        return <Dropdown value={options.value} optionValue="id" optionLabel="name" options={dtProductBrands} onChange={(e) => options.filterApplyCallback(e.value, options.index)} placeholder="Select Brand" className="p-column-filter" />;
    };

    const modelFilterTemplate = (options) => {
        return <Dropdown value={options.value} optionValue="id" optionLabel="name" options={dtProductModels} onChange={(e) => options.filterApplyCallback(e.value, options.index)} placeholder="Select Model" className="p-column-filter" />;
    };

    const renderHeader = () => {
        let stockStr1 = 'Total Stock: ' +  getFormattedNumber(totalStock);
        let stockStr2 = 'Total Cost: ' + getFormattedNumber(totalStockCost);
        let stockStr3 = 'Total Stock Price: ' + getFormattedNumber(totalStockPrice);
        return (
            <div className="flex justify-content-between">
                <h5 className="m-0 ">Stock Status</h5>                
                <Badge severity="warning" value={stockStr1}></Badge>
                <Badge value={stockStr2}></Badge>
                <Badge value={stockStr3}></Badge>
                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter} />
            </div>
        );
    };

    const exportExcel = () => {
        masterDataDBService.getAllUpto(modelName).then(()=> {
            loadLazyData();
            masterDataDBService.getAllProductStockAndBrandStock().then(data => {
                exportSheetDataInExcel('products_stock', [
                    {name: 'Product Stock', data: data.productStock},
                    {name: 'Brand Stock', data: data.brandStock}
                ]);
            });
        });
    };

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt} value={dtProducts} dataKey="id" 
                        className="datatable-responsive" responsiveLayout="scroll"
                        lazy loading={loading} rows={lazyParams.rows}
                        onSort={onSort} sortField={lazyParams.sortField} sortOrder={lazyParams.sortOrder}
                        onFilter={onFilter} filters={lazyParams.filters} filterDisplay="row"
                        scrollable columnResizeMode="expand" resizableColumns showGridlines
                        paginator totalRecords={totalRecords} onPage={onPage} first={lazyParams.first}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" 
                        rowsPerPageOptions={[5,10,25,50]}
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                        emptyMessage="No data found." header={renderHeader} 
                    >
                        <Column field="name" header="Name" filter filterPlaceholder="Search by name" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="code" header="Code" filter filterPlaceholder="Search by Code" sortable body={codeBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="dtProductBrand_id" header="Brand Name" filter filterPlaceholder="Search by Brand Name" filterElement={brandFilterTemplate} sortable body={brandNameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="dtProductModel_id" header="Model No" filter filterPlaceholder="Search by Model No" filterElement={modelFilterTemplate} sortable body={modelNoBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="part_number" header="Part Number" filter filterPlaceholder="Search by Numebr" sortable body={partNumberBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="prev_stock" dataType="numeric" style={{textAlign: 'center'}}  header="Closing/Previous Stock" filter filterPlaceholder="Search by Previous Stock" sortable body={prevStockBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="unit" style={{textAlign: 'center'}}  header="Unit" filter filterPlaceholder="Search by Unit" sortable headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="price" dataType="numeric" style={{textAlign: 'right'}} header="Unit Trade Price" filter filterPlaceholder="Search by Trade Price" filterElement={tradePriceFilterTemplate} sortable body={tradePriceBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="cost" dataType="numeric" style={{textAlign: 'right'}}  header="Unit Cost" filter filterPlaceholder="Search by Purchase Price" filterElement={costFilterTemplate} sortable body={unitCostBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="total_cost" dataType="numeric" style={{textAlign: 'right'}} header="Total Cost" filter filterPlaceholder="Search by cost" sortable body={totalCostBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>                        
                        <Column field="total_price" dataType="numeric" style={{textAlign: 'right'}} header="Total Trade Price" filter filterPlaceholder="Search by totalTradePrice" sortable body={totalPriceBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="current_stock" dataType="numeric" style={{textAlign: 'center'}}  header="Current Stock" filter filterPlaceholder="Search by Current Stock" sortable body={currentStockBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>                        
                        <Column field="low_stock_qty" dataType="numeric" style={{textAlign: 'center'}} header="Low Stock Qty" filter filterPlaceholder="Search by Low Stock Qty" filterElement={lowStockQtyFilterTemplate} sortable body={lowStockQtyBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>                        
                        <Column field="total_stock_in" dataType="numeric" style={{textAlign: 'center'}}  header="Total Stock-In" filter filterPlaceholder="Search by Total Stock-In" sortable body={totalStockInBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>                        
                        <Column field="total_stock_out" dataType="numeric" style={{textAlign: 'center'}}  header="Total Stock-Out" filter filterPlaceholder="Search by Total Stock-Out" sortable body={totalStockOutBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>                        
                        {/* <Column field="total_damage_stock" dataType="numeric" style={{textAlign: 'center'}}  header="totalDamagedStock" filter filterPlaceholder="Search by totalDamagedStock" sortable body={totalDamagedStockBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column> */}
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default StockStatus;