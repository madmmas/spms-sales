import * as moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useForm, Controller, set } from 'react-hook-form';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';

import SelectConstData from '../../components/SelectConstData';
import SelectMasterDataOL from '../../components/SelectMasterDataOL';

import { TransactionService } from '../../../services/TransactionService';
import { PRODUCT_MODEL, STOCK_ADJUSTMENT_MODEL } from '../../../constants/models';
import { ON_STOCK_ADJUSTMENT } from '../../../constants/transactions';
import { ADJUSTMENT_TYPE } from '../../../constants/lookupData';

const StockAdjustment = () => {

    const modelName = STOCK_ADJUSTMENT_MODEL;

    // date, adjustmentType, dtProduct_id, quantity, transferBy, reason
    let defaultValue = {
        date: Date.now(),
        adjustmentType: "", // ADD, REDUCE
        dtProduct_id: null,
        quantity: 0,
        reason: '',
    };

    const toast = useRef(null);
    const dt = useRef(null);
    const quantityRef = useRef(null);
    const reasonRef = useRef(null);

    let defaultFilters = {
        fields: [],
        first: 0,
        rows: 10,
        page: 1,
        sortField: null,
        sortOrder: null,
        filters: {
            'name': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },            
        }
    };

    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [dtStockAdjustment, setStockAdjustment] = useState(null);
    const [lazyParams, setLazyParams] = useState(defaultFilters);
    const [showForm, setShowForm] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const transactionService = new TransactionService();

    const {
        register,
        control,
        formState: { errors },
        resetField,
        handleSubmit
    } = useForm({
        defaultValues: defaultValue
    });

    useEffect(() => {
        initFilters();
    }, []);
    
    const clearFilter = () => {
        initFilters();
    }

    const initFilters = () => {
        setLazyParams(defaultFilters);
    }

    useEffect(() => {
        loadLazyData();
    }, [lazyParams]);

    const loadLazyData = () => {
        setLoading(true);

        transactionService.getAll(modelName, { params: JSON.stringify(lazyParams) }).then(data => {
            console.log(data)
            setTotalRecords(data.total);
            setStockAdjustment(data.rows);
            setLoading(false);
        });
    }

    const exportCSV = () => {
        dt.current.exportCSV();
    };
    const onPage = (event) => {
        let _lazyParams = { ...lazyParams, ...event };
        setLazyParams(_lazyParams);
    }
    const onSort = (event) => {
        let _lazyParams = { ...lazyParams, ...event };
        setLazyParams(_lazyParams);
    }

    const onFilter = (event) => {
        let _lazyParams = { ...lazyParams, ...event };
        _lazyParams['first'] = 0;
        setLazyParams(_lazyParams);
    }

    const onProductSelect = (selectedRow) => {
        console.log("PRODUCT SELECTED::", selectedRow)
        // select quantity from stock
        quantityRef.current.focus();
    };

    const nameBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.name}
            </>
        );
    };

    // reset all form fields
    const resetForm = () => {
        resetField('dtProduct_id');
        resetField('quantity');
        resetField('reason');
        setSubmitted(false);
    };

    // show Add form
    const openNew = () => {
        resetForm();
        setShowForm(true);
    };

    const addStockAdjustment = (formData) => {
        setSubmitted(true);
        if (quantityRef.current.value < 1) {
            return;
        }
        let _data = {
            adjustmentType: formData.adjustmentType,
            dtProduct_id: formData.dtProduct_id,
            quantity: formData.quantity,
            reason: formData.reason,
        };
        console.log(_data);
        transactionService.processTransaction(ON_STOCK_ADJUSTMENT, _data).then(response => {
            console.log(response);
            if (response.success) {
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Damaged Stock Added', life: 3000 });
                resetForm();
                setShowForm(false);
                loadLazyData();
            } else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: response.message, life: 3000 });
            }
        });
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button onClick={() => openNew()} className="p-button p-button-primary mr-2" label="Add Damaged Stock" />
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <h5 className="m-0">Damaged Stock</h5>
                <Button type="button" icon="pi pi-filter-slash" label="Refresh" className="p-button-outlined" onClick={clearFilter} />
            </div>
        )
    }

    const getDate = (date) => {
        return moment(parseInt(date)).format('DD/MM/YYYY hh:mm:ss');
    }

    const dateBodyTemplate = (rowData) => {
        return (
            <>
                {getDate(rowData.date)}
            </>
        );
    };

    const adjustmentTypeBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.adjustmentType}
            </>
        );
    };

    const quantityBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.quantity}
            </>
        );
    };

    const reasonBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.reason}
            </>
        );
    };
    const transferByBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.transferBy}
            </>
        );
    };

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    const hideForm = () => {
        setShowForm(false);
    };

    const footerDialog = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideForm} />
            <Button disabled={submitted} label="Save" icon="pi pi-check" className="p-button-text" onClick={handleSubmit((d) => addStockAdjustment(d))} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt} value={dtStockAdjustment} dataKey="_id" 
                        className="datatable-responsive" responsiveLayout="scroll"
                        lazy loading={loading} rows={lazyParams.rows}
                        onSort={onSort} sortField={lazyParams.sortField} sortOrder={lazyParams.sortOrder}
                        onFilter={onFilter} filters={lazyParams.filters} filterDisplay="menu"
                        scrollable columnResizeMode="expand" resizableColumns showGridlines
                        paginator totalRecords={totalRecords} onPage={onPage} first={lazyParams.first}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" 
                        rowsPerPageOptions={[5,10,25,50]}
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                        emptyMessage="No data found." header={renderHeader} 
                    >
                        <Column field="date" header="Transaction Datetime" filter filterPlaceholder="Search by name" sortable body={dateBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>                        
                        <Column field="adjustmentType" header="Adjustment Type" filter filterPlaceholder="Search by name" sortable body={adjustmentTypeBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="dtProduct_id" header="Product Name" filter filterPlaceholder="Search by name" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>                        
                        <Column field="quantity" header="Quantity" filter filterPlaceholder="Search by name" sortable body={quantityBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>                        
                        <Column field="reason" header="Reason" filter filterPlaceholder="Search by name" sortable body={reasonBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>                        
                        <Column field="transferBy" header="Transfer by" filter filterPlaceholder="Search by name" sortable body={transferByBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>                        
                    </DataTable>

                    <Dialog visible={showForm} style={{ width: '450px' }} header={`Add Damaged Stock`} modal className="p-fluid" footer={footerDialog} onHide={hideForm}>                    
                        <div className="p-fluid formgrid grid">
                            <div className="field col-12 md:col-6">
                            <Controller
                                name="adjustmentType"
                                control={control}
                                rules={{ required: 'Adjustment Type is required.' }}
                                render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Adjustment Type*</label>
                                    <SelectConstData field={field} data={ADJUSTMENT_TYPE}
                                        className={classNames({ 'p-invalid': fieldState.error })} /> 
                                    {getFormErrorMessage(field.name)}
                                </>
                            )}/>
                            </div>
                            <div className="field col-12 md:col-6">
                            <Controller
                                name="dtProduct_id"
                                control={control}
                                rules={{ required: 'Product is required.' }}
                                    render={({ field, fieldState }) => (
                                    <>
                                        <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Product*</label>
                                        <SelectMasterDataOL field={field} modelName={PRODUCT_MODEL}
                                            displayField="name"
                                            className={classNames({ 'p-invalid': fieldState.error })} 
                                            onSelect={onProductSelect}
                                            defaultFilters={defaultFilters}
                                            columns={[
                                                {field: 'name', header: 'Product Name', filterPlaceholder: 'Filter by Product Name', width: '50rem'}, 
                                                {field: 'brandName', header: 'Brand Name', filterPlaceholder: 'Filter by Barnd Name', width: '15rem'},
                                                {field: 'modelNo', header: 'Model No', filterPlaceholder: 'Filter by Model No', width: '15rem'},
                                                {field: 'partNumber', header: 'Part Number', filterPlaceholder: 'Filter by Part Number', width: '15rem'},
                                                {field: 'dtProductCategory_id_shortname', header: 'Product Category', filterPlaceholder: 'Filter by Product Category', width: '15rem'}
                                            ]} />
                                        {getFormErrorMessage(field.name)}
                                    </>
                                )}/>                            
                            </div>
                            <div className="field col-12 md:col-6">
                            <Controller
                                name="quantity"
                                control={control}
                                rules={{
                                    validate: (value) => (value > 0) || 'Quantity greater than 0 is required'
                                }}
                                render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor="quantity">Quantity*</label>
                                    <InputNumber ref={quantityRef}
                                        inputId={field.name} value={field.value} inputRef={field.ref} 
                                        onValueChange={(e) => field.onChange(e)} 
                                        className={classNames({ 'p-invalid': fieldState.error })} />
                                    {getFormErrorMessage(field.name)}
                                </>
                            )}/>
                            </div>                            
                            <div className="field col-12 md:col-12">
                            <Controller
                                name="reason"
                                control={control}
                                rules={{ required: 'Reason is required.' }}
                                render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor="reason">Reason*</label>
                                    <InputTextarea ref={reasonRef}
                                        inputId={field.name} value={field.value} inputRef={field.ref} keyfilter="text" 
                                        className={classNames({ 'p-invalid': fieldState.error })} 
                                        onChange={(e) => field.onChange(e.target.value)} rows={3} cols={20} />
                                    {getFormErrorMessage(field.name)}
                                </>
                            )}/>
                            </div>
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default StockAdjustment;