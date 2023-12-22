import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { classNames } from 'primereact/utils';
import { Dialog } from 'primereact/dialog';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import { DataTable } from 'primereact/datatable';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { Dropdown } from 'primereact/dropdown';

import { CITIES } from '../../../constants/lookupData';
import { DISTRICT } from '../../../constants/districts';
import { CUSTOMER_MODEL,CUSTOMER_CATEGORY_MODEL } from '../../../constants/models';

import { ConfigurationService } from '../../../services/ConfigurationService';
import { MasterDataDBService } from '../../../services/MasterDataDBService';

const List = ({ ledger = false }) => {

    const modelName = CUSTOMER_MODEL;
    const [customerCategory, setCustomerCategory] = useState([]);
    const [District, setDistrict] = useState([]);
    console.log(District)
    const [route, setRoute] = useState([]);

    let navigate = useNavigate();
    const toast = useRef(null);
    const dt = useRef(null);
    
    let defaultFilters = {
        fields:['dtCustomerCategory_id','name','address','phone','email','contact_name','district','route', 'status'],
        first: 0,
        rows: 10,
        page: 1,
        sortField: null,
        sortOrder: null,
        filters: {
            name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
            dtCustomerCategory_id: { value: null, matchMode: FilterMatchMode.EQUALS },
            status: { value: null, matchMode: FilterMatchMode.EQUALS },
            district: { value: null, matchMode: FilterMatchMode.EQUALS },
            route: { value: null, matchMode: FilterMatchMode.EQUALS },
            email: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
            contact_name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
            phone: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
            address: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
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
    
    const configurationService = new ConfigurationService();
    const masterDataDBService = new MasterDataDBService();

    useEffect(() => {
        initFilters();
        configurationService.getAllWithoutParams(CUSTOMER_CATEGORY_MODEL).then(data => {
            console.log("setCustomerCategory::",data)
            setCustomerCategory(data);
        });
    }, [customerCategory]);

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

        masterDataDBService.getAll(modelName, lazyParams).then(async data => {
            console.log(data)
            setTotalRecords(data.total);
            setProfiles(data.rows);
            setLoading(false);
        });
    }

    const reloadData = () => {
        masterDataDBService.getAllMD(modelName, lazyParams).then(data => {
            console.log("dtCustomer::=>>",data);
        });
    };

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
        navigate("/customers/new");
    };

    const editProfile = (dtProfile) => {
        navigate("/customers/" + dtProfile.id);
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
        //     toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Customer Profile Deleted', life: 3000 });
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
    const customerCategoryFilterTemplate = (options) => {
        return <Dropdown value={options.value} optionValue="id" optionLabel="name" options={customerCategory} onChange={(e) => options.filterApplyCallback(e.value)} placeholder="Select One" className="p-column-filter" showClear />;
    };

    const categoryBodyTemplate = (rowData) => {
        
        return (
            <>
                {rowData.dtCustomerCategory_id_shortname}
            </>
        );
    };
    const nameBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.name}
            </>
        );
    };
    const contactnameBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.contact_name}
            </>
        );
    };
    const emailBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.email}
            </>
        );
    };
    const phonenumberBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.phone}
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

    const showLedger = (dtProfile) => {
        navigate("/customers/ledger/" + dtProfile.id);
    };

    const districtFilterTemplate = (options) => {
        return <Dropdown value={options.value} optionValue="id" optionLabel="name" options={DISTRICT} onChange={(e) => options.filterApplyCallback(e.value)} placeholder="Select One" className="p-column-filter" showClear />;
    };

    const districtBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.district}
            </>
        );
    };
  
    const routeFilterTemplate = (options) => {
        return <Dropdown value={options.value} optionValue="id" optionLabel="name" options={CITIES} onChange={(e) => options.filterApplyCallback(e.value)} placeholder="Select One" className="p-column-filter" showClear />;
    };
    const routeBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.route}
            </>
        );
    };

    const statusBodyTemplate = (rowData) => {
        return <i className={classNames('pi', { 'text-green-500 pi-check-circle': (rowData.status==true || rowData.status==true), 'text-red-500 pi-times-circle': (rowData.status==false || rowData.status==false) })}></i>;
    };
    const statusFilterTemplate = (options) => {
        return (
            <div className="flex align-items-center gap-2">
                <label htmlFor="status-filter" className="font-bold">
                    Status
                </label>
                <TriStateCheckbox inputId="status-filter" value={options.value} onChange={(e) => options.filterApplyCallback(e.value)} />
            </div>
        );
    };
    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                {!ledger && <>
                <h5 className="m-0">Manage Customers</h5>
                <Button type="button" icon="pi pi-filter-slash" label="Clear" className="p-button-outlined" onClick={clearFilter} />
                <Button type="button" icon="pi pi-filter-slash" label="Reload" className="p-button-outlined" onClick={reloadData} />
                </>}
                {ledger && <h5 className="m-0">Customers Ledger</h5>}
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
                        onFilter={onFilter} filters={lazyParams.filters} 
                        filterDisplay="row" globalFilterFields={['name', 'contact_name']}
                        scrollable columnResizeMode="expand" resizableColumns showGridlines
                        paginator totalRecords={totalRecords} onPage={onPage} first={lazyParams.first}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" 
                        rowsPerPageOptions={[5,10,25,50]}
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                        emptyMessage="No data found." header={renderHeader} 
                    >
                        <Column body={actionBodyTemplate} frozen headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="name" header="Shop Name" filter filterPlaceholder="Search by shop name" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        
                        {!ledger && <Column field="dtCustomerCategory_id" header="Customer Category" filter filterElement={customerCategoryFilterTemplate} sortable body={categoryBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>}
                        {!ledger && <Column field="contact_name" header="Contact Name" filter filterField="contact_name" filterPlaceholder="Search by contact name" sortable body={contactnameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>}
                        {!ledger && <Column field="phone" header="Phone Number" filter filterPlaceholder="Search by Number" sortable body={phonenumberBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>}
                        {!ledger && <Column field="email" header="Email" filter filterPlaceholder="Search by Email" sortable body={emailBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>}
                        {!ledger && <Column field="address" header="Customer Address" filter filterPlaceholder="Search by Address" body={addressBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>}
                        {!ledger && <Column field="district" header="District" filter filterElement={districtFilterTemplate} sortable body={districtBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>}
                        {!ledger && <Column field="route" header="Route" filter filterElement={routeFilterTemplate} sortable body={routeBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>}
                        {!ledger && <Column field="status" header="Status" filter filterElement={statusFilterTemplate} sortable body={statusBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>}
                        
                    </DataTable>

                    <Dialog visible={deleteProfileDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProfileDialogFooter} onHide={hideDeleteProfileDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {dtProfile && (
                                <span>
                                    Are you sure you want to delete <b>{dtProfile.customerId}</b>?
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