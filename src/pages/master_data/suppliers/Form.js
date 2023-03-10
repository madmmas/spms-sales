import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { InputTextarea } from 'primereact/inputtextarea';
import { HRService } from '../../../services/HRService';
import { SUPPLIER_MODEL } from '../../../constants/models';
import { RadioButton } from "primereact/radiobutton";
const Form = ({supplierProfile}) => {

    const modelName = SUPPLIER_MODEL;

    let navigate = useNavigate();

    const toast = useRef(null);
    const hrManagementService = new HRService();

    const [status, setStatus] = useState('');
 
    const {
        register,
        control,
        formState: { errors },
        resetField,
        handleSubmit
    } = useForm({
        defaultValues: supplierProfile //async () =>  hrManagementService.getById(modelName, SupplierProfile)
      });

    const onSubmit = (formData) => {
        if(supplierProfile==null){
            hrManagementService.create(modelName, formData).then(data => {
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Supplier Created', life: 3000 });
                navigate("/suppliers/" + data.ID, { replace: true });
            });
        }else{
            hrManagementService.update(modelName, formData._id, formData).then(data => {
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Supplier Updated', life: 3000 });
            });
        }
    };

    const gotoList = () => {
        navigate("/suppliers", { replace: true });
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
                            name="supplierId"
                            control={control}
                            rules={{ required: 'Supplier ID is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Supplier ID*</label>
                                <InputText  inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>
                    <div className="field col-12 md:col-6">
                        <Controller
                            name="supplierName"
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
                            name="supplierCategory"
                            control={control}
                            rules={{ required: 'Supplier Category is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Supplier Category</label>
                                <InputText  inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>


                    <div className="field col-12 md:col-6">
                        <Controller
                            name="supplierPhone"
                            control={control}
                            // rules={{ required: 'Supplier Phone is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                     <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Phone</label>
                                <InputText  inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>

                    <div className="field col-12 md:col-6">
                        <Controller
                            name="supplierContactPersonName"
                            control={control}
                            // rules={{ required: 'Supplier Contact PersonName is required.' }}
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
                            name="supplierContactPersonDesignation"
                            control={control}
                            // rules={{ required: 'Supplier Contact PersonName is required.' }}
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
                            name="supplierContactPersonPhone"
                            control={control}
                            // rules={{ required: 'Supplier Contact PersonName is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Contact Person Mobile Number</label>
                                <InputText  inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>

                    <div className="field col-12 md:col-6">
                        <Controller
                            name="supplierCurrency"
                            control={control}
                            // rules={{ required: 'Supplier Contact PersonName is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Currency</label>
                                <InputText  inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>


                    <div className="field col-12 md:col-6">
                        <Controller
                            name="supplierAddress"
                            control={control}
                            // rules={{ required: 'Supplier Address is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Supplier Address*</label>
                                <InputTextarea  inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>
                   
                 <div className="field col-12 md:col-6 ">
                 <label  className={classNames({ 'p-error': errors.value })}>Status</label>
                <div className="flex flex-wrap gap-6 card ">  
                <div className="flex align-items-center">
                    <RadioButton inputId="ingredient1" name="active" value="Cheese" onChange={(e) => setStatus(e.value)} checked={status === 'Cheese'} />
                    <label htmlFor="ingredient1" className="ml-2">Active</label>
                </div>
                <div className="flex align-items-center">
                    <RadioButton inputId="ingredient2" name="inactive" value="Mushroom" onChange={(e) => setStatus(e.value)} checked={status === 'Mushroom'} />
                    <label htmlFor="ingredient2" className="ml-2">Inactive</label>
                </div>
                </div>
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