import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';

import { HRService } from '../../../services/HRService';
import { PRODUCT_MODEL } from '../../../constants/models';

const List = () => {

    const modelName = PRODUCT_MODEL;

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
            'productId': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'name': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'productCategory': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'supplierName': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'itemName': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'barCode': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'partNumber': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'brandName': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'modelNumber': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'measurementUnit': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'reorderQuantity': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'productStatus': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },            
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
                setProfiles(data.rows);
                setLoading(false);
            });
        }, Math.random() * 100);
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
        navigate("/products/new");
    };

    const editProfile = (dtProfile) => {
        navigate("/products/" + dtProfile._id);
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
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Profile Deleted', life: 3000 });
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
    const codeBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Code</span>
                {rowData.code}
            </>
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
    const productCategoryBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Product Category</span>
                {rowData.dtProductCategory_id}
            </>
        );
    };
    const brandNameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Brand Name </span>
                {rowData.brandName}
            </>
        );
    };
    const partNumberBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Part Number</span>
                {rowData.partNumber}
            </>
        );
    };
    const unitPriceBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Unit Price</span>
                {rowData.unitPrice}
            </>
        );
    };
    const minimumQtyBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Minimum Qty</span>
                {rowData.minimumQty}
            </>
        );
    };
    const reorderQtyBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Reorder Qty</span>
                {rowData.reorderQty}
            </>
        );
    };

    const statusBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Status</span>
                {rowData.status}
            </>
        );
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <h5 className="m-0">Manage Products</h5>
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

                        paginator totalRecords={totalRecords} onPage={onPage} first={lazyParams.first}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" 
                        rowsPerPageOptions={[5,10,25,50]}
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"

                        emptyMessage="No data found." header={renderHeader} 
                    >
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="name" header="Name" filter filterPlaceholder="Search by name" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="code" header="Code" filter filterPlaceholder="Search by Code" sortable body={codeBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="dtProductCategory_id" header="Product Category" filter filterPlaceholder="Search by Category" sortable body={productCategoryBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="brandName" header="Brand Name" filter filterPlaceholder="Search by Brand Name " sortable body={brandNameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="partNumber" header="Part Number" filter filterPlaceholder="Search by Numebr" sortable body={partNumberBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>  
                        <Column field="unitPrice" header="Unit Price" filter filterPlaceholder="Search by Price" sortable body={unitPriceBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>                        
                        <Column field="minimumQty" header="Minimum Qty" filter filterPlaceholder="Search by Qty" sortable body={minimumQtyBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>                                                                    
                        <Column field="reorderQty" header="Reorder Qty" filter filterPlaceholder="Search by Reorder Qty" sortable body={reorderQtyBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>                                              
                        <Column field="status" header="Status" filter filterPlaceholder="Search by Status" sortable body={statusBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>                                              
                    </DataTable>

                    <Dialog visible={deleteProfileDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProfileDialogFooter} onHide={hideDeleteProfileDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {dtProfile && (
                                <span>
                                    Are you sure you want to delete <b>{dtProfile.productId}</b>?
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