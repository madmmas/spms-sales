import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { InputSwitch } from 'primereact/inputswitch';
import { Calendar } from 'primereact/calendar';
import { InputTextarea } from 'primereact/inputtextarea';
import { Fieldset } from 'primereact/fieldset';
import SelectConstData from '../../components/SelectConstData';
import SelectLookupData from '../../components/SelectLookupData';

import { HRService } from '../../../services/HRService';

import { LEAVE_REQUEST_MODEL, LEAVE_TYPE_MODEL, EMPLOYEE_MODEL } from '../../../constants/models';

const Form = ({leaveProfile}) => {

    console.log("leave Profile::", leaveProfile);

    const modelName = LEAVE_REQUEST_MODEL;
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
        defaultValues: leaveProfile
      });

    const onSubmit = (formData) => {
        try{        
            setSubmitted(true);
            if(leaveProfile==null){
                hrManagementService.create(modelName, formData).then(data => {
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Leave Created', life: 3000 });
                    navigate("/leaves/" + data.ID);
                });
            }else{
                hrManagementService.update(modelName, formData._id, formData).then(data => {
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Leave Updated', life: 3000 });
                    setSubmitted(false);
                    // navigate("/leaves/" + data.ID);
                });
            }
        }
        catch (err){
            console.log(err)
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Action Performed', life: 3000 });
            navigate("/leaves");
        }
    };

    const gotoList = () => {
        navigate("/leaves");
    };

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    return (
        <div className="form-demo">
            <Toast ref={toast} />
            <div className="card col-12">
                {leaveProfile==null && <Button onClick={() => gotoList()} className="p-button-outlined" label="Go Back to List" />}
                <h5>{leaveProfile==null?"New":"Edit"} Leave</h5>
                <form onSubmit={handleSubmit(onSubmit)} >
                <div className="p-fluid formgrid grid">
                    <div className="field col-12 md:col-6">
                        <Controller
                            name="dtLeaveType_id"
                            control={control}
                            rules={{ required: 'Leave Type is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Leave Type*</label>
                                <SelectLookupData field={field} model={LEAVE_TYPE_MODEL}
                                    className={classNames({ 'p-invalid': fieldState.error })} /> 
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>

                    <div className="field col-12 md:col-6">
                        <Controller
                            name="dtEmployee_id"
                            control={control}
                            rules={{ required: 'Employee Name is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Employee Name*</label>
                                <SelectLookupData field={field} model={EMPLOYEE_MODEL}
                                    className={classNames({ 'p-invalid': fieldState.error })} /> 
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>

                    <div className="field col-12 md:col-6">
                        <Controller
                            name="fromDate"
                            control={control}
                            rules={{ required: 'Leave Start Date is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name}> From Date*</label>
                                <Calendar inputId={field.name} value={field.value} onChange={field.onChange} 
                                    dateFormat="dd/mm/yy" className={classNames({ 'p-invalid': fieldState.error })} />
                                {getFormErrorMessage(field.name)}
                            </>                                
                        )}/>
                    </div>

                    <div className="field col-12 md:col-6">
                        <Controller
                            name="toDate"
                            control={control}
                            rules={{ required: 'Leave End Date is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name}> To Date*</label>
                                <Calendar inputId={field.name} value={field.value} onChange={field.onChange} 
                                    dateFormat="dd/mm/yy" className={classNames({ 'p-invalid': fieldState.error })} />
                                {getFormErrorMessage(field.name)}
                            </>                                
                        )}/>
                    </div>

                    <div className="field col-12 md:col-6">
                        <Controller
                            name="remarks"
                            control={control}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Remarks</label>
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