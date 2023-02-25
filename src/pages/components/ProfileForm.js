import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { HRService } from '../../services/HRService';

const ProfileForm = ({empProfile}) => {

    const modelName = 'emp_profile';

    let navigate = useNavigate();

    const [empProfiles, setActivityTypes] = useState(null);
    const [empProfileDialog, setActivityTypeDialog] = useState(false);
    const [selectedField, setSelectedField] = useState(null);
    const [selectedFieldValue, setSelectedFieldValue] = useState(null);

    const toast = useRef(null);
    const hrManagementService = new HRService();
    
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
        // hrManagementService.update(modelName, formData._id, formData).then(data => {
        //     toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Role Updated', life: 3000 });
        //     // navigate("/empinfo");
        // });
    };

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    const showDialog = (fieldName, fieldValue) => {
        setSelectedField(fieldName);
        setSelectedFieldValue(fieldValue);
        setActivityTypeDialog(true);
    };

    const hideDialog = () => {
        // e.preventDefault()
        resetField(selectedField);
        setActivityTypeDialog(false);
    };

    const empProfileDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            {/* <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveActivityType} /> */}
        </>
    );

    const headerCaption = () => {
        if(selectedField === 'empId') {
            return 'Change Employee ID';
        } else if(selectedField === 'empName') {
            return 'Change Employee Name';
        } else if(selectedField === 'punchId') {
            return 'Change Punch ID';
        }
    }

    return (
        <div className="form-demo">
            <Toast ref={toast} />
            <div className=" col-12">
                <h5>Employee Profile</h5>
                <div className="p-fluid formgrid grid">
                    <div className="field col-12 md:col-6">
                        <Controller name="empId" control={control} render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name}>Employee ID*</label>
                                <div className="p-inputgroup">
                                    <InputText disabled inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                    <Button icon="pi pi-search" className="p-button-warning" onClick={(e)=>{e.preventDefault(); showDialog(field.name, field.value)}} />
                                </div>
                            </>
                        )} />
                    </div>
                    <div className="field col-12 md:col-6">
                        <Controller name="empName" control={control} render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name}>Employee Name*</label>
                                <div className="p-inputgroup">
                                    <InputText disabled inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                    <Button icon="pi pi-search" className="p-button-warning" onClick={(e)=>{e.preventDefault(); showDialog(field.name, field.value)}} />
                                </div>
                            </>
                        )} />
                    </div>
                    <div className="field col-12 md:col-6">
                        <Controller name="punchId" control={control} render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name}>Punch ID*</label>
                                <div className="p-inputgroup">
                                    <InputText disabled inputId={field.name} value={field.value} inputRef={field.ref}  />
                                    <Button icon="pi pi-search" className="p-button-warning" onClick={(e)=>{e.preventDefault(); showDialog(field.name, field.value)}} />
                                </div>
                            </>
                        )} />
                    </div>
                </div>
            </div>

            <Dialog visible={empProfileDialog} style={{ width: '450px' }} header={headerCaption}  modal className="p-fluid" onHide={hideDialog}>
                <form onSubmit={handleSubmit(onSubmit)} >

                {/* <div className="field">
                    <label htmlFor="name">Name</label>
                    <Dropdown inputId="dd-city" value={selectedCity} onChange={(e) => setSelectedCity(e.value)} options={cities} optionLabel="name" className="w-full md:w-14rem" />
                    {submitted && !activity_type.name && <small className="p-invalid">Name is required.</small>}
                </div> */}
                {/* <div className="field">
                    <label htmlFor="description">Description</label>
                    <InputTextarea id="description" value={activity_type.description} onChange={(e) => onInputChange(e, 'description')} required rows={3} cols={20} />
                </div> */}
                {selectedField=="empId" && 
                    <Controller
                        name="empId"
                        control={control}
                        rules={{ required: 'Employee ID is required.' }}
                        render={({ field, fieldState }) => (
                        <>
                            <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Employee ID*</label>
                            <InputText  inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                            {getFormErrorMessage(field.name)}
                        </>
                    )}/>
                }
                {selectedField=="empName" && 
                    <Controller
                        name="empName"
                        control={control}
                        rules={{ required: 'Employee Name is required.' }}
                        render={({ field, fieldState }) => (
                        <>
                            <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Employee Name*</label>
                            <InputText  inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                            {getFormErrorMessage(field.name)}
                        </>
                    )}/>
                }
                {selectedField=="punchId" && 
                    <Controller
                        name="punchId"
                        control={control}
                        rules={{ required: 'Punch ID is required.' }}
                        render={({ field, fieldState }) => (
                        <>
                            <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Punch ID*</label>
                            <InputText  inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                            {getFormErrorMessage(field.name)}
                        </>
                    )}/>
                }
                <>
                    <Button type="submit" label="Submit" className="mt-2" />
                    <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={(e)=>{e.preventDefault(); hideDialog()}} />
                </>
                </form>
            </Dialog>

        </div>
    );
}
                 
export default ProfileForm;