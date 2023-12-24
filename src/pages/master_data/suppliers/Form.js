import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { InputSwitch } from 'primereact/inputswitch';
import { InputTextarea } from 'primereact/inputtextarea';
import { Fieldset } from 'primereact/fieldset';
import SelectConstData from '../../components/SelectConstData';
import SelectLookupData from '../../components/SelectLookupData';

import { MasterDataDBService } from '../../../services/MasterDataDBService';

import { SUPPLIER_MODEL, SUPPLIER_CATEGORY_MODEL } from '../../../constants/models';
import { CURRENCY } from '../../../constants/lookupData';

const Form = ({supplierProfile}) => {

    console.log("supplier Profile::", supplierProfile);

    const modelName = SUPPLIER_MODEL;
    let navigate = useNavigate();
    const toast = useRef(null);
    
    const masterDataDBService = new MasterDataDBService();

    const [submitted, setSubmitted] = useState(false);

    const {
        register,
        control,
        formState: { errors },
        setValue,
        resetField,
        handleSubmit
    } = useForm({
        defaultValues: supplierProfile
    });

    useEffect(() => {
        if(supplierProfile===undefined){
            setValue("status", true);
        }
    }, []);

    const onSubmit = (formData) => {
        try{        
            setSubmitted(true);
            if(supplierProfile==null){
                masterDataDBService.create(modelName, formData).then(data => {
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Supplier Created', life: 3000 });
                    // navigate("/suppliers/" + data.ID);
                    navigate("/suppliers");
                });
            }else{
                masterDataDBService.update(modelName, formData.id, formData).then(data => {
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Supplier Updated', life: 3000 });
                    setSubmitted(false);
                    // navigate("/suppliers/" + data.ID);
                    navigate("/suppliers");
                });
            }
        }
        catch (err){
            console.log(err)
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Action Performed', life: 3000 });
            navigate("/suppliers");
        }
    };

    const gotoList = () => {
        navigate("/suppliers");
    };

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    return (
        <div className="form-demo">
            <Toast ref={toast} />
            <div className="card col-12">
                {supplierProfile==null && <Button onClick={() => gotoList()} className="p-button-outlined" label="Go Back to List" />}
                <h5>{supplierProfile==null?"New":"Edit"} Supplier</h5>
                <form onSubmit={handleSubmit(onSubmit)} >
                <div className="p-fluid formgrid grid">
                    <div className="field col-12 md:col-6">
                        <Controller
                            name="name"
                            control={control}
                            rules={{ required: 'Supplier Name is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Supplier Name*</label>
                                <InputText  inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>

                    <div className="field col-12 md:col-6">
                        <Controller
                            name="dtSupplierCategory_id"
                            control={control}
                            rules={{ required: 'Supplier Category is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Supplier Category*</label>
                                <SelectLookupData field={field} model={SUPPLIER_CATEGORY_MODEL}
                                    className={classNames({ 'p-invalid': fieldState.error })} /> 
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>

                    <div className="field col-12 md:col-6">
                        <Controller
                            name="address"
                            control={control}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Supplier Address</label>
                                <InputTextarea  inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>

                    <div className="field col-12 md:col-6">
                        <Controller
                            name="phone"
                            control={control}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Phone</label>
                                <InputText  inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} placeholder="+8801453656754" onChange={(e) => field.onChange(e.target.value)} />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>

                    <div className=" col-12 md:col-12">
                        <Fieldset legend="Contact Person">
                        <div className="p-fluid formgrid grid">
                            <div className="field col-12 md:col-6">
                                <Controller
                                    name="contactPersonName"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                    <>
                                        <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Contact Person Name</label>
                                        <InputText  inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                        {getFormErrorMessage(field.name)}
                                    </>
                                )}/>
                            </div>
                            <div className="field col-12 md:col-6">
                                <Controller
                                    name="contactPersonDesignation"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                    <>
                                        <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Contact Person Designation</label>
                                        <InputText  inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                        {getFormErrorMessage(field.name)}
                                    </>
                                )}/>
                            </div>
                            <div className="field col-12 md:col-6">
                                <Controller
                                    name="contactPersonPhone"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                    <>
                                        <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Contact Person Mobile Number</label>
                                        <InputText  inputId={field.name} value={field.value} inputRef={field.ref} placeholder="+8801453656754" className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                        {getFormErrorMessage(field.name)}
                                    </>
                                )}/>
                            </div>
                        </div>
                        </Fieldset>
                    </div>
                    <div className="field col-12 md:col-6 mt-2">
                        <Controller
                            name="currency"
                            control={control}
                            rules={{ required: 'Currency is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Currency*</label>
                                <SelectConstData field={field} data={CURRENCY}
                                    className={classNames({ 'p-invalid': fieldState.error })} /> 
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>

                    <div className="field col-12 md:col-6 mt-2">
                        <div className='field'>Status</div>
                        <Controller
                            name="status"
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <InputSwitch inputId={field.name} checked={field.value} inputRef={field.ref} onChange={(e) => field.onChange(e.value)} />
                                </>
                            )}
                        />
                    </div>
                </div>
                <>
                    <Button type="submit" label="Submit" className="mt-2" disabled={submitted} />
                </>
                </form>
            </div>
        </div>
    );
}
                 
export default Form;