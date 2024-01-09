import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FilterMatchMode } from 'primereact/api';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';

import { getFormattedNumber, exportDataInExcel } from '../../../utils';

import { PRODUCT_MODEL, PRODBRAND_MODEL, PRODMODEL_MODEL, WAREHOUSE_MODEL } from '../../../constants/models';

import { MasterDataDBService } from '../../../services/MasterDataDBService';

const StockStatus = () => {

    const modelName = PRODUCT_MODEL;

    let navigate = useNavigate();

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
            // global: { value: null, matchMode: FilterMatchMode.CONTAINS },
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
    const [dtWarehouses, setDtWarehouses] = useState(null);
    const [dtProductBrands, setDtProductBrands] = useState(null);
    const [dtProductModels, setDtProductModels] = useState(null);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [dtProduct, setProduct] = useState({});
    const [selectedProducts, setSelectedProducts] = useState(null);

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
            masterDataDBService.getAll(WAREHOUSE_MODEL).then(data => {
                setDtWarehouses(data.rows);
            });
            reloadData();
            setLoadCount(loadCount+1);
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
            setLoading(false);
        });
    }

    const reloadData = () => {
        masterDataDBService.getAllUpto(modelName).then(()=> {
            loadLazyData();
        });
    };

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

    // const onGlobalFilterChange = (e) => {
    //     let _lazyParams = { ...lazyParams};
    //     console.log(_lazyParams);

    //     const value = e.target.value;

    //     setGlobalFilterValue(value);

    //     if(value === null || value === undefined) {
    //         return;
    //     }

    //     _lazyParams['filters']['global'].value = value;
    //     _lazyParams['first'] = 0;
    //     setLazyParams(_lazyParams);
    // };

    const openNew = () => {
        navigate("/products/new");
    };

    const editProduct = (dtProduct) => {
        navigate("/products/" + dtProduct.id);
    };

    const confirmDeleteProduct = (dtProduct) => {
        setProduct(dtProduct);
        setDeleteProductDialog(true);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    const deleteSelectedProducts = () => {
        let _dtProducts = dtProducts.filter((val) => !selectedProducts.includes(val));
        setProducts(_dtProducts);
        setDeleteProductsDialog(false);
        setSelectedProducts(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
    };

    const deleteProduct = () => {
        masterDataDBService.delete(modelName, dtProduct.id).then(() => {
            reloadData();
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Product Deleted', life: 3000 });
        });
        setDeleteProductDialog(false);
        setProduct(null);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="flex justify-content-between">
                    <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                </div>
            </React.Fragment>
        );
    };
    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                {/* <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} /> */}
                <Button type="button" icon="pi pi-file-excel" severity="success" rounded onClick={exportExcel} data-pr-tooltip="XLS" />
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

    const dtWarehouse_idBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.dtWarehouse_id_shortname}
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
                {rowData.cost * rowData.current_stock}
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
                    // onChange={(e) => options.filterCallback(e.value, options.index)}
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
        return <Dropdown value={options.value} optionValue="id" optionLabel="name" options={dtProductBrands} onChange={(e) => options.filterApplyCallback(e.value, options.index)} placeholder="Select Brand" className="p-column-filter" showClear />;
    };

    const modelFilterTemplate = (options) => {
        return <Dropdown value={options.value} optionValue="id" optionLabel="name" options={dtProductModels} onChange={(e) => options.filterApplyCallback(e.value, options.index)} placeholder="Select Model" className="p-column-filter" showClear />;
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                {/* <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
                </span> */}
                <h5 className="m-0 ">Stock Status</h5>                
                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter} />
            </div>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editProduct(rowData)} />                
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteProduct(rowData)} />                
            </>
        );
    };

    const deleteProductDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteProduct} />
        </>
    );
    const deleteProductsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductsDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedProducts} />
        </>
    );

    const exportExcel = () => {
        masterDataDBService.getAllProductStock().then(products => {
            exportDataInExcel('products_stock', products);
        });
    };

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

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
                        {/* <Column body={actionBodyTemplate} frozen headerStyle={{ minWidth: '10rem' }}></Column> */}
                        <Column field="name" header="Name" filter filterPlaceholder="Search by name" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="code" header="Code" filter filterPlaceholder="Search by Code" sortable body={codeBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="dtProductBrand_id" header="Brand Name" filter filterPlaceholder="Search by Brand Name" filterElement={brandFilterTemplate} sortable body={brandNameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="dtProductModel_id" header="Model No" filter filterPlaceholder="Search by Model No" filterElement={modelFilterTemplate} sortable body={modelNoBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="part_number" header="Part Number" filter filterPlaceholder="Search by Numebr" sortable body={partNumberBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>  
                        <Column field="current_stock" dataType="numeric" style={{textAlign: 'center'}}  header="Current Stock" filter filterPlaceholder="Search by Current Stock" sortable body={currentStockBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>                        
                        <Column field="low_stock_qty" dataType="numeric" style={{textAlign: 'center'}} header="Low Stock Qty" filter filterPlaceholder="Search by Low Stock Qty" filterElement={lowStockQtyFilterTemplate} sortable body={lowStockQtyBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="prev_stock" dataType="numeric" style={{textAlign: 'center'}}  header="Previous Stock" filter filterPlaceholder="Search by Previous Stock" sortable body={prevStockBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>                        
                        <Column field="total_stock_in" dataType="numeric" style={{textAlign: 'center'}}  header="totalStockIn" filter filterPlaceholder="Search by totalStockIn" sortable body={totalStockInBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>                        
                        <Column field="total_stock_out" dataType="numeric" style={{textAlign: 'center'}}  header="totalStockOut" filter filterPlaceholder="Search by totalStockOut" sortable body={totalStockOutBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>                        
                        {/* <Column field="total_damage_stock" dataType="numeric" style={{textAlign: 'center'}}  header="totalDamagedStock" filter filterPlaceholder="Search by totalDamagedStock" sortable body={totalDamagedStockBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>                         */}
                        <Column field="cost" dataType="numeric" style={{textAlign: 'right'}}  header="Unit Cost" filter filterPlaceholder="Search by Purchase Price" filterElement={costFilterTemplate} sortable body={unitCostBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="total_cost" dataType="numeric" style={{textAlign: 'right'}} header="Total Cost" filter filterPlaceholder="Search by cost" sortable body={totalCostBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>                        
                        <Column field="price" dataType="numeric" style={{textAlign: 'right'}} header="Trade Price" filter filterPlaceholder="Search by Trade Price" filterElement={tradePriceFilterTemplate} sortable body={tradePriceBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="total_price" dataType="numeric" style={{textAlign: 'right'}} header="Total Price" filter filterPlaceholder="Search by totalTradePrice" sortable body={totalPriceBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>                        

                    </DataTable>

                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {dtProduct && (
                                <span>
                                    Are you sure you want to delete <b>{dtProduct.id}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {dtProduct && <span>Are you sure you want to delete the selected items?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default StockStatus;