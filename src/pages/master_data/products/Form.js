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
import SelectMasterData from '../../components/SelectMasterData';

import { PRODUCT_CATEGORY_MODEL, WAREHOUSE_MODEL } from '../../../constants/models';
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
            warehouse_id: "",
            bar_code: "",
            brand_name: "",
            model_no: "",
            part_number: "",
            unit: "",
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
            warehouse_id: data.warehouse_id,
            bar_code: data.bar_code,
            brand_name: data.brand_name,
            model_no: data.model_no,
            part_number: data.part_number,
            unit: data.unit,
            low_stock_qty: Number(data.low_stock_qty),
            remarks: data.remarks,
            items: data.items,
            active: data.active
        }
    }
    const onSubmit = (formData) => {
        let data = buildFormData(formData);
        try{
            setSubmitted(true);
            if(productData==null){
                productService.create(data).then(data => {
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
                    navigate("/products/" + data.ID);
                });
            }else{
                productService.update(data.id, data).then(data => {
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
                    navigate("/products/" + data.ID);
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
                            name="bar_code"
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
                            name="brand_name"
                            control={control}
                            rules={{ required: 'Brand Name is required.' }}
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
                            name="model_no"
                            control={control}
                            rules={{ required: 'Model No is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Model No</label>
                                <InputText  inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>                    
                    <div className="field col-12 md:col-4">
                        <Controller
                            name="part_number"
                            control={control}
                            rules={{ required: 'Part Number is required.' }}
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
                    <div className="field col-12 md:col-4">
                    <Controller
                        name="warehouse_id"
                        control={control}
                        rules={{ required: 'Warehouse is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Warehouse*</label>
                                <SelectMasterData field={field} modelName={WAREHOUSE_MODEL}
                                    displayField="name"
                                    className={classNames({ 'p-invalid': fieldState.error })} 
                                    columns={[
                                        {field: 'name', header: 'Warehouse Name', filterPlaceholder: 'Filter by Warehouse Name'}, 
                                    ]} />
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