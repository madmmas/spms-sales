import React, { useEffect, useRef, useState } from 'react';
import { Toolbar } from 'primereact/toolbar';
import * as moment from 'moment';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { useForm, Controller } from 'react-hook-form';
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea'
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';

import SelectMasterData from '../../components/SelectMasterData';
import { TransactionService } from '../../../services/TransactionService';
import { ON_CASH_TO_BANK, ON_BANK_TO_CASH } from '../../../constants/transactions';
import { BANK_REGISTER, BANK_ACCOUNT_MODEL } from '../../../constants/models';

const BankRegister = () => {

    const modelName = BANK_REGISTER;

    let emptyBankRegister = {
        dtBankAccount_id: null,
        date: null,
        amount: 0,
        balance: 0,
        remarks: '',
    };

    const {
        register,
        control,
        formState: { errors },
        reset,
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
        // fields: ["date", "dtBankAccount_id", "amount", "balance", "remarks"],
        first: 0,
        rows: 10,
        page: 1,
        sortField: null,
        sortOrder: null,
        filters: { 
            'date': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },           
            'dtBankAccount_id': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },            
            'amount': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'balance': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },            
            'remarks': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        }
    };

    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [dtBankRegister, setBankRegister] = useState(null);
    const [empProfileDialog, setBankRegisterDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [addWithdraw, setAddWithdraw] = useState(false);
    const [lazyParams, setLazyParams] = useState(defaultFilters);

    let loadLazyTimeout = null;

    const transactionService = new TransactionService();

    useEffect(() => {
        initFilters();
        // transactionService.getAllWithoutParams(BANK_MODEL).then(data => {
        //     setBankRegister(data);
        // });
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

        transactionService.getAll(modelName, { params: JSON.stringify(lazyParams) }).then(data => {
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

    const bankAccountBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.dtBankAccount_id_shortname}
            </>
        );
    };

    const refBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.ref_id_shortname}
            </>
        );
    };

    const particularTypeBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.particularType}
            </>
        );
    };

    const bankAccountFilterTemplate = (options) => {
        return <Dropdown value={options.value} optionValue="_id" optionLabel="name" options={BankRegister} onChange={(e) => options.filterCallback(e.value, options.index)} placeholder="Select One" className="p-column-filter" showClear />;
    };

    const refFilterTemplate = (options) => {
        return <Dropdown value={options.value} optionValue="_id" optionLabel="name" options={BankRegister} onChange={(e) => options.filterCallback(e.value, options.index)} placeholder="Select One" className="p-column-filter" showClear />;
    };

    const particularTypeFilterTemplate = (options) => {
        return <Dropdown value={options.value} optionValue="_id" optionLabel="name" options={BankRegister} onChange={(e) => options.filterCallback(e.value, options.index)} placeholder="Select One" className="p-column-filter" showClear />;
    };

    const dateBodyTemplate = (rowData) => {
        return (
            <>
                {moment(rowData.date).format('DD/MM/YYYY')}
            </>
        );
    };

    const amountBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.amount}
            </>
        );
    };

    const balanceBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.balance}
            </>
        );
    };

    const remarksBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.remarks}
            </>
        );
    };

    const addToBank = () => {
        // transfer bank to cash
        setAddWithdraw(true);
        reset({ ...emptyBankRegister });        
        setSubmitted(false);
        setBankRegisterDialog(true);
    };

    const withdrawFromBank = () => {
        // transfer cash to bank
        setAddWithdraw(false);
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
        console.debug(formData);
        if (addWithdraw) {
            transactionService.processTransaction(ON_CASH_TO_BANK, formData).then(data => {            
                console.log(data);
                loadLazyData();
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Bank Register Updated', life: 3000 });
            });
        } else {
            transactionService.processTransaction(ON_BANK_TO_CASH, formData).then(data => {            
                console.log(data);
                loadLazyData();
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Bank Register Created', life: 3000 });
            });
        }

        setBankRegisterDialog(false);
        reset(emptyBankRegister)
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button onClick={() => addToBank()} className="p-button p-button-primary mr-2" label="Add to Bank" />
                <Button onClick={() => withdrawFromBank()} className="p-button p-button-success mr-2" label="Withdraw from Bank" />
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
                <h5 className="m-0">Bank Register</h5>
                <Button type="button" icon="pi pi-filter-slash" label="Refresh" className="p-button-outlined" onClick={clearFilter} />
            </div>
        )
    }

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt} value={dtBankRegister} dataKey="_id" 
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
                        <Column field="date" header="Date" filter filterPlaceholder="Search by Date" sortable body={dateBodyTemplate} headerStyle={{ minWidth: '8rem' }}></Column>
                        <Column field="dtBankAccount_id" header="Bank Account" filter filterElement={bankAccountFilterTemplate} sortable body={bankAccountBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="particularType" header="Particular Type" filter filterElement={particularTypeFilterTemplate} sortable body={particularTypeBodyTemplate} headerStyle={{ minWidth: '8rem' }}></Column>
                        <Column field="ref_id" header="Particular Name" filter filterElement={refFilterTemplate} sortable body={refBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="amount" header="Amount" filter filterPlaceholder="Search by Amount" sortable body={amountBodyTemplate} headerStyle={{ minWidth: '8rem' }}></Column>                        
                        <Column field="balance" header="Balance" filter filterPlaceholder="Search by Balance" sortable body={balanceBodyTemplate} headerStyle={{ minWidth: '8rem' }}></Column>                        
                        <Column field="remarks" header="Remarks" filter filterPlaceholder="Search by remarks" sortable body={remarksBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                    </DataTable>
                    <Dialog visible={empProfileDialog} style={{ width: '450px' }} header={`${addWithdraw?"Add To":"Withdraw From"} Bank`} modal className="p-fluid" footer={empProfileDialogFooter} onHide={hideDialog}>                    
                        <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-6">
                            <Controller
                                name="date"
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
                                    name="dtBankAccount_id"
                                    control={control}
                                    rules={{ required: 'Bank Account is required.' }}
                                    render={({ field, fieldState }) => (
                                    <>
                                        <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Bank Name*</label>
                                        <SelectMasterData field={field} modelName={BANK_ACCOUNT_MODEL}
                                            displayField="accName" showFields={["dtBank_id", "accNumber", "accName"]}
                                            onSelect={(e) => {console.log(e);}}
                                            className={classNames({ 'p-invalid': fieldState.error })} 
                                            columns={[
                                                {field: 'dtBank_id_shortname', header: 'Bank Name', filterPlaceholder: 'Filter by Bank Name'}, 
                                                {field: 'accNumber', header: 'Account Number', filterPlaceholder: 'Filter by Account Number'},
                                                {field: 'accName', header: 'Account Name', filterPlaceholder: 'Filter by Account Name'}
                                            ]} />
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
                                rules={{ required: 'Remarks is required.' }}
                                render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor="remarks">Remarks*</label>
                                    <InputTextarea inputId={field.name} value={field.value} inputRef={field.ref} keyfilter="text" 
                                        className={classNames({ 'p-invalid': fieldState.error })} 
                                        onChange={(e) => field.onChange(e.target.value)} rows={3} cols={20} />
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