import * as moment from 'moment';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { useForm, Controller } from 'react-hook-form';
import { InputNumber } from 'primereact/inputnumber';
import SelectConstData from '../components/SelectConstData';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { classNames } from 'primereact/utils';
import SelectLookupData from '../components/SelectLookupData';

import BankAccount from '../components/master_data/BankAccount';
import MFSAccount from '../components/master_data/MFSAccount';

import React, { useEffect, useRef, useState } from 'react';

import { TransactionService } from '../../services/TransactionService';
import { RegisterService } from '../../services/RegisterService';

import { BANK_CASH } from '../../constants/lookupData';
import { INCOME_MODEL, INCOME_TYPE_MODEL } from '../../constants/models';

import { MasterDataDBService } from '../../services/MasterDataDBService';

import { getFormattedNumber, getDateFormatted } from '../../utils';

const Income = () => {

    const modelName = INCOME_MODEL;

    let emptyIncome = {
        id: null,
        dtBankAccount_id: null,
        dtMFSAccount_id : null,
        dtIncomeType_id: null,
        incomePeriod: null,
        date: new Date(),
        amount: 0,
        remarks: '',
        income_to: 'CASH',
    };
    
    const {
        control,
        formState: { errors },
        setValue,
        reset,
        handleSubmit
    } = useForm({
        defaultValues: emptyIncome
    });
    
    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };
    const toast = useRef(null);
    const dt = useRef(null);

    let defaultFilters = {
        fields: ["dtBankAccount_id","dtMFSAccount_id","dtIncomeType_id","incomePeriod","date","amount","remarks","income_to"],
        first: 0,
        rows: 10,
        page: 1,
        sortField: null,
        sortOrder: null,
        filters: {
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            'dtBankAccount_id': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'dtMFSAccount_id': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'dtIncomeType_id': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'incomePeriod': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'date': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'amount': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'remarks': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'income_to': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        }
    };

    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [incomeData, setIncomeData] = useState(null);
    const [empProfileDialog, setIncomeDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [createEdit, setCreateEdit] = useState(true);
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const [incomeType, setIncomeType] = useState([]);
    const [bankCash, setBankCash] = useState("CASH");

    const [lazyParams, setLazyParams] = useState(defaultFilters);
    const [loadCount, setLoadCount] = useState(0);
    const [trxId, setTrxId] = useState(0);
    const [trxNo, setTrxNo] = useState("");

    const transactionService = new TransactionService();
    const registerService = new RegisterService();
    const masterDataDBService = new MasterDataDBService();

    useEffect(() => {
        if(loadCount==1){
            masterDataDBService.getAll(INCOME_TYPE_MODEL).then(data => {
                setIncomeType(data.rows);
            });
            setLoadCount(loadCount+1);
            loadLazyData();
        }
    }, [loadCount]);
    
    useEffect(() => {
        loadLazyData();
    }, [lazyParams]);
    
    const clearFilter = () => {
        initFilters();
    }

    const initFilters = () => {
        setLazyParams(defaultFilters);
    }

    const loadLazyData = async () => {
        setLoading(true);

        registerService.getAll(modelName, { params: JSON.stringify(lazyParams) }).then(data => {
            setTotalRecords(data.total);
            setIncomeData(data.rows);
            setLoading(false);
        });
    }

    const openNew = () => {
        setCreateEdit(true);
        setTrxId(0);
        setTrxNo("");
        reset({ ...emptyIncome });
        setBankCash("CASH");
        setSubmitted(false);
        setIncomeDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setIncomeDialog(false);
    };

    const saveIncome = (formData) => {
        setSubmitted(true);
        formData.id = trxId;
        formData.trx_no = trxNo;
        transactionService.generaleIncome(formData).then(data => {
            setIncomeDialog(false);
            loadLazyData();
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Income Created', life: 3000 });
        });

        reset(emptyIncome)
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

    const editData = (rowData) => {
        setCreateEdit(false);
        setBankCash(rowData.income_to);
        setSubmitted(false);
        setIncomeDialog(true);
        console.log("rowData::", rowData);
        setTrxId(rowData.id);
        setTrxNo(rowData.trx_no);
        setValue("dtIncomeType_id", parseInt(rowData.dtIncomeType_id));
        setValue("incomePeriod", rowData.incomePeriod);

        moment.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';
        // Parse the input date using moment
        const formattedDate = moment(rowData.register_date).toDate();
        setValue("date", formattedDate);
        setValue("amount", rowData.amount);
        setValue("remarks", rowData.remarks);
        setValue("income_to", rowData.income_to);
        if(rowData.income_to === "BANK") {
            setValue("dtBankAccount_id", rowData.dtBankAccount_id);
        } else if(rowData.income_to === "MFS") {
            setValue("dtMFSAccount_id", rowData.dtMFSAccount_id);
        }
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

    const incomeTypeFilterTemplate = (options) => {
        return <Dropdown value={options.value} optionValue="id" optionLabel="name" options={incomeType} onChange={(e) => options.filterApplyCallback(e.value, options.index)} placeholder="Select One" className="p-column-filter" />;
    };

    const trxNoBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.trx_no}
            </>
        );
    };

    const incomeBodyTemplate = (rowData) => {
        return (
            <>
                {masterDataDBService.getShortnameById("dtIncomeType", rowData.dtIncomeType_id)}
            </>
        );
    };

    const incomePeriodBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.incomePeriod}
            </>
        );
    };

    const dateBodyTemplate = (rowData) => {
        return (
            <>
                {getDateFormatted(rowData.register_date)}
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

    const bankorcashFilterTemplate = (options) => {
        return <Dropdown value={options.value} optionValue="id" optionLabel="name" options={BANK_CASH} onChange={(e) => options.filterApplyCallback(e.value, options.index)} placeholder="Select One" className="p-column-filter" />;
    };

    const bankorcashBodyTemplate = (rowData) => {
        let incomeTo = "CASH";
        if(rowData.income_to === "BANK") {
            incomeTo = masterDataDBService.getShortnameById("dtBankAccount", rowData.dtBankAccount_id)
        } else if(rowData.income_to === "MFS") {
            incomeTo = masterDataDBService.getShortnameById("dtMFSAccount", rowData.dtMFSAccount_id)
        }
        return (
            <>
                {incomeTo}
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

    const empProfileDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button disabled={submitted} label="Save" icon="pi pi-check" className="p-button-text" onClick={handleSubmit((d) => saveIncome(d))} />
        </>
    );

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editData(rowData)} />
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
                        ref={dt} value={incomeData} dataKey="id" 
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
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="trx_no" header="Trx NO" filter sortable body={trxNoBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="dtIncomeType_id" header="Income Type" filter filterElement={incomeTypeFilterTemplate} sortable body={incomeBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="incomePeriod" header="Income Period" filter filterPlaceholder="Search by Income Period" sortable body={incomePeriodBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="date" header="Date" filter filterPlaceholder="Search by Date" sortable body={dateBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="income_to" header="Income Received In" filter filterElement={bankorcashFilterTemplate} sortable body={bankorcashBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column style={{fontWeight: 'bold', textAlign: 'right'}} field="amount" header="Amount" filter body={amountBodyTemplate} sortable  headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="remarks" header="Remarks" filter filterPlaceholder="Search by remarks" sortable body={remarksBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                    </DataTable>

                    <Dialog visible={empProfileDialog} style={{ width: '450px' }} header={`${createEdit?"Create":"Edit"} Income`} modal className="p-fluid" footer={empProfileDialogFooter} onHide={hideDialog}>                    
                        <div className="p-fluid formgrid grid">
                            <div className="field col-12 md:col-6">
                                <Controller
                                    name="dtIncomeType_id"
                                    control={control}
                                    rules={{ required: 'Income Type is required.' }}
                                    render={({ field, fieldState }) => (
                                    <>
                                        <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Income Type*</label>
                                        <SelectLookupData field={field} model={INCOME_TYPE_MODEL}
                                            className={classNames({ 'p-invalid': fieldState.error })} />
                                        {getFormErrorMessage(field.name)}
                                    </>
                                )}/>
                            </div>
                            <div className="field col-12 md:col-6">
                                <Controller
                                    name="incomePeriod"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                    <>
                                        <label htmlFor="incomePeriod">Income Period</label>
                                        <InputText inputId={field.name} value={field.value} inputRef={field.ref} 
                                            onChange={(e) => field.onChange(e.target.value)} 
                                            className={classNames({ 'p-invalid': fieldState.error })} />
                                    </>
                                )}/>
                            </div>
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
                                        maxFractionDigits={2}
                                        className={classNames({ 'p-invalid': fieldState.error })} />
                                    {getFormErrorMessage(field.name)}
                                </>
                            )}/>
                            </div>
                            <div className="field col-12 md:col-6">
                            <Controller
                                name="income_to"
                                control={control}
                                render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Bank or Cash or MFS</label>
                                    <SelectConstData field={field} data={BANK_CASH}
                                        onSelectChange={(value) => {console.log(value); setBankCash(value)}}
                                        className={classNames({ 'p-invalid': fieldState.error })} /> 
                                    {getFormErrorMessage(field.name)}
                                </>
                            )}/>
                            </div>
                            
                            {bankCash === "BANK" && <div className="field col-12 md:col-6">
                            <Controller
                                name="dtBankAccount_id"
                                control={control}
                                rules={{ 
                                    validate: (value) => ((bankCash === "CASH") || (bankCash === "BANK" && value !== null) ) || 'Bank Account is required.'
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
                            {bankCash === "MFS" && <div className="field col-12 md:col-6">
                            <Controller
                                name="dtMFSAccount_id"
                                control={control}
                                rules={{ 
                                    validate: (value) => ((bankCash === "CASH") || (bankCash === "MFS" && value !== null) ) || 'MFS Account is required.'
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

                            <div className="field col-12 md:col-12">
                            <Controller
                                name="remarks"
                                control={control}
                                render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor="remarks">Remarks*</label>
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

export default Income;