import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';

import { ConfigurationService } from '../../services/ConfigurationService';
import { MasterDataDBService } from '../../services/MasterDataDBService';
import { PRODUCT_CATEGORY_MODEL } from '../../constants/models';

const ProductCategory = () => {

    const modelName = PRODUCT_CATEGORY_MODEL;

    const toast = useRef(null);
    const dt = useRef(null);
    const contextPath = '~';

    let emptyProductCategory = {
        id: null,
        description: '',
        name: ''
    };

    let defaultFilters = {
        fields: ['name', 'description'],
        first: 0,
        rows: 10,
        page: 1,
        sortField: null,
        sortOrder: null,
        filters: {
            'name': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        }
    };

    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [empProfiles, setProductCategorys] = useState(null);
    const [empProfileDialog, setProductCategoryDialog] = useState(false);
    const [deleteProductCategoryDialog, setDeleteProductCategoryDialog] = useState(false);
    const [deleteProductCategorysDialog, setDeleteProductCategorysDialog] = useState(false);
    const [productCategory, setProductCategory] = useState(emptyProductCategory);
    const [selectedProductCategorys, setSelectedProductCategorys] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [createEdit, setCreateEdit] = useState(true);

    const [lazyParams, setLazyParams] = useState(defaultFilters);

    const configurationManagementService = new ConfigurationService();
    const masterDataDBService = new MasterDataDBService();

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

        masterDataDBService.getAll(modelName, lazyParams).then(data => {
            console.log(data)
            setTotalRecords(data.total);
            setProductCategorys(data.rows);
            setLoading(false);
        });
    }

    const reloadData = () => {
        masterDataDBService.getAllUpto(modelName).then(()=> {
            loadLazyData();
        });
    };

    const openNew = () => {
        setCreateEdit(true);
        setProductCategory(emptyProductCategory);
        setSubmitted(false);
        setProductCategoryDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductCategoryDialog(false);
    };

    const hideDeleteProductCategoryDialog = () => {
        setDeleteProductCategoryDialog(false);
    };

    const hideDeleteProductCategorysDialog = () => {
        setDeleteProductCategorysDialog(false);
    };

    const saveProductCategory = () => {
        setSubmitted(true);

        if (productCategory.name.trim()) {
            if (productCategory.id) {
                configurationManagementService.update(modelName, productCategory.id, productCategory).then(data => {
                    console.log(data);
                    reloadData();
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Category Updated', life: 3000 });
                });
            } else {
                configurationManagementService.create(modelName, productCategory).then(data => {
                    console.log(data);
                    reloadData();
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Category Created', life: 3000 });
                });
            }

            setProductCategoryDialog(false);
            setProductCategory(emptyProductCategory);
        }
    };

    const editProductCategory = (ProductCategory) => {
        setCreateEdit(false);
        setProductCategory({ ...ProductCategory });
        setProductCategoryDialog(true);
    };

    const confirmDeleteProductCategory = (ProductCategory) => {
        setProductCategory(ProductCategory);
        setDeleteProductCategoryDialog(true);
    };

    const deleteProductCategory = () => {
        configurationManagementService.delete(modelName, productCategory.id).then(data => {
            console.log(data);
            masterDataDBService.deleteFromModelTable(modelName, productCategory.id).then(() => {
                reloadData();
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Category Deleted', life: 3000 });
            });
        });
        setDeleteProductCategoryDialog(false);
        setProductCategory(emptyProductCategory);
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const deleteSelectedProductCategorys = () => {
        let _empProfiles = empProfiles.filter((val) => !selectedProductCategorys.includes(val));
        setProductCategorys(_empProfiles);
        setDeleteProductCategorysDialog(false);
        setSelectedProductCategorys(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Categories Deleted', life: 3000 });
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _empProfile = { ...productCategory };
        _empProfile[`${name}`] = val;

        setProductCategory(_empProfile);
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

    const nameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.name}
            </>
        );
    };

    const descriptionBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Description</span>
                {rowData.description}
            </>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editProductCategory(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteProductCategory(rowData)} />
            </>
        );
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <h5 className="m-0">Manage Product Category</h5>
                <Button type="button" icon="pi pi-filter-slash" label="Clear" className="p-button-outlined" onClick={clearFilter} />
            </div>
        )
    }

    const empProfileDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveProductCategory} />
        </>
    );
    const deleteProductCategoryDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductCategoryDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteProductCategory} />
        </>
    );
    const deleteProductCategorysDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductCategorysDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedProductCategorys} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt} value={empProfiles} dataKey="id" 
                        className="datatable-responsive" responsiveLayout="scroll"
                        lazy loading={loading} rows={lazyParams.rows}
                        onSort={onSort} sortField={lazyParams.sortField} sortOrder={lazyParams.sortOrder}
                        onFilter={onFilter} filters={lazyParams.filters} filterDisplay="row"

                        paginator totalRecords={totalRecords} onPage={onPage} first={lazyParams.first}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" 
                        rowsPerPageOptions={[5,10,25,50]}
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"

                        emptyMessage="No data found." header={renderHeader} 
                    >
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="name" header="Name" filter filterPlaceholder="Search by name" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="description" header="Description" body={descriptionBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                    </DataTable>

                    <Dialog visible={empProfileDialog} style={{ width: '450px' }} header={`${createEdit?"Create":"Edit"} Product Category`} modal className="p-fluid" footer={empProfileDialogFooter} onHide={hideDialog}>                                                            
                        {productCategory.image && <img src={`${contextPath}/demo/images/productCategory/${productCategory.image}`} alt={productCategory.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
                        <div className="field">
                            <label htmlFor="name">Name*</label>
                            <InputText id="name" value={productCategory.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !ProductCategory.name })} />
                            {submitted && !productCategory.name && <small className="p-invalid">Name is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="description">Description</label>
                            <InputTextarea id="description" value={productCategory.description} onChange={(e) => onInputChange(e, 'description')} rows={3} cols={20} />
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductCategoryDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductCategoryDialogFooter} onHide={hideDeleteProductCategoryDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {productCategory && (
                                <span>
                                    Are you sure you want to delete <b>{productCategory.id}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductCategorysDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductCategorysDialogFooter} onHide={hideDeleteProductCategorysDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {productCategory && <span>Are you sure you want to delete the selected items?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default ProductCategory;