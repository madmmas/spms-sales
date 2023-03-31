import React, { useRef, useState } from 'react';
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

import { HRService } from '../../../services/HRService';

import { BANK_MODEL, BANK_ACCOUNT_MODEL } from '../../../constants/models';
import { CURRENCY } from '../../../constants/lookupData';

const Form = ({bankAccountProfile}) => {

    const modelName = BANK_ACCOUNT_MODEL;
    let navigate = useNavigate();
    const toast = useRef(null);
    const hrManagementService = new HRService();
    const [status, setStatus] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const {
        register,
        control,
        formState: { errors },
        resetField,
        handleSubmit
    } = useForm({
        defaultValues: bankAccountProfile
      });

    const onSubmit = (formData) => {
        setSubmitted(true);
        if(bankAccountProfile==null){
            hrManagementService.create(modelName, formData).then(data => {
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Bank Account Created', life: 3000 });
                navigate("/bank_accounts/" + data.ID);
            });
        }else{
            hrManagementService.update(modelName, formData._id, formData).then(data => {
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Bank Account Updated', life: 3000 });
                setSubmitted(false);
                navigate("/bank_accounts/" + data.ID);
            });
        }
    };

    const gotoList = () => {
        navigate("/bank_accounts");
    };

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    return (
        <div className="form-demo">
            <Toast ref={toast} />
            <div className="card col-12">
                {bankAccountProfile==null && <Button onClick={() => gotoList()} className="p-button-outlined" label="Go Back to List" />}
                <h5>{bankAccountProfile==null?"New":"Edit"} Bank Account</h5>
                <form onSubmit={handleSubmit(onSubmit)} >
                <div className="p-fluid formgrid grid">

                    <div className="field col-12 md:col-6">
                        <Controller
                            name="accName"
                            control={control}
                            rules={{ required: 'Account Name is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Account Name*</label>
                                <InputText  inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>

                    <div className="field col-12 md:col-6">
                        <Controller
                            name="dtBank_id"
                            control={control}
                            rules={{ required: 'Bank Account is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Bank Name*</label>
                                <SelectLookupData field={field} model={BANK_MODEL}
                                    className={classNames({ 'p-invalid': fieldState.error })} /> 
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>

                    <div className="field col-12 md:col-6">
                        <Controller
                            name="branch"
                            control={control}
                            rules={{ required: 'Branch Name is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Branch Name*</label>
                                <InputText  inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>

                    <div className="field col-12 md:col-6">
                        <Controller
                            name="accNumber"
                            control={control}
                            rules={{ required: 'Account Number is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Account Number*</label>
                                <InputText  inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>

                    <div className="field col-12 md:col-6">
                        <Controller
                            name="initBalance"
                            control={control}
                            rules={{ required: 'Initial Balance is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Initial Balance*</label>
                                <InputText  inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
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

                    <div className="field col-12 md:col-6">
                        <Controller
                            name="address"
                            control={control}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Bank Account Address</label>
                                <InputTextarea  inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
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