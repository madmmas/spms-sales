import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import * as moment from 'moment';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { FilterMatchMode } from 'primereact/api';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';
import { classNames } from 'primereact/utils';
import { Dialog } from 'primereact/dialog';

import ConfirmDialog from '../../components/ConfirmDialog';
import SelectConstData from '../../components/SelectConstData';
import SelectMasterDataTableList from '../../components/SelectMasterDataTableList';
import SelectMasterData from '../../components/SelectMasterData';

import { CUSTOMER_CATEGORY } from '../../../constants/lookupData';
import { PRODUCT_MODEL, CUSTOMER_MODEL, SALES_MODEL } from '../../../constants/models';

import PaymentDialog from '../../components/PaymentDialog';

import SalesProductForm from './components/SalesProductForm';

import { ConfigurationService } from '../../../services/ConfigurationService';
import { OrderService } from '../../../services/OrderService';

const Form = React.memo(({ sales }) => {

    const toast = useRef(null);
    let navigate = useNavigate();

    const [trxNo, setTrxNo] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [status, setStatus] = useState('draft');

    // STATES FOR SALE ITEMS
    const [salesItems, setSalesItems] = useState([]);
    const [salesData, setSalesData] = useState([]);

    // STATES FOR PRODUCT SELECT TABLE
    const [selectProductTableItem, setSelectProductTableItem] = useState({});
    const [selectedProductItem, setSelectedProductItem] = useState(null);
    const [selectedAddedProduct, setSelectedAddedProduct] = useState(null);

    // STATES FOR PRODUCT FORM
    const [updateSaleItemMode, setUpdateSaleItemMode] = useState(false);
    const [resetTrigger, setResetTrigger] = useState(0);

    // STATES FOR CUSTOMER FORM
    const [customerCategory, setCustomerCategory] = useState("WALKIN");
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    // STATES FOR CONFIRM DIALOG
    const [triggerConfirmDialog, setTriggerConfirmDialog] = useState(false);
    const [confirmDialogMessage, setConfirmDialogMessage] = useState(null);

    // STATES FOR PAYMENT DIALOG
    const [paymentDlgTrigger, setPaymentDlgTrigger] = useState(0);
    const [paymentData, setPaymentData] = useState([]);
    const [initPayment, setInitPayment] = useState(null);

    // STATES FOR FORM SUBMIT
    const [selAction, setSelAction] = useState(null);
    const [selFormData, setSelFormData] = useState(null);

    ///// Default Values -- Start /////
    let defaultProductFilters = {
        fields: ['id', 'name', 'code', 'bar_code', 'brand_name', 'model_no', 'part_number', 'current_stock', 'min_price', 'price'],
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

    let emptyPayment = {
        payment_date: moment().format('YYYY-MM-DD'),
        payment_no: null,
        payment_type: '',   // dtCash, dtBank, dtMFS
        payment_method: 'CASH', // CASH, BANK, MFS
        party_type: '', // CUSTOMER, SUPPLIER, EMPLOYEE, OTHER
        party_id: null,
        bank_account_id: null,
        current_balance: 0,
        amount: 0,
        reference: '',
        remarks: '',
    };
    ///// Default Values -- END /////

    ///// Initialization -- Start /////
    const orderService = new OrderService();
    const configurationService = new ConfigurationService();

    const {
        control,
        formState: { errors },
        reset,
        setValue,
        handleSubmit
    } = useForm({
        defaultValues: {}
    });
    ///// Initialization -- End /////
    
    ///// SIDE-EFFECTS -- Start /////
    useEffect(() => {
        resetAll();
    }, []);

    useEffect(() => {
        if (sales===null || sales===undefined) {
            if (trxNo === null) {
                configurationService.getNextId(SALES_MODEL).then(data => {
                    setTrxNo(data.nextID);
                });
            }
            setEditMode(true);
        } else {
            console.log("FETCHED-SALES::", sales);
            setTrxNo(sales.voucher_no);
            setSalesItems(sales.items);
            setEditMode(sales.status === 'draft');
            setCustomerCategory(sales.customer_category);
            reset({
                "notes": sales.notes,
                "party_id": sales.party_id,
                "customer_name": sales.customer_name,
                "customer_phone": sales.customer_phone,
                "customer_category": sales.customer_category,
            });
        }
    }, [sales]);
    ///// SIDE-EFFECTS -- End /////

    ///// Functions -- Start /////
    const resetForm = () => {
        reset({
            "customer_category": "WALKIN",
            "notes": "",
            "party_id": "",
            "customer_phone": "",
            "customer_name": ""
        })
    }
    const prepareSalesItem = item => {
        let _item = {
            product_id: item.product_id,
            qty: item.qty,
            discount_profit: item.discount_profit,
            trade_price: item.trade_price,
            net_price: item.net_price,
        }
        return _item;
    }

    const prepareSalesData = formData => {
        let _salesItems = [];
        for(let item of salesItems) {
            _salesItems.push(prepareSalesItem(item));
        }
        let _sales = {
            "voucher_no": trxNo,
            "customer_category": formData.customer_category,
            "party_id": formData.party_id,
            "customer_name": formData.customer_name,
            "customer_phone": formData.customer_phone,
            "notes": formData.notes,
            "status": "draft",
            "trx_status": "pending",
            "items": _salesItems
        };

        return _sales;
    }
        
    const submitSalesData = formData => {
        console.log("submitSalesData::", formData);

        let _sales = prepareSalesData(formData);   
        
        console.log("_sales::", _sales);
        try {
            if (sales && sales.id) {
                if(_sales.status === 'approved'){
                    orderService.commit(SALES_MODEL, sales.id, _sales).then(data => {
                        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Sales Record Committed', life: 3000 });
                        // navigate("/sales");
                    });
                } else {
                    orderService.update(SALES_MODEL, sales.id, _sales).then(data => {
                        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Sales Record Updated', life: 3000 });
                        navigate("/sales");
                    });
                }

                // orderService.update(SALES_MODEL, sales.id, _sales).then(data => {
                //     toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Sales Record Updated', life: 3000 });
                //     navigate("/sales");
                // });         
            } else {
                orderService.create(SALES_MODEL, _sales).then(data => {
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Sales Record Created', life: 3000 });
                    navigate("/sales");
                });
            }
        }
        catch (err){
            console.log(err)
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to create Sales Record!', life: 3000 });
            // navigate("/sales");  
        }
    }

    const getCalculatedValues = () => {
        // calculate totals
        let net = 0.00;
        let gross = 0.00;
        let discount = 0.00;
        let duty_vat = 0.00;
        let transport = 0.00;
        console.log("SALES-ITEMS:::",salesItems)
        salesItems.forEach(item => {
            gross += item.trade_price * item.qty;
            duty_vat += item.net * item.vat / 100;
            discount += (item.qty*item.trade_price*item.discount_profit/100);
        });
        net = gross - discount
        return {
            "gross": gross,
            "discount": discount,
            "transport": transport,
            "duty_vat": duty_vat,
            "net": net
        }
    }

    const sumbitFormData = () => {
        // console.log("sumbitFormData::", salesData);
        submitSalesData(salesData);
    };
    ///// Functions -- End /////

    ///// Events -- Start /////
    ///// Events -- PRODUCT /////
    const resetProductSelection = () => {
        setSelectedProductItem(null);
        setSelectedAddedProduct(null);
        setSelectProductTableItem(null);
    };

    const selectProductFromList = product_id => {
        setSelectProductTableItem({ "id": product_id });
    };
    const deselectProductFromList = () => {
        resetProductSelection();
        // setUpdateSaleItemMode(false);
    };

    const onSelectProductFromTable = async e => {
        let _productSelected = e.value;
        console.log("productSelected::", _productSelected);
        console.log("selectedCustomer::", selectedCustomer);
        if(selectedCustomer!==null || customerCategory==="WALKIN") {
            // if(updateSaleItemMode) {
            //     toast.current.show({ severity: 'warn', summary: 'Please Cancel the update', detail: 'Product in update', life: 3000 });
            //     return;
            // }

            console.log("salesItems::", salesItems);
            for(let sale of salesItems) {
                if(sale.product_id === _productSelected.id) {
                    toast.current.show({ severity: 'warn', summary: 'Already Added', detail: 'Product Already Added', life: 3000 });
                    resetProductSelection();
                    return;
                }
            };

            selectProductFromList(_productSelected.id);
            
            let _product = { 
                ..._productSelected,
                "trade_price": Number(_productSelected.price),
                "current_stock": Number(_productSelected.current_stock),
            };
            console.log("setSelectedProductItem::", _product)
            setSelectedProductItem(_product);
        } else {
            toast.current.show({ severity: 'warn', summary: 'Please Select Customer', detail: 'Select a Customer First', life: 3000 });
        }
    }
    ///// Events -- CUSTOMER /////
    const onCustomerCategoryChange = value => {
        setCustomerCategory(value);
        if(value === "WALKIN") {
            setSelectedCustomer(null);
            resetForm();
        }
    };

    const onCustomerSelect = item => {
        setSelectedCustomer(item);
    };


    ///// Events -- PRODUCT-FORM /////
    const addSalesItem = item => {
        let _newSales = [...salesItems];
        item['index'] = salesItems.length;
        _newSales.push(item);
        setSalesItems(_newSales);
    };

    const updateSalesItem = (item, selectedItemIndex) => {
        let _newSales = [...salesItems];
        item['index'] = selectedItemIndex;
        _newSales[selectedItemIndex] = item;
        setSalesItems(_newSales);
    };

    const removeSalesItem = (index) => {
        let _newSales = [...salesItems];
        _newSales.splice(index, 1);    
        // recalculate index
        _newSales.forEach((item, index) => {
            item['index'] = index;
        });
        setSalesItems(_newSales);
    };

    ///// Events -- CONFIRM DIALOG /////
    const onConfirmClick = () => {
        let action = selAction;
        let formData = selFormData;
        if(action === 'save'){
            submitSalesData(formData);
        } else if(action === 'cancel'){
            orderService.cancel(SALES_MODEL, sales.id).then(data => {
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Sales Record Cancelled', life: 3000 });
                navigate("/sales");
            });
        }
    }

    ///// Events -- FORM /////
    const resetAll = () => {
        resetForm();
        resetProductSelection();

        setSalesItems(null);
        setSelectedCustomer(null);
        setCustomerCategory("WALKIN");

        // reset trigger for product form and list
        setResetTrigger(resetTrigger+1);
    }

    const onSubmit = (action, formData) => {
        console.log("onSubmit::", action, formData);

        setSelAction(action);
        setSelFormData(formData);
        if(action === 'save'){
            setStatus('draft');
            if(salesItems.length < 1) {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'No Product Added', life: 3000 });
                return;
            }
            setConfirmDialogMessage("Are you sure you want to save this order?");
        } else if(action === 'cancel'){
            setStatus('cancelled');
            // setTrxStatus("cancelled");
            setConfirmDialogMessage("Are you sure you want to cancel this order?");
        }
        setTriggerConfirmDialog(triggerConfirmDialog+1);
    }

    ///// Events -- PAYMENT DIALOG /////
    const showPaymentDialog = formData => {
        console.log("customerCategory::", customerCategory);
        setSalesData(formData);
        if (customerCategory === "REGISTERED") {
            // setShowPaymentDialog(true);
            // sumbitFormData();
            // onSubmit('approve', d)
        } else if (customerCategory === "WALKIN") {
            // console.log("salesData:::", salesData)
            let data = getCalculatedValues()
            console.log("DATA::", data)
            setInitPayment({
                ...emptyPayment,
                ...{
                    "current_balance": data.net,
                    "amount": data.net,
                }
            });
            console.log("InitPayment::", initPayment);
            setPaymentDlgTrigger(paymentDlgTrigger + 1);
        } else if(customerCategory === "CONDITIONAL") {
            // sumbitFormData();
            // onSubmit('approve', d);
        }
    }

    const onPaymnetCallback = (data) => {
        console.log("onPaymnetCallback", data);
        setPaymentData(data);
        onSubmit('approve', salesData);
    }
    ///// Events -- End /////

    ///// View Methods -- Start /////
    const getFormErrorMessage = name => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };
    ///// View Methods -- END /////

    ///// View Parts -- START /////

    const renderProductSelectionTable = () => {
        return (
            <>
            {editMode && <div className="card col-12 md:col-12">
                <SelectMasterDataTableList displayField="name"
                    fieldValue=""
                    scrollHeight="300px"
                    defaultFilters={defaultProductFilters}
                    modelName={PRODUCT_MODEL} caption="Select Product"
                    selectedItem={selectProductTableItem}
                    showFields={[]} onSelect={onSelectProductFromTable}
                    columns={[
                        {field: 'name', header: 'Product Name', filterPlaceholder: 'Filter by Product Name', width: '50rem'}, 
                        {field: 'brand_name', header: 'Brand Name', filterPlaceholder: 'Filter by Barnd Name', width: '15rem'},
                        {field: 'model_no', header: 'Model No', filterPlaceholder: 'Filter by Model No', width: '15rem'},
                        {field: 'part_number', header: 'Part Number', filterPlaceholder: 'Filter by Part Number', width: '15rem'},
                        {field: 'category_name', header: 'Product Category', filterPlaceholder: 'Filter by Product Category', width: '15rem'}
                    ]} 
                    />
                </div>}
            </>
        )
    }
    const renderFormButtons = () => {
        let showCancelButton = false;
        if(sales) {
            if(sales.status === 'draft') {
                showCancelButton = true;
            } else if(sales.status === 'approved') {
                if(customerCategory==='CONDITIONAL' && sales.trx_status === 'pending') {
                    showCancelButton = true;
                }
            }
        } 
        return (
        <>
            <div className="field col-12 md:col-2">
                <Button type="submit" label="Clear" className="p-button-outlined p-button-warning" 
                    onClick={() => resetAll()}
                />
            </div>
            {showCancelButton && <div className="field col-12 md:col-3">
                <Button type="submit" label="Cancel Order" className="p-button-outlined p-button-danger" 
                    onClick={handleSubmit((d) => onSubmit('cancel', d))}
                />
            </div>}
            <div className="field col-12 md:col-3">
                <Button type="submit" label="Save Order" className="p-button p-button-success" 
                    onClick={handleSubmit((d) => onSubmit('save', d))}
                />
            </div>
            {sales && <div className="field col-12 md:col-4">
                <Button type="submit" label="Confirm Order" className="p-button p-button-info" 
                    onClick={handleSubmit((d) => showPaymentDialog(d) )}
                />
            </div>}
        </>
        )
    }
    const renderForm = () => {
        return (
            <>
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
                    <InputTextarea inputId={field.name} value={field.value} inputRef={field.ref}  onChange={(e) => field.onChange(e.target.value)} className={classNames({ 'p-invalid': fieldState.error })}/>
                        </>
                    )}/>
                </div>

                {(customerCategory === "WALKIN") && (<div className="grid col-12 md:col-12">
                <div className="field col-12 md:col-6">
                <Controller
                    name="customer_phone"
                    control={control}
                    rules={{ required: 'Mobile Number is required.' }}
                    render={({ field, fieldState }) => (
                        <>
                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Mobile Number</label>
                    <InputText inputId={field.name} value={field.value} inputRef={field.ref}  onChange={(e) => field.onChange(e.target.value)} className={classNames({ 'p-invalid': fieldState.error })}/>
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
                {(customerCategory !== "WALKIN") && (<div className="grid col-12 md:col-12">
                <div className="field col-12 md:col-8">
                <Controller
                    name="party_id"
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
                    <InputText readOnly={true}/>
                </div>
                </div>)}
            </>
        )
    }
    ///// View Parts -- END /////

    return (

    <div className="grid h-screen">    
    <Toast ref={toast} />    
    <div className="card col-5">
        {!sales && <Button className="p-button-outlined" label="Go to Sales List" 
                        onClick={() => navigate("/sales")}/>}
        <h5>Sale Detail :: VoucherNo ({trxNo}) 
            {sales && <Tag severity="warning" value={sales.status}></Tag>}</h5>
        {renderProductSelectionTable()}

        <div className="card col-12 md:col-12">
            <div className="p-fluid formgrid grid">
                {renderForm()}
                {renderFormButtons()}
            </div>
        </div>

    </div>
    <div className="card col-7" >
        {editMode && <SalesProductForm 
                salesItems={salesItems}
                addSalesItem={(item) => addSalesItem(item)}
                updateSalesItem={(item, index) => updateSalesItem(item, index)}
                removeSalesItem={(index) => removeSalesItem(index)}
                deselectProductFromList={() => deselectProductFromList()}
                selectProductFromList={(id) => selectProductFromList(id)}
                selectedItem={selectedProductItem}
                />}

        <ConfirmDialog 
            message={confirmDialogMessage}
            trigger={triggerConfirmDialog}
            onConfirm={onConfirmClick}
            />

        <PaymentDialog 
                trigger={paymentDlgTrigger} 
                initPayment={initPayment}
                readOnly={customerCategory==="WALKIN"}
                onPaymnetCallback={onPaymnetCallback}
                />

        
    </div>     
    </div>
    );
});
                 
export default Form;