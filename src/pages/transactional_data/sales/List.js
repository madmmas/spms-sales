import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
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

import OrderFilter from '../../components/OrderFilter';
import CourierDialog from '../../components/CourierDialog';
import { SALES_MODEL } from '../../../constants/models';

import { OrderService } from '../../../services/OrderService';

import { MasterDataDBService } from '../../../services/MasterDataDBService';

const List = () => {

    const modelName = SALES_MODEL;

    let navigate = useNavigate();

    const toast = useRef(null);
    const dt = useRef(null);

    const {
        control,
        formState: { errors },
        setValue,
        handleSubmit
    } = useForm({});

    let defaultFilters = {
        fields: [],
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
    const [isCourierVisible, setIsCourierVisible] = useState(false);
    const [id, setID] = useState('');

    const [lazyParams, setLazyParams] = useState(defaultFilters);

    const masterDataDBService = new MasterDataDBService();
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

    const reloadLazyData = async (filters) => {
        setLoading(true);
        let _lazyParams = { ...lazyParams };
        _lazyParams['filters'] = filters;
        await orderService.getAll(SALES_MODEL, { params: JSON.stringify(_lazyParams) }).then(data => {
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

    const openCourier = (dtProfile1) => {
        setIsCourierVisible(true);
        setID(dtProfile1.id)
    }

   
        const onInputChange = (e, name) => {
            const val = e.target.value;
            setValue(`${name}`, val);
        };
    

    const hideDialog = () => {
        setIsCourierVisible(false);
        setValue('courier_name', '');
        setValue('courier_memo_number', '');
        setValue('date', '');
    }

    const saveCourier = async (data) => {
        console.log(data)
        let valid = true;
        // if(!data.courier_id){
        //     toast.current.show({ severity: 'error', summary: 'Error Message', detail: 'Courier is required.', life: 3000 });
        //     valid = false;
        // }else if(!data.courier_memo_number){
        //     toast.current.show({ severity: 'error', summary: 'Error Message', detail: 'Courier Memo Number is required.', life: 3000 });
        //     valid = false;
        // }else if(!data.courier_date){
        //     toast.current.show({ severity: 'error', summary: 'Error Message', detail: 'Courier Date is required.', life: 3000 });
        //     valid = false;
        // }
        if(!valid){
            return
        }
        await orderService.updateCourier(SALES_MODEL, id , data).then(result => {
            if(result){
                console.log(result)
            }
        });
        hideDialog();
        
    }

    const courierDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={handleSubmit((d) => saveCourier(d))} />
        </>
    );


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
        // masterDataDBService.delete(modelName, dtProfile.id).then(data => {
        //     console.log(data);
        //     loadLazyData();
        //     toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Sales Profile Deleted', life: 3000 });
        // });
        // setDeleteProfileDialog(false);
        // setProfile(null)
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
                {/* <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} /> */}
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
        let name = "";
        let phone = "";
        if(rowData.customer_category === "REGISTERED" || rowData.customer_category === "CONDITIONAL"){
            name = masterDataDBService.getShortnameById("dtCustomer", rowData.party_id);
        } else {
            name = rowData.customer_name;
            phone = rowData.customer_phone;
        }
        return (
            <>
              {(rowData.customer_category === "REGISTERED" || rowData.customer_category === "CONDITIONAL") && <>{name}</>}
              {(rowData.customer_category === "WALKIN") && <>{name} ({phone})</>}
            </>
        );
    };

    const contactNameBodyTemplate = (rowData) =>{
        return (
            <>
                {rowData.contact_name}
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
        // if(rowData.customer_category === "REGISTERED"){
        //     return (
        //         <>
        //             0
        //         </>
        //     );
        // }

        let amount = 0;
        if(rowData.customer_category === "CONDITIONAL"){
            if(rowData.advance_payment !== null && rowData.advance_payment !== undefined && rowData.advance_payment !== ""){
                if(rowData.trx_status === "pending"){
                    let obj = JSON.parse(rowData.advance_payment);
                    amount = obj ? obj.cash_amount: 0; 
                } else if(rowData.trx_status === "completed"){
                    let obj = JSON.parse(rowData.advance_payment);
                    amount = obj ? obj.cash_amount + obj.current_balance: 0; 
                }
            }
        }else{
            amount = 0;
            if(rowData.payment !== null && rowData.payment !== undefined && rowData.payment !== ""){
                let obj = JSON.parse(rowData.payment)
                amount = obj.cash_amount;
            }
        }
        return (
            <>
                {amount}
            </>
        );
    };

    const  othersBodyTemplate = (rowData) => {
        // if(rowData.customer_category === "REGISTERED"){
        //     return (
        //         <>
        //             0
        //         </>
        //     );
        // }
        
        let amount = 0;
        if(rowData.customer_category === "CONDITIONAL"){
            if(rowData.advance_payment !== null && rowData.advance_payment !== undefined && rowData.advance_payment !== ""){
                let advance_payment = JSON.parse(rowData.advance_payment);
                amount = advance_payment ? advance_payment.bank_amount + advance_payment.mfs_amount: 0;
            }
        }else{
            if(rowData.payment !== null && rowData.payment !== undefined && rowData.payment !== ""){
                let payment = JSON.parse(rowData.payment)
                amount = payment.bank_amount + payment.mfs_amount;
            }
        }
        return (
            <>
                {amount}
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

    const courierNameBodyTemplate = (rowData) => {
        let courier_name = "";
        if(rowData.courier_id !== null){
            courier_name = masterDataDBService.getShortnameById("dtCourier", rowData.courier_id);
        }
        return (
            <>
                {courier_name}
            </>
        );
    };

    const courierMemoNumberBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.courier_memo_number}
            </>
        );
    };

    const createdByBodyTemplate = (rowData) => {
        return (
            <>
                {masterDataDBService.getUsernameById(rowData.created_by)}
            </>
        );
    };

    const confirmedByBodyTemplate = (rowData) => {
        return (
            <>
                {masterDataDBService.getUsernameById(rowData.created_by)}
            </>
        );
    };

    const approvedByBodyTemplate = (rowData) => {
        return (
            <>
                {masterDataDBService.getUsernameById(rowData.created_by)}
            </>
        );
    };

    const dueAmountBodyTemplate = (rowData) => {
        let obj = {
            cash_amount: 0,
            bank_amount: 0,
            mfs_amount: 0
        }
        if(rowData.payment !== null){
            obj = JSON.parse(rowData.payment)
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
                {/* <Button icon="pi pi-list" className="p-button-rounded p-button-info mr-2" onClick={() => showInvoice(rowData)} /> */}
                {rowData.customer_category==="CONDITIONAL" && rowData.trx_status==="pending" && <Button icon="pi pi-pencil" className="p-button-rounded p-button-secondary mr-2" onClick={()=> openCourier(rowData)} />}
            </>
        );
    };

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
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

                    <OrderFilter reloadData={reloadLazyData} isSales={true} />

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
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="voucher_no" header="Voucher No" sortable body={voucherNoBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="status" header="Status" sortable body={statusNoBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="created_at" header="Sales Date" sortable body={dateBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="" header="Customer/Shop Name" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="net" header="Invoice Balance" sortable body={netAmountBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="" header="Cash Payment" sortable body={cashBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="" header="Others Payment (Bank/MFS)" sortable body={othersBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="due" header="Due Balance" sortable headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="customer_category" header="Customer Category" sortable body={customerCategoryBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>                        
                        <Column field="discount" header="Total Discount" sortable body={totalDiscountBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="transport" header="Delivery Cost" sortable body={deliveryCostBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="duty_vat" header="VAT" sortable body={vatBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="net" header="Net Amount" sortable body={netAmountBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="courier_id" header="Courier Name" sortable body={courierNameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="courier_memo_number" header="Courier Memo-Number" body={courierMemoNumberBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="created_by" header="Created By" body={createdByBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="confirmed_by" header="Confirmed By" body={confirmedByBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="approved_by" header="Approved By" body={approvedByBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
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

                    <CourierDialog 
                      isCourierVisible = {isCourierVisible}
                      courierDialogFooter = {courierDialogFooter}
                      hideDialog = {hideDialog}
                      onInputChange = {onInputChange}
                      control={control}
                      getFormErrorMessage={getFormErrorMessage}
                      />
                </div>
            </div>
        </div>
    );
};

export default List;