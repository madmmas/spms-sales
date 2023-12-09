import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { classNames } from 'primereact/utils';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';

import { ConfigurationService } from '../../../services/ConfigurationService';
import { MasterDataDBService } from '../../../services/MasterDataDBService';

import { SUPPLIER_CATEGORY_MODEL, SUPPLIER_MODEL } from '../../../constants/models';
import { CURRENCY } from '../../../constants/lookupData';

const List = ({ ledger = false }) => {

    const modelName = SUPPLIER_MODEL;

    let navigate = useNavigate();

    const toast = useRef(null);
    const dt = useRef(null);

    let defaultFilters = {
        fields: ["name", "dtSupplierCategory_id", "status", "contactPersonName", "contactPersonPhone", "contactPersonDesignation", "currency", "address", "phone"],
        first: 0,
        rows: 10,
        page: 1,
        sortField: null,
        sortOrder: null,
        filters: {
            'name': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'dtSupplierCategory_id': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            'address': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'phone': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'contactPersonName': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'contactPersonDesignation': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'contactPersonPhone': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'currency': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
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
    // const hrManagementService = new HRService();

    const [dtSupplierCategory, setDtSupplierCategory] = useState([]);

    const configurationService = new ConfigurationService();
    const masterDataDBService = new MasterDataDBService();

    useEffect(() => {
        initFilters();
        configurationService.getAllWithoutParams(SUPPLIER_CATEGORY_MODEL).then(data => {
            setDtSupplierCategory(data);
        });
    }, [dtSupplierCategory]);
    
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
        navigate("/suppliers/new");
    };

    const editProfile = (dtProfile) => {
        navigate("/suppliers/" + dtProfile.id);
    };

    const showLedger = (dtProfile) => {
        navigate("/suppliers/ledger/" + dtProfile.id);
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
        // hrManagementService.delete(modelName, dtProfile.id).then(data => {
        //     console.log(data);
        //     loadLazyData();
        //     toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Supplier Profile Deleted', life: 3000 });
        // });
        // setDeleteProfileDialog(false);
        // setProfile(null);
    };

    const reloadData = () => {
        masterDataDBService.getAllMD(modelName, lazyParams).then(data => {
            console.log("dtSupplier::=>>",data);
        });
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
                {rowData.name}
            </>
        );
    };

    const categoryBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.dtSupplierCategory_id_shortname}
            </>
        );
    };

    const supplierCategoryFilterTemplate = (options) => {
        return <Dropdown value={options.value} optionValue="id" optionLabel="name" options={dtSupplierCategory} onChange={(e) => options.filterApplyCallback(e.value, options.index)} placeholder="Select One" className="p-column-filter" showClear />;
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

    const contactBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.contactPersonName}
            </>
        );
    };

    const desigBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.contactPersonDesignation}
            </>
        );
    };

    const mobileBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.contactPersonPhone}
            </>
        );
    };

    const currencyBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.currency}
            </>
        );
    };

    const currencyFilterTemplate = (options) => {
        return <Dropdown value={options.value} optionValue="id" optionLabel="name" options={CURRENCY} onChange={(e) => options.filterApplyCallback(e.value, options.index)} placeholder="Select One" className="p-column-filter" showClear />;
    };

    const statusBodyTemplate = (rowData) => {
        return <i className={classNames('pi', { 'text-green-500 pi-check-circle': rowData.status==true, 'text-red-500 pi-times-circle': rowData.status==false })}></i>;
    };
    
    const statusFilterTemplate = (options) => {
        return (
            <div className="flex align-items-center gap-2">
                <label htmlFor="status-filter" className="font-bold">
                    Supplier Status
                </label>
                <TriStateCheckbox inputId="status-filter" value={options.value} onChange={(e) => options.filterApplyCallback(e.value)} />
            </div>
        );
    };
    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                {!ledger && <><h5 className="m-0">Manage Suppliers</h5>
                <Button type="button" icon="pi pi-filter-slash" label="Clear" className="p-button-outlined" onClick={clearFilter} />
                <Button type="button" icon="pi pi-filter-slash" label="Reload" className="p-button-outlined" onClick={reloadData} />
                </>}
                {ledger && <h5 className="m-0">Supplier Ledger</h5>}
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
                        ref={dt} value={dtProfiles} dataKey="id" 
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
                        <Column body={actionBodyTemplate} frozen headerStyle={{ minWidth: '8rem' }}></Column>
                        <Column field="name" header="Name" filter filterPlaceholder="Search by name" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        {!ledger && <Column field="dtSupplierCategory_id" header="Supplier Category" filter filterElement={supplierCategoryFilterTemplate} sortable body={categoryBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>}
                        {!ledger && <Column field="address" header="Supplier Address" filter filterPlaceholder="Search by name" sortable body={addressBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>}
                        {!ledger && <Column field="phone" header="Phone" filter filterPlaceholder="Search by name" sortable body={phoneBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>}
                        {!ledger && <Column field="contactPersonName" header="Contact Person Name" filter filterPlaceholder="Search by name" sortable body={contactBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>}
                        {!ledger && <Column field="contactPersonDesignation" header="Contact Person Designation" filter filterPlaceholder="Search by name" sortable body={desigBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>}
                        {!ledger && <Column field="contactPersonPhone" header="Contact Person Mobile Number" filter filterPlaceholder="Search by name" sortable body={mobileBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>}
                        {!ledger && <Column field="currency" header="Currency" filter filterPlaceholder="Search by name" filterElement={currencyFilterTemplate} sortable body={currencyBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>}
                        {!ledger && <Column field="status" header="Status" filter filterElement={statusFilterTemplate} sortable body={statusBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>}
                    </DataTable>

                    <Dialog visible={deleteProfileDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProfileDialogFooter} onHide={hideDeleteProfileDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {dtProfile && (
                                <span>
                                    Are you sure you want to delete <b>{dtProfile.supplierId}</b>?
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