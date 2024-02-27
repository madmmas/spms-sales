import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FilterMatchMode } from 'primereact/api';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import { InputNumber } from 'primereact/inputnumber';

import { getFormattedNumber } from '../../../utils';

import { PRODUCT_MODEL, PRODBRAND_MODEL, PRODMODEL_MODEL, WAREHOUSE_MODEL } from '../../../constants/models';

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
            name: { value: null, matchMode: FilterMatchMode.CONTAINS },
            dtCategory_id: { value: 1, matchMode: FilterMatchMode.EQUALS },
            dtWarehouse_id: { value: null, matchMode: FilterMatchMode.EQUALS },
            code: { value: null, matchMode: FilterMatchMode.CONTAINS },
            dtProductBrand_id: { value: null, matchMode: FilterMatchMode.EQUALS },
            dtProductModel_id: { value: null, matchMode: FilterMatchMode.EQUALS },
            part_number: { value: null, matchMode: FilterMatchMode.CONTAINS },
            unit: { value: null, matchMode: FilterMatchMode.CONTAINS },
            cost: { value: null, matchMode: FilterMatchMode.GREATER_THAN_OR_EQUAL_TO },
            price: { value: null, matchMode: FilterMatchMode.GREATER_THAN_OR_EQUAL_TO },
            low_stock_qty: { value: null, matchMode: FilterMatchMode.GREATER_THAN_OR_EQUAL_TO },
            min_trade_price: { value: null, matchMode: FilterMatchMode.GREATER_THAN_OR_EQUAL_TO },
            active: { value: null, matchMode: FilterMatchMode.EQUALS },
        }
    };

    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [dtProfiles, setProducts] = useState(null);
    const [deleteProfileDialog, setDeleteProfileDialog] = useState(false);
    const [deleteProfilesDialog, setDeleteProfilesDialog] = useState(false);
    const [dtProfile, setProfile] = useState({});
    const [selectedProfiles, setSelectedProfiles] = useState(null);

    const [dtWarehouses, setDtWarehouses] = useState(null);
    const [dtProductBrands, setDtProductBrands] = useState(null);
    const [dtProductModels, setDtProductModels] = useState(null);

    const [lazyParams, setLazyParams] = useState(defaultFilters);
    const [loadCount, setLoadCount] = useState(0);

    const masterDataDBService = new MasterDataDBService();    

    useEffect(() => {
        loadLazyData();
    }, [lazyParams]);

    const clearFilter = () => {
        initFilters();
    }

    const initFilters = () => {
        setLazyParams(defaultFilters);
    }

    useEffect(() => {
        setLoadCount(loadCount+1);
    }, []);

    useEffect(() => {
            masterDataDBService.getAll(PRODBRAND_MODEL, {
                rows: 1000,
            }).then(data => {
                data.rows.sort((a, b) => a.name.localeCompare(b.name));
                setDtProductBrands(data.rows);
            });
            masterDataDBService.getAll(PRODMODEL_MODEL, {
                rows: 1000,
            }).then(data => {
                data.rows.sort((a, b) => a.name.localeCompare(b.name));
                setDtProductModels(data.rows);
            });
            masterDataDBService.getAll(WAREHOUSE_MODEL).then(data => {
                setDtWarehouses(data.rows);
            });
            reloadData();
    }, [loadCount]);

    useEffect(() => {
        if(loadCount>1){
            loadLazyData();
        }
    }, [lazyParams]);

    const loadLazyData = () => {
        setLoading(true);

        if(lazyParams.filters.active.value === true) {
            lazyParams.filters.active.value = 1;
        } else if(lazyParams.filters.active.value === false) {
            lazyParams.filters.active.value = 0;
        }

        masterDataDBService.getAll(modelName, lazyParams).then(async data => {
            setTotalRecords(data.total);
            setProducts(data.rows);
            setLoading(false);
        });
    }

    const reloadData = () => {
        masterDataDBService.getAllUpto(modelName).then(()=> {
            loadLazyData();
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
        navigate("/products/new");
    };

    const editProfile = (dtProfile) => {
        navigate("/products/" + dtProfile.id);
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

    const dtWarehouse_idBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.dtWarehouse_id_shortname}
            </>
        );
    };

    const lowStockQtyBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.low_stock_qty||0}
            </>
        );
    };

    const statusBodyTemplate = (rowData) => {
        return <i className={classNames('pi', { 'text-green-500 pi-check-circle': rowData.active==1, 'text-red-500 pi-times-circle': rowData.active==0 })}></i>;
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

    const brandFilterTemplate = (options) => {
        return <Dropdown filter value={options.value} optionValue="id" optionLabel="name" options={dtProductBrands} onChange={(e) => options.filterApplyCallback(e.value, options.index)} placeholder="Select Brand" className="p-column-filter" />;
    };

    const modelFilterTemplate = (options) => {
        return <Dropdown filter value={options.value} optionValue="id" optionLabel="name" options={dtProductModels} onChange={(e) => options.filterApplyCallback(e.value, options.index)} placeholder="Select Model" className="p-column-filter" />;
    };

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

    const statusFilterTemplate = (options) => {
        return (
            <div className="flex align-items-center gap-2">
                <label htmlFor="status-filter" className="font-bold">
                    Product Status
                </label>
                <TriStateCheckbox inputId="status-filter" value={options.value}
                    onChange={(e) => options.filterApplyCallback(e.value)}/>
            </div>
        );
    };

    const tradePriceFilterTemplate = (options) => {
        return <InputNumber value={options.value} 
                    onChange={(e) => options.filterApplyCallback(e.value)} 
                    // onChange={(e) => options.filterCallback(e.value, options.index)}
                    min={0} maxFractionDigits={2}
                />;
    };

    const minTradePriceFilterTemplate = (options) => {
        return <InputNumber value={options.value} onChange={(e) => options.filterApplyCallback(e.value, options.index)} />;
    };

    const costFilterTemplate = (options) => {
        return <InputNumber value={options.value} onChange={(e) => options.filterApplyCallback(e.value, options.index)} />;
    };

    const lowStockQtyFilterTemplate = (options) => {
        return <InputNumber value={options.value} onChange={(e) => options.filterApplyCallback(e.value, options.index)} />;
    };

    const warehouseFilterTemplate = (options) => {
        return <Dropdown value={options.value} optionValue="id" optionLabel="name" options={dtWarehouses} onChange={(e) => options.filterApplyCallback(e.value, options.index)} placeholder="Select Warehouse" className="p-column-filter" />;
    };

    const unitCostBodyTemplate = (rowData) => {
        return (
            <>
                {getFormattedNumber(rowData.cost||0)}
            </>
        );
    };

    const tradePriceBodyTemplate = (rowData) => {
        return (
            <>
                {getFormattedNumber(rowData.price||0)}
            </>
        );
    };

    const minTradePriceBodyTemplate = (rowData) => {
        return (
            <>
                {getFormattedNumber(rowData.min_trade_price||0)}
            </>
        );
    };

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
                        <Column field="dtProductBrand_id" header="Brand Name" filter filterPlaceholder="Search by Brand Name" filterElement={brandFilterTemplate} sortable body={brandNameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="dtProductModel_id" header="Model No" filter filterPlaceholder="Search by Model No" filterElement={modelFilterTemplate} sortable body={modelNumberBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="part_number" header="Part Number" filter filterPlaceholder="Search by Numebr" sortable headerStyle={{ minWidth: '10rem' }}></Column>  
                        <Column field="unit" header="Unit" filter filterPlaceholder="Search by Unit" sortable headerStyle={{ minWidth: '10rem' }}></Column>  
                        <Column field="cost" dataType="numeric" style={{textAlign: 'right'}}  header="Unit Cost" filter filterPlaceholder="Search by Purchase Price" filterElement={costFilterTemplate} sortable body={unitCostBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="price" dataType="numeric" style={{textAlign: 'right'}} header="Trade Price" filter filterPlaceholder="Search by Trade Price" filterElement={tradePriceFilterTemplate} sortable body={tradePriceBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="min_trade_price" dataType="numeric" style={{textAlign: 'right'}} header="Minimum Trade Price" filter filterPlaceholder="Search by Minimum Trade Price" filterElement={minTradePriceFilterTemplate} sortable body={minTradePriceBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="low_stock_qty" dataType="numeric" style={{textAlign: 'center'}} header="Low Stock Qty" filter filterPlaceholder="Search by Low Stock Qty" filterElement={lowStockQtyFilterTemplate} sortable body={lowStockQtyBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>                                                                    
                        <Column field="dtWarehouse_id" header="Warehouse" filter filterPlaceholder="Search by Warehouse" filterElement={warehouseFilterTemplate} sortable body={dtWarehouse_idBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="active" header="Status" filter filterPlaceholder="Search by Status" filterElement={statusFilterTemplate} sortable body={statusBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>                                              
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