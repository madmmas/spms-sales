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
import { EXPENSE_TYPE_MODEL } from '../../constants/models';

const ExpenseType = () => {

    const modelName = EXPENSE_TYPE_MODEL;

    const toast = useRef(null);
    const dt = useRef(null);
    const contextPath = '~';

    let emptyExpenseType = {
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
        }
    };

    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [empProfiles, setExpenseTypes] = useState(null);
    const [empProfileDialog, setExpenseTypeDialog] = useState(false);
    const [deleteExpenseTypeDialog, setDeleteExpenseTypeDialog] = useState(false);
    const [deleteExpenseTypesDialog, setDeleteExpenseTypesDialog] = useState(false);
    const [task_type, setExpenseType] = useState(emptyExpenseType);
    const [selectedExpenseTypes, setSelectedExpenseTypes] = useState(null);
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
                setExpenseTypes(data.rows);
                setLoading(false);
            });
        }, Math.random() * 1000 + 250);
    }

    const openNew = () => {
        setCreateEdit(true);
        setExpenseType(emptyExpenseType);
        setSubmitted(false);
        setExpenseTypeDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setExpenseTypeDialog(false);
    };

    const hideDeleteExpenseTypeDialog = () => {
        setDeleteExpenseTypeDialog(false);
    };

    const hideDeleteExpenseTypesDialog = () => {
        setDeleteExpenseTypesDialog(false);
    };

    const saveExpenseType = () => {
        setSubmitted(true);

        if (task_type.name.trim()) {
            if (task_type._id) {
                configurationManagementService.update(modelName, task_type._id, task_type).then(data => {
                    console.log(data);
                    loadLazyData();
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Expense Type Updated', life: 3000 });
                });
            } else {
                configurationManagementService.create(modelName, task_type).then(data => {
                    console.log(data);
                    loadLazyData();
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Expense Type Created', life: 3000 });
                });
            }

            setExpenseTypeDialog(false);
            setExpenseType(emptyExpenseType);
        }
    };

    const editExpenseType = (task_type) => {
        setCreateEdit(false);
        setExpenseType({ ...task_type });
        setExpenseTypeDialog(true);
    };

    const confirmDeleteExpenseType = (task_type) => {
        setExpenseType(task_type);
        setDeleteExpenseTypeDialog(true);
    };

    const deleteExpenseType = () => {
        configurationManagementService.delete(modelName, task_type._id).then(data => {
            console.log(data);
            loadLazyData();
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Employee Profile Deleted', life: 3000 });
        });
        setDeleteExpenseTypeDialog(false);
        setExpenseType(emptyExpenseType);
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const deleteSelectedExpenseTypes = () => {
        let _empProfiles = empProfiles.filter((val) => !selectedExpenseTypes.includes(val));
        setExpenseTypes(_empProfiles);
        setDeleteExpenseTypesDialog(false);
        setSelectedExpenseTypes(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'ExpenseTypes Deleted', life: 3000 });
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _empProfile = { ...task_type };
        _empProfile[`${name}`] = val;

        setExpenseType(_empProfile);
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
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editExpenseType(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteExpenseType(rowData)} />
            </>
        );
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <h5 className="m-0">Manage Expense Type</h5>
                <Button type="button" icon="pi pi-filter-slash" label="Clear" className="p-button-outlined" onClick={clearFilter} />
            </div>
        )
    }

    const empProfileDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveExpenseType} />
        </>
    );
    const deleteExpenseTypeDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteExpenseTypeDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteExpenseType} />
        </>
    );
    const deleteExpenseTypesDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteExpenseTypesDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedExpenseTypes} />
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
                    </DataTable>

                    <Dialog visible={empProfileDialog} style={{ width: '450px' }} header={`${createEdit?"Create":"Edit"} Expense Type`} modal className="p-fluid" footer={empProfileDialogFooter} onHide={hideDialog}>                    
                        {task_type.image && <img src={`${contextPath}/demo/images/task_type/${task_type.image}`} alt={task_type.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
                        <div className="field">
                            <label htmlFor="name">Name</label>
                            <InputText id="name" value={task_type.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !task_type.name })} />
                            {submitted && !task_type.name && <small className="p-invalid">Name is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="description">Description</label>
                            <InputTextarea id="description" value={task_type.description} onChange={(e) => onInputChange(e, 'description')} required rows={3} cols={20} />
                        </div>
                    </Dialog>

                    <Dialog visible={deleteExpenseTypeDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteExpenseTypeDialogFooter} onHide={hideDeleteExpenseTypeDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {task_type && (
                                <span>
                                    Are you sure you want to delete <b>{task_type.empID}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteExpenseTypesDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteExpenseTypesDialogFooter} onHide={hideDeleteExpenseTypesDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {task_type && <span>Are you sure you want to delete the selected items?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default ExpenseType;