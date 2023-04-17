import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { classNames } from 'primereact/utils';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { DataTable } from 'primereact/datatable';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';

import { HRService } from '../../../services/HRService';
import { ConfigurationService } from '../../../services/ConfigurationService';
import { BANK_MODEL, BANK_ACCOUNT_MODEL } from '../../../constants/models';

const List = () => {

    const modelName = BANK_ACCOUNT_MODEL;

    let navigate = useNavigate();

    const toast = useRef(null);
    const dt = useRef(null);

    let defaultFilters = {
        fields: ["dtBank_id", "branch", "accNumber", "accName", "initBalance", "balance", "address", "phone", "note", "status"],
        first: 0,
        rows: 10,
        page: 1,
        sortField: null,
        sortOrder: null,
        filters: {
            'dtBank_id': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            'branch': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'phone': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'accNumber': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'accName': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'initBalance': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            'balance': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            'address': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            'phone': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            'note': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            'status': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        }
    };

    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [dtProfiles, setProfiles] = useState(null);
    const [deleteProfileDialog, setDeleteProfileDialog] = useState(false);
    const [deleteProfilesDialog, setDeleteProfilesDialog] = useState(false);
    const [dtProfile, setProfile] = useState({});
    const [selectedProfiles, setSelectedProfiles] = useState(null);
    const [lazyParams, setLazyParams] = useState(defaultFilters);

    const [dtBank, setDtBank] = useState([]);

    const hrManagementService = new HRService();
    const configurationService = new ConfigurationService();

    useEffect(() => {
        initFilters();
        configurationService.getAllWithoutParams(BANK_MODEL).then(data => {
            setDtBank(data);
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

        hrManagementService.getAll(modelName, { params: JSON.stringify(lazyParams) }).then(data => {
            console.log(data)
            setTotalRecords(data.total);
            setProfiles(data.rows);
            setLoading(false);
        });
    }

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const onPage = (event) => {
        let _lazyParams = { ...lazyParams, ...event };
        setLazyParams(_lazyParams);
    };

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
        navigate("/bank_accounts/new");
    };

    const editProfile = (dtProfile) => {
        navigate("/bank_accounts/" + dtProfile._id);
    };

    const confirmDeleteProfile = (dtProfile) => {
        setProfile(dtProfile);
        setDeleteProfileDialog(true);
    };

    const hideDeleteProfileDialog = () => {
        setDeleteProfileDialog(false);
    };

    const hideDeleteProfilesDialog = () => {
        setDeleteProfilesDialog(false);
    };

    const deleteSelectedProfiles = () => {
        let _dtProfiles = dtProfiles.filter((val) => !selectedProfiles.includes(val));
        setProfiles(_dtProfiles);
        setDeleteProfilesDialog(false);
        setSelectedProfiles(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Profiles Deleted', life: 3000 });
    };

    const deleteProfile = () => {
        hrManagementService.delete(modelName, dtProfile._id).then(data => {
            console.log(data);
            loadLazyData();
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Bank Account Profile Deleted', life: 3000 });
        });
        setDeleteProfileDialog(false);
        setProfile(null);
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

    const nameBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.dtBank_id_shortname}
            </>
        );
    };

    const branchBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.branch}
            </>
        );
    };

    const accNumberBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.accNumber}
            </>
        );
    };

    const accNameBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.accName}
            </>
        );
    };

    const initBalanceBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.initBalance}
            </>
        );
    };

    const balanceBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.balance}
            </>
        );
    };

    const addressBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.address}
            </>
        );
    };
    const phoneBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.phone}
            </>
        );
    };

    const noteBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.note}
            </>
        );
    };

    const statusBodyTemplate = (rowData) => {
        return <i className={classNames('pi', { 'text-green-500 pi-check-circle': rowData.status=="true", 'text-red-500 pi-times-circle': rowData.status=="false" })}></i>;
    };

    
    const statusFilterTemplate = (options) => {
        return (
            <div className="flex align-items-center gap-2">
                <label htmlFor="status-filter" className="font-bold">
                    Bank Account Status
                </label>
                <TriStateCheckbox inputId="status-filter" value={options.value} onChange={(e) => options.filterCallback(e.value)} />
            </div>
        );
    };

    const initBalanceFilterTemplate = (options) => {
        return <InputNumber value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} mode="currency" currency="USD" locale="en-US" />;
    };    

    const balanceFilterTemplate = (options) => {
        return <InputNumber value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} mode="currency" currency="USD" locale="en-US" />;
    };    

    const bankFilterTemplate = (options) => {
        return <Dropdown value={options.value} optionValue="_id" optionLabel="name" options={dtBank} onChange={(e) => options.filterCallback(e.value, options.index)} placeholder="Select Bank" className="p-column-filter" showClear />;
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <h5 className="m-0">Manage Bank Accounts</h5>
                <Button type="button" icon="pi pi-filter-slash" label="Clear" className="p-button-outlined" onClick={clearFilter} />
            </div>
        )
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editProfile(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteProfile(rowData)} />
            </>
        );
    };

    const deleteProfileDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProfileDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteProfile} />
        </>
    );
    const deleteProfilesDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProfilesDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedProfiles} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt} value={dtProfiles} dataKey="_id" 
                        className="datatable-responsive" responsiveLayout="scroll"
                        lazy loading={loading} rows={lazyParams.rows}
                        onSort={onSort} sortField={lazyParams.sortField} sortOrder={lazyParams.sortOrder}
                        onFilter={onFilter} filters={lazyParams.filters} filterDisplay="menu"
                        scrollable columnResizeMode="expand" resizableColumns showGridlines
                        paginator totalRecords={totalRecords} onPage={onPage} first={lazyParams.first}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" 
                        rowsPerPageOptions={[5,10,25,50]}
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                        emptyMessage="No data found." header={renderHeader} >
                        <Column body={actionBodyTemplate} frozen headerStyle={{ minWidth: '6rem' }}></Column>
                        <Column field="dtBank_id" header="Bank Name" filter filterElement={bankFilterTemplate} sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>                        
                        <Column field="branch" header="Branch" filter filterPlaceholder="Search by branch" sortable body={branchBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="accNumber" header="Account Number" filter filterPlaceholder="Search by accNumber" sortable body={accNumberBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="accName" header="Account Name" filter filterPlaceholder="Search by accName" sortable body={accNameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>                        
                        <Column field="initBalance" header="Initial Balance" filter filterElement={initBalanceFilterTemplate} sortable body={initBalanceBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="balance" header="Current Balance" filter filterElement={balanceFilterTemplate} sortable body={balanceBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="address" header="Address" filter filterPlaceholder="Search by address" body={addressBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="phone" header="Phone" filter filterPlaceholder="Search by phone" body={phoneBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="note" header="Note" filter filterPlaceholder="Search by note" body={noteBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>                        
                        <Column field="status" header="Status" filter filterElement={statusFilterTemplate} sortable body={statusBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                    </DataTable>

                    <Dialog visible={deleteProfileDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProfileDialogFooter} onHide={hideDeleteProfileDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {dtProfile && (
                                <span>
                                    Are you sure you want to delete <b>{dtProfile.bankAccountId}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProfilesDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProfilesDialogFooter} onHide={hideDeleteProfilesDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {dtProfile && <span>Are you sure you want to delete the selected items?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default List;