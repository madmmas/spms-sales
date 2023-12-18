import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { classNames } from 'primereact/utils';
import { FilterMatchMode } from 'primereact/api';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';

import { PRODUCT_MODEL, PRODBRAND_MODEL, PRODMODEL_MODEL } from '../../../constants/models';

// import { ProductService } from '../../../services/ProductService';
import { MasterDataDBService } from '../../../services/MasterDataDBService';

const List = () => {

    const modelName = PRODUCT_MODEL;

    let navigate = useNavigate();

    const toast = useRef(null);
    const dt = useRef(null);

    let defaultFilters = {
        fields: ['id', 'name', 'category_id', 'warehouse_id', 'code', 'brand_id', 'model_id', 'part_number', 'unit', 'cost', 'price', 'active'],
        first: 0,
        rows: 10,
        page: 1,
        sortField: null,
        sortOrder: null,
        filters: {
            type: { value: "GENERAL", matchMode: FilterMatchMode.EQUALS },
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            
            name: { value: null, matchMode: FilterMatchMode.CONTAINS },
            brand_name: { value: null, matchMode: FilterMatchMode.CONTAINS },
            model_no: { value: null, matchMode: FilterMatchMode.CONTAINS },
            part_number: { value: null, matchMode: FilterMatchMode.CONTAINS }
        }
    };

    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [dtProducts, setProducts] = useState(null);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [dtProduct, setProduct] = useState({});
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const [lazyParams, setLazyParams] = useState(defaultFilters);

    // const productService = new ProductService();
    const masterDataDBService = new MasterDataDBService();

    useEffect(() => {
        initFilters();
    }, []);
    
    const clearCache = async () => {
        // await productService.clearCache();
        loadLazyData();
    }

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
        masterDataDBService.getAll(modelName, lazyParams).then(async data => {
            console.log(data)
            setTotalRecords(data.total);
            setProducts(data.rows);
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

        if(value === null || value === undefined) {
            return;
        }

        _lazyParams['filters']['global'].value = value;
        _lazyParams['first'] = 0;
        setLazyParams(_lazyParams);

    };

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
        // productService.delete(modelName, dtProduct.id).then(data => {
        //     console.log(data);
        //     loadLazyData();
        //     toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Product Deleted', life: 3000 });
        // });
        // setDeleteProductDialog(false);
        // setProduct(null);
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
                <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
            </React.Fragment>
        );
    };
    const codeBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Code</span>
                {rowData.code}
            </>
        );
    };
    const nameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.name}
            </>
        );
    };

    const dtProductCategory_idBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Product Category</span>
                {rowData.category_name}
            </>
        );
    };

    const dtWarehouse_idBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Warehouse</span>
                {rowData.warehouse_name}
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
                <span className="p-column-title">Part Number</span>
                {rowData.part_number}
            </>
        );
    };

    const lowStockQtyBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Low Stock Qty</span>
                {rowData.lowStockQty||0}
            </>
        );
    };

    const unitCostBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Last Trade Price</span>
                {rowData.cost}
            </>
        );
    };

    const tradePriceBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Last Trade Price</span>
                {rowData.price}
            </>
        );
    };

    const statusBodyTemplate = (rowData) => {
        return <i className={classNames('pi', { 'text-green-500 pi-check-circle': rowData.active, 'text-red-500 pi-times-circle': !rowData.active })}></i>;
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
                </span>
                <h5 className="m-0 ">Manage Products</h5>                
                <Button type="button" icon="pi pi-filter-slash" label="Clear Cache" onClick={clearCache} />
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
                        onFilter={onFilter} filters={lazyParams.filters} filterDisplay="menu"
                        scrollable columnResizeMode="expand" resizableColumns showGridlines
                        paginator totalRecords={totalRecords} onPage={onPage} first={lazyParams.first}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" 
                        rowsPerPageOptions={[5,10,25,50]}
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"

                        emptyMessage="No data found." header={renderHeader} 
                    >
                        <Column body={actionBodyTemplate} frozen headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="name" header="Name" filter filterPlaceholder="Search by name" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="code" header="Code" filter filterPlaceholder="Search by Code" sortable body={codeBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        {/* <Column field="category_id" header="Product Category" filter filterPlaceholder="Search by Category" sortable body={dtProductCategory_idBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column> */}
                        <Column field="brand_id" header="Brand Name" filter filterPlaceholder="Search by Brand Name " sortable body={brandNameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="model_id" header="Model No" filter filterPlaceholder="Search by Model No" sortable body={modelNoBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="part_number" header="Part Number" filter filterPlaceholder="Search by Numebr" sortable body={partNumberBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>  
                        {/* <Column field="low_stock_qty" header="Low Stock Qty" filter filterPlaceholder="Search by Qty" sortable body={lowStockQtyBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>                                                                     */}
                        {/* <Column field="cost" header="Unit Cost" filter filterPlaceholder="Search by Last Purchase Price" sortable body={unitCostBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column> */}
                        {/* <Column field="price" header="Trade Price" filter filterPlaceholder="Search by Last Purchase Price" sortable body={tradePriceBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column> */}
                        {/* <Column field="warehouse_id" header="Warehouse" filter filterPlaceholder="Search by Warehouse" sortable body={dtWarehouse_idBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column> */}
                        {/* <Column field="active" header="Status" filter filterPlaceholder="Search by Status" sortable body={statusBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>                                               */}
                    </DataTable>

                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {dtProduct && (
                                <span>
                                    Are you sure you want to delete <b>{dtProduct.productId}</b>?
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

export default List;