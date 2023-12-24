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

import BankAccount from '../../components/master_data/BankAccount';
import MFSAccount from '../../components/master_data/MFSAccount';

import { TransactionService } from '../../../services/TransactionService';
import { RegisterService } from '../../../services/RegisterService';

import { getFormattedNumber } from '../../../utils';

const BankRegister = () => {

    let emptyBankRegister = {
        transfer_to: 'CASH',
        cr_ref_id: null,
        trx_date: moment().format('YYYY-MM-DD'),
        amount: 0,
        remarks: '',
    };

    const {
        register,
        control,
        formState: { errors },
        reset,
        setValue,
        getValues,
        handleSubmit
    } = useForm({
        defaultValues: emptyBankRegister
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
    const [dtBankRegister, setBankRegister] = useState(null);
    const [empProfileDialog, setBankRegisterDialog] = useState(false);
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

        registerService.getAll("trxBankTransfer", { params: JSON.stringify(lazyParams) }).then(data => {
            console.log(data)
            setTotalRecords(data.total);
            setBankRegister(data.rows);
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

    const transferBank = () => {
        setValue("transfer_to", "CASH");
        setTransferTo("CASH");
        reset({ ...emptyBankRegister });        
        setSubmitted(false);
        setBankRegisterDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setBankRegisterDialog(false);
    };

    const empProfileDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button disabled={submitted} label="Save" icon="pi pi-check" className="p-button-text" onClick={handleSubmit((d) => saveBankRegister(d))} />
        </>
    );

    const saveBankRegister = (formData) => {
        setSubmitted(true);
        transactionService.transferBank(transferTo, formData).then(data => {            
            console.log(data);
            loadLazyData();
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Bank Register Updated', life: 3000 });
        });

        setBankRegisterDialog(false);
        reset(emptyBankRegister)
    };

    const onSelectTransferTo = (value) => {
        setTransferTo(value);
    }

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button onClick={() => transferBank()} className="p-button p-button-primary mr-2" label="Transfer" />
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
                <h5 className="m-0">Bank Transfer</h5>
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

    const mfsNameBodyTemplate = (rowData) => {
        return (
            <>
                {CacheMasterDataService.getShortnameById(rowData.dtMFS_id+"-dtMFS")}
            </>
        );
    };

    const amountBodyTemplate = (rowData) => {
        return (
            <>
                {getFormattedNumber(rowData.amount)}
            </>
        );
    };

    const refBodyTemplate = (rowData) => {
        let ref = "CASH";
        if(rowData.trx_type === "BANK_TO_MFS") {
            ref = CacheMasterDataService.getShortnameById(rowData.cr_ref_id+"-dtMFSAccount");
        } else if(rowData.trx_type === "BANK_TO_BANK") {
            ref = CacheMasterDataService.getShortnameById(rowData.cr_ref_id+"-dtBankAccount");
        }
        return (
            <>
                {ref}
            </>
        );
    };

    const fromBodyTemplate = (rowData) => {
        return (
            <>
                {CacheMasterDataService.getShortnameById(rowData.dr_ref_id+"-dtBankAccount")}
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
                        ref={dt} value={dtBankRegister} dataKey="id" 
                        className="datatable-responsive" responsiveLayout="scroll"
                        lazy loading={loading} rows={lazyParams.rows}
                        onSort={onSort} sortField={lazyParams.sortField} sortOrder={lazyParams.sortOrder}
                        onFilter={onFilter} filters={lazyParams.filters} filterDisplay="row"
                        scrollable columnResizeMode="expand" resizableColumns showGridlines
                        paginator totalRecords={totalRecords} onPage={onPage} first={lazyParams.first}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" 
                        rowsPerPageOptions={[5,10,25,50]}
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                        emptyMessage="No data found." header={renderHeader} 
                    >                       
                        <Column field="trx_no" header="Trx No" filter  sortable  headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="trx_date" header="Trx Date" filter  sortable  headerStyle={{ minWidth: '10rem' }} body={dateBodyTemplate}></Column>
                        <Column field="dr_ref_id" header="Transfer From" body={fromBodyTemplate} filter  sortable  headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="cr_ref_id" header="Transfer To" body={refBodyTemplate} filter  sortable  headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="amount" header="Payment Amount" body={amountBodyTemplate} filter  sortable  headerStyle={{ minWidth: '10rem' }} style={{fontWeight: 'bold', textAlign: 'right'}}></Column>
                        <Column field="remarks" header="Remarks" filter  sortable  headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable> 
                    <Dialog visible={empProfileDialog} style={{ width: '450px' }} header={"Bank Transfer"} modal className="p-fluid" footer={empProfileDialogFooter} onHide={hideDialog}>                    
                        <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-12">
                        <Controller
                            name="dr_ref_id"
                            control={control}
                            rules={{ required: 'Bank Account is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Transfer From Bank Account*</label>
                                <BankAccount field={field} fieldState={fieldState}
                                    onSelect={(e) => {console.log(e);}}
                                    />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                        </div>
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

                                            <RadioButton inputId="f6" {...field} value="MFS"
                                                checked={transferTo === 'MFS'}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    onSelectTransferTo(e.value);
                                                }}
                                            />
                                            <label htmlFor="f6" className="ml-1 mr-3">
                                                MFS
                                            </label>
                                        </div>
                                        {getFormErrorMessage(field.name)}
                                    </>
                                )}
                            />
                            </div>
                            {transferTo === "BANK" &&
                            <div className="field col-12 md:col-12">
                            <Controller
                                name="cr_ref_id"
                                control={control}
                                rules={{
                                    required: 'Bank Account is required.', 
                                    validate: (value) => (value !== getValues("dr_ref_id")) || 'Bank Account is same as Transfer From Bank Account.'
                                }}
                                render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Bank Account*</label>
                                    <BankAccount field={field} fieldState={fieldState}
                                        onSelect={(e) => {console.log(e);}}
                                        />
                                    {getFormErrorMessage(field.name)}
                                </>
                            )}/>
                            </div>}
                            {transferTo === "MFS" &&
                            <div className="field col-12 md:col-12">
                            <Controller
                                name="cr_ref_id"
                                control={control}
                                rules={{ 
                                        validate: (value) => (transferTo === "MFS" && value !== null) || 'MFS Account is required.'
                                }}
                                render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>MFS Account*</label>
                                    <MFSAccount field={field} fieldState={fieldState}
                                        onSelect={(e) => {console.log(e);}}
                                        />
                                    {getFormErrorMessage(field.name)}
                                </>
                            )}/>
                            </div>}
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

export default BankRegister;