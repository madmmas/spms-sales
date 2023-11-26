import React, { useEffect, useRef, useState } from 'react';
import { Toolbar } from 'primereact/toolbar';
import * as moment from 'moment';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { RadioButton } from "primereact/radiobutton";
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { useForm, Controller } from 'react-hook-form';
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';

import CacheMasterDataService from '../../../services/CacheMasterDataService';
import SelectMasterData from '../../components/SelectMasterData';
import { TransactionService } from '../../../services/TransactionService';
import { RegisterService } from '../../../services/RegisterService';
import { BANK_ACCOUNT_MODEL } from '../../../constants/models';

const MFSRegister = () => {

    let emptyMFSRegister = {
        transfer_to: null,
        ref_id: null,
        trx_date: null,
        amount: 0,
        remarks: '',
    };

    const {
        register,
        control,
        formState: { errors },
        reset,
        setValue,
        handleSubmit
    } = useForm({
        defaultValues: emptyMFSRegister
    });
    
    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };
    
    const toast = useRef(null);
    const dt = useRef(null);

    let defaultFilters = {
        fields: ["id", "register_date", "register_details"],
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
    const [dtMFSRegister, setMFSRegister] = useState(null);
    const [empProfileDialog, setMFSRegisterDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);    
    const [lazyParams, setLazyParams] = useState(defaultFilters);
    const [transferTo, setTransferTo] = useState("CASH");

    const registerService = new RegisterService();
    const transactionService = new TransactionService();

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

        registerService.getAll("trxMFSRegister", { params: JSON.stringify(lazyParams) }).then(data => {
            console.log(data)
            setTotalRecords(data.total);
            setMFSRegister(data.rows);
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

    const dateBodyTemplate = (rowData) => {
        return (
            <>
                {moment(rowData.trx_date).format('DD/MM/YYYY')}
            </>
        );
    };

    const transferMFS = () => {
        reset({ ...emptyMFSRegister });        
        setSubmitted(false);
        setMFSRegisterDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setMFSRegisterDialog(false);
    };

    const empProfileDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button disabled={submitted} label="Save" icon="pi pi-check" className="p-button-text" onClick={handleSubmit((d) => saveMFSRegister(d))} />
        </>
    );

    const saveMFSRegister = (formData) => {
        setSubmitted(true);
        transactionService.transferMFS(transferTo, formData).then(data => {            
            console.log(data);
            loadLazyData();
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'MFS Register Updated', life: 3000 });
        });

        setMFSRegisterDialog(false);
        reset(emptyMFSRegister)
    };

    const onSelectTransferTo = (value) => {
        setTransferTo(value);
    }

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button onClick={() => transferMFS()} className="p-button p-button-primary mr-2" label="Transfer" />
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

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <h5 className="m-0">MFS Transfer</h5>
                <Button type="button" icon="pi pi-filter-slash" label="Refresh" className="p-button-outlined" onClick={clearFilter} />
            </div>
        )
    }

    const bankNameBodyTemplate = (rowData) => {
        return (
            <>
                {CacheMasterDataService.getShortnameById(rowData.dtBank_id+"-dtBank")}
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
                        ref={dt} value={dtMFSRegister} dataKey="_id" 
                        className="datatable-responsive" responsiveLayout="scroll"
                        lazy loading={loading} rows={lazyParams.rows}
                        onSort={onSort} sortField={lazyParams.sortField} sortOrder={lazyParams.sortOrder}
                        onFilter={onFilter} filters={lazyParams.filters} filterDisplay="menu"
                        scrollable columnResizeMode="expand" resizableColumns showGridlines
                        paginator totalRecords={totalRecords} onPage={onPage} first={lazyParams.first}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" 
                        rowsPerPageOptions={[5,10,25,50]}
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                        emptyMessage="No data found." header={renderHeader} 
                    >                       
                        <Column field="trx_no" header="Trx No" filter  sortable  headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="trx_date" header="Trx Date" filter  sortable  headerStyle={{ minWidth: '10rem' }}
                            body={dateBodyTemplate}></Column>
                        <Column field="amount" header="Payment Amount" filter  sortable  headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="trx_type" header="Transfer To" filter  sortable  headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="ref_name" header="Account Name" filter  sortable  headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="remarks" header="Remarks" filter  sortable  headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable> 
                    <Dialog visible={empProfileDialog} style={{ width: '450px' }} header={"MFS Transfer"} modal className="p-fluid" footer={empProfileDialogFooter} onHide={hideDialog}>                    
                        <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-12">
                            <div>Transfer to:</div>
                            <Controller
                                name="transfer_to"
                                control={control}
                                rules={{ required: 'Value is required.' }}
                                render={({ field }) => (
                                    <>
                                        <div className="flex align-items-center">
                                            <RadioButton inputId="f5" {...field} inputRef={field.ref} value="CASH" 
                                                checked={transferTo === 'CASH'}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    onSelectTransferTo(e.value);
                                                }}
                                                />
                                            <label htmlFor="f5" className="ml-1 mr-3">
                                                Cash
                                            </label>

                                            <RadioButton inputId="f6" {...field} value="BANK"
                                                checked={transferTo === 'BANK'}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    onSelectTransferTo(e.value);
                                                }}
                                            />
                                            <label htmlFor="f6" className="ml-1 mr-3">
                                                BANK
                                            </label>
                                        </div>
                                        {getFormErrorMessage(field.name)}
                                    </>
                                )}
                            />
                            </div>

                            <div hidden={transferTo !== "BANK"} className="field col-12 md:col-12">
                            <Controller
                                name="ref_id"
                                control={control}
                                rules={{ 
                                    validate: (value) => ((transferTo === "CASH" ) || (transferTo === "BANK" && value !== null) ) || 'Bank Account is required.'
                                }}
                                render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>BANK Name*</label>
                                    <SelectMasterData field={field} modelName={BANK_ACCOUNT_MODEL}
                                        displayField="accName" showFields={["dtBank_id", "accNumber", "accName"]}
                                        onSelect={(e) => {
                                            console.log(e);
                                        }}
                                        className={classNames({ 'p-invalid': fieldState.error })} 
                                        columns={[
                                            {field: 'dtBank_id', header: 'Bank Name', body: bankNameBodyTemplate, filterPlaceholder: 'Filter by Bank Name'},
                                            {field: 'accNumber', header: 'Account Number', filterPlaceholder: 'Filter by Account Number'},
                                            {field: 'accName', header: 'Account Name', filterPlaceholder: 'Filter by Account Name'}
                                        ]} 
                                        defaultFilters={{
                                            fields: ['dtBank_id', 'accNumber', 'accName'],
                                            first: 0,
                                            rows: 10,
                                            page: 1,
                                            sortField: null,
                                            sortOrder: null,
                                            filters: {
                                                global: { value: null, matchMode: 'contains' }
                                            }
                                        }}/>
                                    {getFormErrorMessage(field.name)}
                                </>
                            )}/>
                            </div>
                            <div className="field col-12 md:col-6">
                            <Controller
                                name="trx_date"
                                control={control}
                                rules={{ required: 'Date is required.' }}
                                render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name}>Date*</label>
                                    <Calendar inputId={field.name} value={field.value} onChange={field.onChange} 
                                        dateFormat="dd/mm/yy" className={classNames({ 'p-invalid': fieldState.error })} />
                                    {getFormErrorMessage(field.name)}
                                </>                                
                            )}/>
                            </div>                            
                            <div className="field col-12 md:col-6">
                            <Controller
                                name="amount"
                                control={control}
                                rules={{
                                    validate: (value) => (value > 0) || 'Enter a valid amount.'
                                }}
                                render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor="amount">Amount</label>
                                    <InputNumber inputId={field.name} value={field.value} inputRef={field.ref} 
                                        onValueChange={(e) => field.onChange(e)} 
                                        className={classNames({ 'p-invalid': fieldState.error })} />
                                    {getFormErrorMessage(field.name)}
                                </>
                            )}/>
                            </div>    
                            <div className="field col-12 md:col-12">
                            <Controller
                                name="remarks"
                                control={control}
                                // rules={{ required: 'Remarks is required.' }}
                                render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor="remarks">Remarks</label>
                                    <InputTextarea inputId={field.name} value={field.value} inputRef={field.ref}  onChange={(e) => field.onChange(e.target.value)} className={classNames({ 'p-invalid': fieldState.error })}/>
                                    {getFormErrorMessage(field.name)}
                                </>
                            )}/>
                            </div>
                        </div>
                    </Dialog>                   
                </div>
            </div>
        </div>
    );
};

export default MFSRegister;