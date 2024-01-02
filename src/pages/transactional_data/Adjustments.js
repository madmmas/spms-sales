import * as moment from 'moment';
import React, { useEffect, useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { Column } from 'primereact/column';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import ConfirmDialog from '../components/ConfirmDialog';

import Custmer from '../components/master_data/Custmer';
import Supplier from '../components/master_data/Supplier';

import { MasterDataDBService } from '../../services/MasterDataDBService';
import { RegisterService } from '../../services/RegisterService';
import { OrderService } from '../../services/OrderService';
import { TransactionService } from '../../services/TransactionService';

const Adjustments = () => {

    const dt = useRef(null);
    const toast = useRef(null);

    let emptyAdjustment = {
        adjustment_date: moment().format('YYYY-MM-DD'),
        adjustment_no: null,
        adjustment_type: 'RECEIVABLE', // RECEIVABLE, PAYABLE
        ref_type: '', // CUSTOMER, SUPPLIER, EMPLOYEE, OTHER
        ref_id: null,
        current_balance: 0,
        amount: 0,
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
        defaultValues: emptyAdjustment
    });

    let defaultFilters = {
        fields: ["id", "register_date", "register_details", "address"],
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
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const [lazyParams, setLazyParams] = useState(defaultFilters);
    const [submitted, setSubmitted] = useState(false);
    const [partyTypes, setPartyTypes] = useState([
        { name: 'Customer', code: 'dtCustomer' },
        { name: 'Supplier', code: 'dtSupplier' }
        
    ]);
    const [adjustmentTypes, setAdjustmentTypes] = useState([
        { name: 'AC Receivable', code: 'RECEIVABLE' },
        { name: 'AC Payable', code: 'PAYABLE' },
        // { name: 'Bank', code: 'BANK' },
        // { name: 'MFS', code: 'MFS' },        
        // { name: 'Cash', code: 'CASH' },
    ]);
    const [partyType, setPartyType] = useState("dtCustomer");
    const [adjustmentType, setAdjustmentType] = useState("RECEIVABLE");
    const [initAdjustment, setInitAdjustment] = useState(emptyAdjustment);
    const [dlgTrigger, setDlgTrigger] = useState(0);

    const [adjustmentData, setAdjustmentData] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);

    const transactionService = new TransactionService();
    const orderService = new OrderService();
    const registerService = new RegisterService();
    const masterDataDBService = new MasterDataDBService();

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

        registerService.getAll("trxLedgerAdjustment", { params: JSON.stringify(lazyParams) }).then(data => {
            console.log(data)
            setTotalRecords(data.total);
            setAdjustmentData(data.rows);
            setLoading(false);
        });
    }

    const onSelectAdjustmentType = (value) => {
        setAdjustmentType(value);
    }

    const onSelectPartyType = (value) => {
        setPartyType(value);
        setValue("ref_id", null);
        setValue("current_balance", 0);
    }

    const onAdjustmentCallback = (data) => {
        console.log("onPaymnetCallback", data);
        setSubmitted(true);
        console.log("adjustmentType::", adjustmentType)
        transactionService.ledgerAdjustment(data).then(data => {
            console.log(data);
            setSubmitted(false);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Adjustment Created', life: 3000 });
            reset({
                "ref_type": partyType,
                "ref_id": null,
                "current_balance": 0,
                "adjustment_type": adjustmentType,
            })
            // reload data
            setLazyParams({ ...lazyParams });
        }).catch(error => {
            console.log(error);
            setSubmitted(false);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Adjustment Creation Failed', life: 3000 });
        });
    }

    const onPaymnetSubmit = (formData) => {
        setInitAdjustment({
            ...emptyAdjustment,
            ...formData,
        });
        setDlgTrigger(dlgTrigger + 1);
    }

    const getPartyBalance = (partyId) => {
        orderService.getLedgerBalance(partyType, partyId).then(data => {
            if(data){
                let dr_amount = Number(data.dr_amount)||0;
                let cr_amount = Number(data.cr_amount)||0;
                let balance = dr_amount - cr_amount;
                if(balance < 0){
                    setValue("current_balance", -balance); 
                } else {
                    setValue("current_balance", balance); 
                }
            }
        });
    }

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
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

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <div>
                <Button type="button" icon="pi pi-filter-slash" label="Refresh" outlined onClick={clearFilter} />
                <Button label="Export" icon="pi pi-upload" className="p-button-help" outlined onClick={exportCSV} />
                </div>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
                </span>
            </div>
        );
    };

    const renderAdjustmentForm = () => {
        return (     
        <div className="form-demo">
            <div className="card col-12">
                <h5>Adjustment Information:</h5>
                <div className="p-fluid formgrid grid">
                    <div className="field col-12 md:col-4">
                        <Controller
                            name="adjustment_type"
                            control={control}
                            rules={{ required: 'Value is required.' }}
                            render={({ field, fieldState }) => (
                                <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Adjustment Type*</label>
                                <Dropdown
                                    value={field.value}
                                    optionValue="code" 
                                    optionLabel="name"
                                    placeholder="Select a Adjustment Type"
                                    options={adjustmentTypes}
                                    onChange={(e) => {
                                        field.onChange(e.value)
                                        onSelectAdjustmentType(e.value)
                                    }}
                                    className={classNames({ 'p-invalid': fieldState.error })}
                                    />
                                    {getFormErrorMessage(field.name)}
                                </>
                            )}
                        />
                    </div>
                    <div className="field col-12 md:col-3">
                        <Controller
                            name="ref_type"
                            control={control}
                            rules={{ required: 'Party Type is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Party Type*</label>
                                <Dropdown
                                    value={field.value}
                                    optionValue="code" 
                                    optionLabel="name"
                                    placeholder="Select a Party Type"
                                    options={partyTypes}
                                    onChange={(e) => {
                                        field.onChange(e.value)
                                        onSelectPartyType(e.value)
                                    }}
                                    className={classNames({ 'p-invalid': fieldState.error })}
                                />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>

                    {partyType == "dtCustomer" && <div className="field col-12 md:col-5">
                        <Controller
                            name="ref_id"
                            control={control}
                            rules={{ required: 'Party is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Select Party*</label>
                                <Custmer field={field} fieldState={fieldState} 
                                    onSelect={(e) => {
                                        field.onChange(e.id);
                                    }}/>
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>}
                    {partyType == "dtSupplier" && <div className="field col-12 md:col-5">
                        <Controller
                            name="ref_id"
                            control={control}
                            rules={{ required: 'Party is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Select Party*</label>
                                <Supplier field={field} fieldState={fieldState}
                                    onSelect={(e) => {
                                        field.onChange(e.id);
                                    }}/>
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>}

                    <div className="field col-12 md:col-3">
                        <Controller
                            name="current_balance"
                            control={control}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Current Balance*</label>
                                <InputNumber inputId={field.name} value={field.value} inputRef={field.ref} 
                                    className={classNames({ 'p-invalid': fieldState.error })}
                                    onValueChange={(e) => field.onChange(e)}
                                    readOnly={true}
                                    />                                
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>
                    
                    <div className="field col-12 md:col-3">
                        <Controller
                            name="amount"
                            control={control}
                            rules={{ 
                                required: 'Value is required.',
                                // min: { value: 1, message: 'Value must be greater than 0.' },
                                validate: {
                                    lessThanBalance: value => {
                                        return Number(value) <= Number(getValues('current_balance')) || 'Value must be less than or equal to current balance.';
                                    }
                                }
                            }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Adjustment Amount*</label>
                                <InputNumber inputId={field.name} value={field.value} inputRef={field.ref} 
                                    className={classNames({ 'p-invalid': fieldState.error })}
                                    onValueChange={(e) => field.onChange(e)}
                                    />                                
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>
                    
                    <div className="field col-12 md:col-6">
                    <Controller
                        name="remarks"
                        control={control}
                        rules={{ required: 'Value is required.' }}
                        render={({ field, fieldState }) => (
                        <>
                            <label htmlFor="remarks">Remarks*</label>
                            <InputTextarea inputId={field.name} value={field.value} inputRef={field.ref}  
                                onChange={(e) => field.onChange(e.target.value)} 
                                className={classNames({ 'p-invalid': fieldState.error })}/>
                            {getFormErrorMessage(field.name)}
                        </>
                    )}/>
                    </div>

                    <div className="col-12 md:col-12">
                        <div className="field col-12 md:col-4">
                            <Button label="Update Adjustment" icon="pi pi-plus" className="p-button-success mr-2" onClick={handleSubmit((d) => onPaymnetSubmit(d))} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )}

    const expenseTypeFilterTemplate = (options) => {
        // return <Dropdown value={options.value} optionValue="id" optionLabel="name" options={expenseType} onChange={(e) => options.filterApplyCallback(e.value, options.index)} placeholder="Select One" className="p-column-filter" showClear />;
    };

    const partyNameBodyTemplate = (rowData) => {
        return (
            <>
                {masterDataDBService.getShortnameById(rowData.ref_type, rowData.ref_id)}
            </>
        );
    };

    return (
        <div className="grid crud-demo">
            <Toast ref={toast} />
            <div className="col-12">
                {renderAdjustmentForm()}
                <div className="card">
                    <DataTable
                        ref={dt} value={adjustmentData} dataKey="id" 
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
                        <Column field="adjustment_date" header="Trx Date" filter filterElement={expenseTypeFilterTemplate}  sortable  headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="ref_id" header="Party Name" filter filterElement={expenseTypeFilterTemplate} body={partyNameBodyTemplate}  sortable  headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="adjustment_type" header="Adjustment Type" filter filterElement={expenseTypeFilterTemplate}  sortable  headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="remarks" header="Remarks" filter filterElement={expenseTypeFilterTemplate}  sortable  headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column style={{fontWeight: 'bold', textAlign: 'right'}} field="amount" header="Adjustment Amount" filter filterElement={expenseTypeFilterTemplate}  sortable  headerStyle={{ minWidth: '10rem' }}></Column>                        
                    </DataTable>
                </div>
            </div>
            <ConfirmDialog 
                message="Are you sure you want to save?"
                trigger={dlgTrigger}
                onConfirm={(e) => onAdjustmentCallback(initAdjustment)}
                />

        </div>
    );
}

export default Adjustments;