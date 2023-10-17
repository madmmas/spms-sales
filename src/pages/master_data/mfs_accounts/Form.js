import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { InputMask } from "primereact/inputmask";
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { InputSwitch } from 'primereact/inputswitch';
import { InputTextarea } from 'primereact/inputtextarea';
import SelectLookupData from '../../components/SelectLookupData';

import { HRService } from '../../../services/HRService';

import { MFS_MODEL, MFS_ACCOUNT_MODEL } from '../../../constants/models';

const Form = ({mfsAccountProfile}) => {

    const modelName = MFS_ACCOUNT_MODEL;
    let navigate = useNavigate();
    const toast = useRef(null);
    const hrManagementService = new HRService();
    const [isEdit, setIsEdit] = useState(mfsAccountProfile!=null);
    const [submitted, setSubmitted] = useState(false);

    const {
        register,
        control,
        formState: { errors },
        setValue,
        resetField,
        handleSubmit
    } = useForm({
        defaultValues: mfsAccountProfile
    });

    useEffect(() => {
        if(mfsAccountProfile===undefined){
            setValue("status", true);
        }
    }, []);

    const onSubmit = (formData) => {
        try{

        setSubmitted(true);
        if(!isEdit){
            formData.balance = formData.initBalance;
            hrManagementService.create(modelName, formData).then(data => {
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'MFS Account Created', life: 3000 });
                // navigate("/mfs_accounts/" + data.ID);
                navigate("/mfs_accounts");
            });
        }else{
            hrManagementService.update(modelName, formData._id, formData).then(data => {
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'MFS Account Updated', life: 3000 });
                setSubmitted(false);
                // navigate("/mfs_accounts/" + data.ID);
                navigate("/mfs_accounts");
            });
        }
        }
        catch (err){
            console.log(err)
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Action Performed', life: 3000 });
            navigate("/mfs_accounts");
        }

    };

    const gotoList = () => {
        navigate("/mfs_accounts");
    };

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    return (
        <div className="form-demo">
            <Toast ref={toast} />
            <div className="card col-12">
                {mfsAccountProfile==null && <Button onClick={() => gotoList()} className="p-button-outlined" label="Go Back to List" />}
                <h5>{mfsAccountProfile==null?"New":"Edit"} MFS Account</h5>
                <form onSubmit={handleSubmit(onSubmit)} >
                <div className="p-fluid formgrid grid">

                    <div className="field col-12 md:col-6">
                        <Controller
                            name="dtMFS_id"
                            control={control}
                            rules={{ required: 'MFS Account is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>MFS*</label>
                                <SelectLookupData field={field} model={MFS_MODEL}
                                    className={classNames({ 'p-invalid': fieldState.error })} /> 
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>

                    <div className="field col-12 md:col-6">
                        <Controller
                            name="refNumber"
                            control={control}
                            rules={{ required: 'Reference Number is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Reference Number*</label>                                
                                <InputText disabled={isEdit} keyfilter="int" inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)}/>                                
                                <small id="refNumber-help">
                                    Enter numeric value only.
                                </small>
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>

                    <div className="field col-12 md:col-6">
                        <Controller
                            name="accName"
                            control={control}
                            rules={{ required: 'Account Name is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Account Name*</label>                                
                                <InputText inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)}/>                                
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>

                    <div className="field col-12 md:col-6">
                        <Controller
                            name="initBalance"
                            control={control}
                            rules={{
                                validate: (value) => (value!==null) || 'Initial Balance is required.'
                            }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Initial Balance*</label>
                                <InputNumber disabled={isEdit} inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onValueChange={(e) => {setValue("balance",e.value); field.onChange(e)}} minFractionDigits={2} mode="currency" currency="BDT" currencyDisplay="code" locale="en-IN" />                                
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>

                    <div className="field col-12 md:col-6">
                        <Controller
                            name="balance"
                            control={control}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Current Balance*</label>
                                <InputNumber disabled={true} inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onValueChange={(e) => field.onChange(e)} minFractionDigits={2} mode="currency" currency="BDT" currencyDisplay="code" locale="en-IN" />                                
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>

                    <div className="field col-12 md:col-6">
                        <Controller
                            name="note"
                            control={control}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Note</label>
                                <InputTextarea  inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
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
                                    <InputSwitch inputId={field.name} checked={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.value)} />                                    
                                </>
                            )}
                        />
                    </div>
                </div>
                <>
                    <Button type="submit" label="Submit" className="mt-2" disabled={submitted}/>
                </>
                </form>
            </div>
        </div>
    );
}
                 
export default Form;