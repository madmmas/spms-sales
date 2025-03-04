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
import { CASH_MODEL } from '../../constants/models';

const Cash = () => {

    const modelName = CASH_MODEL;

    const toast = useRef(null);
    const dt = useRef(null);
    const contextPath = '~';

    let emptyCash = {
        id: null,
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
    const [empProfiles, setCashs] = useState(null);
    const [empProfileDialog, setCashDialog] = useState(false);
    const [deleteCashDialog, setDeleteCashDialog] = useState(false);
    const [deleteCashsDialog, setDeleteCashsDialog] = useState(false);
    const [cash, setCash] = useState(emptyCash);
    const [selectedCashs, setSelectedCashs] = useState(null);
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
            setCashs(data.rows);
            setLoading(false);
        });
    }

    const openNew = () => {
        setCreateEdit(true);
        setCash(emptyCash);
        setSubmitted(false);
        setCashDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setCashDialog(false);
    };

    const hideDeleteCashDialog = () => {
        setDeleteCashDialog(false);
    };

    const hideDeleteCashsDialog = () => {
        setDeleteCashsDialog(false);
    };

    const saveCash = () => {
        setSubmitted(true);

        if (cash.name.trim()) {
            if (cash.id) {
                configurationManagementService.update(modelName, cash.id, cash).then(data => {
                    console.log(data);
                    loadLazyData();
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Cash Updated', life: 3000 });
                });
            } else {
                configurationManagementService.create(modelName, cash).then(data => {
                    console.log(data);
                    loadLazyData();
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Cash Created', life: 3000 });
                });
            }

            setCashDialog(false);
            setCash(emptyCash);
        }
    };

    const editCash = (cash) => {
        setCreateEdit(false);
        setCash({ ...cash });
        setCashDialog(true);
    };

    const confirmDeleteCash = (cash) => {
        setCash(cash);
        setDeleteCashDialog(true);
    };

    const deleteCash = () => {
        configurationManagementService.delete(modelName, cash.id).then(data => {
            console.log(data);
            loadLazyData();
        });
        setDeleteCashDialog(false);
        setCash(emptyCash);
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const deleteSelectedCashs = () => {
        let _empProfiles = empProfiles.filter((val) => !selectedCashs.includes(val));
        setCashs(_empProfiles);
        setDeleteCashsDialog(false);
        setSelectedCashs(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Cashs Deleted', life: 3000 });
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _empProfile = { ...cash };
        _empProfile[`${name}`] = val;

        setCash(_empProfile);
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
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editCash(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteCash(rowData)} />
            </>
        );
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <h5 className="m-0">Manage Cash</h5>
                <Button type="button" icon="pi pi-filter-slash" label="Clear" className="p-button-outlined" onClick={clearFilter} />
            </div>
        )
    }

    const empProfileDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveCash} />
        </>
    );
    const deleteCashDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteCashDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteCash} />
        </>
    );
    const deleteCashsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteCashsDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedCashs} />
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
                        <Column field="name" header="Name" filter filterPlaceholder="Search by name" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="description" header="Description" body={descriptionBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={empProfileDialog} style={{ width: '450px' }} header={`${createEdit?"Create":"Edit"} Cash`} modal className="p-fluid" footer={empProfileDialogFooter} onHide={hideDialog}>                    
                        {cash.image && <img src={`${contextPath}/demo/images/cash/${cash.image}`} alt={cash.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
                        <div className="field">
                            <label htmlFor="name">Name</label>
                            <InputText id="name" value={cash.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !cash.name })} />
                            {submitted && !cash.name && <small className="p-invalid">Name is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="description">Description</label>
                            <InputTextarea id="description" value={cash.description} onChange={(e) => onInputChange(e, 'description')} required rows={3} cols={20} />
                        </div>
                    </Dialog>

                    <Dialog visible={deleteCashDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteCashDialogFooter} onHide={hideDeleteCashDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {cash && (
                                <span>
                                    Are you sure you want to delete <b>{cash.empID}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteCashsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteCashsDialogFooter} onHide={hideDeleteCashsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {cash && <span>Are you sure you want to delete the selected items?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Cash;