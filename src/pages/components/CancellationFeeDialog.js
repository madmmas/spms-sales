import React, { useEffect, useState } from 'react';
import { useForm, Controller, set } from 'react-hook-form';
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { Dialog } from 'primereact/dialog';


const CancellationFeeDialog = ({ trigger, onCancelOrder }) => {

    let emptyCancelOrder = {
        charge: 0,
        reason: "",
    };

    const [cancellationFeeDialog, setCancellationFeeDialog] = useState(false);

    const {
        control,
        formState: { errors },
        setValue,
        handleSubmit
    } = useForm({
        defaultValues: emptyCancelOrder
    });

    useEffect(() => {
        if (trigger) {
            setValue('charge', 0);
            setValue('reason', "");
            showDialog();
        }
    }, [trigger]);

    const showDialog = () => {
        setCancellationFeeDialog(true);
    };

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    const hideSalesCancellationFeeDialog = () => {
        setCancellationFeeDialog(false);
    };

    const submitCancelOrder = (data) => {
        console.log("submitCancelOrder", data);
        let _data = {
            'charge': data.charge,
            'reason': data.reason,
        }
        onCancelOrder(_data);
        setCancellationFeeDialog(false);
    };

    const cancellationFeeDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideSalesCancellationFeeDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" 
                onClick={handleSubmit((d) => submitCancelOrder(d))}
            />
        </>
    );

    return (
        <Dialog visible={cancellationFeeDialog} style={{ width: '450px' }} header={`CancelOrder`} modal className="p-fluid" footer={cancellationFeeDialogFooter} onHide={hideSalesCancellationFeeDialog}>                    
            <div className="p-fluid formgrid grid">
                <div className="field col-12 md:col-12">
                <Controller
                    name="charge"
                    control={control}
                    rules={{
                        validate: (value) => value >0 || 'Enter a valid amount.'
                    }}
                    render={({ field, fieldState }) => (
                    <>
                        <label htmlFor="charge">Cancellation Fee*</label>
                        <InputNumber inputId={field.name} value={field.value} inputRef={field.ref} 
                            onValueChange={(e) => field.onChange(e)}
                            min={0} maxFractionDigits={2}
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
                     
export default CancellationFeeDialog;