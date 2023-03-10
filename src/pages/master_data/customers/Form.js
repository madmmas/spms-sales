import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';

import { HRService } from '../../../services/HRService';
import { CUSTOMER_MODEL } from '../../../constants/models';

const Form = ({customerProfile}) => {

    const modelName = CUSTOMER_MODEL;

    let navigate = useNavigate();

    const toast = useRef(null);
    const hrManagementService = new HRService();
    
    const {
        register,
        control,
        formState: { errors },
        resetField,
        handleSubmit
    } = useForm({
        defaultValues: customerProfile //async () =>  hrManagementService.getById(modelName, CustomerProfile)
      });

    const onSubmit = (formData) => {
        if(customerProfile==null){
            hrManagementService.create(modelName, formData).then(data => {
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Customer Created', life: 3000 });
                navigate("/customers/" + data.ID);
            });
        }else{
            hrManagementService.update(modelName, formData._id, formData).then(data => {
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Customer Updated', life: 3000 });
            });
        }
    };

    const gotoList = () => {
        navigate("/customers");
    };

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    return (
        <div className="form-demo">
            <Toast ref={toast} />
            <div className="card col-12">
                {customerProfile==null && <Button onClick={() => gotoList()} className="p-button-outlined" label="Go Back to List" />}
                <h5>{customerProfile==null?"New":"Edit"} Customer</h5>
                <form onSubmit={handleSubmit(onSubmit)} >
                <div className="p-fluid formgrid grid">
                    <div className="field col-12 md:col-6">
                        <Controller
                            name="customerId"
                            control={control}
                            rules={{ required: 'Customer ID is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Customer ID*</label>
                                <InputText  inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>
                    <div className="field col-12 md:col-6">
                        <Controller
                            name="customerName"
                            control={control}
                            rules={{ required: 'Customer Name is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Customer Name*</label>
                                <InputText  inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>
                </div>
                <>
                    <Button type="submit" label="Submit" className="mt-2" />
                </>
                </form>
            </div>
        </div>
    );
}
                 
export default Form;