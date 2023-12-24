import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { InputSwitch } from 'primereact/inputswitch';
import { InputTextarea } from 'primereact/inputtextarea';

import { MasterDataDBService } from '../../../services/MasterDataDBService';

import { WAREHOUSE_MODEL } from '../../../constants/models';

const Form = ({warehouseProfile}) => {

    const modelName = WAREHOUSE_MODEL;
    let navigate = useNavigate();
    const toast = useRef(null);
    const masterDataDBService = new MasterDataDBService();
    const [submitted, setSubmitted] = useState(false);

    const {
        control,
        formState: { errors },
        setValue,
        handleSubmit
    } = useForm({
        defaultValues: warehouseProfile
    });

    useEffect(() => {
        if(warehouseProfile===undefined){
            setValue("status", true);
        }
    }, []);

    const onSubmit = (formData) => {
        setSubmitted(true);
        if(warehouseProfile==null){
            masterDataDBService.create(modelName, formData).then(data => {
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Warehouse Created', life: 3000 });
                // navigate("/warehouses/" + data.ID);
                navigate("/warehouses");
            });
        }else{
            masterDataDBService.update(modelName, formData.id, formData).then(data => {
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Warehouse Updated', life: 3000 });
                setSubmitted(false);
                // navigate("/warehouses/" + data.ID);
                navigate("/warehouses");
            });
        }
    };

    const gotoList = () => {
        navigate("/warehouses");
    };

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    return (
        <div className="form-demo">
            <Toast ref={toast} />
            <div className="card col-12">
                {warehouseProfile==null && <Button onClick={() => gotoList()} className="p-button-outlined" label="Go Back to List" />}
                <h5>{warehouseProfile==null?"New":"Edit"} Warehouse</h5>
                <form onSubmit={handleSubmit(onSubmit)} >
                <div className="p-fluid formgrid grid">
                    <div className="field col-12 md:col-6">
                        <Controller
                            name="name"
                            control={control}
                            rules={{ required: 'Warehouse Name is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Warehouse Name*</label>
                                <InputText  inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>

                    <div className="field col-12 md:col-6">
                        <Controller
                            name="description"
                            rules={{ required: 'Warehouse Description is required.' }}
                            control={control}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Description*</label>
                                <InputText  inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>

                    <div className="field col-12 md:col-6">
                        <Controller
                            name="address"
                            rules={{ required: 'Warehouse Address is required.' }}
                            control={control}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Warehouse Address*</label>
                                <InputTextarea  inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>

                    <div className="field col-12 md:col-6 mt-2">
                        <div className='field'>Status*</div>
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

                    <div className="field col-12 md:col-6 mt-2">
                        <div className='field'>Default*</div>
                        <Controller
                            name="_default"
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
                    <Button type="submit" label="Submit" className="mt-2" />
                </>
                </form>
            </div>
        </div>
    );
}
                 
export default Form;