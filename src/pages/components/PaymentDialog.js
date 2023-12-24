import React, { useEffect, useState, useRef } from 'react';
import { useForm, Controller, set } from 'react-hook-form';
import { FilterMatchMode } from 'primereact/api';
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';

import BankAccount from './master_data/BankAccount';
import MFSAccount from './master_data/MFSAccount';

const PaymentDialog = ( { 
    trigger, initPayment, onPaymnetCallback, 
    readOnly = false 
}) => {

    const toast = useRef(null);
    const [submitted, setSubmitted] = useState(false);
    const [paymentDialog, setPaymentDialog] = useState(false);
    // const [bankCash, setBankCash] = useState("CASH");
    const [amount, setAmount] = useState(0);
    const [currentBalance, setCurrentBalance] = useState(0);
    const [amountCash, setAmountCash] = useState(0);
    const [amountBank, setAmountBank] = useState(0);
    const [amountMFS, setAmountMFS] = useState(0);


    const {
        control,
        formState: { errors },
        setValue,
        reset,
        handleSubmit
    } = useForm({
        defaultValues: initPayment
    });

    useEffect(() => {
        if (initPayment) {
            reset({
                ...initPayment
            })
            setAmountCash(initPayment.cash_amount);
            setAmountBank(initPayment.bank_amount);
            setAmountMFS(initPayment.mfs_amount);
            setCurrentBalance(initPayment.current_balance);
        }
    }, [initPayment]);

    useEffect(() => {
        if (trigger) {
            setPaymentDialog(true);
        }
    }, [trigger]);

    useEffect(() => {
        changeAmount();
    }, [amountCash, amountBank, amountMFS]);

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    const hidePaymentDialog = () => {
        setPaymentDialog(false);
    };

    const changeAmount = () => {
        console.log("changeAmount:::", amountCash, amountBank, amountMFS);
        let _amount = Number(amountCash) + Number(amountBank) + Number(amountMFS);
        setAmount(_amount);
        setValue('amount', _amount);
        setValue('current_balance', currentBalance - _amount);
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || 0;

        if(name === "cash_amount") {
            setAmountCash(val);
        } else if(name === "bank_amount") {
            setAmountBank(val);
        } else if(name === "mfs_amount") {
            setAmountMFS(val);
        }
        setValue(`${name}`, val);
    };

    const onPaymentSubmit = (data) => {
        // check if the invoice_amount is equal to amount if customer_category is WALKIN
        let valid = true;
        // if bank_amount is not equal to 0 then bank_account_id is required
        if(data.bank_amount !== 0 && data.bank_account_id === null) {
            toast.current.show({ severity: 'error', summary: 'Error Message', detail: 'Bank Account is required.', life: 3000 });
            valid = false;
        }
        // if mfs_amount is not equal to 0 then mfs_account_id is required
        if(data.mfs_amount !== 0 && data.mfs_account_id === null) {
            toast.current.show({ severity: 'error', summary: 'Error Message', detail: 'MFS Account is required.', life: 3000 });
            valid = false;
        }
        if(readOnly && data.invoice_amount !== data.amount) {
            toast.current.show({ severity: 'error', summary: 'Error Message', detail: 'Amount is not equal to current balance.', life: 3000 });
            valid = false;
        }
        if(!valid){
            return;
        }

        setSubmitted(false);
        hidePaymentDialog();
        if(onPaymnetCallback) {
            let payment = {
                ...data,
                ref_id: initPayment.ref_id,
                ref_type: initPayment.ref_type,
                payment_type: initPayment.payment_type,
            }
            console.log("PAYMENT-1:::", initPayment);
            console.log("PAYMENT-2:::", data);
            console.log("PAYMENT-3:::", payment);
            onPaymnetCallback(payment);
        }
    };

    const paymentDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hidePaymentDialog} />
            <Button disabled={submitted} label="Save" icon="pi pi-check" className="p-button-text" 
                onClick={
                    handleSubmit((d) => onPaymentSubmit(d))
                }
            />
        </>
    );

    const bankNameBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.dtBank_id_shortname}
            </>
        );
    };

    const mfsNameBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.dtMFS_id_shortname}
            </>
        );
    };

    return (
        <Dialog visible={paymentDialog} style={{ width: '450px' }} header={`Payment`} modal className="p-fluid" footer={paymentDialogFooter} onHide={hidePaymentDialog}>                    
            <Toast ref={toast} />
            <div className="p-fluid formgrid grid">
                <div className="field col-12 md:col-6">
                <Controller
                    name="previous_balance"
                    control={control}
                    render={({ field, fieldState }) => (
                    <>
                        <label htmlFor="previous_balance">Previous Balance</label>
                        <InputNumber readOnly={true} inputId={field.name} value={field.value} inputRef={field.ref} 
                            onValueChange={(e) => field.onChange(e)} 
                            className={classNames({ 'p-invalid': fieldState.error })} />
                        {getFormErrorMessage(field.name)}
                    </>
                )}/>
                </div>
                <div className="field col-12 md:col-6">
                <Controller
                    name="invoice_amount"
                    control={control}
                    render={({ field, fieldState }) => (
                    <>
                        <label htmlFor="invoice_amount">Invoice Amount</label>
                        <InputNumber readOnly={true} inputId={field.name} value={field.value} inputRef={field.ref} 
                            onValueChange={(e) => field.onChange(e)} 
                            className={classNames({ 'p-invalid': fieldState.error })} />
                        {getFormErrorMessage(field.name)}
                    </>
                )}/>
                </div>
                <div className="grid">
                    <div className="field col-7 md:col-7">
                    <Controller
                        name="bank_account_id"
                        control={control}
                        // rules={{ 
                        //     validate: (value) => ((bankCash === "CASH") || (bankCash === "BANK" && value !== null) ) || 'Bank Account is required.'
                        // }}
                        // rules={{
                        //     validate: () => (amountBank == 0) || 'This field is required.'
                        // }}

                        render={({ field, fieldState }) => (
                        <>
                            <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Bank Account*</label>
                            <BankAccount field={field} fieldState={fieldState}
                                onSelect={(e) => {console.log(e);}}
                                />
                            {getFormErrorMessage(field.name)}
                        </>
                    )}/>
                    </div>
                    <div className="field col-5 md:col-5">
                    <Controller
                        name="bank_amount"
                        control={control}
                        rules={{
                            validate: (value) => (value >= 0) || 'Enter a valid amount.'
                        }}
                        render={({ field, fieldState }) => (
                        <>
                            <label htmlFor="amount">Bank Amount</label>
                            <InputNumber inputId={field.name} value={field.value} inputRef={field.ref} 
                                onValueChange={(e) => onInputChange(e, "bank_amount")} 
                                className={classNames({ 'p-invalid': fieldState.error })} 
                                min={0} maxFractionDigits={2}
                                />
                            {getFormErrorMessage(field.name)}
                        </>
                    )}/>
                    </div>      
                </div>
                <div className='p-fluid formgrid grid'>
                    <div className="field col-7 md:col-7">
                    <Controller
                        name="mfs_account_id"
                        control={control}
                        render={({ field, fieldState }) => (
                        <>
                            <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>MFS Account*</label>
                            <MFSAccount field={field} fieldState={fieldState}
                                onSelect={(e) => {console.log(e);}}
                                />
                            {getFormErrorMessage(field.name)}
                        </>
                    )}/>
                    </div>
                    <div className="field col-12 md:col-5">
                    <Controller
                        name="mfs_amount"
                        control={control}
                        rules={{
                            validate: (value) => (value >= 0) || 'Enter a valid amount.'
                        }}
                        render={({ field, fieldState }) => (
                        <>
                            <label htmlFor="amount">MFS Amount</label>
                            <InputNumber inputId={field.name} value={field.value} inputRef={field.ref} 
                                onValueChange={(e) => onInputChange(e, "mfs_amount")} 
                                className={classNames({ 'p-invalid': fieldState.error })} 
                                min={0} maxFractionDigits={2}
                                />
                            {getFormErrorMessage(field.name)}
                        </>
                    )}/>
                    </div>                            

                </div>
                <div className="field col-12 md:col-6">
                <Controller
                    name="cash_amount"
                    control={control}
                    rules={{
                        validate: (value) => (value >= 0) || 'Enter a valid amount.'
                    }}
                    render={({ field, fieldState }) => (
                    <>
                        <label htmlFor="amount">Cash Amount</label>
                        <InputNumber inputId={field.name} value={field.value} inputRef={field.ref} 
                            onValueChange={(e) => onInputChange(e, "cash_amount")} 
                            className={classNames({ 'p-invalid': fieldState.error })} 
                            min={0} maxFractionDigits={2}
                            />
                        {getFormErrorMessage(field.name)}
                    </>
                )}/>
                </div>                            
                <div className="field col-12 md:col-6">
                <Controller
                    name="amount"
                    control={control}
                    rules={{
                        validate: (value) => (value >= 0) || 'Enter a valid amount.'
                    }}
                    render={({ field, fieldState }) => (
                    <>
                        <label htmlFor="amount">Pay Amount</label>
                        <InputNumber readOnly={true} inputId={field.name} value={field.value} inputRef={field.ref} 
                            onValueChange={(e) => field.onChange(e)} 
                            className={classNames({ 'p-invalid': fieldState.error })} />
                        {getFormErrorMessage(field.name)}
                    </>
                )}/>
                </div>                            
                <div className="field col-12 md:col-6">
                <Controller
                    name="current_balance"
                    control={control}
                    render={({ field, fieldState }) => (
                    <>
                        <label htmlFor="current_balance">Current Balance</label>
                        <InputNumber readOnly={true} inputId={field.name} value={field.value} inputRef={field.ref} 
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
    );
}
                     
export default PaymentDialog;