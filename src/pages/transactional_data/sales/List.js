import * as moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { getDateFormatted } from '../../../utils';
import { useNavigate } from 'react-router-dom';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';

import { HRService } from '../../../services/HRService';
import { OrderService } from '../../../services/OrderService';
import { SALES_MODEL } from '../../../constants/models';

const List = () => {

    const modelName = SALES_MODEL;

    let navigate = useNavigate();

    const toast = useRef(null);
    const dt = useRef(null);

    let defaultFilters = {
        fields: ["created_at", "party_id", "customer_category", "customer_name", "customer_phone",  "gross", "transport", "duty_vat", "net"],
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
    const [dtProfiles, setProfiles] = useState(null);
    const [deleteProfileDialog, setDeleteProfileDialog] = useState(false);
    const [deleteProfilesDialog, setDeleteProfilesDialog] = useState(false);
    const [dtProfile, setProfile] = useState({});
    const [selectedProfiles, setSelectedProfiles] = useState(null);

    const [lazyParams, setLazyParams] = useState(defaultFilters);

    const hrManagementService = new HRService();
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

        await orderService.getAll(SALES_MODEL, { params: JSON.stringify(lazyParams) }).then(data => {
            if(data){
                console.log(data)
                setTotalRecords(data.total);
                setProfiles(data.rows);
                setLoading(false);
            }
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
        navigate("/sales/new");
    };

    const editProfile = (dtProfile) => {
        navigate("/sales/" + dtProfile.id);
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
        hrManagementService.delete(modelName, dtProfile.id).then(data => {
            console.log(data);
            loadLazyData();
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Sales Profile Deleted', life: 3000 });
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

    const voucherNoBodyTemplate = (rowData) => {
        return (
            <>
                <a href={"#/invoice/"+rowData.id} target="_blank" rel="noopener noreferrer" >{rowData.voucher_no}</a>
            </>
        );
    };

    const getSeverityColor = (status) => {
        let severity = "info";
        if(status==="draft"){
            severity = "info";
        } else if(status==="pending"){
            severity = "warning";
        } else if(status==="completed" || status==="approved"){
            severity = "success";
        } else if(status==="cancelled"){
            severity = "danger";
        }
        return severity;
    };

    const statusNoBodyTemplate = (rowData) => {
        let status = "";
        if(rowData.customer_category==="CONDITIONAL"){
            status = rowData.trx_status;
        } else {
            status = rowData.status;
        }
        let severity = getSeverityColor(status);
        return (
            <>
                {<Tag severity={severity} value={status}></Tag>}
            </>
        );
    };

    const dateBodyTemplate = (rowData) => {
        return (
            <>
                {getDateFormatted(rowData.created_at)}
            </>
        );
    };

    const nameBodyTemplate = (rowData) => {
        if(rowData.customer_category === "REGISTERED" || rowData.customer_category === "CONDITIONAL"){
            rowData.customer_name = rowData.party_name;
        }
        return (
            <>
                {rowData.customer_name}
            </>
        );
    };

    const shopNameBodyTemplate = (rowData) =>{
        return (
            <>
                {rowData.shopName}
            </>
        );
    }

    const customerCategoryBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.customer_category}
            </>
        );
    };

    const totalPriceBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.gross}
            </>
        );
    };

    const  cashBodyTemplate = (rowData) => {
        if(rowData.payment === null){
            rowData.payment = '{}';
        }
        let obj = JSON.parse(rowData.payment)
        if(JSON.stringify(obj) === '{}'){
            obj.cash_amount = 0;
        }
        return (
            <>
                {obj.cash_amount}
            </>
        );
    };

    const  othersBodyTemplate = (rowData) => {
        if(rowData.payment === null){
            rowData.payment = '{}';
        }
        let obj = JSON.parse(rowData.payment)
        if(JSON.stringify(obj) === '{}'){
            obj.bank_amount = 0;
            obj.mfs_amount = 0;
        }
        return (
            <>
                {obj.bank_amount + obj.mfs_amount}
            </>
        );
    };

    const totalDiscountBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.discount}
            </>
        );
    };

    const deliveryCostBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.transport}
            </>
        );
    };

    const vatBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.duty_vat}
            </>
        );
    };

    const netAmountBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.net}
            </>
        );
    };
    const dueAmountBodyTemplate = (rowData) => {
        if(rowData.payment === null){
            rowData.payment = '{}';
        }
        let obj = JSON.parse(rowData.payment)
        if(JSON.stringify(obj) === '{}'){
            obj.cash_amount = 0;
            obj.bank_amount = 0;
            obj.mfs_amount = 0;
        }
        return (
            <>
                {rowData.net - obj.cash_amount - obj.bank_amount - obj.mfs_amount}
            </>
        );
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <h5 className="m-0">Manage Sales</h5>
                <Button type="button" icon="pi pi-filter-slash" label="Clear" className="p-button-outlined" onClick={clearFilter} />
            </div>
        )
    }

    const showInvoice = (dtProfile) => {
        navigate("/sales/invoice/" + dtProfile.id);
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editProfile(rowData)} />
                <Button icon="pi pi-list" className="p-button-rounded p-button-info mr-2" onClick={() => showInvoice(rowData)} />
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
                        onFilter={onFilter} filters={lazyParams.filters} filterDisplay="menu"
                        paginator totalRecords={totalRecords} onPage={onPage} first={lazyParams.first}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" 
                        rowsPerPageOptions={[5,10,25,50]}
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                        emptyMessage="No data found." header={renderHeader} 
                    >
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="voucher_no" header="Voucher No" filter filterPlaceholder="Search by voucher no" sortable body={voucherNoBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="status" header="Status" filter filterPlaceholder="Search by status" sortable body={statusNoBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="created_at" header="Sales Date" filter filterPlaceholder="Search by ID" sortable body={dateBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="shopName" header="Shop Name" filter filterPlaceholder="Search by shop name" sortable body={shopNameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="customer_name" header="Customer Name" filter filterPlaceholder="Search by name" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="net" header="Invoice Balance" filter filterPlaceholder="Search by gross" sortable body={netAmountBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="" header="Cash Payment" filter filterPlaceholder="Search by Cash" sortable body={cashBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="" header="Others Payment (Bank/MFS)" filter filterPlaceholder="Search by Others" sortable body={othersBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="due" header="Due Balance" filter filterPlaceholder="Search by Net Amount" sortable body={netAmountBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="customer_category" header="Customer Category" filter filterPlaceholder="Search by name" sortable body={customerCategoryBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="customer_name" header="Customer Name" filter filterPlaceholder="Search by name" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        {/* <Column field="totalQuantity" header="Total Quantity" filter filterPlaceholder="Search by name" sortable body={totalQuantityBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column> */}
                        
                        <Column field="discount" header="Total Discount" filter filterPlaceholder="Search by discount" sortable body={totalDiscountBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="transport" header="Delivery Cost" filter filterPlaceholder="Search by transport" sortable body={deliveryCostBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="duty_vat" header="VAT" filter filterPlaceholder="Search by Vat Amount" sortable body={vatBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="net" header="Net Amount" filter filterPlaceholder="Search by Net Amount" sortable body={netAmountBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                    </DataTable>

                    <Dialog visible={deleteProfileDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProfileDialogFooter} onHide={hideDeleteProfileDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {dtProfile && (
                                <span>
                                    Are you sure you want to delete <b>{dtProfile.saleId}</b>?
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