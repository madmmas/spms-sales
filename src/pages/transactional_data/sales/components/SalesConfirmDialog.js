import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { Dialog } from 'primereact/dialog';

const SalesConfirmDialog = ( { trigger, confirmOrder }) => {

    let emptyData = {
        notes: '',
    };

    const [submitted, setSubmitted] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState(false);

    const {
        control,
        formState: { errors },
        handleSubmit
    } = useForm({
        defaultValues: emptyData
    });

    useEffect(() => {
        if (trigger) {
            setConfirmDialog(!confirmDialog);
        }
    }, [trigger]);

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    const hideSalesConfirmDialog = () => {
        setConfirmDialog(false);
    };

    const confirmDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideSalesConfirmDialog} />
            <Button disabled={submitted} label="Confirm" icon="pi pi-check" className="p-button-text" 
                onClick={
                    handleSubmit((d) => confirmOrder(d))
                }
            />
        </>
    );

    return (
        <Dialog visible={confirmDialog} style={{ width: '450px' }} header={`Payment`} modal className="p-fluid" footer={confirmDialogFooter} onHide={hideSalesConfirmDialog}>                    
            <div className="p-fluid formgrid grid">
                                       
                <div className="field col-12 md:col-12">
                <Controller
                    name="notes"
                    control={control}
                    rules={{ required: 'Note is required.' }}
                    render={({ field, fieldState }) => (
                    <>
                        <label htmlFor="notes">Note*</label>
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
                     
export default SalesConfirmDialog;