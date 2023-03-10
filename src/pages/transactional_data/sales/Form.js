import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';

import { HRService } from '../../../services/HRService';
import { SALE_MODEL } from '../../../constants/models';

const Form = ({saleProfile}) => {

    const modelName = SALE_MODEL;

    const [customers, setCustomers] = useState([]);

    let navigate = useNavigate();

    const toast = useRef(null);
    const hrManagementService = new HRService();
    
    const {
        register,
        control,
        formState: { errors },
        resetField,
        handleSubmit
    } = useForm({
        defaultValues: saleProfile //async () =>  hrManagementService.getById(modelName, SaleProfile)
      });

    const onSubmit = (formData) => {
        if(saleProfile==null){
            hrManagementService.create(modelName, formData).then(data => {
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Sale Created', life: 3000 });
                navigate("/sales/" + data.ID);
            });
        }else{
            hrManagementService.update(modelName, formData._id, formData).then(data => {
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Sale Updated', life: 3000 });
            });
        }
    };

    const gotoList = () => {
        navigate("/sales");
    };

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    return (
        <div className="grid h-screen">        
            <div className="col h-screen"  style={{ backgroundColor: "blue" }}>
            <div class="card">
                <div className="p-fluid formgrid grid">
                    <div className="field col">
                        <Controller
                            name="saleId"
                            control={control}
                            rules={{ required: 'Sale ID is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Sale ID*</label>
                                <InputText  inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>
                    <div className="field col">
                        <Controller
                            name="saleName"
                            control={control}
                            rules={{ required: 'Sale Name is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Sale Name*</label>
                                <InputText  inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>
                    <div className="field col">
                        <Controller
                            name="saleName"
                            control={control}
                            rules={{ required: 'Sale Name is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Sale Name*</label>
                                <InputText  inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>
                    <div className="field col">
                        <Controller
                            name="saleName"
                            control={control}
                            rules={{ required: 'Sale Name is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Sale Name*</label>
                                <InputText  inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>
                </div>
            </div>
            <div class="card">
            <div className="p-fluid formgrid grid">
                    <div className="field col-12 md:col-6">
                        <Controller
                            name="saleId"
                            control={control}
                            rules={{ required: 'Sale ID is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Sale ID*</label>
                                <InputText  inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>
                    <div className="field col-12 md:col-6">
                        <Controller
                            name="saleName"
                            control={control}
                            rules={{ required: 'Sale Name is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Sale Name*</label>
                                <InputText  inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>
                </div>

            <DataTable value={customers} resizableColumns 
                stripedRows showGridlines scrollable scrollHeight="400px" 
                style={{ minHeight: "60%" }}>
                <Column field="name" header="Name"></Column>
                <Column field="country.name" header="Country"></Column>
                <Column field="representative.name" header="Representative"></Column>
                <Column field="company" header="Company"></Column>
            </DataTable>
            
            </div>
            <div class="flex align-content-end justify-content-around flex-wrap card-container indigo-container">
                <div class="flex align-items-center justify-content-center w-4rem h-4rem bg-indigo-500 font-bold text-white border-round m-2">1</div>
                <div class="flex align-items-center justify-content-center w-4rem h-4rem bg-indigo-500 font-bold text-white border-round m-2">2</div>
                <div class="flex align-items-center justify-content-center w-4rem h-4rem bg-indigo-500 font-bold text-white border-round m-2">3</div>
                <div class="flex align-items-center justify-content-center w-4rem h-4rem bg-indigo-500 font-bold text-white border-round m-2">4</div>
                <div class="flex align-items-center justify-content-center w-4rem h-4rem bg-indigo-500 font-bold text-white border-round m-2">5</div>
            </div>
        </div>

      
    </div>
        // <div className="form-demo">
        //     <Toast ref={toast} />
        //     <div className="card col-12">
        //         {saleProfile==null && <Button onClick={() => gotoList()} className="p-button-outlined" label="Go Back to List" />}
        //         <h5>{saleProfile==null?"New":"Edit"} Sale</h5>
        //         <form onSubmit={handleSubmit(onSubmit)} >


        //         </div>
        //         <>
        //             <Button type="submit" label="Submit" className="mt-2" />
        //         </>
        //         </form>
        //     </div>
        // </div>
    );
}
                 
export default Form;