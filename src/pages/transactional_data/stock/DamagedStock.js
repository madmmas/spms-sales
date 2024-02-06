import React, { useEffect, useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { FilterMatchMode } from 'primereact/api';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { Dropdown } from 'primereact/dropdown';

import SelectMasterDataOL from '../../components/SelectMasterDataOL';

import { getDateFormatted } from '../../../utils';

import { TransactionService } from '../../../services/TransactionService';
import { MasterDataDBService } from '../../../services/MasterDataDBService';
import { RegisterService } from '../../../services/RegisterService';

import { PRODUCT_MODEL, DAMAGED_STOCK_MODEL, PRODBRAND_MODEL, PRODMODEL_MODEL } from '../../../constants/models';


const DamagedStock = () => {

    const modelName = DAMAGED_STOCK_MODEL;

    let defaultValue = {
        date: Date.now(),
        dtProduct_id: null,
        quantity: 0,
        remarks: '',
    };

    const toast = useRef(null);
    const dt = useRef(null);
    const quantityRef = useRef(null);
    const detailsRef = useRef(null);

    let defaultFilters = {
        fields: ['code', 'name', 'brand_name', 'model_no', 'part_number'],
        first: 0,
        rows: 10,
        page: 1,
        sortField: null,
        sortOrder: null,
        filters: {
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            name: { value: null, matchMode: FilterMatchMode.CONTAINS },
            dtProductBrand_id: { value: null, matchMode: FilterMatchMode.EQUALS },
            dtProductModel_id: { value: null, matchMode: FilterMatchMode.EQUALS },
            part_number: { value: null, matchMode: FilterMatchMode.CONTAINS },   
            code: { value: null, matchMode: FilterMatchMode.CONTAINS },
        }
    };

    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [dtDamagedStock, setDamagedStock] = useState(null);
    const [lazyParams, setLazyParams] = useState(defaultFilters);
    const [showForm, setShowForm] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const [dtProductBrands, setDtProductBrands] = useState(null);
    const [dtProductModels, setDtProductModels] = useState(null);

    const transactionService = new TransactionService();
    const registerService = new RegisterService();
    const masterDataDBService = new MasterDataDBService();

    const {
        control,
        formState: { errors },
        resetField,
        handleSubmit
    } = useForm({
        defaultValues: defaultValue
    });

    useEffect(() => {
        masterDataDBService.getAll(PRODBRAND_MODEL, {
            rows: 1000,
        }).then(data => {
            data.rows.sort((a, b) => a.name.localeCompare(b.name));
            setDtProductBrands(data.rows);
        });
        masterDataDBService.getAll(PRODMODEL_MODEL, {
            rows: 1000,
        }).then(data => {
            data.rows.sort((a, b) => a.name.localeCompare(b.name));
            setDtProductModels(data.rows);
        });
    }, []);

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

        registerService.getAll(modelName, { params: JSON.stringify(lazyParams) }).then( async data => {
            console.log(data)
            setTotalRecords(data.total);
            for(let i=0; i<data.rows.length; i++) {
                let product = await masterDataDBService.getById(PRODUCT_MODEL, data.rows[i].dtProduct_id);
                data.rows[i]['product_name'] = product.name;
            }
            setDamagedStock(data.rows);
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
                {rowData.product_name}
            </>
        );
    };

    // reset all form fields
    const resetForm = () => {
        resetField('dtProduct_id');
        resetField('quantity');
        resetField('remarks');
        setSubmitted(false);
    };

    // show Add form
    const openNew = () => {
        resetForm();
        setShowForm(true);
    };

    const addDamagedStock = (formData) => {
        setSubmitted(true);
        if (quantityRef.current.value < 1) {
            return;
        }
        let _data = {
            dtProduct_id: formData.dtProduct_id,
            quantity: formData.quantity,
            remarks: formData.remarks,
            register_date: Date.now(),
        };
        console.log(_data);
        transactionService.damageStock(_data).then(response => {
            console.log(response);
            if (response.status) {
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

    const dateBodyTemplate = (rowData) => {
        return (
            <>
                {getDateFormatted(rowData.register_date)}
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

    const detailsBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.remarks}
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

    const brandFilterTemplate = (options) => {
        return <Dropdown filter value={options.value} optionValue="id" optionLabel="name" options={dtProductBrands} onChange={(e) => options.filterApplyCallback(e.value, options.index)} placeholder="Select Brand" className="p-column-filter" />;
    };

    const modelFilterTemplate = (options) => {
        return <Dropdown filter value={options.value} optionValue="id" optionLabel="name" options={dtProductModels} onChange={(e) => options.filterApplyCallback(e.value, options.index)} placeholder="Select Model" className="p-column-filter" />;
    };

    const brandNameBodyTemplate = (rowData) => {
        return (
            <>
                {masterDataDBService.getShortnameById('dtProductBrand', rowData.dtProductBrand_id)}
            </>
        );
       
    }


    const modelNumberBodyTemplate = (rowData) => {
        return (
            <>
                {masterDataDBService.getShortnameById('dtProductModel', rowData.dtProductModel_id)}
            </>
        );
       
    }

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    const hideForm = () => {
        setShowForm(false);
    };

    const footerDialog = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideForm} />
            <Button disabled={submitted} label="Save" icon="pi pi-check" className="p-button-text" onClick={handleSubmit((d) => addDamagedStock(d))} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt} value={dtDamagedStock} dataKey="id" 
                        className="datatable-responsive" responsiveLayout="scroll"
                        lazy loading={loading} rows={lazyParams.rows}
                        onSort={onSort} sortField={lazyParams.sortField} sortOrder={lazyParams.sortOrder}
                        onFilter={onFilter} filters={lazyParams.filters} filterDisplay="row"
                        scrollable columnResizeMode="expand" resizableColumns showGridlines
                        paginator totalRecords={totalRecords} onPage={onPage} first={lazyParams.first}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" 
                        rowsPerPageOptions={[5,10,25,50]}
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                        emptyMessage="No data found." header={renderHeader} 
                    >
                        <Column field="date" header="Transaction Datetime" filter filterPlaceholder="Search by name" sortable body={dateBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>                        
                        <Column field="dtProduct_id" header="Product Name" filter filterPlaceholder="Search by name" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>                        
                        <Column field="quantity" header="Quantity" filter filterPlaceholder="Search by name" sortable body={quantityBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>                        
                        <Column field="remarks" header="Details" filter filterPlaceholder="Search by name" sortable body={detailsBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>                        
                    </DataTable>

                    <Dialog visible={showForm} style={{ width: '450px' }} header={`Add Damaged Stock`} modal className="p-fluid" footer={footerDialog} onHide={hideForm}>                    
                        <div className="p-fluid formgrid grid">
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
                                                {field: 'dtProductBrand_id', header: 'Brand Name', body:brandNameBodyTemplate, filterPlaceholder: 'Filter by Barnd Name', filterElement: brandFilterTemplate, width: '15rem'},
                                                {field: 'dtProductModel_id', header: 'Model No', body:modelNumberBodyTemplate, filterPlaceholder: 'Filter by Model No', filterElement: modelFilterTemplate, width: '15rem'},
                                                {field: 'part_number', header: 'Part Number', filterPlaceholder: 'Filter by Part Number', width: '15rem'},
                                                {field: 'code', header: 'Product Code', filterPlaceholder: 'Filter by Product Code', width: '15rem'}
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
                                name="remarks"
                                control={control}
                                rules={{ required: 'Details is required.' }}
                                render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor="remarks">Details*</label>
                                    <InputTextarea ref={detailsRef}
                                        inputId={field.name} value={field.value} inputRef={field.ref}
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

export default DamagedStock;