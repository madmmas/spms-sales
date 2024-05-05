import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { Dialog } from 'primereact/dialog';

const SalesCancelDialog = ( { trigger, onCancelOrder }) => {

    let emptyData = {
        cancelRemarks: '',
        cancelationCharge: 0,
    };

    const [submitted, setSubmitted] = useState(false);
    const [cancelDialog, setCancelDialog] = useState(false);

    const {
        control,
        formState: { errors },
        handleSubmit
    } = useForm({
        defaultValues: emptyData
    });

    useEffect(() => {
        if (trigger) {
            setCancelDialog(!cancelDialog);
        }
    }, [trigger]);

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    const hideSalesCancelDialog = () => {
        setCancelDialog(false);
    };

    const cancelDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideSalesCancelDialog} />
            <Button disabled={submitted} label="Confirm" icon="pi pi-check" className="p-button-text" 
                onClick={
                    handleSubmit((d) => onCancelOrder(d))
                }
            />
        </>
    );

    return (
        <Dialog visible={cancelDialog} style={{ width: '450px' }} header={`Payment`} modal className="p-fluid" footer={cancelDialogFooter} onHide={hideSalesCancelDialog}>                    
            <div className="p-fluid formgrid grid">

                <div className="field col-12 md:col-12">
                <Controller
                    name="cancelationCharge"
                    control={control}
                    render={({ field, fieldState }) => (
                    <>
                        <label htmlFor="cancelationCharge">Additional Charge</label>
                        <InputNumber inputId={field.name} value={field.value} inputRef={field.payRef} 
                            onValueChange={(e) => field.onChange(e)} 
                            maxFractionDigits={2}
                            className={classNames({ 'p-invalid': fieldState.error })} />
                        {getFormErrorMessage(field.name)}
                    </>
                )}/>
                </div>                            
                                       
                <div className="field col-12 md:col-12">
                <Controller
                    name="cancelRemarks"
                    control={control}
                    rules={{ required: 'Remarks is required.' }}
                    render={({ field, fieldState }) => (
                    <>
                        <label htmlFor="cancelRemarks">Remarks*</label>
                        <InputTextarea inputId={field.name} value={field.value} inputRef={field.payRef}  
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
                     
export default SalesCancelDialog;