import * as moment from 'moment';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
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
import SelectMasterData from '../components/SelectMasterData';
import React, { useEffect, useRef, useState } from 'react';

import { ConfigurationService } from '../../services/ConfigurationService';
import { TransactionService } from '../../services/TransactionService';
import { getConstantNameById } from '../../utils';
import { BANK_CASH, COLLECTION_TYPES } from '../../constants/lookupData';
import { ON_EXTRA_INCOME_TO_CASH, ON_EXTRA_INCOME_TO_BANK } from '../../constants/transactions';

import { EXTRA_INCOME_MODEL, EXTRA_INCOME_TYPE_MODEL, BANK_ACCOUNT_MODEL } from '../../constants/models';

const ExtraIncome = () => {

    const modelName = EXTRA_INCOME_MODEL;

    let emptyExtraIncome = {
        _id: null,
        dtBankAccount_id: null,
        dtExtraIncomeType_id: null,
        dtCollectionType_id: null,
        date: null,
        amount: 0,
        remarks: '',
    };
    
    const {
        register,
        control,
        formState: { errors },
        reset,
        handleSubmit
    } = useForm({
        defaultValues: emptyExtraIncome
    });
    
    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };
    const toast = useRef(null);
    const dt = useRef(null);

    let defaultFilters = {        
        fields: ["dtBankAccount_id", "dtExtraIncomeType_id", "dtCollectionType_id", "date", "amount",  "remarks"],
        first: 0,
        rows: 10,
        page: 1,
        sortField: null,
        sortOrder: null,
        filters: {
            'dtBankAccount_id': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'dtExtraIncomeType_id': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'dtCollectionType_id': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'date': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'amount': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'remarks': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        }
    };

    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [expenseData, setExpenseData] = useState(null);
    const [empProfileDialog, setExtraIncomeDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [createEdit, setCreateEdit] = useState(true);

    const [extraIncomeType, setExtraIncomeType] = useState([]);
    const [bankCash, setBankCash] = useState("CASH");

    const [lazyParams, setLazyParams] = useState(defaultFilters);

    const transactionService = new TransactionService();
    const configurationService = new ConfigurationService();
    let loadLazyTimeout = null;

    useEffect(() => {
        initFilters();
        configurationService.getAllWithoutParams(EXTRA_INCOME_TYPE_MODEL).then(data => {
            setExtraIncomeType(data);
        });
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
            transactionService.getAll(modelName, { params: JSON.stringify(lazyParams) }).then(data => {
                console.log(data)
                setTotalRecords(data.total);
                setExpenseData(data.rows);
                setLoading(false);
            });
        }, Math.random() * 1000 + 250);
    }

    const openNew = () => {
        setCreateEdit(true);
        reset({ ...emptyExtraIncome });
        setBankCash("CASH");
        setSubmitted(false);
        setExtraIncomeDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setExtraIncomeDialog(false);
    };

    const saveExtraIncome = (formData) => {
        setSubmitted(true);
        console.debug(formData);
        if (bankCash == 'BANK') {
            transactionService.processTransaction(ON_EXTRA_INCOME_TO_BANK, formData).then(data => {
                console.log(data);
                loadLazyData();
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Extra Income Created', life: 3000 });
            });
        } else {
            transactionService.processTransaction(ON_EXTRA_INCOME_TO_CASH, formData).then(data => {
                console.log(data);
                loadLazyData();
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Extra Income Created', life: 3000 });
            });
        }

        setExtraIncomeDialog(false);
        reset(emptyExtraIncome)
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

    const extraIncomeTypeFilterTemplate = (options) => {
        return <Dropdown value={options.value} optionValue="_id" optionLabel="name" options={extraIncomeType} onChange={(e) => options.filterCallback(e.value, options.index)} placeholder="Select One" className="p-column-filter" showClear />;
    };

    const bankAccountFilterTemplate = (options) => {
        return <Dropdown value={options.value} optionValue="_id" optionLabel="name" options={extraIncomeType} onChange={(e) => options.filterCallback(e.value, options.index)} placeholder="Select One" className="p-column-filter" showClear />;
    };

    const expenseBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.dtExtraIncomeType_id_shortname}
            </>
        );
    };

    const bankAccountBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.dtBankAccount_id_shortname}
            </>
        );
    };
    
    const collectionTypeBodyTemplate = (rowData) => {
        return (
            <>
                {getConstantNameById(rowData.dtCollectionType_id, COLLECTION_TYPES)}
            </>
        );
    };

    const collectionTypeFilterTemplate = (options) => {
        return <Dropdown value={options.value} optionValue="id" optionLabel="name" options={COLLECTION_TYPES} onChange={(e) => options.filterCallback(e.value, options.index)} placeholder="Select One" className="p-column-filter" showClear />;
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
                <h5 className="m-0">Manage Extra Income</h5>
                <Button type="button" icon="pi pi-filter-slash" label="Clear" className="p-button-outlined" onClick={clearFilter} />
            </div>
        )
    }

    const empProfileDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button disabled={submitted} label="Save" icon="pi pi-check" className="p-button-text" onClick={handleSubmit((d) => saveExtraIncome(d))} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt} value={expenseData} dataKey="_id" 
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
                        <Column field="date" header="Date" filter filterPlaceholder="Search by Date" sortable body={dateBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="dtExtraIncomeType_id" header="Extra Income Type" filter filterElement={extraIncomeTypeFilterTemplate} sortable body={expenseBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="dtCollectionType_id" header="Collection Type" filter  filterElement={collectionTypeFilterTemplate} sortable body={collectionTypeBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="dtBankAccount_id" header="Bank Account" filter filterElement={bankAccountFilterTemplate} sortable body={bankAccountBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="amount" header="Amount" filter filterPlaceholder="Search by Amount" sortable body={amountBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="remarks" header="Remarks" filter filterPlaceholder="Search by remarks" sortable body={remarksBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                    </DataTable>

                    <Dialog visible={empProfileDialog} style={{ width: '450px' }} header={`${createEdit?"Create":"Edit"} Extra Income`} modal className="p-fluid" footer={empProfileDialogFooter} onHide={hideDialog}>                    
                        <div className="p-fluid formgrid grid">
                            <div className="field col-12 md:col-6">
                                <Controller
                                    name="dtExtraIncomeType_id"
                                    control={control}
                                    rules={{ required: 'Extra Income Type Id is required.' }}
                                    render={({ field, fieldState }) => (
                                    <>
                                        <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Extra Income Type*</label>
                                        <SelectLookupData field={field} model={EXTRA_INCOME_TYPE_MODEL}
                                            className={classNames({ 'p-invalid': fieldState.error })} /> 
                                        {getFormErrorMessage(field.name)}
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
                                        className={classNames({ 'p-invalid': fieldState.error })} />
                                    {getFormErrorMessage(field.name)}
                                </>
                            )}/>
                            </div>
                            <div className="field col-12 md:col-6">
                            <Controller
                                name="dtCollectionType_id"
                                control={control}
                                render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Collection Type</label>
                                    <SelectConstData field={field} data={COLLECTION_TYPES}
                                        onSelectChange={(value) => {console.log(value); setBankCash(value)}}
                                        className={classNames({ 'p-invalid': fieldState.error })} /> 
                                    {getFormErrorMessage(field.name)}
                                </>
                            )}/>
                            </div>
                            <div hidden={bankCash !== "BANK"} className="field col-12 md:col-6">
                            <Controller
                                name="dtBankAccount_id"
                                control={control}
                                rules={{ 
                                    validate: (value) => ((bankCash === "CASH") || (bankCash === "BANK" && value !== null) ) || 'Bank Account is required.'
                                }}
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

export default ExtraIncome;