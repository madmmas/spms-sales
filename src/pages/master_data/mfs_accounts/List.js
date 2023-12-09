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

import CacheMasterDataService from '../../../services/CacheMasterDataService';
import { ConfigurationService } from '../../../services/ConfigurationService';
import { MasterDataDBService } from '../../../services/MasterDataDBService';

import { MFS_MODEL, MFS_ACCOUNT_MODEL } from '../../../constants/models';

const List = ({ ledger = false }) => {

    const modelName = MFS_ACCOUNT_MODEL;

    let navigate = useNavigate();

    const toast = useRef(null);
    const dt = useRef(null);

    let defaultFilters = {
        fields: ["dtMFS_id", "branch", "refNumber", "accName", "initBalance", "balance", "address", "phone", "note", "status"],
        first: 0,
        rows: 10,
        page: 1,
        sortField: null,
        sortOrder: null,
        filters: {
            dtMFS_id: { value: null, matchMode: FilterMatchMode.EQUALS },
            branch: { value: null, matchMode: FilterMatchMode.EQUALS },
            refNumber: { value: null, matchMode: FilterMatchMode.EQUALS },
            accName: { value: null, matchMode: FilterMatchMode.EQUALS },
            initBalance: { value: null, matchMode: FilterMatchMode.EQUALS },
            balance: { value: null, matchMode: FilterMatchMode.EQUALS },
            address: { value: null, matchMode: FilterMatchMode.EQUALS },
            phone: { value: null, matchMode: FilterMatchMode.EQUALS },
            note: { value: null, matchMode: FilterMatchMode.EQUALS },
            status: { value: null, matchMode: FilterMatchMode.EQUALS },
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

    const [dtMFS, setDtMFS] = useState([]);

    const configurationService = new ConfigurationService();
    const masterDataDBService = new MasterDataDBService();

    useEffect(() => {
        initFilters();
        configurationService.getAllWithoutParams(MFS_MODEL).then(data => {
            setDtMFS(data);
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

        masterDataDBService.getAll(modelName, lazyParams).then(data => {
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
        navigate("/mfs_accounts/new");
    };

    const editProfile = (dtProfile) => {
        navigate("/mfs_accounts/" + dtProfile._id);
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
        // hrManagementService.delete(modelName, dtProfile._id).then(data => {
        //     console.log(data);
        //     loadLazyData();
        //     toast.current.show({ severity: 'success', summary: 'Successful', detail: 'MFS Account Profile Deleted', life: 3000 });
        // });
        // setDeleteProfileDialog(false);
        // setProfile(null);
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
                {CacheMasterDataService.getShortnameById(rowData.dtMFS_id+"-dtMFS")}
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

    const refNumberBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.refNumber}
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
                    MFS Account Status
                </label>
                <TriStateCheckbox inputId="status-filter" value={options.value} onChange={(e) => options.filterApplyCallback(e.value)} />
            </div>
        );
    };

    const initBalanceFilterTemplate = (options) => {
        return <InputNumber value={options.value} onChange={(e) => options.filterApplyCallback(e.value, options.index)} mode="currency" currency="USD" locale="en-US" />;
    };    

    const balanceFilterTemplate = (options) => {
        return <InputNumber value={options.value} onChange={(e) => options.filterApplyCallback(e.value, options.index)} mode="currency" currency="USD" locale="en-US" />;
    };    

    const mfsFilterTemplate = (options) => {
        return <Dropdown value={options.value} optionValue="_id" optionLabel="name" options={dtMFS} onChange={(e) => options.filterApplyCallback(e.value, options.index)} placeholder="Select MFS" className="p-column-filter" showClear />;
    };

    const showLedger = (dtProfile) => {
        navigate("/mfs_accounts/ledger/" + dtProfile._id);
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                {!ledger && <><h5 className="m-0">Manage MFS Accounts</h5>
                <Button type="button" icon="pi pi-filter-slash" label="Clear" className="p-button-outlined" onClick={clearFilter} /></>}
                {ledger && <h5 className="m-0">MFS Accounts Ledger</h5>}
            </div>
        )
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                {!ledger && <>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editProfile(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteProfile(rowData)} />
                </>}
                {ledger && <Button icon="pi pi-list" className="p-button-rounded p-button-info mr-2" onClick={() => showLedger(rowData)} />}
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
                    {!ledger && <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>}

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
                        <Column field="dtMFS_id" header="MFS Name" filter filterElement={mfsFilterTemplate} sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>                        
                        <Column field="refNumber" header="Reference Number" filter filterPlaceholder="Search by refNumber" sortable body={refNumberBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="accName" header="Account Name" filter filterPlaceholder="Search by accName" sortable body={accNameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>                        
                        {!ledger && <Column field="initBalance" header="Initial Balance" filter filterElement={initBalanceFilterTemplate} sortable body={initBalanceBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>}
                        {!ledger && <Column field="balance" header="Current Balance" filter filterElement={balanceFilterTemplate} sortable body={balanceBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>}
                        {!ledger && <Column field="note" header="Note" filter filterPlaceholder="Search by note" body={noteBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>}
                        {!ledger && <Column field="status" header="Status" filter filterElement={statusFilterTemplate} sortable body={statusBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>}
                    </DataTable>

                    <Dialog visible={deleteProfileDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProfileDialogFooter} onHide={hideDeleteProfileDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {dtProfile && (
                                <span>
                                    Are you sure you want to delete <b>{dtProfile.mfsAccountId}</b>?
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