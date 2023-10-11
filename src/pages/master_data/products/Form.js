import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { InputSwitch } from 'primereact/inputswitch';
import { InputTextarea } from 'primereact/inputtextarea';
import { classNames } from 'primereact/utils';

import SelectConstData from '../../components/SelectConstData';
import SelectLookupData from '../../components/SelectLookupData';

import { PRODUCT_CATEGORY_MODEL, WAREHOUSE_MODEL, PRODMODEL_MODEL, PRODBRAND_MODEL } from '../../../constants/models';
import { MEASUREMENT_UNITS } from '../../../constants/lookupData';
import { ProductService } from '../../../services/ProductService';

const Form = ({productData}) => {

    let navigate = useNavigate();

    const toast = useRef(null);
    const productService = new ProductService();
    const [submitted, setSubmitted] = useState(false);

    const {
        control,
        formState: { errors },
        reset,
        handleSubmit
    } = useForm({
        defaultValues: productData
    });

    const resetForm = () => {
        reset({ 
            id: null,
            code: "",
            name: "",
            price: 0.00,
            type: "GENERAL",
            category_id: "",
            // warehouse_id: "",
            brand_name: "",
            model_no: "",
            brand_id: "",
            model_id: "",
            part_number: "",
            unit: MEASUREMENT_UNITS[0].id,
            low_stock_qty: 0,
            remarks: "",
            active: true
         });
    };

    useEffect(() => {
        if (productData) {
            reset(productData);
        } else {
            resetForm();
        }
    }, [productData]);

    const buildFormData = (data) => {
        return {
            id: data.id,
            code: data.code,
            name: data.name,
            price: Number(data.price),
            type: 'GENERAL',
            category_id: data.category_id,
            // warehouse_id: data.warehouse_id,
            brand_name: data.brand_name,
            model_no: data.model_no,
            brand_id: data.brand_id,
            model_id: data.model_id,
            part_number: data.part_number,
            unit: data.unit,
            low_stock_qty: Number(data.low_stock_qty),
            remarks: data.remarks,
            items: data.items,
            active: data.active
        }
    }

    const validateData = (data) => {
        console.log("validateData:::", data);
        let valid = true;
        // check if product name exist
        let isExist = productService.isProductNameExist(data.id, data.name);
        if(isExist){
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Product Name already exist', life: 3000 });
            valid = false;
        }
        // check if product code exist
        isExist = productService.isProductCodeExist(data.id, data.code);
        if(isExist){
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Product Code already exist', life: 3000 });
            valid = false;
        }

        // // check if product part number exist
        isExist = productService.isProductPartNumberExist(data.id, data.part_number, data.brand_id);
        if(isExist){
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Product Part Number already exist for the Brand', life: 3000 });
            valid = false;
        }
        return valid;
    }

    const onSubmit = (formData) => {

        let data = buildFormData(formData);
        let valid = validateData(data);
        if(!valid){
            return;
        }

        try{
            setSubmitted(true);
            if(productData==null){
                productService.create(data).then(data => {
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
                    // navigate("/products/" + data.ID);
                    navigate("/products");
                });
            }else{
                productService.update(data.id, data).then(data => {
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
                    // navigate("/products/" + data.ID);
                    navigate("/products");
                });
            }
        }
        catch (err){
            console.log(err)
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Action Performed', life: 3000 });
            navigate("/products");
        }
    };

    const gotoList = () => {
        navigate("/products");
    };

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    return (
        <div className="form-demo">
            <Toast ref={toast} />
            <div className="card col-12">
                {productData==null && <Button onClick={() => gotoList()} className="p-button-outlined" label="Go Back to List" />}
                <h5>{productData==null?"New":"Edit"} Product</h5>
                <form onSubmit={handleSubmit(onSubmit)} >
                <div className="p-fluid formgrid grid">
                    <div className="field col-12 md:col-4">
                        <Controller
                            name="name"
                            control={control}
                            rules={{ required: 'Product Name is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Product Name*</label>
                                <InputText  inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>
                    <div className="field col-12 md:col-4">
                        <Controller
                            name="category_id"
                            control={control}
                            rules={{ required: 'Product Category is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Product Category*</label>
                                <SelectLookupData field={field} model={PRODUCT_CATEGORY_MODEL}
                                    className={classNames({ 'p-invalid': fieldState.error })} /> 
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
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Product Code</label>
                                <InputText  inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>

                    <div className="field col-12 md:col-4">
                        <Controller
                            name="brand_id"
                            control={control}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Product Brand</label>
                                <SelectLookupData field={field} model={PRODBRAND_MODEL}
                                    className={classNames({ 'p-invalid': fieldState.error })} /> 
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>
                    <div className="field col-12 md:col-4">
                        <Controller
                            name="model_id"
                            control={control}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Product Model</label>
                                <SelectLookupData field={field} model={PRODMODEL_MODEL}
                                    className={classNames({ 'p-invalid': fieldState.error })} /> 
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>
                    <div className="field col-12 md:col-4">
                        <Controller
                            name="part_number"
                            control={control}
                            // rules={{ required: 'Part Number is required.' }}
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
                            name="unit"
                            control={control}
                            rules={{ required: 'Measurement Unit is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Measurement Unit</label>
                                <SelectConstData field={field} data={MEASUREMENT_UNITS}
                                     className={classNames({ 'p-invalid': fieldState.error })} /> 
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>
                    <div className="field col-12 md:col-4">
                        <Controller
                            name="low_stock_qty"
                            control={control}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Low Stock Quatity</label>
                                <InputText  inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>
                    
                    <div className="field col-12 md:col-8">
                        <Controller
                            name="remarks"
                            control={control}                            
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Remarks</label>
                                 <InputTextarea  inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} 
                                    onChange={(e) => field.onChange(e.target.value)} />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>
                    <div className="field col-12 md:col-6 mt-2">
                        <div className='field'>Status</div>
                        <Controller
                            name="active"
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