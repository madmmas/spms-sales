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
import { PRODMODEL_MODEL } from '../../constants/models';

const ProdModel = () => {

    const modelName = PRODMODEL_MODEL;

    const toast = useRef(null);
    const dt = useRef(null);
    const contextPath = '~';

    let emptyProdModel = {
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
    const [empProfiles, setProdModels] = useState(null);
    const [empProfileDialog, setProdModelDialog] = useState(false);
    const [deleteProdModelDialog, setDeleteProdModelDialog] = useState(false);
    const [deleteProdModelsDialog, setDeleteProdModelsDialog] = useState(false);
    const [prodModel, setProdModel] = useState(emptyProdModel);
    const [selectedProdModels, setSelectedProdModels] = useState(null);
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
            setProdModels(data.rows);
            setLoading(false);
        });
    }

    const openNew = () => {
        setCreateEdit(true);
        setProdModel(emptyProdModel);
        setSubmitted(false);
        setProdModelDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProdModelDialog(false);
    };

    const hideDeleteProdModelDialog = () => {
        setDeleteProdModelDialog(false);
    };

    const hideDeleteProdModelsDialog = () => {
        setDeleteProdModelsDialog(false);
    };

    const saveProdModel = () => {
        setSubmitted(true);

        if (prodModel.name.trim()) {
            if (prodModel._id) {
                configurationManagementService.update(modelName, prodModel._id, prodModel).then(data => {
                    console.log(data);
                    loadLazyData();
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'ProdModel Updated', life: 3000 });
                });
            } else {
                configurationManagementService.create(modelName, prodModel).then(data => {
                    console.log(data);
                    loadLazyData();
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'ProdModel Created', life: 3000 });
                });
            }

            setProdModelDialog(false);
            setProdModel(emptyProdModel);
        }
    };

    const editProdModel = (prodModel) => {
        setCreateEdit(false);
        setProdModel({ ...prodModel });
        setProdModelDialog(true);
    };

    const confirmDeleteProdModel = (prodModel) => {
        setProdModel(prodModel);
        setDeleteProdModelDialog(true);
    };

    const deleteProdModel = () => {
        configurationManagementService.delete(modelName, prodModel._id).then(data => {
            console.log(data);
            loadLazyData();
        });
        setDeleteProdModelDialog(false);
        setProdModel(emptyProdModel);
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const deleteSelectedProdModels = () => {
        let _empProfiles = empProfiles.filter((val) => !selectedProdModels.includes(val));
        setProdModels(_empProfiles);
        setDeleteProdModelsDialog(false);
        setSelectedProdModels(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'ProdModels Deleted', life: 3000 });
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _empProfile = { ...prodModel };
        _empProfile[`${name}`] = val;

        setProdModel(_empProfile);
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
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editProdModel(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteProdModel(rowData)} />
            </>
        );
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <h5 className="m-0">Manage Product Model</h5>
                <Button type="button" icon="pi pi-filter-slash" label="Clear" className="p-button-outlined" onClick={clearFilter} />
            </div>
        )
    }

    const empProfileDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveProdModel} />
        </>
    );
    const deleteProdModelDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProdModelDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteProdModel} />
        </>
    );
    const deleteProdModelsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProdModelsDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedProdModels} />
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

                    <Dialog visible={empProfileDialog} style={{ width: '450px' }} header={`${createEdit?"Create":"Edit"} ProdModel`} modal className="p-fluid" footer={empProfileDialogFooter} onHide={hideDialog}>                    
                        {prodModel.image && <img src={`${contextPath}/demo/images/prodModel/${prodModel.image}`} alt={prodModel.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
                        <div className="field">
                            <label htmlFor="name">Name*</label>
                            <InputText id="name" value={prodModel.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !prodModel.name })} />
                            {submitted && !prodModel.name && <small className="p-invalid">Name is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="description">Description</label>
                            <InputTextarea id="description" value={prodModel.description} onChange={(e) => onInputChange(e, 'description')} required rows={3} cols={20} />
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProdModelDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProdModelDialogFooter} onHide={hideDeleteProdModelDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {prodModel && (
                                <span>
                                    Are you sure you want to delete <b>{prodModel.empID}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProdModelsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProdModelsDialogFooter} onHide={hideDeleteProdModelsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {prodModel && <span>Are you sure you want to delete the selected items?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default ProdModel;