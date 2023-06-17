import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';

import SelectConstData from '../../../components/SelectConstData';
import SelectMasterData from '../../../components/SelectMasterData';

import { PAYMENT_TYPES } from '../../../../constants/lookupData';
import { BANK_ACCOUNT_MODEL } from '../../../../constants/models';

const Form = ( { customerCategory, trigger, netAmount, onPaymnetSubmit }) => {

    let emptyPayment = {
        dtPaymentType_id: 'CASH',
        dtBankAccount_id: null,
        paymentDate: Date.now(),
        paidAmount: 0,
        dueAmount: 0,
        paymentRef: "",
        paymentRemarks: '',
    };

    const [submitted, setSubmitted] = useState(false);
    const [paymentDialog, setPaymentDialog] = useState(false);
    const [bankCash, setBankCash] = useState("CASH");

    const {
        register,
        control,
        formState: { errors },
        resetField,
        setValue,
        handleSubmit
    } = useForm({
        defaultValues: emptyPayment
    });

    useEffect(() => {
        if (trigger) {
            showDialog();
            if (customerCategory === "WALKIN") {
                setValue('dueAmount', 0);
                setValue('paidAmount', netAmount);
            } else {
                setValue('dueAmount', netAmount);
                setValue('paidAmount', 0);    
            }
        }
    }, [trigger]);

    const showDialog = () => {
        setPaymentDialog(true);
    };

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    const hideSalesPaymentDialog = () => {
        setPaymentDialog(false);
    };

    const onInputChange = (e) => {
        const val = (e.target && e.target.value) || 0;
        const dueAmount = netAmount - val;
        setValue('dueAmount', dueAmount);
    };

    const paymentDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideSalesPaymentDialog} />
            <Button disabled={submitted} label="Save" icon="pi pi-check" className="p-button-text" 
                onClick={
                    handleSubmit((d) => onPaymnetSubmit(d))
                }
            />
        </>
    );

    return (
        <Dialog visible={paymentDialog} style={{ width: '450px' }} header={`Payment`} modal className="p-fluid" footer={paymentDialogFooter} onHide={hideSalesPaymentDialog}>                    
            <div className="p-fluid formgrid grid">
                <div className="field col-12 md:col-12">
                    <Controller
                        name="dtPaymentType_id"
                        control={control}
                        rules={{ required: 'Payment Type is required.' }}
                        render={({ field, fieldState }) => (
                        <>
                            <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Payment Method</label>
                            <SelectConstData field={field} data={PAYMENT_TYPES}
                                onSelectChange={(value) => {console.log(value); setBankCash(value)}}
                                className={classNames({ 'p-invalid': fieldState.error })} /> 
                            {getFormErrorMessage(field.name)}
                        </>
                    )}/>
                </div>
                <div hidden={bankCash !== "BANK"} className="field col-12 md:col-12">
                <Controller
                    name="dtBankAccount_id"
                    control={control}
                    rules={{ 
                        valipaymentDate: (value) => ((bankCash === "CASH") || (bankCash === "BANK" && value !== null) ) || 'Bank Account is required.'
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
                    name="dueAmount"
                    control={control}
                    rules={{
                        valipaymentDate: (value) => (value > 0) || 'Enter a valid amount.'
                    }}
                    render={({ field, fieldState }) => (
                    <>
                        <label htmlFor="dueAmount">Due Amount*</label>
                        <InputNumber readOnly={true} inputId={field.name} value={field.value} inputRef={field.payRef} 
                            onValueChange={(e) => field.onChange(e)} 
                            className={classNames({ 'p-invalid': fieldState.error })} />
                        {getFormErrorMessage(field.name)}
                    </>
                )}/>
                </div>                            
                <div className="field col-12 md:col-12">
                <Controller
                    name="paidAmount"
                    control={control}
                    rules={{
                        valipaymentDate: (value) => (value > 0) || 'Enter a valid amount.'
                    }}
                    render={({ field, fieldState }) => (
                    <>
                        <label htmlFor="paidAmount">Pay Amount*</label>
                        <InputNumber inputId={field.name} value={field.value} inputRef={field.payRef} 
                            readOnly={customerCategory === "WALKIN"}
                            // onValueChange={(e) => field.onChange(e)} 
                            onValueChange={(e) => onInputChange(e)}
                            className={classNames({ 'p-invalid': fieldState.error })} />
                        {getFormErrorMessage(field.name)}
                    </>
                )}/>
                </div>                            
                <div className="field col-12 md:col-12">
                <Controller
                    name="paymentRef"
                    control={control}
                    render={({ field, fieldState }) => (
                    <>
                        <label htmlFor="payRef">Reference</label>
                        <InputText inputId={field.name} value={field.value} inputRef={field.payRef} keyfilter="text" 
                            className={classNames({ 'p-invalid': fieldState.error })} 
                            onChange={(e) => field.onChange(e.target.value)} rows={3} cols={20} />
                        {getFormErrorMessage(field.name)}
                    </>
                )}/>
                </div>
                <div className="field col-12 md:col-12">
                <Controller
                    name="paymentRemarks"
                    control={control}
                    render={({ field, fieldState }) => (
                    <>
                        <label htmlFor="payRemarks">Remarks*</label>
                        <InputTextarea inputId={field.name} value={field.value} inputRef={field.payRef} keyfilter="text" 
                            className={classNames({ 'p-invalid': fieldState.error })} 
                            onChange={(e) => field.onChange(e.target.value)} rows={3} cols={20} />
                        {getFormErrorMessage(field.name)}
                    </>
                )}/>
                </div>
            </div>
        </Dialog>
    );
}
                     
export default Form;