import * as moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { Tag } from 'primereact/tag';

import { PURCHASE_MODEL } from '../../../constants/models';

import OrderFilter from '../../components/OrderFilter';

import { OrderService } from '../../../services/OrderService';

const List = () => {

    let navigate = useNavigate();

    const toast = useRef(null);
    const dt = useRef(null);

    let defaultFilters = {
        fields: [],
        first: 0,
        rows: 10,
        page: 1,
        sortField: null,
        sortOrder: null,
        filters: {            
            'date': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'party_id': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'cnf': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'be_no': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'lc_no': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'gross': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'net': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
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

    const orderService = new OrderService();

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

    const loadLazyData = async () => {
        setLoading(true);

        await orderService.getAll(PURCHASE_MODEL, { params: JSON.stringify(lazyParams) }).then(data => {
            if(data) {
                console.log(data)
                setTotalRecords(data.total);
                setProfiles(data.rows);
                setLoading(false);    
            }
        });
    }

    const reloadLazyData = async (filters) => {
        setLoading(true);
        let _lazyParams = { ...lazyParams };
        _lazyParams['filters'] = filters;
        await orderService.getAll(PURCHASE_MODEL, { params: JSON.stringify(_lazyParams) }).then(data => {
            if(data) {
                console.log(data)
                setTotalRecords(data.total);
                setProfiles(data.rows);
                setLoading(false);    
            }
        });
    }

    const getDate = (date) => {
        return moment(date).format('DD/MM/YYYY');
        // let d = new Date(parseInt(date));
        // return d.toDateString();
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
        navigate("/purchases/new");
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
        // masterDataDBService.delete(modelName, dtProfile.id).then(data => {
        //     console.log(data);
        //     loadLazyData();
        //     toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Purchase Profile Deleted', life: 3000 });
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

    const voucherNoBodyTemplate = (rowData) => {
        return (
            <>
                <a href={"#/purchases/"+rowData.id}>{rowData.voucher_no}</a>
            </>
        );
    };

    const statusNoBodyTemplate = (rowData) => {
        return (
            <>
                {<Tag severity="warning" value={rowData.status}></Tag>}
            </>
        );
    };

    const trxStatusNoBodyTemplate = (rowData) => {
        return (
            <>
                {<Tag severity="info" value={rowData.trx_status}></Tag>}
            </>
        );
    };

    const dateBodyTemplate = (rowData) => {
        return (
            <>
                {getDate(rowData.created_at)}
            </>
        );
    };

    const nameBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.party_id}
            </>
        );
    };

    const cnfBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.cnf}                
            </>
        );
    };

    const beNoBodyTemplate = (rowData) => {
        return (
            <>                
                {rowData.be_no}
            </>
        );
    };

    const lcNOBodyTemplate = (rowData) => {
        return (
            <>                
                {rowData.lc_no}
            </>
        );
    };

    const totalAmountBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.gross}
            </>
        );
    };

    const totalAmountBDTBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.gross}
            </>
        );
    };

    const totalQuantityBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.totalQuantity}
            </>
        );
    };

    const totalTransportBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.transport}
            </>
        );
    };

    const totalDutyBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.duty_vat}
            </>
        );
    };

    const netAmountBDTBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.net}
            </>
        );
    };
    
    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <h5 className="m-0">Manage Purchases</h5>
                <Button type="button" icon="pi pi-filter-slash" label="Clear" className="p-button-outlined" onClick={clearFilter} />
            </div>
        )
    }

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

    const editProfile = (dtProfile) => {
        navigate("/purchases/" + dtProfile.id);
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editProfile(rowData)} />
            </>
        );
    };

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">

                    <OrderFilter reloadData={reloadLazyData} isSales={false} />

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
                        <Column field="voucher_no" header="Voucher No" filter filterPlaceholder="Search by voucher no" sortable body={voucherNoBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="status" header="Status" filter filterPlaceholder="Search by status" sortable body={statusNoBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        {/* <Column field="trx_status" header="Transaction Status" filter filterPlaceholder="Search by status" sortable body={trxStatusNoBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column> */}
                        <Column field="created_at" header="Purchase Date" filter filterPlaceholder="Search by ID" sortable body={dateBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="party_it" header="Supplier Name" filter filterPlaceholder="Search by name" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>                        
                        <Column field="CnF" header="CnF" filter filterPlaceholder="Search by CnF" sortable body={cnfBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>                        
                        <Column field="BENo" header="B/E No" filter filterPlaceholder="Search by B/E No" sortable body={beNoBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="LCNo" header="LC No" filter filterPlaceholder="Search by LC No" sortable body={lcNOBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        {/* <Column field="totalAmountF" header="Total Amount F" filter filterPlaceholder="Search by ID" sortable body={totalAmountBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column> */}
                        <Column field="gross" header="Total Amount BDT" filter filterPlaceholder="Search by Amount" sortable body={totalAmountBDTBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        {/* <Column field="totalQuantity" header="Total Quantity" filter filterPlaceholder="Search by Quantity" sortable body={totalQuantityBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column> */}
                        <Column field="transport" header="Total Transport" filter filterPlaceholder="Search by Transport" sortable body={totalTransportBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="duty_vat" header="Total Duty" filter filterPlaceholder="Search by Duty" sortable body={totalDutyBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="net" header="Net Amount BDT" filter filterPlaceholder="Search by Amount" sortable body={netAmountBDTBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                    </DataTable>

                    <Dialog visible={deleteProfileDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProfileDialogFooter} onHide={hideDeleteProfileDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {dtProfile && (
                                <span>
                                    Are you sure you want to delete <b>{dtProfile.purchaseId}</b>?
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