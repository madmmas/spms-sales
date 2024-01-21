import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { InputSwitch } from 'primereact/inputswitch';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { classNames } from 'primereact/utils';

import SelectConstData from '../../components/SelectConstData';
import SelectLookupData from '../../components/SelectLookupData';

import { WAREHOUSE_MODEL, PRODMODEL_MODEL, PRODBRAND_MODEL } from '../../../constants/models';
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
        setValue,
        handleSubmit
    } = useForm({
        defaultValues: productData
    });

    const resetForm = () => {
        reset({ 
            id: null,
            code: "",
            name: "",
            category_id: "", // as GENERAL
            warehouse_id: "",
            brand_name: "",
            model_no: "",
            brand_id: "",
            model_id: "",
            part_number: "",
            unit: MEASUREMENT_UNITS[0].id,
            price: 0.00,
            min_trade_price: 0.00,
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
        let _data = {
            name: data.name,
            category_id: 1, // as GENERAL
            warehouse_id: data.warehouse_id,
            brand_id: data.brand_id,
            model_id: data.model_id,
            part_number: data.part_number,
            unit: data.unit,
            price: Number(data.price),
            min_trade_price: Number(data.min_trade_price),
            cost:data.cost,
            low_stock_qty: Number(data.low_stock_qty),
            remarks: data.remarks,
            active: data.active
        }

        if(data.id){
            _data.id = data.id;
        }

        return _data;
    }

    const validateData = async (data) => {
        console.log("validateData:::", data);
        let valid = true;
        // check if product name exist
        let isExist = await productService.isProductNameExist(data.id, data.name);
        if(isExist){
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Product Name already exist', life: 3000 });
            valid = false;
        }
        // check if product code exist
        // isExist = await productService.isProductCodeExist(data.id, data.code);
        // if(isExist){
        //     toast.current.show({ severity: 'error', summary: 'Error', detail: 'Product Code already exist', life: 3000 });
        //     valid = false;
        // }

        // // check if product part number exist
        isExist = await productService.isProductPartNumberExist(data.id, data.part_number, data.brand_id);
        if(isExist){
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Product Part Number already exist for the Brand', life: 3000 });
            valid = false;
        }

        if(data.price< data.cost){
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Price cannot be less than Cost', life: 3000 });
            valid = false;
        }

        if(data.min_trade_price < data.cost){
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Minimum Trade Price cannot be less than Cost', life: 3000 });
            valid = false;
        }

        return valid;
    }

    const onSubmit = (formData) => {

        let data = buildFormData(formData);

        setSubmitted(true);
        if(productData==null){
            validateData(data).then(valid => {
                if(valid){
                    productService.create(data).then(data => {
                        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
                        // navigate("/products/" + data.ID);
                        navigate("/products");
                    });
                }
            });
        }else{
            productService.update(data.id, data).then(data => {
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
                // navigate("/products/" + data.ID);
                navigate("/products");
            });
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
                            name="warehouse_id"
                            control={control}
                            rules={{ required: 'Warehouse is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Warehouse*</label>
                                <SelectLookupData field={field} model={WAREHOUSE_MODEL}
                                    onChangeItem={(id) => {
                                        console.log("SelectLookupData:onChangeItem", id)
                                        // set the default value
                                        setValue("warehouse_id", id);
                                    }}                                
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
                                <InputText readOnly={true} inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>
                    <div className="field col-12 md:col-4">
                        <Controller
                            name="brand_id"
                            control={control}
                            rules={{ required: 'Product Brand is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Product Brand*</label>
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
                            rules={{ required: 'Product Model is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Product Model*</label>
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
                             name="cost"
                             control={control} 
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Purchase Price</label>
                                <InputText readOnly={true} inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>
                    <div className="field col-12 md:col-4">
                        <Controller
                            name="price"
                            control={control}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Trade Price</label>
                                <InputNumber inputId={field.name} value={field.value} inputRef={field.ref} 
                                    onChange={(e) => field.onChange(e.value)}
                                    className={classNames({ 'p-invalid': fieldState.error })} 
                                    min={0} maxFractionDigits={2}
                                    />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>
                    <div className="field col-12 md:col-4">
                        <Controller
                            name="min_trade_price"
                            control={control}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Minimum Trade Price</label>
                                <InputNumber inputId={field.name} value={field.value} inputRef={field.ref} 
                                    onChange={(e) => field.onChange(e.value)}
                                    className={classNames({ 'p-invalid': fieldState.error })} 
                                    min={0} maxFractionDigits={2}
                                    />
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
                                <InputNumber inputId={field.name} value={field.value} inputRef={field.ref} 
                                    onChange={(e) => field.onChange(e.value)}
                                    className={classNames({ 'p-invalid': fieldState.error })} 
                                    min={0} maxFractionDigits={2}
                                    />
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