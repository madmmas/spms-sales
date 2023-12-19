import * as moment from 'moment';
import React, { useState, useRef, Suspense } from 'react';
import { useForm, Controller, set } from 'react-hook-form';
import { Button } from 'primereact/button';
import { TabMenu } from 'primereact/tabmenu';
import { RadioButton } from "primereact/radiobutton";
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';

import SelectMasterData from '../../components/SelectMasterData';

import { OrderService } from '../../../services/OrderService';
import { TransactionService } from '../../../services/TransactionService';

import { lazyRetry } from '../../components/LazyWithRetry';

import PaymentDialog2 from '../../components/PaymentDialog2';

const DispatchPayment = React.lazy(() => lazyRetry(() => import(/* webpackChunkName: "dispatchPayment" */ './DispatchPayment'), "dispatchPayment"));
const ReceivePayment = React.lazy(() => lazyRetry(() => import(/* webpackChunkName: "receivePayment" */ './ReceivePayment'), "receivePayment"));

const Detail = () => {

    const toast = useRef(null);

    let emptyPayment = {
        payment_date: moment().format('YYYY-MM-DD'),
        payment_no: null,
        payment_type: 'RECEIVE',   // dtCash, dtBank, dtMFS
        payment_method: 'CASH', // CASH, BANK, MFS
        ref_type: '', // CUSTOMER, SUPPLIER, EMPLOYEE, OTHER
        ref_id: null,
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

    const tabs = [
        { component: ReceivePayment },
        { component: DispatchPayment },
    ];

    const [activeIndex, setActiveIndex] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [partyTypes, setPartyTypes] = useState([
        { name: 'Customer', code: 'dtCustomer' },
        { name: 'Supplier', code: 'dtSupplier' }
        
    ]);
    const [partyType, setPartyType] = useState("dtCustomer");
    const [paymentType, setPaymentType] = useState("RECEIVE");
    const [initPayment, setInitPayment] = useState(emptyPayment);
    const [dlgTrigger, setDlgTrigger] = useState(0);
    const [receiveTrigger, setReceiveTrigger] = useState(0);
    const [dispatchTrigger, setDispatchTrigger] = useState(0);

    const transactionService = new TransactionService();
    const orderService = new OrderService();

    const items = [
        {label: 'Payment Received', icon: 'pi pi-fw pi-home'},
        {label: 'Payment Dispatched', icon: 'pi pi-fw pi-home'},
    ];

    const onSelectPaymentType = (value) => {
        setPaymentType(value);
        setActiveIndex(value==="RECEIVE"?0:1);
    }

    const onSelectTab = (value) => {
        setActiveIndex(value);
        setValue("payment_type", value===0?"RECEIVE":"DISPATCH");
        setPaymentType(value===0?"RECEIVE":"DISPATCH");
    }

    const onSelectPartyType = (value) => {
        setPartyType(value);
        setValue("ref_id", null);
        setValue("current_balance", 0);
    }

    const onPaymnetCallback = (data) => {
        setSubmitted(true);
        let _paymentType = paymentType==="RECEIVE"?"trxACReceivable":"trxACPayable";
        transactionService.commitPayment(_paymentType, data).then(data => {
            setSubmitted(false);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Payment Created', life: 3000 });
            reset({
                "ref_type": partyType,
                "ref_id": null,
                "current_balance": 0,
                "payment_type": paymentType,
            })
            if(paymentType==="RECEIVE"){
                setReceiveTrigger(receiveTrigger+1);
            }else{
                setDispatchTrigger(dispatchTrigger+1);
            }
        }).catch(error => {
            setSubmitted(false);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Payment Creation Failed', life: 3000 });
        });
    }

    const onPaymnetSubmit = (formData) => {
        setInitPayment({
            ...emptyPayment,
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
                setValue("current_balance", balance); 
            }
        });
    }

    const renderTabPanel = () => {
        const TabPanel = tabs[activeIndex].component;
        return <TabPanel trigger={activeIndex==0?receiveTrigger:dispatchTrigger} />;
    };

    const renderPaymentForm = () => {
        return (     
        <div className="form-demo">
            <div className="card col-12">
                <h5>Payment Information:</h5>
                <div className="p-fluid formgrid grid">
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

                    {partyType == "dtCustomer" && <div className="field col-12 md:col-3">
                        <Controller
                            name="ref_id"
                            control={control}
                            rules={{ required: 'Party is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Select Party*</label>
                                <SelectMasterData field={field} modelName="dtCustomer"
                                    caption='Select Customer'
                                    displayField="name" showFields={["name"]}
                                    onSelect={(e) => {
                                        getPartyBalance(e.id);
                                    }}
                                    defaultFilters={{
                                        fields: ["name","address","route","phone","contact_name"],
                                        first: 0,
                                        rows: 10,
                                        page: 1,
                                        sortField: null,
                                        sortOrder: null,
                                        filters: {
                                            global: { value: null, matchMode: 'contains' },
                                            name: { value: null, matchMode: 'contains' },
                                            address: { value: null, matchMode: 'contains' },
                                            route: { value: null, matchMode: 'contains' },
                                            phone: { value: null, matchMode: 'contains' },
                                            contact_name: { value: null, matchMode: 'contains' },
                                        }
                                    }}
                                    className={classNames({ 'p-invalid': fieldState.error })} 
                                    columns={[
                                        {field: 'name', header: 'Shop Name', filterPlaceholder: 'Filter by Shop Name'},
                                        {field: 'address', header: 'Address', filterPlaceholder: 'Filter by Address'},
                                        {field: 'route', header: 'Route', filterPlaceholder: 'Filter by Route'},
                                        {field: 'phone', header: 'phone', filterPlaceholder: 'Filter by Phone'},
                                        {field: 'contact_name', header: 'Contact Person', filterPlaceholder: 'Filter by Contact Person'},
                                    ]} />
                                    {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>}
                    {partyType == "dtSupplier" && <div className="field col-12 md:col-3">
                        <Controller
                            name="ref_id"
                            control={control}
                            rules={{ required: 'Party is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Select Party*</label>
                                <SelectMasterData field={field} modelName="dtSupplier"
                                    caption='Select Supplier'
                                    displayField="name" showFields={["name"]}
                                    onSelect={(e) => {
                                        getPartyBalance(e.id);
                                    }}
                                    defaultFilters={{
                                        fields: ["name","address","phone"],
                                        first: 0,
                                        rows: 10,
                                        page: 1,
                                        sortField: null,
                                        sortOrder: null,
                                        filters: {
                                            global: { value: null, matchMode: 'contains' },
                                            name: { value: null, matchMode: 'contains' },
                                            address: { value: null, matchMode: 'contains' },
                                            phone: { value: null, matchMode: 'contains' },
                                        }
                                    }}
                                    className={classNames({ 'p-invalid': fieldState.error })} 
                                    columns={[
                                        {field: 'name', header: 'Name', filterPlaceholder: 'Filter by Shop Name'},
                                        {field: 'address', header: 'Address', filterPlaceholder: 'Filter by Address'},
                                        {field: 'phone', header: 'phone', filterPlaceholder: 'Filter by Phone'},
                                    ]} />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>}

                    <div className="field col-12 md:col-3">
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
                                    readOnly={true}
                                    />                                
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>
                    <div className="field col-12 md:col-3">
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
                                        Receive
                                    </label>

                                    <RadioButton inputId="f6" {...field} value="DISPATCH"
                                        checked={field.value === 'DISPATCH'}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            onSelectPaymentType(e.value);
                                        }}
                                    />
                                    <label htmlFor="f6" className="ml-1 mr-3">
                                        Dispatch
                                    </label>
                                </div>
                                {getFormErrorMessage(field.name)}
                            </>
                        )}
                    />
                    </div>
                    <div className="field col-12 md:col-2">
                        <Button label="New Payment" icon="pi pi-plus" className="p-button-success mr-2" onClick={handleSubmit((d) => onPaymnetSubmit(d))} />
                    </div>
                </div>
            </div>
        </div>
    )}

    return (
        <div className="grid crud-demo">
            <Toast ref={toast} />
            <div className="col-12">
                {renderPaymentForm()}
                <div className="card">
                    <TabMenu model={items} activeIndex={activeIndex} onTabChange={(e) => onSelectTab(e.index)} />
                    <Suspense fallback={<div>Loading...</div>}>
                        {renderTabPanel()}
                    </Suspense>
                
                </div>
            </div>

            <PaymentDialog2 
                trigger={dlgTrigger} 
                initPayment={initPayment}
                onPaymnetCallback={onPaymnetCallback}
                />

        </div>
    );
}

export default Detail;