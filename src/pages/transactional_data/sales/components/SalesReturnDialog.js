import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { Dialog } from 'primereact/dialog';

const SalesReturnDialog = ( { trigger, selectedItem, addToSalesReturn }) => {

    let emptyData = {
        productId: '',
        returnReason: '',
        returnQuantity: 0,
        returnAmount: 0,
        returnableQty: 0,
    };

    const [submitted, setSubmitted] = useState(false);
    const [cancelDialog, setCancelDialog] = useState(false);
    const [returnableQty, setReturnableQty] = useState(0);
    const [itemUnitPrice, setItemUnitPrice] = useState(0);

    const {
        control,
        formState: { errors },
        handleSubmit
    } = useForm({
        defaultValues: emptyData
    });

    useEffect(() => {
        console.log("selectedItem:::   ", selectedItem);
        setReturnableQty(selectedItem.quantity - (selectedItem.returned || 0));
        setItemUnitPrice(selectedItem.netPrice/selectedItem.quantity);
    }, [selectedItem]);

    useEffect(() => {
        if (trigger) {
            setCancelDialog(!cancelDialog);
        }
    }, [trigger]);

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    const hideSalesReturnDialog = () => {
        setCancelDialog(false);
    };

    const addToReturn = (d) => {
        console.log("addToReturn:::   ", d);
        let data = {
            productId: selectedItem.id,
            returnReason: d.returnReason,
            returnQuantity: d.returnQuantity,
            returnAmount: selectedItem.itemUnitPrice * d.returnQuantity,
        }

        addToSalesReturn(data);
        setCancelDialog(false);
    };

    const cancelDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideSalesReturnDialog} />
            <Button disabled={submitted} label="Confirm" icon="pi pi-check" className="p-button-text" 
                onClick={
                    handleSubmit((d) => addToReturn(d))
                }
            />
        </>
    );

    return (
        <Dialog visible={cancelDialog} style={{ width: '450px' }} header={`Payment`} modal className="p-fluid" footer={cancelDialogFooter} onHide={hideSalesReturnDialog}>                    
            <div className="p-fluid formgrid grid">

                <div className="field col-12 md:col-12">
                <Controller
                    name="returnQuantity"
                    control={control}
                    // required and max value is returnableQty
                    rules={{ required: 'Return Quantity is required.', max: returnableQty }}
                    render={({ field, fieldState }) => (
                    <>
                        <label htmlFor="returnQuantity">Return Quantity*</label>
                        <InputNumber inputId={field.name} value={field.value} inputRef={field.payRef} 
                            onValueChange={(e) => field.onChange(e)} 
                            className={classNames({ 'p-invalid': fieldState.error })} />
                        {getFormErrorMessage(field.name)}
                    </>
                )}/>
                </div>                            
                                       
                <div className="field col-12 md:col-12">
                <Controller
                    name="returnReason"
                    control={control}
                    rules={{ required: 'Remarks is required.' }}
                    render={({ field, fieldState }) => (
                    <>
                        <label htmlFor="returnReason">Return Reason*</label>
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
                     
export default SalesReturnDialog;