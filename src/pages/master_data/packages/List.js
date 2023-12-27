import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';

import { PRODUCT_MODEL } from '../../../constants/models';

import { MasterDataDBService } from '../../../services/MasterDataDBService';

const List = () => {

    const modelName = PRODUCT_MODEL;

    let navigate = useNavigate();

    const toast = useRef(null);
    const dt = useRef(null);

    let defaultFilters = {
        globalFilterFields: ['name', 'brand_name', 'model_no', 'part_number'],
        fields: ['id', 'name', 'warehouse_id', 'code', 'price', 'active'],
        first: 0,
        rows: 10,
        page: 1,
        sortField: null,
        sortOrder: null,
        filters: {
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            dtCategory_id: { value: 2, matchMode: FilterMatchMode.EQUALS },
            name: { value: null, matchMode: FilterMatchMode.CONTAINS },
            brand_name: { value: null, matchMode: FilterMatchMode.CONTAINS },
            model_no: { value: null, matchMode: FilterMatchMode.CONTAINS },
            part_number: { value: null, matchMode: FilterMatchMode.CONTAINS }
        }
    };

    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [dtProfiles, setProducts] = useState(null);
    const [deleteProfileDialog, setDeleteProfileDialog] = useState(false);
    const [deleteProfilesDialog, setDeleteProfilesDialog] = useState(false);
    const [dtProfile, setProfile] = useState({});
    const [selectedProfiles, setSelectedProfiles] = useState(null);

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
        masterDataDBService.getAll(modelName, lazyParams).then(async data => {
            console.log(data)
            setTotalRecords(data.total);
            setProducts(data.rows);
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
        navigate("/packages/new");
    };

    const editProfile = (dtProfile) => {
        navigate("/packages/" + dtProfile.id);
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
        setProducts(_dtProfiles);
        setDeleteProfilesDialog(false);
        setSelectedProfiles(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Profiles Deleted', life: 3000 });
    };

    const deleteProfile = () => {
        // productService.delete(dtProfile.id).then(data => {
        //     console.log(data);
        //     loadLazyData();
        //     toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Package Profile Deleted', life: 3000 });
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

    const lastTradePriceBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Last Trade Price</span>
                {rowData.price}
            </>
        );
    };

    const dtWarehouse_idBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Warehouse</span>
                {rowData.warehouse_name}
            </>
        );
    };

    const lowStockQtyBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Low Stock Qty</span>
                {rowData.lowStockQty||0}
            </>
        );
    };

    const statusBodyTemplate = (rowData) => {
        return <i className={classNames('pi', { 'text-green-500 pi-check-circle': rowData.status==true, 'text-red-500 pi-times-circle': rowData.status==false })}></i>;
    };

    const nameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.name}
            </>
        );
    };

    const codeBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Code</span>
                {rowData.code}
            </>
        );
    };

    const brandNameBodyTemplate = (rowData) =>{
        return (
            <>
                <span className="p-column-title">Brand Name</span>
                {masterDataDBService.getShortnameById('dtProductBrand', rowData.dtProductBrand_id)}
            </>
        );
    }

    const modelNumberBodyTemplate = (rowData) =>{
        return (
            <>
                <span className="p-column-title">Model Number</span>
                {masterDataDBService.getShortnameById('dtProductModel', rowData.dtProductModel_id)}
            </>
        );
    }


    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <h5 className="m-0">Manage Packages</h5>
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
                        ref={dt} value={dtProfiles} dataKey="id" 
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
                        <Column body={actionBodyTemplate} frozen headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="name" header="Name" filter filterPlaceholder="Search by Name" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="code" header="Code" filter filterPlaceholder="Search by Code" sortable body={codeBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="dtProductBrand_id" header="Brand Name" filter filterPlaceholder="Search by Brand Name" body={brandNameBodyTemplate} sortable headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="dtProductModel_id" header="Model No" filter filterPlaceholder="Search by Model No" body={modelNumberBodyTemplate} sortable headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="part_number" header="Part Number" filter filterPlaceholder="Search by Numebr" sortable headerStyle={{ minWidth: '10rem' }}></Column>  
                    </DataTable>

                    <Dialog visible={deleteProfileDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProfileDialogFooter} onHide={hideDeleteProfileDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {dtProfile && (
                                <span>
                                    Are you sure you want to delete <b>{dtProfile.id}</b>?
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