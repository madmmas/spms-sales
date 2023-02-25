import { useNavigate } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';

import { HRService } from '../../services/HRService';

const EmpProfileList = () => {

    const modelName = 'emp_profile';

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

    const editEmpProfile = (empProfile) => {
        navigate("/empinfo/" + empProfile._id);
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
                {rowData.empId}
            </>
        );
    };

    const punchIdBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Punch ID</span>
                {rowData.punchId}
            </>
        );
    };

    const nameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.empName}
            </>
        );
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <h5 className="m-0">Manage Deparment</h5>
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
                    <Toolbar className="mb-4" right={rightToolbarTemplate}></Toolbar>

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
                        <Column field="empId" header="Employee ID" filter filterPlaceholder="Search by ID" sortable body={idBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="punchId" header="Punch ID" filter filterPlaceholder="Search by punchId" sortable body={punchIdBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="empName" header="Name" filter filterPlaceholder="Search by name" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
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

export default EmpProfileList;