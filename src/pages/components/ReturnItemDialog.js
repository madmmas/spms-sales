import React, { useEffect, useState } from 'react';
import { useForm, Controller, set } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { Dialog } from 'primereact/dialog';


const ReturnItemDialog = ({ selectedReturnItem, trigger, onAddReturnItem }) => {

    let emptyReturnItem = {
        return_qty: 0,
        reason: "",
    };

    const [returnItemDialog, setReturnItemDialog] = useState(false);
    const [validReturnQty, setValidReturnQty] = useState(0);

    const {
        control,
        formState: { errors },
        setValue,
        handleSubmit
    } = useForm({
        defaultValues: emptyReturnItem
    });

    useEffect(() => {
    }, [selectedReturnItem]);

    useEffect(() => {
        if (trigger) {
            setValue('return_qty', 0);
            setValue('reason', "");
            console.log("selectedReturnItem=>>>", selectedReturnItem)
            let validReturnQty = Number(selectedReturnItem.qty) - (Number(selectedReturnItem.return_qty) || 0);
            setValidReturnQty(validReturnQty);
            console.log("validReturnQty", validReturnQty);
            showDialog();
        }
    }, [trigger]);

    const showDialog = () => {
        setReturnItemDialog(true);
    };

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    const hideSalesReturnItemDialog = () => {
        setReturnItemDialog(false);
    };

    const submitReturnItem = (data) => {
        console.log("submitReturnItem", data);
        onAddReturnItem({
            'product_id': selectedReturnItem.product_id,
            'product_name': selectedReturnItem.product_name,
            'trade_price': selectedReturnItem.trade_price,
            'return_qty': data.return_qty,
            'return_amount': data.return_qty * selectedReturnItem.trade_price,
            'reason': data.reason,
        });
        setReturnItemDialog(false);
    };

    const onInputChange = (e) => {
        const val = (e.target && e.target.value) || 0;
    };

    const returnItemDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideSalesReturnItemDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" 
                onClick={handleSubmit((d) => submitReturnItem(d))}
            />
        </>
    );

    return (
        <Dialog visible={returnItemDialog} style={{ width: '450px' }} header={`ReturnItem`} modal className="p-fluid" footer={returnItemDialogFooter} onHide={hideSalesReturnItemDialog}>                    
            <div className="p-fluid formgrid grid">
                <div className="field col-12 md:col-12">
                <Controller
                    name="return_qty"
                    control={control}
                    rules={{
                        validate: (value) => (value >0 && value <= validReturnQty) || 'Enter a valid amount.'
                    }}
                    render={({ field, fieldState }) => (
                    <>
                        <label htmlFor="return_qty">Return Quantity*</label>
                        <InputNumber inputId={field.name} value={field.value} inputRef={field.payRef} 
                            onValueChange={(e) => field.onChange(e)} 
                            className={classNames({ 'p-invalid': fieldState.error })} />
                        {getFormErrorMessage(field.name)}
                    </>
                )}/>
                </div>                            
                <div className="field col-12 md:col-12">
                <Controller
                    name="reason"
                    control={control}
                    rules={{
                        required: 'Reason is required.'
                    }}
                    render={({ field, fieldState }) => (
                    <>
                        <label htmlFor="reason">Reason*</label>
                        <InputTextarea inputId={field.name} value={field.value} inputRef={field.ref}  onChange={(e) => field.onChange(e.target.value)} className={classNames({ 'p-invalid': fieldState.error })}/>
                        {getFormErrorMessage(field.name)}
                    </>
                )}/>
                </div>
            </div>
        </Dialog>
    );
}
                     
export default ReturnItemDialog;