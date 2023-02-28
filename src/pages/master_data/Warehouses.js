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
import { WAREHOUSES_MODEL } from '../../constants/models';

const Warehouses = () => {

    const modelName = WAREHOUSES_MODEL;

    const toast = useRef(null);
    const dt = useRef(null);
    const contextPath = '~';

    let emptyWarehouses = {
        _id: null,
        empID: '',
        name: ''
    };

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
    const [empProfiles, setWarehousess] = useState(null);
    const [empProfileDialog, setWarehousesDialog] = useState(false);
    const [deleteWarehousesDialog, setDeleteWarehousesDialog] = useState(false);
    const [deleteWarehousessDialog, setDeleteWarehousessDialog] = useState(false);
    const [warehouses, setWarehouses] = useState(emptyWarehouses);
    const [selectedWarehousess, setSelectedWarehousess] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [createEdit, setCreateEdit] = useState(true);

    const [lazyParams, setLazyParams] = useState(defaultFilters);

    const configurationManagementService = new ConfigurationService();

    let loadLazyTimeout = null;

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

        if (loadLazyTimeout) {
            clearTimeout(loadLazyTimeout);
        }

        loadLazyTimeout = setTimeout(() => {
            configurationManagementService.getAll(modelName, { params: JSON.stringify(lazyParams) }).then(data => {
                console.log(data)
                setTotalRecords(data.total);
                setWarehousess(data.rows);
                setLoading(false);
            });
        }, Math.random() * 1000 + 250);
    }

    const openNew = () => {
        setCreateEdit(true);
        setWarehouses(emptyWarehouses);
        setSubmitted(false);
        setWarehousesDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setWarehousesDialog(false);
    };

    const hideDeleteWarehousesDialog = () => {
        setDeleteWarehousesDialog(false);
    };

    const hideDeleteWarehousessDialog = () => {
        setDeleteWarehousessDialog(false);
    };

    const saveWarehouses = () => {
        setSubmitted(true);

        if (warehouses.name.trim()) {
            if (warehouses._id) {
                configurationManagementService.update(modelName, warehouses._id, warehouses).then(data => {
                    console.log(data);
                    loadLazyData();
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Warehouses Updated', life: 3000 });
                });
            } else {
                configurationManagementService.create(modelName, warehouses).then(data => {
                    console.log(data);
                    loadLazyData();
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Warehouses Created', life: 3000 });
                });
            }

            setWarehousesDialog(false);
            setWarehouses(emptyWarehouses);
        }
    };

    const editWarehouses = (warehouses) => {
        setCreateEdit(false);
        setWarehouses({ ...warehouses });
        setWarehousesDialog(true);
    };

    const confirmDeleteWarehouses = (warehouses) => {
        setWarehouses(warehouses);
        setDeleteWarehousesDialog(true);
    };

    const deleteWarehouses = () => {
        configurationManagementService.delete(modelName, warehouses._id).then(data => {
            console.log(data);
            loadLazyData();
        });
        setDeleteWarehousesDialog(false);
        setWarehouses(emptyWarehouses);
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const deleteSelectedWarehousess = () => {
        let _empProfiles = empProfiles.filter((val) => !selectedWarehousess.includes(val));
        setWarehousess(_empProfiles);
        setDeleteWarehousessDialog(false);
        setSelectedWarehousess(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Warehousess Deleted', life: 3000 });
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _empProfile = { ...warehouses };
        _empProfile[`${name}`] = val;

        setWarehouses(_empProfile);
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
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editWarehouses(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteWarehouses(rowData)} />
            </>
        );
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <h5 className="m-0">Manage Warehouses</h5>
                <Button type="button" icon="pi pi-filter-slash" label="Clear" className="p-button-outlined" onClick={clearFilter} />
            </div>
        )
    }

    const empProfileDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveWarehouses} />
        </>
    );
    const deleteWarehousesDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteWarehousesDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteWarehouses} />
        </>
    );
    const deleteWarehousessDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteWarehousessDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedWarehousess} />
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
                        <Column field="name" header="Name" filter filterPlaceholder="Search by name" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="description" header="Description" body={descriptionBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={empProfileDialog} style={{ width: '450px' }} header={`${createEdit?"Create":"Edit"} Warehouses`} modal className="p-fluid" footer={empProfileDialogFooter} onHide={hideDialog}>                    
                        {warehouses.image && <img src={`${contextPath}/demo/images/warehouses/${warehouses.image}`} alt={warehouses.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
                        <div className="field">
                            <label htmlFor="name">Name</label>
                            <InputText id="name" value={warehouses.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !warehouses.name })} />
                            {submitted && !warehouses.name && <small className="p-invalid">Name is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="description">Description</label>
                            <InputTextarea id="description" value={warehouses.description} onChange={(e) => onInputChange(e, 'description')} required rows={3} cols={20} />
                        </div>
                    </Dialog>

                    <Dialog visible={deleteWarehousesDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteWarehousesDialogFooter} onHide={hideDeleteWarehousesDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {warehouses && (
                                <span>
                                    Are you sure you want to delete <b>{warehouses.empID}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteWarehousessDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteWarehousessDialogFooter} onHide={hideDeleteWarehousessDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {warehouses && <span>Are you sure you want to delete the selected items?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Warehouses;