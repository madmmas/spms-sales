import * as moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { FilterMatchMode } from 'primereact/api';
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
import SelectConstData from './SelectConstData';
import SelectMasterData from './SelectMasterData';

import { PAYMENT_TYPES } from '../../constants/lookupData';
import { BANK_ACCOUNT_MODEL, MFS_ACCOUNT_MODEL } from '../../constants/models';

import CacheMasterDataService from '../../services/CacheMasterDataService';

const PaymentDialog2 = ( { trigger, initPayment, onPaymnetCallback, readOnly = false }) => {

    const [submitted, setSubmitted] = useState(false);
    const [paymentDialog, setPaymentDialog] = useState(false);
    const [paymentType, setPaymentType] = useState("CASH");

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
        }
    }, [initPayment]);

    useEffect(() => {
        if (trigger) {
            setValue('payment_method', 'CASH');
            setValue('current_balance', initPayment.current_balance);
            setValue('amount', 0);
            setValue('payment_date', new Date());
            setValue('remarks', '');
            setValue('bank_account_id', null);
            setValue('mfs_account_id', null);
            setPaymentType('CASH');
            setPaymentDialog(true);
        }
    }, [trigger]);

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    const hidePaymentDialog = () => {
        setPaymentDialog(false);
    };

    const onInputChange = (e) => {
        const val = (e.target && e.target.value) || 0;
    };

    const onPaymentSubmit = (data) => {
        setSubmitted(false);
        hidePaymentDialog();
        if(data.payment_method === "BANK") {
            data.bank_amount = data.amount;
            data.mfs_amount = 0;
            data.cash_amount = 0;
        } else if(data.payment_method === "MFS") {
            data.bank_amount = 0;
            data.mfs_amount = data.amount;
            data.cash_amount = 0;
        } else {
            data.bank_amount = 0;
            data.mfs_amount = 0;
            data.cash_amount = data.amount;
        }
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

    return (
        <Dialog visible={paymentDialog} style={{ width: '450px' }} header={`Payment`} modal className="p-fluid" footer={paymentDialogFooter} onHide={hidePaymentDialog}>                    
            <div className="p-fluid formgrid grid">
                <div className="field col-12 md:col-6">
                    <Controller
                        name="payment_date"
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
                <div className="field col-12 md:col-12">
                    <Controller
                        name="payment_method"
                        control={control}
                        rules={{ required: 'Payment Type is required.' }}
                        render={({ field, fieldState }) => (
                        <>
                            <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Payment Method</label>
                            <SelectConstData field={field} data={PAYMENT_TYPES}
                                onSelectChange={(value) => {console.log(value); setPaymentType(value)}}
                                className={classNames({ 'p-invalid': fieldState.error })} /> 
                            {getFormErrorMessage(field.name)}
                        </>
                    )}/>
                </div>
                {paymentType === "BANK" && <div className="field col-12 md:col-12">
                <Controller
                    name="bank_account_id"
                    control={control}
                    rules={{ 
                        validate: (value) => ((paymentType === "CASH" || paymentType === "MFS" ) || (paymentType === "BANK" && value !== null) ) || 'Bank Account is required.'
                    }}
                    render={({ field, fieldState }) => (
                    <>
                        <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Bank Name*</label>
                        <SelectMasterData field={field} modelName={BANK_ACCOUNT_MODEL}
                            displayField="dtBank_id_shortname"
                            onSelect={(e) => {console.log(e);}}
                            className={classNames({ 'p-invalid': fieldState.error })} 
                            columns={[
                                {field: 'dtBank_id', header: 'Bank Name', filterPlaceholder: 'Filter by Bank Name', body: bankNameBodyTemplate}, 
                                {field: 'accNumber', header: 'Account Number', filterPlaceholder: 'Filter by Account Number'},
                                {field: 'accName', header: 'Account Name', filterPlaceholder: 'Filter by Account Name'}
                            ]} 
                            defaultFilters={{
                                fields: ["dtBank_id", "accNumber", "accName"],
                                first: 0,
                                rows: 10,
                                page: 1,
                                sortField: null,
                                sortOrder: null,
                                filters: {
                                    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
                                    accName: { value: null, matchMode: FilterMatchMode.CONTAINS },
                                    accNumber: { value: null, matchMode: FilterMatchMode.CONTAINS },
                                    dtBank_id: { value: null, matchMode: FilterMatchMode.EQUALS },
                                }
                            }}/>
                        {getFormErrorMessage(field.name)}
                    </>
                )}/>
                </div>}
                {paymentType === "MFS" && <div className="field col-12 md:col-12">
                <Controller
                    name="mfs_account_id"
                    control={control}
                    rules={{ 
                        validate: (value) => ((paymentType === "CASH" || paymentType === "BANK" ) || (paymentType === "MFS" && value !== null) ) || 'Bank Account is required.'
                    }}
                    render={({ field, fieldState }) => (
                    <>
                        <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>MFS Name*</label>
                        <SelectMasterData field={field} modelName={MFS_ACCOUNT_MODEL}
                            displayField="dtMFS_id_shortname"
                            onSelect={(e) => {console.log(e);}}
                            className={classNames({ 'p-invalid': fieldState.error })} 
                            columns={[
                                {field: 'dtMFS_id', header: 'MFS Name', filterPlaceholder: 'Filter by MFS Name', body: mfsNameBodyTemplate}, 
                                {field: 'refNumber', header: 'Reference Number', filterPlaceholder: 'Filter by Reference Number'},
                                {field: 'accName', header: 'Account Name', filterPlaceholder: 'Filter by Account Name'}
                            ]} 
                            defaultFilters={{
                                fields: ["dtMFS_id", "refNumber", "accName"],
                                first: 0,
                                rows: 10,
                                page: 1,
                                sortField: null,
                                sortOrder: null,
                                filters: {
                                    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
                                    accName: { value: null, matchMode: FilterMatchMode.CONTAINS },
                                    refNumber: { value: null, matchMode: FilterMatchMode.CONTAINS },
                                    dtMFS_id: { value: null, matchMode: FilterMatchMode.EQUALS },
                                }
                            }}/>
                        {getFormErrorMessage(field.name)}
                    </>
                )}/>
                </div>}
                <div className="field col-12 md:col-12">
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
                    name="amount"
                    control={control}
                    rules={{
                        validate: (value) => (value > 0) || 'Enter a valid amount.'
                    }}
                    render={({ field, fieldState }) => (
                    <>
                        <label htmlFor="amount">Pay Amount</label>
                        <InputNumber readOnly={readOnly} inputId={field.name} value={field.value} inputRef={field.ref} 
                            onValueChange={(e) => field.onChange(e)} 
                            min={0} maxFractionDigits={2}
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
                        <label htmlFor="remarks">Remarks</label>
                        <InputTextarea inputId={field.name} value={field.value} inputRef={field.ref}  onChange={(e) => field.onChange(e.target.value)} className={classNames({ 'p-invalid': fieldState.error })}/>
                        {getFormErrorMessage(field.name)}
                    </>
                )}/>
                </div>
            </div>
        </Dialog>
    );
}
                     
export default PaymentDialog2;