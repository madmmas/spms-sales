import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { InputSwitch } from 'primereact/inputswitch';
import { InputTextarea } from 'primereact/inputtextarea';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';

import Warehouse from '../../components/master_data/Warehouse';

import SelectMasterDataTableList from '../../components/SelectMasterDataTableList';
import SelectLookupData from '../../components/SelectLookupData';

import { PRODUCT_MODEL, WAREHOUSE_MODEL, PRODMODEL_MODEL, PRODBRAND_MODEL } from '../../../constants/models';

import { ProductService } from '../../../services/ProductService';
import { MasterDataDBService } from '../../../services/MasterDataDBService';

import PackageProductForm from './components/PackageProductForm';
import PackageProductDetail from './components/PackageProductDetail';

const Form = ({ packageData }) => {

    let navigate = useNavigate();

    let defaultPackageProduct = {
        id: null,
        dtProduct_id: null,
        product_name: "",
        code: "",
        brand_name: "",
        model_no: "",
        part_number: "",
        quantity: 0,
        price: 0.00,
        min_trade_price: 0.00,
    };

    const toast = useRef(null);

    const [products, setProducts] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0.00);
    const [selectedItem, setSelectedItem] = useState({});
    const [selectedProduct, setSelectedProduct] = useState(defaultPackageProduct);
    const [selectedTableItem, setSelectedTableItem] = useState({});
    const [deleteProductDialog, setDeletePackageProductDialog] = useState(false);

    const [updateSaleItemMode, setUpdateSaleItemMode] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [defaultWarehouse, setDefaultWarehouse] = useState(null);

    const [dtProductBrands, setDtProductBrands] = useState(null);
    const [dtProductModels, setDtProductModels] = useState(null);

    const productService = new ProductService();
    const masterDataDBService = new MasterDataDBService();

    const {
        control,
        formState: { errors },
        reset,
        setValue,
        getValues,
        handleSubmit
    } = useForm({
        defaultValues: defaultPackageProduct,
        // packageData,
    });

    const resetForm = () => {
        reset({ 
            id: null,
            code: "",
            name: "",
            price: 0.00,
            category_id: 2,
            warehouse_id: "",
            low_stock_qty: 0,
            remarks: "",
            items: [],
            active: true
         });
    };

    useEffect(() => {
        // get default warehouse
        masterDataDBService.getDefaultItem(WAREHOUSE_MODEL).then(data => {
            if(data){
                console.log("DEFAULT WAREHOUSE::", data);
                setDefaultWarehouse(data.id);    
            }
        });
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
    },[])

    useEffect(() => {
        setValue('warehouse_id', defaultWarehouse);
    }, [defaultWarehouse]);

    useEffect(() => {
        if (packageData) {
            reset(packageData);
            setProducts(packageData.items);
        } else {
            resetForm();
        }
    }, [packageData]);

    useEffect(() => {
        calculateTotals(products);
    }, [products]);

    const buildFormData = (data) => {
        return {
            id: data.id,
            name: data.name,
            price: Number(data.price),
            min_trade_price: Number(data.min_trade_price),
            category_id: 2,
            warehouse_id: data.warehouse_id,
            brand_id: Number(data.brand_id),
            model_id: Number(data.model_id),
            part_number: data.part_number,
            low_stock_qty: Number(data.low_stock_qty),
            remarks: data.remarks,
            items: data.items,
            active: data.active
        }
    }

    const onSubmit = (formData) => {
        let data = buildFormData({ ...formData, ...{ items: products }});
        try{
            setSubmitted(true);            
            if(packageData==null){
                productService.create(data).then(data => {
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
                    navigate("/packages");
                });
            } else {
                productService.update(data.id, data).then(data => {
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
                    navigate("/packages");
                });
            }
        }
        catch (err){
            console.log(err)
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Action Performed', life: 3000 });
            navigate("/packages");
        }
    };

    const gotoList = () => {
        navigate("/packages");
    };

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    const addToSaleList = (addedItem) => {
        let newProducts = [...products];
        addedItem['index'] = products.length;
        newProducts.push(addedItem);
        setProducts(newProducts);
        clearProductSelection();
    };

    const updateSalelist = (dtPackageProduct) => {
        let newProducts = [...products];
        newProducts[selectedProduct.index] = dtPackageProduct;
        setProducts(newProducts);
        clearProductSelection();
    };

    const clearProductSelection = () => {
        setSelectedProduct(defaultPackageProduct);
        setSelectedItem({});
        setSelectedTableItem({});
        setUpdateSaleItemMode(false);
    };

    const clearAll = () => {
        setProducts([]);
        setTotalPrice(0.00);
        resetForm();
    };

    const removeItem = () => {
        let newProducts = [...products];
        newProducts.splice(selectedProduct.index, 1);
        setProducts(newProducts);
        setDeletePackageProductDialog(false);
    };

    const calculateTotals = (allsales) => {
        let total = 0.00;
        allsales.forEach(sale => {
            total += sale.totalPrice;
        });
        setTotalPrice(total);
        setValue('price', total);
        // if(getValues('min_trade_price')===0) {
        //     setValue('min_trade_price', total);
        // }
    };

    const editPackageProduct = (dtPackageProduct) => {
        console.log("EDIT PRODUCT::", dtPackageProduct);
        setSelectedProduct({ ...dtPackageProduct});
        setSelectedTableItem({ "id": dtPackageProduct.dtProduct_id });
        setUpdateSaleItemMode(true);
    };


    const onSelection = async (e) => {
        let productSelected = e.value;
        console.log("productSelected::", productSelected);
        if(productSelected!==null) {
            if(updateSaleItemMode) {
                toast.current.show({ severity: 'warn', summary: 'Please Cancel the update', detail: 'Product in update', life: 3000 });
                return;
            }

            let alreadySelected = false;
            products.forEach(sale => {
                if(sale.dtProduct_id === productSelected.id) {
                    alreadySelected = true;
                }
            });
            if(alreadySelected) {
                toast.current.show({ severity: 'warn', summary: 'Already Added', detail: 'Product Already Added', life: 3000 });
                setSelectedTableItem({});
                setSelectedItem({});
                setSelectedProduct(defaultPackageProduct);
                return;
            }

            setSelectedTableItem({ "id": productSelected.id });
            setSelectedItem(productSelected);
        }
    }

    let defaultFilters = {
        globalFilterFields: ['name', 'brand_name', 'model_no', 'part_number'],
        fields: ['id', 'name', 'code',  'brand_name', 'model_no', 'part_number', 'price'],
        first: 0,
        rows: 10,
        page: 1,
        sortField: null,
        sortOrder: null,
        filters: {
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            dtCategory_id: { value: 1, matchMode: FilterMatchMode.EQUALS },
            name: { value: null, matchMode: FilterMatchMode.CONTAINS },
            part_number: { value: null, matchMode: FilterMatchMode.CONTAINS },
            dtProductBrand_id: { value: null, matchMode: FilterMatchMode.EQUALS },
            dtProductModel_id: { value: null, matchMode: FilterMatchMode.EQUALS },
        }
    }

    const confirmDeletePackageProduct = (dtPackageProduct) => {
        setDeletePackageProductDialog(true);
    };

    const hideDeletePackageProductDialog = () => {
        setDeletePackageProductDialog(false);
    };

    const deleteProductDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeletePackageProductDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={removeItem} />
        </>
    );

    const brandFilterTemplate = (options) => {
        return <Dropdown filter value={options.value} optionValue="id" optionLabel="name" options={dtProductBrands} onChange={(e) => options.filterApplyCallback(e.value, options.index)} placeholder="Select Brand" className="p-column-filter" />;
    };

    const modelFilterTemplate = (options) => {
        return <Dropdown filter value={options.value} optionValue="id" optionLabel="name" options={dtProductModels} onChange={(e) => options.filterApplyCallback(e.value, options.index)} placeholder="Select Model" className="p-column-filter" />;
    };

    const brandNameBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.dtProductBrand_id_shortname}
            </>
        );
    };

    const modelNoBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.dtProductModel_id_shortname}
            </>
        );
    };

    return (

    <div className="grid h-screen">    
    <Toast ref={toast} />    
    <div className="card col-4">
        <h5><Button onClick={() => gotoList()} className="p-button-outlined" label="Go Back" /> Package Detail</h5>
        <div className="card col-12 md:col-12">
        <SelectMasterDataTableList displayField="name"
                fieldValue=""
                scrollHeight="200px"
                defaultFilters={defaultFilters}
                modelName={PRODUCT_MODEL} caption="Select Product"
                selectedItem={selectedTableItem}
                showFields={[]} onSelect={onSelection}
                columns={[
                    {field: 'name', header: 'Product Name', filterPlaceholder: 'Filter by Product Name', minWidth: '20rem'}, 
                    {field: 'dtProductBrand_id', header: 'Brand Name', body: brandNameBodyTemplate, filterPlaceholder: 'Filter by Barnd Name', filterElement: brandFilterTemplate, width: '15rem'},
                    {field: 'dtProductModel_id', header: 'Model No', body: modelNoBodyTemplate, filterPlaceholder: 'Filter by Model No', filterElement: modelFilterTemplate, width: '15rem'},
                    {field: 'part_number', header: 'Part Number', filterPlaceholder: 'Filter by Part Number', minWidth: '10rem'},
                    {field: 'price', header: 'Trade Price', filterPlaceholder: 'Filter by Part Number', minWidth: '10rem'},
                ]} 
                />
        </div>
        <div className="card col-12 md:col-12">
            <div className="p-fluid formgrid grid">
                
                <div className="field col-12 md:col-6">
                    <Button type="submit" label="Cancel" className="p-button-outlined p-button-warning" 
                        onClick={() => clearAll()}
                    />
                </div>
                <div className="field col-12 md:col-6">
                    <Button type="submit" label="Save" className="p-button p-button-success" 
                        onClick={handleSubmit((d) => onSubmit(d))}
                    />
                </div>
                
            </div>
        </div>
    </div>
    <div className="card col-8" >
    <div className="card col-12 md:col-12">
            <div className="p-fluid formgrid grid">
                <div className="field col-12 md:col-4">
                <Controller
                    name="name"
                    control={control}
                    rules={{ required: 'Name is required.' }}
                    render={({ field, fieldState }) => (
                        <>
                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Package Name*</label>
                    <InputText inputId={field.name} value={field.value} inputRef={field.ref}  onChange={(e) => field.onChange(e.target.value)} />
                    {getFormErrorMessage(field.name)}
                        </>
                    )}/>
                </div>
                <div className="field col-12 md:col-2">
                <Controller
                    name="code"
                    control={control}
                    render={({ field, fieldState }) => (
                        <>
                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Code</label>
                    <InputText readOnly={true} inputId={field.name} value={field.value} inputRef={field.ref}  onChange={(e) => field.onChange(e.target.value)} />
                    {getFormErrorMessage(field.name)}
                        </>
                    )}/>
                </div>
                <div className="field col-12 md:col-4">
                        <Controller
                            name="brand_id"
                            control={control}
                            rules={{ required: 'Brand is required.' }}
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
                            rules={{ required: 'Model is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Product Model*</label>
                                <SelectLookupData field={field} model={PRODMODEL_MODEL}
                                    className={classNames({ 'p-invalid': fieldState.error })} /> 
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>
                    <div className="field col-12 md:col-2">
                    <Controller
                        name="part_number"
                        control={control}
                        // rules={{ required: 'Part_number is required.' }}
                        render={({ field, fieldState }) => (
                            <>
                        <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Part Number</label>
                        <InputText inputId={field.name} value={field.value} inputRef={field.ref}  onChange={(e) => field.onChange(e.target.value)} />
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
                            <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Package Price</label>
                            <InputNumber readOnly={true} inputId={field.name} value={field.value} inputRef={field.ref} 
                                className={classNames({ 'p-invalid': fieldState.error })} 
                                onValueChange={(e) => field.onChange(e.target.value)} 
                                />
                            {getFormErrorMessage(field.name)}
                        </>
                    )}/>
                    </div>
                    {/* <div className="field col-12 md:col-4">
                    <Controller
                        name="min_trade_price"
                        control={control}
                        rules={{ 
                            required: 'Minimum Package Price is required.',
                            validate: (value) => {
                                return value >= Number(getValues('price')) || 'Must be less than Package Price.';
                            }
                        }}
                        render={({ field, fieldState }) => (
                        <>
                            <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Minimum Package Price</label>
                            <InputNumber inputId={field.name} value={field.value} inputRef={field.ref} 
                                className={classNames({ 'p-invalid': fieldState.error })} 
                                onValueChange={(e) => field.onChange(e.target.value)} 
                                />
                            {getFormErrorMessage(field.name)}
                        </>
                    )}/>
                    </div> */}
                    <div className="field col-12 md:col-4">
                        <Controller
                            name="low_stock_qty"
                            control={control}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Low Stock Quatity</label>
                                <InputNumber inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onValueChange={(e) => field.onChange(e.target.value)} />
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
                                <Warehouse field={field} fieldState={fieldState} onSelect={(e) => field.onChange(e.id)} />
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
        </div>
        <PackageProductForm 
            onAdd={(dt) => addToSaleList(dt)} 
            onEdit={(dt) => updateSalelist(dt)}
            onCancel={() => clearProductSelection()}
            defaultPackageProduct={defaultPackageProduct} 
            selectedItem={selectedItem}
            selectedProduct={selectedProduct}
            />
        <PackageProductDetail products={products}
                totalPrice={totalPrice}
                onEdit={(dt) => editPackageProduct(dt)} 
                onDelete={(dt) => confirmDeletePackageProduct(dt)}
            />
        <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeletePackageProductDialog}>
            <div className="flex align-items-center justify-content-center">
                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                <span>
                    Are you sure you want to delete?
                </span>
            </div>
        </Dialog>
    </div>     
    </div>
    );
}
                 
export default Form;