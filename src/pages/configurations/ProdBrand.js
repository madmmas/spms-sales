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
import { PRODBRAND_MODEL } from '../../constants/models';

const ProdBrand = () => {

    const modelName = PRODBRAND_MODEL;

    const toast = useRef(null);
    const dt = useRef(null);
    const contextPath = '~';

    let emptyProdBrand = {
        _id: null,
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
            'name': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'description': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        }
    };
    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [empProfiles, setProdBrands] = useState(null);
    const [empProfileDialog, setProdBrandDialog] = useState(false);
    const [deleteProdBrandDialog, setDeleteProdBrandDialog] = useState(false);
    const [deleteProdBrandsDialog, setDeleteProdBrandsDialog] = useState(false);
    const [prodBrand, setProdBrand] = useState(emptyProdBrand);
    const [selectedProdBrands, setSelectedProdBrands] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [createEdit, setCreateEdit] = useState(true);

    const [lazyParams, setLazyParams] = useState(defaultFilters);

    const configurationManagementService = new ConfigurationService();

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

        configurationManagementService.getAll(modelName, { params: JSON.stringify(lazyParams) }).then(data => {
            console.log(data)
            setTotalRecords(data.total);
            setProdBrands(data.rows);
            setLoading(false);
        });
    }

    const openNew = () => {
        setCreateEdit(true);
        setProdBrand(emptyProdBrand);
        setSubmitted(false);
        setProdBrandDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProdBrandDialog(false);
    };

    const hideDeleteProdBrandDialog = () => {
        setDeleteProdBrandDialog(false);
    };

    const hideDeleteProdBrandsDialog = () => {
        setDeleteProdBrandsDialog(false);
    };

    const saveProdBrand = () => {
        setSubmitted(true);

        if (prodBrand.name.trim()) {
            if (prodBrand._id) {
                configurationManagementService.update(modelName, prodBrand._id, prodBrand).then(data => {
                    console.log(data);
                    loadLazyData();
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'ProdBrand Updated', life: 3000 });
                });
            } else {
                configurationManagementService.create(modelName, prodBrand).then(data => {
                    console.log(data);
                    loadLazyData();
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'ProdBrand Created', life: 3000 });
                });
            }

            setProdBrandDialog(false);
            setProdBrand(emptyProdBrand);
        }
    };

    const editProdBrand = (prodBrand) => {
        setCreateEdit(false);
        setProdBrand({ ...prodBrand });
        setProdBrandDialog(true);
    };

    const confirmDeleteProdBrand = (prodBrand) => {
        setProdBrand(prodBrand);
        setDeleteProdBrandDialog(true);
    };

    const deleteProdBrand = () => {
        configurationManagementService.delete(modelName, prodBrand._id).then(data => {
            console.log(data);
            loadLazyData();
        });
        setDeleteProdBrandDialog(false);
        setProdBrand(emptyProdBrand);
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const deleteSelectedProdBrands = () => {
        let _empProfiles = empProfiles.filter((val) => !selectedProdBrands.includes(val));
        setProdBrands(_empProfiles);
        setDeleteProdBrandsDialog(false);
        setSelectedProdBrands(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'ProdBrands Deleted', life: 3000 });
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _empProfile = { ...prodBrand };
        _empProfile[`${name}`] = val;

        setProdBrand(_empProfile);
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
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editProdBrand(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteProdBrand(rowData)} />
            </>
        );
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <h5 className="m-0">Manage Product Brand</h5>
                <Button type="button" icon="pi pi-filter-slash" label="Clear" className="p-button-outlined" onClick={clearFilter} />
            </div>
        )
    }

    const empProfileDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveProdBrand} />
        </>
    );
    const deleteProdBrandDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProdBrandDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteProdBrand} />
        </>
    );
    const deleteProdBrandsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProdBrandsDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedProdBrands} />
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
                        <Column field="description" header="Description" filter filterPlaceholder="Search by description" sortable body={descriptionBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                    </DataTable>

                    <Dialog visible={empProfileDialog} style={{ width: '450px' }} header={`${createEdit?"Create":"Edit"} ProdBrand`} modal className="p-fluid" footer={empProfileDialogFooter} onHide={hideDialog}>                    
                        {prodBrand.image && <img src={`${contextPath}/demo/images/prodBrand/${prodBrand.image}`} alt={prodBrand.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
                        <div className="field">
                            <label htmlFor="name">Name*</label>
                            <InputText id="name" value={prodBrand.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !prodBrand.name })} />
                            {submitted && !prodBrand.name && <small className="p-invalid">Name is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="description">Description</label>
                            <InputTextarea id="description" value={prodBrand.description} onChange={(e) => onInputChange(e, 'description')} required rows={3} cols={20} />
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProdBrandDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProdBrandDialogFooter} onHide={hideDeleteProdBrandDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {prodBrand && (
                                <span>
                                    Are you sure you want to delete <b>{prodBrand.empID}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProdBrandsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProdBrandsDialogFooter} onHide={hideDeleteProdBrandsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {prodBrand && <span>Are you sure you want to delete the selected items?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default ProdBrand;