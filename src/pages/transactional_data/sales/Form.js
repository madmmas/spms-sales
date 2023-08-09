import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { FilterMatchMode } from 'primereact/api';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { Dialog } from 'primereact/dialog';

import SelectConstData from '../../components/SelectConstData';
import SelectMasterDataTableList from '../../components/SelectMasterDataTableList';
import SelectMasterData from '../../components/SelectMasterData';

import { CUSTOMER_CATEGORY } from '../../../constants/lookupData';
import { ON_SALES_PRODUCT } from '../../../constants/transactions';
import { PRODUCT_MODEL, CUSTOMER_MODEL, SALES_MODEL } from '../../../constants/models';


import SalesProductForm from './components/SalesProductForm';
import SalesProductDetail from './components/SalesProductDetail';
import SalesProductTotal from './components/SalesProductTotal';

import { TransactionService } from '../../../services/TransactionService';
import { ConfigurationService } from '../../../services/ConfigurationService';
import { OrderService } from '../../../services/OrderService';

const Form = React.memo(({ sales }) => {

    let navigate = useNavigate();

    let defaultFormValues = {
        notes: '',
        dtCustomer_id: '',
        customer_category: 'WALKIN',
        customer_phone: '',
        customer_name: '',
    };

    let defaultSalesProduct = {
        _id: null,
        dtProduct_id: "",
        barCode: "",
        lastSalePrice: 0.00,

        unitTradePrice: 0.00,
        quantity: 1,  
        totalPrice: 0.00,
        discount: 0.00,
        discountedAmount: 0.00,
        netPrice: 0.00,

        remarks: "",
    };

    const toast = useRef(null);

    const [totalPrice, setTotalPrice] = useState(0.00);
    const [totalDiscount, setTotalDiscount] = useState(0.00);
    const [totalDiscountedAmount, setTotalDiscountedAmount] = useState(0.00);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [vat, setVat] = useState(0.00);
    const [deliveryCost, setDeliveryCost] = useState(0.00);
    const [vatPercentage, setVatPercentage] = useState(0.00);
    const [netAmount, setNetAmount] = useState(0.00);

    const [salesItems, setSalesItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState({});
    const [selectedTableItem, setSelectedTableItem] = useState({});
    const [selectedProduct, setSelectedProduct] = useState(defaultSalesProduct);
    const [deleteProductDialog, setDeleteSalesProductDialog] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedCustomer_currency] = useState("INR");
    const [customerCategory, setCustomerCategory] = useState("WALKIN");
    const [updateSaleItemMode, setUpdateSaleItemMode] = useState(false);
    const [trxNo, setTrxNo] = useState('XXXXX');
    const [dialogMsg, setDialogMsg] = useState('');
    const [status, setStatus] = useState('draft');
    const [editMode, setEditMode] = useState(true);

    const orderService = new OrderService();
    const configurationService = new ConfigurationService();

    const {
        control,
        formState: { errors },
        reset,
        setValue,
        handleSubmit
    } = useForm({
        defaultValues: defaultFormValues
    });

    useEffect(() => {
        if (sales===null || sales===undefined) {
            if (trxNo === 'XXXXX') {
                configurationService.getNextId(SALES_MODEL).then(data => {
                    setTrxNo(data.nextID);
                    // console.log("NEXT ID::", data.nextID);
                });
            }
            // setEditMode(true);
        } else {
            // console.log("FETCHED-SALES::", sales);    
            reset({
                id: sales.id,
                party_type: sales.party_type,
                dtCustomer_id: sales.party_id,
                customer_category: sales.customer_category,
                customer_phone: sales.customer_phone,
                customer_name: sales.customer_name,
                notes: sales.notes,
            });
            setSalesItems(sales.items);
            calculateTotals(sales.items);
            setTrxNo(sales.voucher_no);
            setEditMode(sales.status === 'draft');
            // console.log("EDIT MODE:::=>", sales.status, sales.status === 'draft');
        }
    }, [sales]);


    const onSubmit = (formData) => {

        if(salesItems.length === 0) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'No Product Added', life: 3000 });
            return;
        }

        formData.status = status;
        formData.voucher_no = trxNo;

        if(customerCategory === "WALKIN") {
            formData.party_type = " ";
            formData.party_id = " ";
            formData.customer_phone = formData.customer_phone;
            formData.customer_name = formData.customer_name;
            // formData.customerAddress = '';
            formData.salesStatus = "COMPLETED";
        } else {
            // console.log("selectedCustomer::", selectedCustomer);
            formData.party_type = "dtCustomer";
            formData.party_id = selectedCustomer._id;
            formData.customer_phone = selectedCustomer.phone;
            formData.customer_name = selectedCustomer.name;
            // formData.customerAddress = selectedCustomer.address;
            // if(paymentData.dueAmount === 0.00) {
            //     formData.salesStatus = "COMPLETED";
            // } else {
            //     formData.salesStatus = "PENDING";
            // }
        }

        formData.items = salesItems;

        formData.gross = totalPrice;
        formData.discount = totalDiscount;
        formData.duty_vat = vat;
        formData.net = netAmount;
        formData.due = netAmount;
        formData.paid = 0;

        try {
            if (sales) {
                orderService.update(SALES_MODEL, sales.id, formData).then(data => {
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Purchase Record Created', life: 3000 });
                    // navigate("/sales");
                });                
            } else {
                orderService.create(SALES_MODEL, formData).then(data => {
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Purchase Record Created', life: 3000 });
                    // navigate("/sales");
                });
            }
        }
        catch (err){
            console.log(err)
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to create Purchase Record!', life: 3000 });
            // navigate("/sales");  
        }
    };

    const gotoList = () => {
        navigate("/sales");
    };

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    const addToSaleList = (addedItem) => {
        let newSales = [...salesItems];
        addedItem['index'] = salesItems.length;
        newSales.push(addedItem);
        setSalesItems(newSales);
        calculateTotals(newSales);
        clearProductSelection();
    };

    const updateSalelist = (dtSalesProduct) => {
        let newSales = [...salesItems];
        newSales[selectedProduct.index] = dtSalesProduct;
        setSalesItems(newSales);
        calculateTotals(newSales);
        clearProductSelection();
    };

    const onVATChange = (vatPercentage) => {
        setVatPercentage(vatPercentage);
        let newSales = [...salesItems];
        calculateTotals(newSales);
    };

    const onDeliveryCostChange = (deliveryCost) => {
        setDeliveryCost(deliveryCost);
        let newSales = [...salesItems];
        calculateTotals(newSales);
    };

    const clearProductSelection = () => {
        setSelectedProduct(defaultSalesProduct);
        setSelectedItem({});
        setSelectedTableItem({});
        setUpdateSaleItemMode(false);
    };

    const clearAll = () => {
        setSalesItems([]);
        setTotalPrice(0.00);
        setTotalDiscount(0.00);
        setTotalQuantity(0);
        setVat(0.00);
        setDeliveryCost(0.00);
        setVatPercentage(0.00);
        setNetAmount(0.00);
        setCustomerCategory("WALKIN");
        setSelectedCustomer({});
        reset(defaultFormValues);
    };

    const removeItem = () => {
        let newSales = [...salesItems];
        newSales.splice(selectedProduct.index, 1);
        setSalesItems(newSales);
        setDeleteSalesProductDialog(false);
    };

    const calculateTotals = (allsales) => {
        let total = 0.00;
        let discount = 0.00;
        let discountedAmount = 0.00;
        let quantity = 0;
        let vat = 0.00;
        let netAmount = 0.00;
        allsales.forEach(sale => {
            total += sale.totalPrice;
            discount += sale.discount;
            discountedAmount += sale.discountedAmount;
            quantity += sale.quantity;
        });
        vat = (total - discountedAmount) * (vatPercentage / 100);
        netAmount = total - discountedAmount + vat + deliveryCost;
        setTotalPrice(total);
        setTotalDiscount(discount);
        setTotalDiscountedAmount(discountedAmount);
        setTotalQuantity(quantity);
        setVat(vat);
        setNetAmount(netAmount);
    };

    const editSalesProduct = (dtSalesProduct) => {
        console.log(dtSalesProduct);
        setSelectedProduct({ ...dtSalesProduct });
        setSelectedTableItem({ "id": dtSalesProduct.dtProduct_id });
        setUpdateSaleItemMode(true);
    };

    const onCustomerSelect = (selectedRow) => {
        setSelectedCustomer(selectedRow);
    };

    const onCustomerCategoryChange = (value) => {
        setCustomerCategory(value);
        if(value === "WALKIN") {
            setSelectedCustomer({});
            setValue('dtCustomer_id', '');
            setValue('notes', '');
            setValue('customer_phone', '');
            setValue('customer_name', '');
        }
    };

    const onSelection = async (e) => {
        let productSelected = e.value;
        console.log("selectedCustomer::", selectedCustomer);
        if(selectedCustomer!==null || customerCategory==="WALKIN") {
            if(updateSaleItemMode) {
                toast.current.show({ severity: 'warn', summary: 'Please Cancel the update', detail: 'Product in update', life: 3000 });
                return;
            }

            let alreadySelected = false;
            salesItems.forEach(sale => {
                if(sale.dtProduct_id === productSelected.id) {
                    alreadySelected = true;
                }
            });
            if(alreadySelected) {
                toast.current.show({ severity: 'warn', summary: 'Already Added', detail: 'Product Already Added', life: 3000 });
                setSelectedTableItem({});
                setSelectedItem({});
                setSelectedProduct(defaultSalesProduct);
                return;
            }

            let lastTradePrice = 0
            if(selectedCustomer!==null){
                // crash here
                // lastTradePrice = await productService.getProductCustomerLastPrice(productSelected._id, selectedCustomer);
            }
            productSelected['lastTradePrice'] = lastTradePrice;

            setSelectedTableItem({ "id": productSelected.id });
            setSelectedItem(productSelected);
        } else {
            toast.current.show({ severity: 'warn', summary: 'Please Select Customer', detail: 'Select a Customer First', life: 3000 });
        }
    }

    let defaultFilters = {
        fields: ['id', 'name', 'code', 'bar_code', 'brand_name', 'model_no', 'part_number', 'current_stock', 'price'],
        first: 0,
        rows: 10,
        page: 1,
        sortField: null,
        sortOrder: null,
        filters: {
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            name: { value: null, matchMode: FilterMatchMode.CONTAINS },
            brandName: { value: null, matchMode: FilterMatchMode.CONTAINS },
            modelNo: { value: null, matchMode: FilterMatchMode.CONTAINS },
            partNumber: { value: null, matchMode: FilterMatchMode.CONTAINS }
        }
    }

    const confirmDeleteSalesProduct = (dtSalesProduct) => {
        setDeleteSalesProductDialog(true);
    };

    const hideDeleteSalesProductDialog = () => {
        setDeleteSalesProductDialog(false);
    };

    const deleteProductDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteSalesProductDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={removeItem} />
        </>
    );

    return (

    <div className="grid h-screen">    
    <Toast ref={toast} />    
    <div className="card col-5">
        <h5><Button onClick={() => gotoList()} className="p-button-outlined" label="Go Back" /> Sale Detail :: VoucherNo ({trxNo}) </h5>
        <div className="card col-12 md:col-12">
        <SelectMasterDataTableList displayField="name"
                fieldValue=""
                scrollHeight="300px"
                defaultFilters={defaultFilters}
                modelName={PRODUCT_MODEL} caption="Select Product"
                selectedItem={selectedTableItem}
                showFields={[]} onSelect={onSelection}
                columns={[
                    {field: 'name', header: 'Product Name', filterPlaceholder: 'Filter by Product Name', width: '50rem'}, 
                    {field: 'brand_name', header: 'Brand Name', filterPlaceholder: 'Filter by Barnd Name', width: '15rem'},
                    {field: 'model_no', header: 'Model No', filterPlaceholder: 'Filter by Model No', width: '15rem'},
                    {field: 'part_number', header: 'Part Number', filterPlaceholder: 'Filter by Part Number', width: '15rem'},
                    {field: 'category_name', header: 'Product Category', filterPlaceholder: 'Filter by Product Category', width: '15rem'}
    ]} 
                />
        </div>
        <div className="card col-12 md:col-12">
            <div className="p-fluid formgrid grid">
                <div className="field col-12 md:col-4">
                <Controller
                    name="customer_category"
                    control={control}
                    render={({ field, fieldState }) => (
                    <>
                        <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Customer Category</label>
                        <SelectConstData field={field} data={CUSTOMER_CATEGORY}
                            onSelectChange={(value) => onCustomerCategoryChange(value)}
                            className={classNames({ 'p-invalid': fieldState.error })} /> 
                        {getFormErrorMessage(field.name)}
                    </>
                )}/>
                </div>
                <div className="field col-12 md:col-8">
                <Controller
                    name="notes"
                    control={control}
                    render={({ field, fieldState }) => (
                        <>
                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Notes</label>
                    <InputTextarea inputId={field.name} value={field.value} inputRef={field.ref}  onChange={(e) => field.onChange(e.target.value)} />
                        </>
                    )}/>
                </div>

                <div className="field col-12 md:col-2">
                    <Button type="submit" label="Cancel Order" className="p-button-outlined p-button-warning" 
                        onClick={() => clearAll()}
                    />
                </div>
                <div className="field col-12 md:col-2">
                    <Button type="submit" label="Save Order" className="p-button p-button-success" 
                        onClick={handleSubmit((d) => onSubmit(d))}
                    />
                </div>

                {(customerCategory === "WALKIN") && (<div className="grid col-12 md:col-8">
                <div className="field col-12 md:col-6">
                <Controller
                    name="customer_phone"
                    control={control}
                    rules={{ required: 'Mobile Number is required.' }}
                    render={({ field, fieldState }) => (
                        <>
                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Mobile Number</label>
                    <InputText inputId={field.name} value={field.value} inputRef={field.ref}  onChange={(e) => field.onChange(e.target.value)} />
                    {getFormErrorMessage(field.name)}
                        </>
                    )}/>
                </div>
                <div className="field col-12 md:col-6">
                <Controller
                    name="customer_name"
                    control={control}
                    render={({ field, fieldState }) => (
                        <>
                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Name</label>
                    <InputText inputId={field.name} value={field.value} inputRef={field.ref}  onChange={(e) => field.onChange(e.target.value)} className={classNames({ 'p-invalid': fieldState.error })}/>
                        </>
                    )}/>
                </div>
                </div>)}
                {(customerCategory !== "WALKIN") && (<div className="grid col-12 md:col-8">
                <div className="field col-12 md:col-8">
                <Controller
                    name="dtCustomer_id"
                    control={control}
                    rules={{ required: 'Custmer is required.' }}
                    render={({ field, fieldState }) => (
                    <>
                        <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Customer*</label>
                        <SelectMasterData field={field} modelName={CUSTOMER_MODEL}
                            displayField="name"
                            onSelect={onCustomerSelect}
                            className={classNames({ 'p-invalid': fieldState.error })} 
                            columns={[
                                {field: 'name', header: 'Customer Name', filterPlaceholder: 'Filter by Customer Name'}
                            ]} />
                        {getFormErrorMessage(field.name)}
                    </>
                )}/>
                </div>
                <div className="field col-12 md:col-4">
                    <label>Last Voucher</label>
                    <InputText  readOnly={true}/>
                </div>
                </div>)}
            </div>
        </div>
    </div>
    <div className="card col-7" >
        <SalesProductForm 
            onAdd={(dt) => addToSaleList(dt)} 
            onEdit={(dt) => updateSalelist(dt)}
            onCancel={() => clearProductSelection()}
            currency={selectedCustomer_currency} 
            defaultSalesProduct={defaultSalesProduct} 
            selectedItem={selectedItem}
            selectedProduct={selectedProduct}
            />
        <SalesProductTotal sales={salesItems}
                totalPrice={totalPrice} netAmount={netAmount} 
                totalDiscount={totalDiscountedAmount} 
                vat={vat} onVATChange={onVATChange}
                onDeliveryCostChange={onDeliveryCostChange}
                onEdit={(dt) => editSalesProduct(dt)} 
                onDelete={(dt) => confirmDeleteSalesProduct(dt)}
            />
        <SalesProductDetail sales={salesItems}
                totalPrice={totalPrice} netAmount={netAmount} 
                totalDiscount={totalDiscountedAmount} 
                vat={vat} onVATChange={onVATChange}
                onDeliveryCostChange={onDeliveryCostChange}
                onEdit={(dt) => editSalesProduct(dt)} 
                onDelete={(dt) => confirmDeleteSalesProduct(dt)}
            />
        <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteSalesProductDialog}>
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
});
                 
export default Form;