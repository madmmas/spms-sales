import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputSwitch } from 'primereact/inputswitch';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';

import { ConfigurationService } from '../../services/ConfigurationService';
import { MasterDataDBService } from '../../services/MasterDataDBService';
import { CUSTOMER_CATEGORY_MODEL } from '../../constants/models';

const CustomerCategory = () => {

    const modelName = CUSTOMER_CATEGORY_MODEL;

    const toast = useRef(null);
    const dt = useRef(null);
    const contextPath = '~';

    let emptyCustomerCategory = {
        _id: null,
        description: '',
        name: '',
        _default: false,
    };

    let defaultFilters = {
        fields: ['name', 'description', '_default'],
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
    const [empProfiles, setCustomerCategorys] = useState(null);
    const [empProfileDialog, setCustomerCategoryDialog] = useState(false);
    const [deleteCustomerCategoryDialog, setDeleteCustomerCategoryDialog] = useState(false);
    const [deleteCustomerCategorysDialog, setDeleteCustomerCategorysDialog] = useState(false);
    const [CustomerCategory, setCustomerCategory] = useState(emptyCustomerCategory);
    const [selectedCustomerCategorys, setSelectedCustomerCategorys] = useState(null);
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
            setCustomerCategorys(data.rows);
            setLoading(false);
        });
    }

    const openNew = () => {
        setCreateEdit(true);
        setCustomerCategory(emptyCustomerCategory);
        setSubmitted(false);
        setCustomerCategoryDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setCustomerCategoryDialog(false);
    };

    const hideDeleteCustomerCategoryDialog = () => {
        setDeleteCustomerCategoryDialog(false);
    };

    const hideDeleteCustomerCategorysDialog = () => {
        setDeleteCustomerCategorysDialog(false);
    };

    const saveCustomerCategory = () => {
        setSubmitted(true);

        if (CustomerCategory.name.trim()) {
            if (CustomerCategory._id) {
                configurationManagementService.update(modelName, CustomerCategory._id, CustomerCategory).then(data => {
                    console.log(data);
                    loadLazyData();
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Customer Category Updated', life: 3000 });
                });
            } else {
                configurationManagementService.create(modelName, CustomerCategory).then(data => {
                    console.log(data);
                    loadLazyData();
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Customer Category Created', life: 3000 });
                });
            }

            setCustomerCategoryDialog(false);
            setCustomerCategory(emptyCustomerCategory);
        }
    };

    const editCustomerCategory = (CustomerCategory) => {
        setCreateEdit(false);
        setCustomerCategory({ ...CustomerCategory });
        setCustomerCategoryDialog(true);
    };

    const confirmDeleteCustomerCategory = (CustomerCategory) => {
        setCustomerCategory(CustomerCategory);
        setDeleteCustomerCategoryDialog(true);
    };

    const deleteCustomerCategory = () => {
        configurationManagementService.delete(modelName, CustomerCategory._id).then(data => {
            console.log(data);
            loadLazyData();
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Customer Category Deleted', life: 3000 });
        });
        setDeleteCustomerCategoryDialog(false);
        setCustomerCategory(emptyCustomerCategory);
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const deleteSelectedCustomerCategorys = () => {
        let _empProfiles = empProfiles.filter((val) => !selectedCustomerCategorys.includes(val));
        setCustomerCategorys(_empProfiles);
        setDeleteCustomerCategorysDialog(false);
        setSelectedCustomerCategorys(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Customer Categories Deleted', life: 3000 });
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _empProfile = { ...CustomerCategory };
        _empProfile[`${name}`] = val;
        console.log(_empProfile);
        setCustomerCategory(_empProfile);
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

    const defaultBodyTemplate = (rowData) => {
        return <i className={classNames('pi', { 'text-green-500 pi-check-circle': rowData._default=="true", 'text-red-500 pi-times-circle': rowData._default!=="true" })}></i>;
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editCustomerCategory(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteCustomerCategory(rowData)} />
            </>
        );
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <h5 className="m-0">Manage Customer Category</h5>
                <Button type="button" icon="pi pi-filter-slash" label="Clear" className="p-button-outlined" onClick={clearFilter} />
            </div>
        )
    }

    const empProfileDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveCustomerCategory} />
        </>
    );
    const deleteCustomerCategoryDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteCustomerCategoryDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteCustomerCategory} />
        </>
    );
    const deleteCustomerCategorysDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteCustomerCategorysDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedCustomerCategorys} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt} value={empProfiles} dataKey="_id" 
                        className="datatable-responsive" responsiveLayout="scroll"
                        lazy loading={loading} rows={lazyParams.rows}
                        onSort={onSort} sortField={lazyParams.sortField} sortOrder={lazyParams.sortOrder}
                        onFilter={onFilter} filters={lazyParams.filters} filterDisplay="menu"

                        paginator totalRecords={totalRecords} onPage={onPage} first={lazyParams.first}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" 
                        rowsPerPageOptions={[5,10,25,50]}
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"

                        emptyMessage="No data found." header={renderHeader} 
                    >
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="name" header="Name" filter filterPlaceholder="Search by name" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="description" header="Description" body={descriptionBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>                        
                        <Column field="_default" header="Default" body={defaultBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>                        
                    </DataTable>

                    <Dialog visible={empProfileDialog} style={{ width: '450px' }} header={`${createEdit?"Create":"Edit"} Customer Category`} modal className="p-fluid" footer={empProfileDialogFooter} onHide={hideDialog}>                                        
                        {CustomerCategory.image && <img src={`${contextPath}/demo/images/CustomerCategory/${CustomerCategory.image}`} alt={CustomerCategory.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
                        <div className="field">
                            <label htmlFor="name">Name</label>
                            <InputText id="name" value={CustomerCategory.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !CustomerCategory.name })} />
                            {submitted && !CustomerCategory.name && <small className="p-invalid">Name is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="description">Description</label>
                            <InputTextarea id="description" value={CustomerCategory.description} onChange={(e) => onInputChange(e, 'description')} rows={3} cols={20} />
                        </div>
                        <div className="field">
                            <label htmlFor="default">Default</label>
                            <InputSwitch id="default" checked={CustomerCategory._default==="true"} onChange={(e) => onInputChange(e, '_default')} />
                        </div>
                    </Dialog>

                    <Dialog visible={deleteCustomerCategoryDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteCustomerCategoryDialogFooter} onHide={hideDeleteCustomerCategoryDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {CustomerCategory && (
                                <span>
                                    Are you sure you want to delete <b>{CustomerCategory.empID}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteCustomerCategorysDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteCustomerCategorysDialogFooter} onHide={hideDeleteCustomerCategorysDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {CustomerCategory && <span>Are you sure you want to delete the selected items?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default CustomerCategory;