import React, { useEffect, useRef, useState } from 'react';
import * as moment from 'moment';
import { useForm, Controller } from 'react-hook-form';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { RadioButton } from "primereact/radiobutton";
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';

import SelectMasterData from '../../components/SelectMasterData';

import { TransactionService } from '../../../services/TransactionService';

import PaymentDialog from '../../components/PaymentDialog';

const PaymentRegister = () => {

    let emptyPayment = {
        payment_date: moment().format('YYYY-MM-DD'),
        payment_no: null,
        payment_type: '',   // dtCash, dtBank, dtMFS
        payment_method: 'CASH', // CASH, BANK, MFS
        party_type: '', // CUSTOMER, SUPPLIER, EMPLOYEE, OTHER
        party_id: null,
        bank_account_id: null,
        current_balance: 0,
        amount: 0,
    };
    
    const {
        register,
        control,
        formState: { errors },
        reset,
        setValue,
        handleSubmit
    } = useForm({
        defaultValues: emptyPayment
    });
    
    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    const toast = useRef(null);
    const dt = useRef(null);

    let defaultFilters = {
        fields: ["bank_account_id"],
        first: 0,
        rows: 10,
        page: 1,
        sortField: null,
        sortOrder: null,
        filters: {
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            'dtBankAccount_id': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'dtExpenseType_id': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'expensePeriod': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'date': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'amount': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'remarks': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'bankOrCash': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        }
    };

    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const [lazyParams, setLazyParams] = useState(defaultFilters);

    const [dlgTrigger, setDlgTrigger] = useState(0);
    const [paymentData, setPaymentData] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);

    const [receivePartyTypes, setReceivePartyTypes] = useState([
        { name: 'Customer', code: 'dtCustomer' }
        
    ]);
    const [dispatchPartyTypes, setDispatchPartyTypes] = useState([
        { name: 'Supplier', code: 'dtSupplier' }
    ]);
    const [partyType, setPartyType] = useState("dtCustomer");
    const [paymentType, setPaymentType] = useState("RECEIVE");
    const [initPayment, setInitPayment] = useState(emptyPayment);

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

    const loadLazyData = async () => {
        setLoading(true);

        // await transactionService.getAll(modelName, { params: JSON.stringify(lazyParams) }).then(data => {
        //     console.log(data)
        //     setLoading(false);
        // });
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

    const onGlobalFilterChange = (e) => {
        let _lazyParams = { ...lazyParams};
        console.log(_lazyParams);

        const value = e.target.value;

        setGlobalFilterValue(value);

        if(value === null || value === undefined || value === '' || value.length < 1) {
            return;
        }

        _lazyParams['filters']['global'].value = value;
        _lazyParams['first'] = 0;
        setLazyParams(_lazyParams);

    };

    const onPaymnetSubmit = (formData) => {
        console.log("selected Payment--1:::", emptyPayment);
        console.log("selected Payment--2:::", formData);
        console.log("selected Payment--3:::", {
            ...emptyPayment,
            ...formData,
        });
        setInitPayment({
            ...emptyPayment,
            ...formData,
        });
        console.log("InitPayment::", initPayment);
        setDlgTrigger(dlgTrigger + 1);
    }

    const onSelectPaymentType = (value) => {
        let partyType = value==="RECEIVE"?"dtCustomer":"dtSupplier";
        console.log("SELECT-PAYMENT-TYPE", value, partyType)
        setValue("party_type", partyType);
        setPartyType(partyType);
        setValue("party_id", null);
        setPaymentType(value);
    }

    const onSelectPartyType = (value) => {
        // console.log(value)
        setPartyType(value);
    }

    const onPaymnetCallback = (data) => {
        console.log("onPaymnetCallback", data);
        // call api to save data
        setSubmitted(true);
        transactionService.commitPayment(data).then(data => {
            console.log(data);
            setSubmitted(false);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Payment Created', life: 3000 });
        }).catch(error => {
            console.log(error);
            setSubmitted(false);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Payment Creation Failed', life: 3000 });
        });
    }

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="flex justify-content-between">
                    <Button label="New Payment" icon="pi pi-plus" className="p-button-success mr-2" onClick={handleSubmit((d) => onPaymnetSubmit(d))} />
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

    const expenseTypeFilterTemplate = (options) => {
        // return <Dropdown value={options.value} optionValue="_id" optionLabel="name" options={expenseType} onChange={(e) => options.filterCallback(e.value, options.index)} placeholder="Select One" className="p-column-filter" showClear />;
    };

    const expenseBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.dtExpenseType_id_shortname}
            </>
        );
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter} />
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
                </span>
            </div>
        );
    };

    return (
        <div className="grid crud-demo">
            <div className="form-demo">
                <div className="card col-12">
                    <h5>Payment Information:</h5>
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-6">
                        <div>Payment type:</div>
                        <Controller
                            name="payment_type"
                            control={control}
                            rules={{ required: 'Value is required.' }}
                            render={({ field }) => (
                                <>
                                    <div className="flex align-items-center">
                                        <RadioButton inputId="f5" {...field} inputRef={field.ref} value="RECEIVE" 
                                            checked={field.value === 'RECEIVE'}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                onSelectPaymentType(e.value);
                                            }}
                                         />
                                        <label htmlFor="f5" className="ml-1 mr-3">
                                            Receive Payment
                                        </label>

                                        <RadioButton inputId="f6" {...field} value="DISPATCH"
                                            checked={field.value === 'DISPATCH'}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                onSelectPaymentType(e.value);
                                            }}
                                        />
                                        <label htmlFor="f6" className="ml-1 mr-3">
                                            Dispatch Payment
                                        </label>
                                    </div>
                                    {getFormErrorMessage(field.name)}
                                </>
                            )}
                        />
                        </div>

                        <div className="field col-12 md:col-6">
                            <Controller
                                name="party_type"
                                control={control}
                                rules={{ required: 'Party Type is required.' }}
                                render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Party Type*</label>
                                    {paymentType==="RECEIVE" && <Dropdown
                                        value={field.value}
                                        optionValue="code" 
                                        optionLabel="name"
                                        placeholder="Select a Party Type"
                                        options={receivePartyTypes}
                                        onChange={(e) => {
                                            field.onChange(e.value)
                                            onSelectPartyType(e.value)
                                        }}
                                        className={classNames({ 'p-invalid': fieldState.error })}
                                    />}
                                    {paymentType==="DISPATCH" && <Dropdown
                                        value={field.value}
                                        optionValue="code" 
                                        optionLabel="name"
                                        placeholder="Select a Party Type"
                                        options={dispatchPartyTypes}
                                        onChange={(e) => {
                                            field.onChange(e.value)
                                            onSelectPartyType(e.value)
                                        }}
                                        className={classNames({ 'p-invalid': fieldState.error })}
                                    />}
                                    {getFormErrorMessage(field.name)}
                                </>
                            )}/>
                        </div>

                        <div className="field col-12 md:col-6">
                            <Controller
                                name="party_id"
                                control={control}
                                rules={{ required: 'Party is required.' }}
                                render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Select Party*</label>
                                    <SelectMasterData field={field} modelName={partyType}
                                        displayField="name" showFields={["name"]}
                                        onSelect={(e) => {console.log(e);}}
                                        className={classNames({ 'p-invalid': fieldState.error })} 
                                        columns={[
                                            {field: 'name', header: 'Party Name', filterPlaceholder: 'Filter by Party Name'}
                                        ]} />
                                    {getFormErrorMessage(field.name)}
                                </>
                            )}/>
                        </div>

                        <div className="field col-12 md:col-6">
                            <Controller
                                name="current_balance"
                                control={control}
                                // rules={{ required: 'Current Balance is required.' }}
                                render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Current Balance*</label>
                                    <InputNumber inputId={field.name} value={field.value} inputRef={field.ref} 
                                        className={classNames({ 'p-invalid': fieldState.error })}
                                        onValueChange={(e) => field.onChange(e)} 
                                        />                                
                                    {getFormErrorMessage(field.name)}
                                </>
                            )}/>
                        </div>

                    </div>
                </div>
            </div>
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>


                    <DataTable
                        ref={dt} value={paymentData} dataKey="_id" 
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
                        <Column field="payment_date" header="Payment Date" filter filterElement={expenseTypeFilterTemplate} sortable body={expenseBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        {/* <Column field="payment_type" header="Payment Type" filter filterElement={expenseTypeFilterTemplate} sortable body={expenseBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column> */}
                        <Column field="payment_method" header="Payment Method" filter filterElement={expenseTypeFilterTemplate} sortable body={expenseBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="amount" header="Payment Amount" filter filterElement={expenseTypeFilterTemplate} sortable body={expenseBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="party_name" header="Party Name" filter filterElement={expenseTypeFilterTemplate} sortable body={expenseBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="bank_account_name" header="Bank Account" filter filterElement={expenseTypeFilterTemplate} sortable body={expenseBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                    </DataTable>
                </div>
            </div>
            <PaymentDialog 
                trigger={dlgTrigger} 
                initPayment={initPayment}
                onPaymnetCallback={onPaymnetCallback}
                />
        </div>
    );
};

export default PaymentRegister;