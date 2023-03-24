import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';

import SelectConstData from '../../components/SelectConstData';
import SelectLookupData from '../../components/SelectLookupData';
import SelectMasterData from '../../components/SelectMasterData';

import { HRService } from '../../../services/HRService';
import { PRODUCT_MODEL, PRODUCT_CATEGORY_MODEL } from '../../../constants/models';
import { PRODUCT_STATUS, MEASUREMENT_UNITS } from '../../../constants/lookupData';

const Form = ({productProfile}) => {

    const modelName = PRODUCT_MODEL;

    let navigate = useNavigate();

    const toast = useRef(null);
    const hrManagementService = new HRService();
    
    const [supplierDialog, setSupplierDialog] = useState(false);

    const {
        register,
        control,
        formState: { errors },
        resetField,
        handleSubmit
    } = useForm({
        defaultValues: productProfile //async () =>  hrManagementService.getById(modelName, ProductProfile)
      });

    const onSubmit = (formData) => {
        if(productProfile==null){
            hrManagementService.create(modelName, formData).then(data => {
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
                navigate("/products/" + data.ID);
            });
        }else{
            hrManagementService.update(modelName, formData._id, formData).then(data => {
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
            });
        }
    };

    const gotoList = () => {
        navigate("/products");
    };

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    const selectAndHideDialog = (id, name) => {
        // resetField(selectedField);
        setSupplierDialog(false);
    };

    const hideDialog = () => {
        // resetField(selectedField);
        setSupplierDialog(false);
    };
    const [selectedStatus, setSelectedStatus] = useState(null);
    const status = [
        { name: 'Active', value: '1' },
        { name: 'Inactive', value: '2' },
        { name: 'Draft', value: '3' },
    ];

    return (
        <div className="form-demo">
            <Toast ref={toast} />
            <div className="card col-12">
                {productProfile==null && <Button onClick={() => gotoList()} className="p-button-outlined" label="Go Back to List" />}
                <h5>{productProfile==null?"New":"Edit"} Product</h5>
                <form onSubmit={handleSubmit(onSubmit)} >
                <div className="p-fluid formgrid grid">
                    <div className="field col-12 md:col-4">
                        <Controller
                            name="name"
                            control={control}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Name</label>
                                <InputText  inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>
                    <div className="field col-12 md:col-4">
                        <Controller
                            name="code"
                            control={control}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Code</label>
                                <InputText  inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>
                    <div className="field col-12 md:col-4">
                        <Controller
                            name="dtProductCategory_id"
                            control={control}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Product Category</label>
                                <SelectLookupData field={field} model={PRODUCT_CATEGORY_MODEL}
                                    className={classNames({ 'p-invalid': fieldState.error })} /> 
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>
                    <div className="field col-12 md:col-4">
                        <Controller
                            name="brandName"
                            control={control}
                            render={({ field, fieldState }) => (
                            <>
                              <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Brand Name</label>
                                <InputText  inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>
                    <div className="field col-12 md:col-4">
                        <Controller
                            name="partNumber"
                            control={control}
                            render={({ field, fieldState }) => (
                            <>
                              <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Part Number</label>
                                <InputText  inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>
                    <div className="field col-12 md:col-4">
                        <Controller
                            name="unitPrice"
                            control={control}
                            render={({ field, fieldState }) => (
                            <>
                              <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Unit Price</label>
                                <InputText  inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>
                    <div className="field col-12 md:col-4">
                        <Controller
                            name="barCode"
                            control={control}
                            render={({ field, fieldState }) => (
                            <>
                              <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Bar Code</label>
                                <InputText  inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>
                    <div className="field col-12 md:col-4">
                        <Controller
                            name="minimumQty"
                            control={control}
                            render={({ field, fieldState }) => (
                            <>
                              <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Minimum Qty</label>
                                <InputText  inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>
                    <div className="field col-12 md:col-4">
                        <Controller
                            name="reorderQty"
                            control={control}
                            render={({ field, fieldState }) => (
                            <>
                              <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Reorder Qty</label>
                                <InputText  inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>
                    <div className="field col-12 md:col-4">
                        <Controller
                            name="unitOfMeasurement"
                            control={control}
                            render={({ field, fieldState }) => (
                            <>
                              <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Unit Of Measurement</label>
                                <InputText  inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>
                    <div className="field col-12 md:col-4">
                        <Controller
                            name="status"
                            control={control}                            
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Active Status</label>
                                <SelectConstData field={field} data={PRODUCT_STATUS}
                                    className={classNames({ 'p-invalid': fieldState.error })} /> 
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>
                    <div className="field col-12 md:col-4">
                        <Controller
                            name="remarks"
                            control={control}                            
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Remarks</label>
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