import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputSwitch } from 'primereact/inputswitch';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { Dropdown } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';

import { ConfigurationService } from '../../services/ConfigurationService';
import { LEAVE_TYPE_MODEL, LEAVE_POLICY_MODEL } from '../../constants/models';

const LeavePolicy = () => {

    const modelName = LEAVE_POLICY_MODEL;

    const toast = useRef(null);
    const dt = useRef(null);
    const contextPath = '~';

    let emptyLeavePolicy = {
        _id: null,
        description: '',
        name: ''
    };

    let defaultFilters = {
        fields: ['dtLeaveType_id', 'numOfDays', 'active'],
        first: 0,
        rows: 10,
        page: 1,
        sortField: null,
        sortOrder: null,
        filters: {
            'dtLeaveType_id': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'status': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        }
    };

    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [empProfiles, setLeavePolicys] = useState(null);
    const [empProfileDialog, setLeavePolicyDialog] = useState(false);
    const [deleteLeavePolicyDialog, setDeleteLeavePolicyDialog] = useState(false);
    const [deleteLeavePolicysDialog, setDeleteLeavePolicysDialog] = useState(false);
    const [LeavePolicy, setLeavePolicy] = useState(emptyLeavePolicy);
    const [selectedLeavePolicys, setSelectedLeavePolicys] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [createEdit, setCreateEdit] = useState(true);

    const [lazyParams, setLazyParams] = useState(defaultFilters);

    const configurationManagementService = new ConfigurationService();

    const [dtLeaveType, setDtLeaveType] = useState([]);
    
    useEffect(() => {
        initFilters();
        configurationManagementService.getAllWithoutParams(LEAVE_TYPE_MODEL).then(data => {
            setDtLeaveType(data);
        });
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
            setLeavePolicys(data.rows);
            setLoading(false);
        });
    }

    const openNew = () => {
        setCreateEdit(true);
        setLeavePolicy(emptyLeavePolicy);
        setSubmitted(false);
        setLeavePolicyDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setLeavePolicyDialog(false);
    };

    const hideDeleteLeavePolicyDialog = () => {
        setDeleteLeavePolicyDialog(false);
    };

    const hideDeleteLeavePolicysDialog = () => {
        setDeleteLeavePolicysDialog(false);
    };

    const saveLeavePolicy = () => {
        setSubmitted(true);

        if (LeavePolicy.name.trim()) {
            if (LeavePolicy._id) {
                configurationManagementService.update(modelName, LeavePolicy._id, LeavePolicy).then(data => {
                    console.log(data);
                    loadLazyData();
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Leave Policy Updated', life: 3000 });
                });
            } else {
                configurationManagementService.create(modelName, LeavePolicy).then(data => {
                    console.log(data);
                    loadLazyData();
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Leave Policy Created', life: 3000 });
                });
            }

            setLeavePolicyDialog(false);
            setLeavePolicy(emptyLeavePolicy);
        }
    };

    const editLeavePolicy = (LeavePolicy) => {
        setCreateEdit(false);
        setLeavePolicy({ ...LeavePolicy });
        setLeavePolicyDialog(true);
    };

    const confirmDeleteLeavePolicy = (LeavePolicy) => {
        setLeavePolicy(LeavePolicy);
        setDeleteLeavePolicyDialog(true);
    };

    const deleteLeavePolicy = () => {
        configurationManagementService.delete(modelName, LeavePolicy._id).then(data => {
            console.log(data);
            loadLazyData();
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Leave Policy Deleted', life: 3000 });
        });
        setDeleteLeavePolicyDialog(false);
        setLeavePolicy(emptyLeavePolicy);
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const deleteSelectedLeavePolicys = () => {
        let _empProfiles = empProfiles.filter((val) => !selectedLeavePolicys.includes(val));
        setLeavePolicys(_empProfiles);
        setDeleteLeavePolicysDialog(false);
        setSelectedLeavePolicys(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Customer Categories Deleted', life: 3000 });
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _empProfile = { ...LeavePolicy };
        _empProfile[`${name}`] = val;

        setLeavePolicy(_empProfile);
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

    const leaveTypeBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.dtLeaveType_id_shortname}
            </>
        );
    };

    const leaveTypeFilterTemplate = (options) => {
        return <Dropdown value={options.value} optionValue="_id" optionLabel="name" options={dtLeaveType} onChange={(e) => options.filterCallback(e.value, options.index)} placeholder="Select One" className="p-column-filter" showClear />;
    };

    const numOfDaysBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Number of Days</span>
                {rowData.numOfDays}
            </>
        );
    };

    const statusBodyTemplate = (rowData) => {
        return <i className={classNames('pi', { 'text-green-500 pi-check-circle': rowData.status, 'text-red-500 pi-times-circle': !rowData.status })}></i>;
    };
    
    const statusFilterTemplate = (options) => {
        return (
            <div className="flex align-items-center gap-2">
                <label htmlFor="status-filter" className="font-bold">
                    Leave Status
                </label>
                <InputSwitch  inputId="status-filter" value={options.value} onChange={(e) => options.filterCallback(e.value)} />
            </div>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editLeavePolicy(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteLeavePolicy(rowData)} />
            </>
        );
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <h5 className="m-0">Manage Leave Policy</h5>
                <Button type="button" icon="pi pi-filter-slash" label="Clear" className="p-button-outlined" onClick={clearFilter} />
            </div>
        )
    }

    const empProfileDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveLeavePolicy} />
        </>
    );
    const deleteLeavePolicyDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteLeavePolicyDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteLeavePolicy} />
        </>
    );
    const deleteLeavePolicysDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteLeavePolicysDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedLeavePolicys} />
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
                        <Column field="dtLeaveType_id" header="Leave Type" filter filterElement={leaveTypeFilterTemplate} sortable body={leaveTypeBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="numOfDays" header="Number Of Days" filter filterPlaceholder="Search by NumOfDays" sortable body={numOfDaysBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="status" header="Status" filter filterElement={statusFilterTemplate} sortable body={statusBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                    </DataTable>

                    <Dialog visible={empProfileDialog} style={{ width: '450px' }} header={`${createEdit?"Create":"Edit"} Leave Policy`} modal className="p-fluid" footer={empProfileDialogFooter} onHide={hideDialog}>                                        
                        {LeavePolicy.image && <img src={`${contextPath}/demo/images/LeavePolicy/${LeavePolicy.image}`} alt={LeavePolicy.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
                        <div className="field">
                            <label htmlFor="dtEmployee_id">Employee Name</label>
                            <InputText id="dtEmployee_id" value={LeavePolicy.name} onChange={(e) => onInputChange(e, 'dtEmployee_id')} required autoFocus className={classNames({ 'p-invalid': submitted && !LeavePolicy.name })} />
                            {submitted && !LeavePolicy.dtEmployee_id && <small className="p-invalid">Employee Name is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="status">Status</label>
                            <InputSwitch inputId={LeavePolicy.name} checked={LeavePolicy.value} inputRef={LeavePolicy.ref} onChange={(e) => LeavePolicy.onChange(e.value)} />
                        </div>
                    </Dialog>

                    <Dialog visible={deleteLeavePolicyDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteLeavePolicyDialogFooter} onHide={hideDeleteLeavePolicyDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {LeavePolicy && (
                                <span>
                                    Are you sure you want to delete <b>{LeavePolicy.empID}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteLeavePolicysDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteLeavePolicysDialogFooter} onHide={hideDeleteLeavePolicysDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {LeavePolicy && <span>Are you sure you want to delete the selected items?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default LeavePolicy;