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
import { DEPARTMENT_MODEL } from '../../constants/models';

const Department = () => {

    const modelName = DEPARTMENT_MODEL;

    const toast = useRef(null);
    const dt = useRef(null);
    const contextPath = '~';

    let emptyDepartment = {
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
    const [empProfiles, setDepartments] = useState(null);
    const [empProfileDialog, setDepartmentDialog] = useState(false);
    const [deleteDepartmentDialog, setDeleteDepartmentDialog] = useState(false);
    const [deleteDepartmentsDialog, setDeleteDepartmentsDialog] = useState(false);
    const [department, setDepartment] = useState(emptyDepartment);
    const [selectedDepartments, setSelectedDepartments] = useState(null);
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
            setDepartments(data.rows);
            setLoading(false);
        });
    }

    const openNew = () => {
        setCreateEdit(true);
        setDepartment(emptyDepartment);
        setSubmitted(false);
        setDepartmentDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setDepartmentDialog(false);
    };

    const hideDeleteDepartmentDialog = () => {
        setDeleteDepartmentDialog(false);
    };

    const hideDeleteDepartmentsDialog = () => {
        setDeleteDepartmentsDialog(false);
    };

    const saveDepartment = () => {
        setSubmitted(true);

        if (department.name.trim()) {
            if (department._id) {
                configurationManagementService.update(modelName, department._id, department).then(data => {
                    console.log(data);
                    loadLazyData();
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Department Updated', life: 3000 });
                });
            } else {
                configurationManagementService.create(modelName, department).then(data => {
                    console.log(data);
                    loadLazyData();
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Department Created', life: 3000 });
                });
            }

            setDepartmentDialog(false);
            setDepartment(emptyDepartment);
        }
    };

    const editDepartment = (department) => {
        setCreateEdit(false);
        setDepartment({ ...department });
        setDepartmentDialog(true);
    };

    const confirmDeleteDepartment = (department) => {
        setDepartment(department);
        setDeleteDepartmentDialog(true);
    };

    const deleteDepartment = () => {
        configurationManagementService.delete(modelName, department._id).then(data => {
            console.log(data);
            loadLazyData();
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Department Deleted', life: 3000 });
        });
        setDeleteDepartmentDialog(false);
        setDepartment(emptyDepartment);
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const deleteSelectedDepartments = () => {
        let _empProfiles = empProfiles.filter((val) => !selectedDepartments.includes(val));
        setDepartments(_empProfiles);
        setDeleteDepartmentsDialog(false);
        setSelectedDepartments(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Departments Deleted', life: 3000 });
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _empProfile = { ...department };
        _empProfile[`${name}`] = val;

        setDepartment(_empProfile);
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
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editDepartment(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteDepartment(rowData)} />
            </>
        );
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <h5 className="m-0">Manage Department</h5>
                <Button type="button" icon="pi pi-filter-slash" label="Clear" className="p-button-outlined" onClick={clearFilter} />
            </div>
        )
    }

    const empProfileDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveDepartment} />
        </>
    );
    const deleteDepartmentDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteDepartmentDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteDepartment} />
        </>
    );
    const deleteDepartmentsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteDepartmentsDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedDepartments} />
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

                    <Dialog visible={empProfileDialog} style={{ width: '450px' }} header={`${createEdit?"Create":"Edit"} Department`} modal className="p-fluid" footer={empProfileDialogFooter} onHide={hideDialog}>                    
                        {department.image && <img src={`${contextPath}/demo/images/department/${department.image}`} alt={department.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
                        <div className="field">
                            <label htmlFor="name">Name</label>
                            <InputText id="name" value={department.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !department.name })} />
                            {submitted && !department.name && <small className="p-invalid">Name is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="description">Description</label>
                            <InputTextarea id="description" value={department.description} onChange={(e) => onInputChange(e, 'description')} required rows={3} cols={20} />
                        </div>
                    </Dialog>

                    <Dialog visible={deleteDepartmentDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteDepartmentDialogFooter} onHide={hideDeleteDepartmentDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {department && (
                                <span>
                                    Are you sure you want to delete <b>{department.empID}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteDepartmentsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteDepartmentsDialogFooter} onHide={hideDeleteDepartmentsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {department && <span>Are you sure you want to delete the selected items?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Department;