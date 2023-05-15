import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Fieldset } from 'primereact/fieldset';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { InputSwitch } from 'primereact/inputswitch';
import SelectConstData from '../../components/SelectConstData';
import SelectLookupData from '../../components/SelectLookupData';
import { InputNumber } from 'primereact/inputnumber';
import { HRService } from '../../../services/HRService';
import { BLOOD_GROUP, GENDER, MARITAL_STATUS, RELIGION } from '../../../constants/lookupData';
import { EMPLOYEE_MODEL,DEPARTMENT_MODEL,GRADE_MODEL,DESIGNATION_MODEL,OFFICE_TIME_MODEL,GROUP_MODEL} from '../../../constants/models';


const Form = ({empProfile}) => {

    const modelName = EMPLOYEE_MODEL;

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
        defaultValues: empProfile //async () =>  hrManagementService.getById(modelName, empProfile)
      });

    const onSubmit = (formData) => {
        if(empProfile==null){
            hrManagementService.create(modelName, formData).then(data => {
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Employee Created', life: 3000 });
                navigate("/employees/" + data.ID);
            });
        }else{
            hrManagementService.update(modelName, formData._id, formData).then(data => {
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Employee Updated', life: 3000 });
            });
        }
    };

    const gotoList = () => {
        navigate("/employees");
    };

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    return (
        <div className="form-demo">
            <Toast ref={toast} />
            <div className="card col-12">
                {empProfile==null && <Button onClick={() => gotoList()} className="p-button-outlined" label="Go Back to List" />}
                <h5>{empProfile==null?"New":"Edit"} Employee</h5>
                <form onSubmit={handleSubmit(onSubmit)} >
                <div className="p-fluid formgrid grid">
                    <div className="field col-12 md:col-4">
                        <Controller
                            name="empID"
                            control={control}
                            rules={{ required: 'Employee ID is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Employee ID*</label>
                                <InputText  inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>
                    <div className="field col-12 md:col-4">
                        <Controller
                            name="fullname"
                            control={control}
                            rules={{ required: 'Employee Name is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Full Name</label>
                                <InputText  inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>

                    <Fieldset className="card col-12" legend="Personal Information">
                    <div className="p-fluid grid">

                    <div className="field col-12 md:col-4">
                        <Controller
                            name="fathername"
                            control={control}
                            rules={{ required: 'Father Name is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Father's Name</label>
                                <InputText  inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>
                    <div className="field col-12 md:col-4">
                        <Controller
                            name="mothername"
                            control={control}
                            rules={{ required: 'Mother Name is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Mother's Name</label>
                                <InputText  inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>
                    <div className="field col-12 md:col-4">
                        <Controller
                            name="dob"
                            control={control}
                            rules={{ required: 'Date of birth is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Date of Birth</label>
                                <InputText  inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>
                    <div className="field col-12 md:col-4">
                        <Controller
                            name="presentaddress"
                            control={control}
                            rules={{ required: 'Present address is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Present Address</label>
                                <InputTextarea  inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>
                    <div className="field col-12 md:col-4">
                        <Controller
                            name="parmanentaddress"
                            control={control}
                            rules={{ required: 'Parmanent address is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Permanent Address</label>
                                <InputTextarea  inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>
                    <div className="field col-12 md:col-4">
                        <Controller
                            name="nationality"
                            control={control}
                            rules={{ required: 'Nationality is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Nationality</label>
                                <InputText  inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>
                    <div className="field col-12 md:col-4">
                        <Controller
                            name="nid_birth_certificate"
                            control={control}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>NID / Birth Certificate No</label>
                                <InputText  inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>
                    <div className="field col-12 md:col-4">
                        <Controller
                            name="gender"
                            control={control}
                            rules={{ required: 'Gender is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Gender</label>
                                <SelectConstData field={field} data={GENDER}
                                        onSelectChange={(value) => {console.log(value); 
                                            // setBankCash(value)
                                        }}
                                        className={classNames({ 'p-invalid': fieldState.error })} /> 
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>
                    <div className="field col-12 md:col-4">
                        <Controller
                            name="bloodgroup"
                            control={control}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Blood Group</label>
                                <SelectConstData field={field} data={BLOOD_GROUP}
                                        onSelectChange={(value) => {console.log(value); 
                                            // setBankCash(value)
                                        }}
                                        className={classNames({ 'p-invalid': fieldState.error })} /> 
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>
                    <div className="field col-12 md:col-4">
                        <Controller
                            name="religion"
                            control={control}
                            rules={{ required: 'Religion is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Religion</label>
                                <SelectConstData field={field} data={RELIGION}
                                        onSelectChange={(value) => {console.log(value); 
                                            // setBankCash(value)
                                        }}
                                        className={classNames({ 'p-invalid': fieldState.error })} /> 
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>
                    <div className="field col-12 md:col-4">
                        <Controller
                            name="maritalstatus"
                            control={control}
                            rules={{ required: 'Marital Status is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Marital Status</label>
                                <SelectConstData field={field} data={MARITAL_STATUS}
                                        onSelectChange={(value) => {console.log(value); 
                                            // setBankCash(value)
                                        }}
                                        className={classNames({ 'p-invalid': fieldState.error })} /> 
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>
                    <div className="field col-12 md:col-4">
                        <Controller
                            name="tinId"
                            control={control}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>TIN ID</label>
                                <InputText  inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>
                    <div className="field col-12 md:col-4">
                        <Controller
                            name="passportNo"
                            control={control}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Passport No</label>
                                <InputText  inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>
                    </div>
                    </Fieldset>
                    <Fieldset className="card col-12" legend="Contact Information">
                    <div className="p-fluid grid">
                    <div className="field col-12 md:col-4">
                        <Controller
                            name="phone"
                            control={control}
                            rules={{ required: 'Phone is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Phone</label>
                                <InputText  keyfilter="int" inputId={field.name} placeholder='+880182345235' value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>

                    <div className="field col-12 md:col-4">
                        <Controller
                            name="email"
                            control={control}
                            rules={{ required: 'Email is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Email</label>
                                <InputText type='email' inputId={field.name}  value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>
                    <div className="field col-12 md:col-4">
                        <Controller
                            name="secondaryPhone"
                            control={control}
                            rules={{ required: 'Email is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Secondary Phone Number</label>
                                <InputText type='email' inputId={field.name}  value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>
                    <div className="field col-12 md:col-4">
                        <Controller
                            name="emergencyContactPersonNumber"
                            control={control}
                            rules={{ required: 'Email is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Emergency Conctact Number</label>
                                <InputText type='email' inputId={field.name}  value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>
                    <div className="field col-12 md:col-4">
                        <Controller
                            name="emergencyContactPersonName"
                            control={control}
                            rules={{ required: 'Email is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Emergency Contact Person Name</label>
                                <InputText type='email' inputId={field.name}  value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>
                    <div className="field col-12 md:col-4">
                        <Controller
                            name="relationWithEmergencyContactPerson"
                            control={control}
                            rules={{ required: 'Email is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Relation with Emergency Contact Person</label>
                                <InputText type='email' inputId={field.name}  value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>
                    </div>
                    </Fieldset>                    
                    <Fieldset className="card col-12" legend="Office Related Information">
                    <div className="p-fluid grid">
                    <div className="field col-12 md:col-4">
                            <Controller
                                name="punchID"
                                control={control}
                                rules={{ required: 'Punch ID is required.' }}
                                render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Punch</label>
                                    <InputText  inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                    {getFormErrorMessage(field.name)}
                                </>
                            )}/>
                        </div>
                        <div className="field col-12 md:col-4">
                            <Controller
                                name="dtGrade_id"
                                control={control}
                                render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Grade</label>
                                    <SelectLookupData field={field} model={GRADE_MODEL}
                                        className={classNames({ 'p-invalid': fieldState.error })} /> 
                                    {getFormErrorMessage(field.name)}
                                </>
                            )}/>
                        </div>
                        <div className="field col-12 md:col-4">
                            <Controller
                                name="dtDepartment_id"
                                control={control}
                                render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Department</label>
                                    <SelectLookupData field={field} model={DEPARTMENT_MODEL}
                                        className={classNames({ 'p-invalid': fieldState.error })} /> 
                                    {getFormErrorMessage(field.name)}
                                </>
                            )}/>
                        </div>
                        <div className="field col-12 md:col-4">
                            <Controller
                                name="dtDesignation_id"
                                control={control}
                                render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Designation</label>
                                    <SelectLookupData field={field} model={DESIGNATION_MODEL}
                                        className={classNames({ 'p-invalid': fieldState.error })} /> 
                                    {getFormErrorMessage(field.name)}
                                </>
                            )}/>
                        </div>
                        <div className="field col-12 md:col-4">
                            <Controller
                                name="dtOfficeTime_id"
                                control={control}
                                render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Office Time</label>
                                    <SelectLookupData field={field} model={OFFICE_TIME_MODEL}
                                        className={classNames({ 'p-invalid': fieldState.error })} /> 
                                    {getFormErrorMessage(field.name)}
                                </>
                            )}/>
                        </div>

                        <div className="field col-12 md:col-4">
                            <Controller
                                name="dtGroup_id"
                                control={control}
                                render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Group</label>
                                    <SelectLookupData field={field} model={GROUP_MODEL}
                                        className={classNames({ 'p-invalid': fieldState.error })} /> 
                                    {getFormErrorMessage(field.name)}
                                </>
                            )}/>
                        </div>
                        <div className="field col-12 md:col-4 ">
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
                    </Fieldset>
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