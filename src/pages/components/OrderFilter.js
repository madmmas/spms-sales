import * as moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';
import { Button } from 'primereact/button';

import SelectMasterData from '../components/SelectMasterData';

const OrderFilter = ({ reloadData, isSales }) => {

    const {
        register,
        control,
        formState: { errors },
        reset,
        setValue,
        handleSubmit,
        getValues,
    } = useForm({
        defaultValues: {}
    });

    const [customerCategory, setCustomerCategory] = useState(null);
    const [salesTypeList, setSalesTypeList] = useState([
        {id: "WALKIN", name: "Walkin"},
        {id: "REGISTERED", name: "Registered"},
        {id: "CONDITIONAL", name: "Conditional"},
    ]);
    const [salesStatusList, setSalesStatusList] = useState([
        {id: "draft", name: "Draft"},
        {id: "pending", name: "Pending"},
        {id: "completed", name: "Completed"},
        {id: "approved", name: "Approved"},
        {id: "cancelled", name: "Cancelled"},
    ]);

    const onSubmit = (data) => {
        console.log("FILTER-DATA::=>>>", data);
        let filters = {};

        if(data.voucher_no !== null && data.voucher_no !== undefined && data.voucher_no !== '') {
            filters.voucher_no = { value: data.voucher_no, matchMode: 'contains' }
        }
        if(data.sales_status !== null && data.sales_status !== undefined && data.sales_status !== '') {
            if(data.sales_status === 'draft' || data.sales_status === 'approved' || data.sales_status === 'cancelled') {
                filters.status = { value: data.sales_status, matchMode: 'equals' }
            } else if(data.sales_status === 'pending' || data.sales_status === 'completed') {
                filters.trx_status = { value: data.sales_status, matchMode: 'equals' }
            }
        }
        if((data.from_date !== null && data.from_date !== undefined && data.from_date !== '') && 
            (data.to_date !== null && data.to_date !== undefined && data.to_date !== '')){
            let fromDate = moment(data.from_date).format('YYYY-MM-DD');
            let toDate = moment(data.to_date).format('YYYY-MM-DD');
            filters.created_at = { value: [fromDate, toDate], matchMode: 'between' }
        } else {
            if(data.from_date !== null && data.from_date !== undefined && data.from_date !== '') {
                let fromDate = moment(data.from_date).format('YYYY-MM-DD');
                filters.created_at = { value: fromDate, matchMode: 'gte' }
            }
            if(data.to_date !== null && data.to_date !== undefined && data.to_date !== '') {
                let toDate = moment(data.to_date).format('YYYY-MM-DD');
                filters.created_at = { value: toDate, matchMode: 'lt' }
            }    
        }
        if(data.customer_category !== null && data.customer_category !== undefined && data.customer_category !== '') {
            // filters.customer_category = data.customer_category
            filters.customer_category = { value: data.customer_category, matchMode: 'equals' }
        }
        if(data.customer_name !== null && data.customer_name !== undefined && data.customer_name !== '') {
            // filters.customer_name = data.customer_name
            filters.customer_name = { value: data.customer_name, matchMode: 'contains' }
        }
        if(data.customer_phone !== null && data.customer_phone !== undefined && data.customer_phone !== '') {
            // filters.customer_phone = data.customer_phone
            filters.customer_phone = { value: data.customer_phone, matchMode: 'contains' }
        }
        if(data.party_id !== null && data.party_id !== undefined && data.party_id !== '') {
            // filters.party_id = data.party_id
            // as string
            filters.party_id = { value: data.party_id.toString(), matchMode: 'equals' }
        }
        if(data.cnf !== null && data.cnf !== undefined && data.cnf !== '') {
            filters.cnf = { value: data.cnf, matchMode: 'contains' }
        }
        if(data.be_no !== null && data.be_no !== undefined && data.be_no !== '') {
            filters.be_no = { value: data.be_no, matchMode: 'contains' }
        }
        if(data.lc_no !== null && data.lc_no !== undefined && data.lc_no !== '') {
            filters.lc_no = { value: data.lc_no, matchMode: 'contains' }
        }
        console.log("FILTERS::=>>>", filters);
            
        reloadData(filters);
    }

    const resetForm = () => {
        reset();
        setCustomerCategory(null);
    }
    
    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    return (
        <div className="card col-12 md:col-12">
            <div className="p-fluid formgrid grid">
                <div className="field col-12 md:col-2">
                <Controller
                    name="voucher_no"
                    control={control}
                    render={({ field, fieldState }) => (
                        <>
                            <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Voucher No</label>
                            <InputText inputId={field.name} value={field.value} inputRef={field.ref}
                                onChange={field.onChange} className={classNames({ 'p-invalid': fieldState.error })}/>
                            {getFormErrorMessage(field.name)}
                        </>
                    )}/>
                </div>
                {isSales && <div className="field col-12 md:col-2">
                <Controller
                    name="sales_status"
                    control={control}
                    render={({ field, fieldState }) => (
                        <>
                            <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Sales Status</label>
                            <Dropdown inputId={field.name} value={field.value} options={salesStatusList}
                                onChange={field.onChange} optionLabel="name" optionValue="id" showClear
                                className={classNames({ 'p-invalid': fieldState.error })}/>
                            {getFormErrorMessage(field.name)}
                        </>
                    )}/>
                </div>}
                <div className="field col-12 md:col-2">
                <Controller
                    name="from_date"
                    control={control}
                    render={({ field, fieldState }) => (
                    <>
                        <label htmlFor={field.name}>From Date</label>
                        <Calendar inputId={field.name} value={field.value} onChange={field.onChange} 
                            dateFormat="dd/mm/yy" className={classNames({ 'p-invalid': fieldState.error })} />
                        {getFormErrorMessage(field.name)}
                    </>                                
                )}/>
                </div>
                <div className="field col-12 md:col-2">
                <Controller
                    name="to_date"
                    control={control}
                    render={({ field, fieldState }) => (
                    <>
                        <label htmlFor={field.name}>To Date</label>
                        <Calendar inputId={field.name} value={field.value} onChange={field.onChange} 
                            dateFormat="dd/mm/yy" className={classNames({ 'p-invalid': fieldState.error })} />
                        {getFormErrorMessage(field.name)}
                    </>                                
                )}/>
                </div>
                {isSales && <div className="field col-12 md:col-2">
                <Controller
                    name="customer_category"
                    control={control}
                    render={({ field, fieldState }) => (
                        <>
                            <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Customer Category</label>
                            <Dropdown inputId={field.name} value={field.value} options={salesTypeList}
                                onChange={(e) => {
                                    field.onChange(e.value); 
                                    setCustomerCategory(e.value);
                                    setValue('customer_name', ''); 
                                    setValue('customer_phone', ''); 
                                    setValue('party_id', '');
                                }}
                                optionLabel="name" optionValue="id" showClear
                                className={classNames({ 'p-invalid': fieldState.error })}/>
                            {getFormErrorMessage(field.name)}
                        </>
                    )}/>
                </div>}
                {customerCategory == 'WALKIN' && <><div className="field col-12 md:col-2">
                <Controller
                    name="customer_name"
                    control={control}
                    render={({ field, fieldState }) => (
                        <>
                            <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Customer Name</label>
                            <InputText inputId={field.name} value={field.value} inputRef={field.ref}
                                onChange={field.onChange} className={classNames({ 'p-invalid': fieldState.error })}/>
                            {getFormErrorMessage(field.name)}
                        </>
                    )}/>
                </div>
                <div className="field col-12 md:col-2">
                <Controller
                    name="customer_phone"
                    control={control}
                    render={({ field, fieldState }) => (
                        <>
                            <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Customer Phone</label>
                            <InputText inputId={field.name} value={field.value} inputRef={field.ref}
                                onChange={field.onChange} className={classNames({ 'p-invalid': fieldState.error })}/>
                            {getFormErrorMessage(field.name)}
                        </>
                    )}/>
                </div></>}
                {(isSales && customerCategory !== 'WALKIN') &&
                <div className="field col-12 md:col-2">
                <Controller
                    name="party_id"
                    control={control}
                    render={({ field, fieldState }) => (
                    <>
                        <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Select Customer</label>
                        <SelectMasterData field={field} modelName="dtCustomer"
                            caption='Select Customer'
                            displayField="name" showFields={["name"]}
                            onSelect={(e) => {
                                field.onChange(e._id);                                
                            }}
                            defaultFilters={{
                                fields: ["name","address","route","phone","contact_name"],
                                first: 0,
                                rows: 10,
                                page: 1,
                                sortField: null,
                                sortOrder: null,
                                filters: {
                                    global: { value: null, matchMode: 'contains' },
                                    name: { value: null, matchMode: 'contains' },
                                    address: { value: null, matchMode: 'contains' },
                                    route: { value: null, matchMode: 'contains' },
                                    phone: { value: null, matchMode: 'contains' },
                                    contact_name: { value: null, matchMode: 'contains' },
                                }
                            }}
                            className={classNames({ 'p-invalid': fieldState.error })} 
                            columns={[
                                {field: 'name', header: 'Shop Name', filterPlaceholder: 'Filter by Shop Name'},
                                {field: 'address', header: 'Address', filterPlaceholder: 'Filter by Address'},
                                {field: 'route', header: 'Route', filterPlaceholder: 'Filter by Route'},
                                {field: 'phone', header: 'phone', filterPlaceholder: 'Filter by Phone'},
                                {field: 'contact_name', header: 'Contact Person', filterPlaceholder: 'Filter by Contact Person'},
                            ]} />
                            {getFormErrorMessage(field.name)}
                    </>
                )}/>
                </div>}
                {isSales == false &&
                <>
                <div className="field col-12 md:col-2">
                <Controller
                    name="party_id"
                    control={control}
                    render={({ field, fieldState }) => (
                    <>
                        <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Select Supplier</label>
                        <SelectMasterData field={field} modelName="dtSupplier"
                            caption='Select Supplier'
                            displayField="name" showFields={["name"]}
                            onSelect={(e) => {
                                field.onChange(e._id);
                            }}
                            defaultFilters={{
                                fields: ["name","address","phone"],
                                first: 0,
                                rows: 10,
                                page: 1,
                                sortField: null,
                                sortOrder: null,
                                filters: {
                                    global: { value: null, matchMode: 'contains' },
                                    name: { value: null, matchMode: 'contains' },
                                    address: { value: null, matchMode: 'contains' },
                                    phone: { value: null, matchMode: 'contains' },
                                }
                            }}
                            className={classNames({ 'p-invalid': fieldState.error })} 
                            columns={[
                                {field: 'name', header: 'Name', filterPlaceholder: 'Filter by Shop Name'},
                                {field: 'address', header: 'Address', filterPlaceholder: 'Filter by Address'},
                                {field: 'phone', header: 'phone', filterPlaceholder: 'Filter by Phone'},
                            ]} />
                            {getFormErrorMessage(field.name)}
                    </>)}/>
                    </div>
                    <div className="field col-12 md:col-2">
                    <Controller
                        name="cnf"
                        control={control}
                        render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>CnF</label>
                                <InputText inputId={field.name} value={field.value} inputRef={field.ref}
                                    onChange={field.onChange} className={classNames({ 'p-invalid': fieldState.error })}/>
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>
                    <div className="field col-12 md:col-2">
                    <Controller
                        name="be_no"
                        control={control}
                        render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>BE No</label>
                                <InputText inputId={field.name} value={field.value} inputRef={field.ref}
                                    onChange={field.onChange} className={classNames({ 'p-invalid': fieldState.error })}/>
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>
                    <div className="field col-12 md:col-2">
                    <Controller
                        name="lc_no"
                        control={control}
                        render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>LC No</label>
                                <InputText inputId={field.name} value={field.value} inputRef={field.ref}
                                    onChange={field.onChange} className={classNames({ 'p-invalid': fieldState.error })}/>
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>
                </>
                }
                <div className="field col-12 md:col-2">
                    <Button type="submit" label="Submit" className="mt-2"
                        onClick={handleSubmit((d) => onSubmit(d))}
                        />    
                    <Button label="Clear" className="p-button-outlined p-button-warning mt-2" 
                        onClick={resetForm}
                        />
                </div>
            </div>
        </div>
    );
};

export default OrderFilter;