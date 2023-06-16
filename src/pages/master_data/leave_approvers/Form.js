import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { InputTextarea } from 'primereact/inputtextarea';
import { Fieldset } from 'primereact/fieldset';
import SelectConstData from '../../components/SelectConstData';
import SelectLookupData from '../../components/SelectLookupData';

import { HRService } from '../../../services/HRService';

import { EMPLOYEE_LEAVE_APPROVERS_MODEL, EMPLOYEE_MODEL } from '../../../constants/models';

const Form = ({leaveApproverProfile}) => {

    console.log("Leave Approver Profile::", leaveApproverProfile);

    const modelName = EMPLOYEE_LEAVE_APPROVERS_MODEL;
    let navigate = useNavigate();
    const toast = useRef(null);
    const hrManagementService = new HRService();
    const [submitted, setSubmitted] = useState(false);
    const {
        register,
        control,
        formState: { errors },
        resetField,
        handleSubmit
    } = useForm({
        defaultValues: leaveApproverProfile
      });

    const onSubmit = (formData) => {
        try{        
            setSubmitted(true);
            if(leaveApproverProfile==null){
                hrManagementService.create(modelName, formData).then(data => {
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Leave Approval Created', life: 3000 });
                    navigate("/leaves/" + data.ID);
                });
            }else{
                hrManagementService.update(modelName, formData._id, formData).then(data => {
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Leave Approval Updated', life: 3000 });
                    setSubmitted(false);
                    // navigate("/leave_approvers/" + data.ID);
                });
            }
        }
        catch (err){
            console.log(err)
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Action Performed', life: 3000 });
            navigate("/leave_approvers");
        }
    };

    const gotoList = () => {
        navigate("/leave_approvers");
    };

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    return (
        <div className="form-demo">
            <Toast ref={toast} />
            <div className="card col-12">
                {leaveApproverProfile==null && <Button onClick={() => gotoList()} className="p-button-outlined" label="Go Back to List" />}
                <h5>{leaveApproverProfile==null?"New":"Edit"} Leave Approval</h5>
                <form onSubmit={handleSubmit(onSubmit)} >
                <div className="p-fluid formgrid grid">
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
                            name="approver1_dtEmployee_id"
                            control={control}
                            rules={{ required: 'Employee Approver1 Name is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Employee Approver1 Name*</label>
                                <SelectLookupData field={field} model={EMPLOYEE_MODEL}
                                    className={classNames({ 'p-invalid': fieldState.error })} /> 
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>
                    <div className="field col-12 md:col-6">
                        <Controller
                            name="approver2_dtEmployee_id"
                            control={control}
                            rules={{ required: 'Employee Approver2 Name is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Employee Approver2 Name*</label>
                                <SelectLookupData field={field} model={EMPLOYEE_MODEL}
                                    className={classNames({ 'p-invalid': fieldState.error })} /> 
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>
                    <div className="field col-12 md:col-6">
                        <Controller
                            name="approver3_dtEmployee_id"
                            control={control}
                            rules={{ required: 'Employee Approver2 Name is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Employee Approver3 Name*</label>
                                <SelectLookupData field={field} model={EMPLOYEE_MODEL}
                                    className={classNames({ 'p-invalid': fieldState.error })} /> 
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>

                    <div className="field col-12 md:col-6">
                        <Controller
                            name="numOfApprovalNeeded"
                            control={control}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Number of Approval Needed</label>
                                <InputText  inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
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