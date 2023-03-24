import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { ConfigurationService } from '../../../services/ConfigurationService';

import { HRService } from '../../../services/HRService';
import { EMPLOYEE_MODEL,DEPARTMENT_MODEL,GRADE_MODEL,DESIGNATION_MODEL,OFFICE_TIME_MODEL,GROUP_MODEL} from '../../../constants/models';
const List = () => {

    const modelName = EMPLOYEE_MODEL;
    const [dtDepartment_id, setdtDepartment_id] = useState([]);

    const configurationService = new ConfigurationService();
    let navigate = useNavigate();

    const toast = useRef(null);
    const dt = useRef(null);

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
    const [empProfiles, setEmpProfiles] = useState(null);
    const [deleteEmpProfileDialog, setDeleteEmpProfileDialog] = useState(false);
    const [deleteEmpProfilesDialog, setDeleteEmpProfilesDialog] = useState(false);
    const [empProfile, setEmpProfile] = useState({});
    const [selectedEmpProfiles, setSelectedEmpProfiles] = useState(null);

    const [lazyParams, setLazyParams] = useState(defaultFilters);

    const hrManagementService = new HRService();

    let loadLazyTimeout = null;

    useEffect(() => {
        initFilters();
        configurationService.getAllWithoutParams(DEPARTMENT_MODEL).then(data => {
            setdtDepartment_id(data);
        });
    }, []);

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
            hrManagementService.getAll(modelName, { params: JSON.stringify(lazyParams) }).then(data => {
                console.log(data)
                setTotalRecords(data.total);
                setEmpProfiles(data.rows);
                setLoading(false);
            });
        }, Math.random() * 1000 + 250);
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

    const openNew = () => {
        navigate("/employees/new");
    };

    const editEmpProfile = (empProfile) => {
        navigate("/employees/" + empProfile._id);
    };

    const confirmDeleteEmpProfile = (empProfile) => {
        setEmpProfile(empProfile);
        setDeleteEmpProfileDialog(true);
    };

    const hideDeleteEmpProfileDialog = () => {
        setDeleteEmpProfileDialog(false);
    };

    const hideDeleteEmpProfilesDialog = () => {
        setDeleteEmpProfilesDialog(false);
    };

    const deleteSelectedEmpProfiles = () => {
        let _empProfiles = empProfiles.filter((val) => !selectedEmpProfiles.includes(val));
        setEmpProfiles(_empProfiles);
        setDeleteEmpProfilesDialog(false);
        setSelectedEmpProfiles(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'EmpProfiles Deleted', life: 3000 });
    };

    const deleteEmpProfile = () => {
        hrManagementService.delete(modelName, empProfile._id).then(data => {
            console.log(data);
            loadLazyData();
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Employee Profile Deleted', life: 3000 });
        });
        setDeleteEmpProfileDialog(false);
        setEmpProfile(null);
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
    const idBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Employee ID</span>
                {rowData.empID}
            </>
        );
    };
    const first_nameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">First Name</span>
                {rowData.first_name}
            </>
        );
    };
    const last_nameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Last Name</span>
                {rowData.last_name}
            </>
        );
    };
    const phoneBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Phone</span>
                {rowData.phone}
            </>
        );
    };
    const emailBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Email</span>
                {rowData.email}
            </>
        );
    };

    const gradeBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Grade ID</span>
                {rowData.dtGrade_id}
            </>
        );
    };
    const departmentBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Department ID</span>
                {rowData.dtDepartment_id}
            </>
        );
    };
    const designationBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Designation ID</span>
                {rowData.dtDesignation_id}
            </>
        );
    };
    const officetimeBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Office Time</span>
                {rowData.dtOfficeTime_id}
            </>
        );
    };
    const grouptimeBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Group ID</span>
                {rowData.dtGroup_id}
            </>
        );
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <h5 className="m-0">Manage Employees</h5>
                <Button type="button" icon="pi pi-filter-slash" label="Clear" className="p-button-outlined" onClick={clearFilter} />
            </div>
        )
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editEmpProfile(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteEmpProfile(rowData)} />
            </>
        );
    };

    const deleteEmpProfileDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteEmpProfileDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteEmpProfile} />
        </>
    );
    const deleteEmpProfilesDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteEmpProfilesDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedEmpProfiles} />
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
                        <Column field="empID" header="Employee ID" filter filterPlaceholder="Search by ID" sortable body={idBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="first_name" header="First Name" filter filterPlaceholder="Search by First Name" sortable body={first_nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="last_name" header="Last Name" filter filterPlaceholder="Search by last_name" sortable body={last_nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="phone" header="Phone" filter filterPlaceholder="Search by Phone" sortable body={phoneBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="email" header="Email" filter filterPlaceholder="Search by Email" sortable body={emailBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="dtGrade_id" header="Grade" filter filterPlaceholder="Search by punchID" sortable body={gradeBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="dtDepartment_id" header="Department" filter filterPlaceholder="Search by Department ID" sortable body={departmentBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="dtDesignation_id" header="Designation" filter filterPlaceholder="Search by Designation ID" sortable body={designationBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="dtOfficeTime_id" header="Office Time" filter filterPlaceholder="Search by Office time" sortable body={officetimeBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="dtGroup_id" header="Group ID" filter filterPlaceholder="Search by Group" sortable body={grouptimeBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>

                    </DataTable>

                    <Dialog visible={deleteEmpProfileDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteEmpProfileDialogFooter} onHide={hideDeleteEmpProfileDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {empProfile && (
                                <span>
                                    Are you sure you want to delete <b>{empProfile.empId}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteEmpProfilesDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteEmpProfilesDialogFooter} onHide={hideDeleteEmpProfilesDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {empProfile && <span>Are you sure you want to delete the selected items?</span>}
                        </div>
                    </Dialog>

                </div>
            </div>
        </div>
    );
};

export default List;