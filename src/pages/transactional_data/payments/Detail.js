import React, { useState, useRef, Suspense } from 'react';
import * as moment from 'moment';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
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

import PaymentDialog from '../../components/PaymentDialog';

const DispatchPayment = React.lazy(() => lazyRetry(() => import(/* webpackChunkName: "dispatchPayment" */ './DispatchPayment'), "dispatchPayment"));
const ReceivePayment = React.lazy(() => lazyRetry(() => import(/* webpackChunkName: "receivePayment" */ './ReceivePayment'), "receivePayment"));

const Detail = () => {

    const toast = useRef(null);

    let emptyPayment = {
        payment_date: moment().format('YYYY-MM-DD'),
        payment_no: null,
        payment_type: '',   // dtCash, dtBank, dtMFS
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
        { component: DispatchPayment },
        { component: ReceivePayment },
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
    const [partyBalance, setPartyBalance] = useState(0);

    const transactionService = new TransactionService();
    const orderService = new OrderService();

    const items = [
        {label: 'Payment Received', icon: 'pi pi-fw pi-home'},
        {label: 'Payment Dispatched', icon: 'pi pi-fw pi-home'},
    ];

    const onSelectPaymentType = (value) => {
        let _val = value==="RECEIVE"?"trxACReceivable":"trxACPayable";
        // console.log("SELECT-PAYMENT-TYPE", value, partyType)
        // setValue("ref_type", partyType);
        // setPartyType(partyType);
        // setValue("ref_id", null);
        setPaymentType(_val);
    }

    const onSelectPartyType = (value) => {
        // console.log(value)
        setPartyType(value);
    }

    const onPaymnetCallback = (data) => {
        console.log("onPaymnetCallback", data);
        // call api to save data
        setSubmitted(true);
        transactionService.commitPayment(paymentType, data).then(data => {
            console.log(data);
            setSubmitted(false);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Payment Created', life: 3000 });
            reset({
                "ref_type": partyType,
                "ref_id": null,
                "current_balance": 0,
            })
        }).catch(error => {
            console.log(error);
            setSubmitted(false);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Payment Creation Failed', life: 3000 });
        });
    }

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

    const getPartyBalance = (partyId) => {
        let _val = partyType==="dtCustomer"?"trxACReceivable":"trxACPayable";
        orderService.getLedgerBalance(_val, partyId).then(data => {
            console.log("balance::", data);
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
        return <TabPanel />;
    };

    const renderPaymentForm = () => {
        return (     
        <div className="form-demo">
            <div className="card col-12">
                <h5>Payment Information:</h5>
                <div className="p-fluid formgrid grid">
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

                    <div className="field col-12 md:col-3">
                        <Controller
                            name="ref_id"
                            control={control}
                            rules={{ required: 'Party is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Select Party*</label>
                                <SelectMasterData field={field} modelName={partyType}
                                    displayField="name" showFields={["name"]}
                                    onSelect={(e) => {
                                        console.log("selected Party:::", e);
                                        getPartyBalance(e._id);
                                    }}
                                    className={classNames({ 'p-invalid': fieldState.error })} 
                                    columns={[
                                        {field: 'name', header: 'Party Name', filterPlaceholder: 'Filter by Party Name'}
                                    ]} />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>

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
                    <TabMenu model={items} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} />
                    <Suspense fallback={<div>Loading...</div>}>
                        {renderTabPanel()}
                    </Suspense>
                
                </div>
            </div>

            <PaymentDialog 
                trigger={dlgTrigger} 
                initPayment={initPayment}
                onPaymnetCallback={onPaymnetCallback}
                />

        </div>
    );
}

export default Detail;