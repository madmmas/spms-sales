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

import { MasterDataDBService } from '../../../services/MasterDataDBService';
import { EMP_HISTORY_MODEL } from '../../../constants/models';

const EmploymentHistory = ({empProfile}) => {

    const modelName = EMP_HISTORY_MODEL;

    const toast = useRef(null);
    const dt = useRef(null);
    const contextPath = '~';

    let emptyEmploymentHistory = {
        id: null,
        empId: '',
        designation: '',
        department: '',
        workLocation: '',
        supervisorId: '',
        joiningDate: '',
        leavingDate: '',
        employmentStatus: '',
        dateOfParmanent: '',
        grossSalary: ''
    };

    let defaultFilters = {
        fields: ['name', 'description'],
        first: 0,
        rows: 10,
        page: 1,
        sortField: null,
        sortOrder: null,
        filters: {
            'empId': { operator: FilterOperator.AND, constraints: [{ value: empProfile.empId, matchMode: FilterMatchMode.EQUALS }] },
            'designation': { operator: FilterOperator.AND, constraints: [{ value: '', matchMode: FilterMatchMode.EQUALS }] },
            'department': { operator: FilterOperator.AND, constraints: [{ value: '', matchMode: FilterMatchMode.EQUALS }] },
            'workLocation': { operator: FilterOperator.AND, constraints: [{ value: '', matchMode: FilterMatchMode.EQUALS }] },
            'supervisorId': { operator: FilterOperator.AND, constraints: [{ value: '', matchMode: FilterMatchMode.EQUALS }] },
            'joiningDate': { operator: FilterOperator.AND, constraints: [{ value: '', matchMode: FilterMatchMode.EQUALS }] },
            'leavingDate': { operator: FilterOperator.AND, constraints: [{ value: '', matchMode: FilterMatchMode.EQUALS }] },
            'employmentStatus': { operator: FilterOperator.AND, constraints: [{ value: '', matchMode: FilterMatchMode.EQUALS }] },
            'dateOfParmanent': { operator: FilterOperator.AND, constraints: [{ value: '', matchMode: FilterMatchMode.EQUALS }] },
            'grossSalary': { operator: FilterOperator.AND, constraints: [{ value: '', matchMode: FilterMatchMode.EQUALS }] }
        }
    };

    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [empProfiles, setEmploymentHistorys] = useState(null);
    const [empProfileDialog, setEmploymentHistoryDialog] = useState(false);
    const [deleteEmploymentHistoryDialog, setDeleteEmploymentHistoryDialog] = useState(false);
    const [deleteEmploymentHistorysDialog, setDeleteEmploymentHistorysDialog] = useState(false);
    const [employmentHistory, setEmploymentHistory] = useState(emptyEmploymentHistory);
    const [selectedEmploymentHistorys, setSelectedEmploymentHistorys] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [createEdit, setCreateEdit] = useState(true);

    const [lazyParams, setLazyParams] = useState(defaultFilters);

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
        masterDataDBService.getAll(modelName, { params: JSON.stringify(lazyParams) }).then(data => {
            console.log(data)
            setTotalRecords(data.total);
            setEmploymentHistorys(data.rows);
            setLoading(false);
        });
    }

    const openNew = () => {
        setCreateEdit(true);
        setEmploymentHistory(emptyEmploymentHistory);
        setSubmitted(false);
        setEmploymentHistoryDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setEmploymentHistoryDialog(false);
    };

    const hideDeleteEmploymentHistoryDialog = () => {
        setDeleteEmploymentHistoryDialog(false);
    };

    const hideDeleteEmploymentHistorysDialog = () => {
        setDeleteEmploymentHistorysDialog(false);
    };

    const saveEmploymentHistory = () => {
        setSubmitted(true);

        if (employmentHistory.name.trim()) {
            if (employmentHistory.id) {
                masterDataDBService.update(modelName, employmentHistory.id, employmentHistory).then(data => {
                    console.log(data);
                    loadLazyData();
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'EmploymentHistory Updated', life: 3000 });
                });
            } else {
                masterDataDBService.create(modelName, employmentHistory).then(data => {
                    console.log(data);
                    loadLazyData();
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'EmploymentHistory Created', life: 3000 });
                });
            }

            setEmploymentHistoryDialog(false);
            setEmploymentHistory(emptyEmploymentHistory);
        }
    };

    const editEmploymentHistory = (employmentHistory) => {
        setCreateEdit(false);
        setEmploymentHistory({ ...employmentHistory });
        setEmploymentHistoryDialog(true);
    };

    const confirmDeleteEmploymentHistory = (employmentHistory) => {
        setEmploymentHistory(employmentHistory);
        setDeleteEmploymentHistoryDialog(true);
    };

    const deleteEmploymentHistory = () => {
        masterDataDBService.delete(modelName, employmentHistory.id).then(data => {
            console.log(data);
            loadLazyData();
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Employee Profile Deleted', life: 3000 });
        });
        setDeleteEmploymentHistoryDialog(false);
        setEmploymentHistory(emptyEmploymentHistory);
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const deleteSelectedEmploymentHistorys = () => {
        let _empProfiles = empProfiles.filter((val) => !selectedEmploymentHistorys.includes(val));
        setEmploymentHistorys(_empProfiles);
        setDeleteEmploymentHistorysDialog(false);
        setSelectedEmploymentHistorys(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'EmploymentHistorys Deleted', life: 3000 });
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _empProfile = { ...employmentHistory };
        _empProfile[`${name}`] = val;

        setEmploymentHistory(_empProfile);
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
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editEmploymentHistory(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteEmploymentHistory(rowData)} />
            </>
        );
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <h5 className="m-0">Manage EmploymentHistory</h5>
                <Button type="button" icon="pi pi-filter-slash" label="Clear" className="p-button-outlined" onClick={clearFilter} />
            </div>
        )
    }

    const empProfileDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveEmploymentHistory} />
        </>
    );
    const deleteEmploymentHistoryDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteEmploymentHistoryDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteEmploymentHistory} />
        </>
    );
    const deleteEmploymentHistorysDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteEmploymentHistorysDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedEmploymentHistorys} />
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
                        <Column field="description" header="Description" filter filterPlaceholder="Search by description" sortable body={descriptionBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                    </DataTable>

                    <Dialog visible={empProfileDialog} style={{ width: '450px' }} header={`${createEdit?"Create":"Edit"} EmploymentHistory`} modal className="p-fluid" footer={empProfileDialogFooter} onHide={hideDialog}>                                        
                        {employmentHistory.image && <img src={`${contextPath}/demo/images/employmentHistory/${employmentHistory.image}`} alt={employmentHistory.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
                        <div className="field">
                            <label htmlFor="name">Name*</label>
                            <InputText id="name" value={employmentHistory.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !employmentHistory.name })} />
                            {submitted && !employmentHistory.name && <small className="p-invalid">Name is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="description">Description</label>
                            <InputTextarea id="description" value={employmentHistory.description} onChange={(e) => onInputChange(e, 'description')} required rows={3} cols={20} />
                        </div>
                    </Dialog>

                    <Dialog visible={deleteEmploymentHistoryDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteEmploymentHistoryDialogFooter} onHide={hideDeleteEmploymentHistoryDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {employmentHistory && (
                                <span>
                                    Are you sure you want to delete <b>{employmentHistory.empID}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteEmploymentHistorysDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteEmploymentHistorysDialogFooter} onHide={hideDeleteEmploymentHistorysDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {employmentHistory && <span>Are you sure you want to delete the selected items?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default EmploymentHistory;