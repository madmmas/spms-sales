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
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';

import ConfirmDialog from '../../components/ConfirmDialog';
import SelectConstData from '../../components/SelectConstData';
import SelectMasterDataTableList from '../../components/SelectMasterDataTableList';
import SelectMasterData from '../../components/SelectMasterData';

import { CUSTOMER_CATEGORY } from '../../../constants/lookupData';
import { PRODUCT_MODEL, CUSTOMER_MODEL, SALES_MODEL } from '../../../constants/models';

import PaymentDialog from '../../components/PaymentDialog';
import ReturnItemDialog from '../../components/ReturnItemDialog';

import SalesProductForm from './components/SalesProductForm';

import { ConfigurationService } from '../../../services/ConfigurationService';
import { OrderService } from '../../../services/OrderService';
import { ProductService } from '../../../services/ProductService';
import CancellationFeeDialog from '../../components/CancellationFeeDialog';

const Form = React.memo(({ sales }) => {

    const toast = useRef(null);
    let navigate = useNavigate();

    const [trxNo, setTrxNo] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [status, setStatus] = useState('draft');
    const [trxStatus, setTrxStatus] = useState('draft');

    // STATES FOR SALE ITEMS
    const [salesItems, setSalesItems] = useState([]);
    const [salesData, setSalesData] = useState([]);
    const [vat, setVat] = useState(0.00);
    const [deliveryCost, setDeliveryCost] = useState(0.00);
    const [additionalDiscount, setAdditionalDiscount] = useState(0.00);

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
    const [customerLastOrder, setCustomerLastOrder] = useState(null);
    const [customerBalance, setCustomerBalance] = useState(null);

    // STATES FOR CONFIRM DIALOG
    const [triggerConfirmDialog, setTriggerConfirmDialog] = useState(false);
    const [confirmDialogMessage, setConfirmDialogMessage] = useState(null);

    // STATES FOR PAYMENT DIALOG
    const [paymentDlgTrigger, setPaymentDlgTrigger] = useState(0);
    const [paymentData, setPaymentData] = useState(null);
    const [initPayment, setInitPayment] = useState(null);

    // STATES FOR FORM SUBMIT
    const [selAction, setSelAction] = useState(null);
    const [selFormData, setSelFormData] = useState(null);

    // STATES FOR FORM RETURN
    const [returnMode, setReturnMode] = useState(false);
    const [selectedReturnItem, setSelectedReturnItem] = useState({});
    const [selectedReturnItems, setSelectedReturnItems] = useState([]);
    const [returnItems, setReturnItems] = useState([]);
    const [returnDlgTrigger, setReturnDlgTrigger] = useState(0);
    const [returnDialog, setReturnDialog] = useState(false);

    // STATES FOR CANCELLATION FEE DIALOG
    const [cancelData, setCancelData] = useState(null);
    const [cancellationFeeDlgTrigger, setCancellationFeeDlgTrigger] = useState(0);
    
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
        ref_type: '', // CUSTOMER, SUPPLIER, EMPLOYEE, OTHER
        ref_id: null,
        bank_account_id: null,
        current_balance: 0,
        amount: 0,
        reference: '',
        remarks: '',
    };
    ///// Default Values -- END /////

    ///// Initialization -- Start /////
    const orderService = new OrderService();
    const productService = new ProductService();
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
            setReturnItems(sales.return_items);
            setEditMode(sales.status === 'draft');
            setCustomerCategory(sales.customer_category);
            setCustomerLastOrder(sales.last_trx_id);
            
            setReturnMode(sales.status === 'approved' && sales.trx_status === 'completed');
            setVat(Number(sales.duty_vat));
            setDeliveryCost(Number(sales.transport));
            setAdditionalDiscount(Number(sales.additional_discount));
            // get customer balance
            getPartyBalance(sales.party_id);
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
        let _payment = paymentData;
        let _sales = {
            "voucher_no": trxNo,
            "customer_category": formData.customer_category,
            "party_id": formData.party_id,
            "customer_name": formData.customer_name,
            "last_trx_id": customerLastOrder,
            "customer_phone": formData.customer_phone,
            "notes": formData.notes,
            "status": status,
            "trx_status": trxStatus,
            "items": _salesItems,
            "payment": _payment,
            "duty_vat": vat,
            "transport": deliveryCost,
            "additional_discount": additionalDiscount,
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
                    if(customerCategory === "CONDITIONAL" && _sales.trx_status === 'completed') {
                        orderService.confirmPayment(sales.id, _sales).then(data => {
                            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Sales Record Committed', life: 3000 });
                            // navigate("/sales");
                            navigate("/sales/invoice/" + sales.id);
                        });                                                
                    } else {
                        orderService.commit(SALES_MODEL, sales.id, _sales).then(data => {
                            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Sales Record Committed', life: 3000 });
                            // navigate("/sales");
                            navigate("/sales/invoice/" + sales.id);
                        });
                    }
                } else {
                    orderService.update(SALES_MODEL, sales.id, _sales).then(data => {
                        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Sales Record Updated', life: 3000 });
                        navigate("/sales");
                    });
                }
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
        let discountedAmount = 0.00;
        let duty_vat = 0.00;
        let transport = 0.00;
        console.log("SALES-ITEMS:::",salesItems)
        salesItems.forEach(item => {
            gross += item.trade_price * item.qty;
            discountedAmount += Number(item.trade_price) * Number(item.qty) * Number(item.discount_profit) / 100;
        });
        duty_vat = (gross - discountedAmount) * (vat / 100);
        net = gross - discountedAmount + Number(duty_vat) + Number(deliveryCost) - Number(additionalDiscount);
        return {
            "gross": gross,
            "discount": discountedAmount,
            "additional_discount": additionalDiscount,
            "transport": deliveryCost,
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

    const onSelectProductFromTable = async (e) => {
        let _productSelected = e.value;
        // fetch current stock
        let data = await productService.getById(_productSelected.id);
        _productSelected['current_stock'] = data.current_stock;
        _productSelected['price'] = data.price;
        _productSelected['min_price'] = data.min_price;
        console.log("productSelected::", _productSelected);
        console.log("selectedCustomer::", selectedCustomer);
        if(selectedCustomer!==null || customerCategory==="WALKIN") {
            if(updateSaleItemMode) {
                toast.current.show({ severity: 'warn', summary: 'Please Cancel the update', detail: 'Product in update', life: 3000 });
                return;
            }

            console.log("salesItems::", salesItems);
            for(let sale of salesItems) {
                if(sale.product_id === _productSelected.id) {
                    toast.current.show({ severity: 'warn', summary: 'Already Added', detail: 'Product Already Added', life: 3000 });
                    resetProductSelection();
                    return;
                }
            };

            let lastTradePrice = 0
            if(selectedCustomer!==null){
                // crash here
                lastTradePrice = await orderService.getOrderProductLastPrice("trxSales", _productSelected.id, selectedCustomer._id);
            }

            selectProductFromList(_productSelected.id);
            
            let _product = { 
                ..._productSelected,
                "trade_price": Number(_productSelected.price),
                "current_stock": Number(_productSelected.current_stock),
                "min_price": Number(_productSelected.min_price),
                "lastTradePrice": Number(lastTradePrice),
            };
            console.log("setSelectedProductItem::", _product)
            setSelectedProductItem(_product);
        } else {
            toast.current.show({ severity: 'warn', summary: 'Please Select Customer', detail: 'Select a Customer First', life: 3000 });
        }
    }
    ///// Events -- CUSTOMER /////
    const onCustomerCategoryChange = value => {
        resetForm();
        setSelectedCustomer(null);
        setCustomerCategory(value);
        setCustomerLastOrder(null);
        setCustomerBalance(null);
        setValue("customer_category", value);
    };

    const getPartyBalance = (partyId) => {
        console.log("getPartyBalance-PartyID::", partyId);
        if(partyId === null || partyId === undefined || partyId === "") {
            return;
        }
        orderService.getLedgerBalance("trxACReceivable", partyId).then(data => {
            console.log("balance::", data);
            if(data){
                let dr_amount = Number(data.dr_amount)||0;
                let cr_amount = Number(data.cr_amount)||0;
                let balance = dr_amount - cr_amount;
                setCustomerBalance(balance); 
            }
        });
    };

    const onCustomerSelect = item => {
        console.log("onCustomerSelect::", item);
        setCustomerLastOrder(item.last_trx_id);
        setSelectedCustomer(item);
        getPartyBalance(item._id);
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
        if(action === 'cancel'){
            orderService.cancel(SALES_MODEL, sales.id, cancelData).then(data => {
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Sales Record Cancelled', life: 3000 });
                // navigate("/sales");
            });
        } else {
            console.log("onConfirmClick::", selAction, selFormData);
            let formData = selFormData;
            submitSalesData(formData);
        }
    }

    ///// Events -- FORM /////
    const resetAll = () => {
        resetForm();
        resetProductSelection();

        setSalesItems([]);
        setSelectedCustomer(null);
        setCustomerCategory("WALKIN");

        // reset trigger for product form and list
        setResetTrigger(resetTrigger+1);
    }

    const onSubmit = (action, formData) => {
        console.log("onSubmit::", action, formData);
        if(salesItems.length < 1) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'No Product Added', life: 3000 });
            return;
        }
        setSelAction(action);
        setSelFormData(formData);
        if(action === 'save'){
            setStatus('draft');
            setConfirmDialogMessage("Are you sure you want to save this order?");
            setTriggerConfirmDialog(triggerConfirmDialog+1);
        } else if(action === 'cancel'){
            setStatus('cancelled');
            setTrxStatus("cancelled");
            setConfirmDialogMessage("Are you sure you want to cancel this order?");
            if(customerCategory === "CONDITIONAL") {
            setCancellationFeeDlgTrigger(cancellationFeeDlgTrigger+1);
            }else{
                setTriggerConfirmDialog(triggerConfirmDialog+1);
            }
        } else if(action === 'approve'){
            setStatus('approved');
            if (customerCategory === "CONDITIONAL") {
                setTrxStatus("pending");
            } else {
                setTrxStatus("completed");
            }
            setConfirmDialogMessage("Are you sure you want to approve this order?");
            setTriggerConfirmDialog(triggerConfirmDialog+1);
        } else if(action == 'confirm_payment') {
            setStatus('approved');
            setTrxStatus("completed");
            console.log("confirm_payment::", formData);
            setConfirmDialogMessage("Are you sure you want to complete this order?");
            setTriggerConfirmDialog(triggerConfirmDialog+1);
        }
    }

    ///// Events -- PAYMENT DIALOG /////
    const confirmPayment = () => {
        console.log("confirmPayment::", paymentData);
        let data = getCalculatedValues()
        console.log("DATA::", data)
        setInitPayment({
            ...emptyPayment,
            ...{
                "ref_type": "dtCustomer",
                "ref_id": sales.party_id,
                "current_balance": data.net,
                "amount": data.net,
            }
        });
        console.log("InitPayment::", initPayment);
        setPaymentDlgTrigger(paymentDlgTrigger + 1);
    }

    const showPaymentDialog = formData => {
        console.log("customerCategory::", customerCategory);
        setSalesData(formData);
        if (customerCategory === "REGISTERED") {
            // setShowPaymentDialog(true);
            // sumbitFormData();
            onSubmit('approve', formData)
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
            onSubmit('approve', formData);
        }
    }

    const onPaymnetCallback = (data) => {
        console.log("onPaymnetCallback", data);
        setPaymentData(data);
        if(customerCategory === "CONDITIONAL") {
            onSubmit('confirm_payment', salesData);
        } else {
            onSubmit('approve', salesData);
        }
    }

    ///// Events -- RETURN /////
    const hideReturnDialog = () => {
        setReturnDialog(false);
    };

    const submitReturnItems = () => {
        console.log("COFIRM RETURN ITEMS::", selectedReturnItems);
        orderService.return(SALES_MODEL, sales.id, selectedReturnItems).then(data => {
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Purchase Record Created', life: 3000 });
            navigate("/sales");
        });
    };

    const returnDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideReturnDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={submitReturnItems} />
        </>
    );


    const confirmReturnItems = () => {
        if (selectedReturnItems.length === 0) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Please select at least one item to return', life: 3000 });
            return;
        }
        setReturnDialog(true);
    };

    const onReturnItem = (selectedRow) => {
        console.log("SELECTED RETURN ITEM::", selectedRow);
        setSelectedReturnItem(selectedRow);
        setReturnDlgTrigger((returnDlgTrigger) => returnDlgTrigger + 1);
    };

    const onAddReturnItem = (returnItem) => {
        console.log("SELECTED RETURN ITEM::", returnItem);
        // add index to return item
        returnItem['index'] = selectedReturnItems.length;
        // add timestamp
        returnItem['created_at'] = new Date();
        // check if already added
        for(let i=0; i<selectedReturnItems.length; i++) {
            if(selectedReturnItems[i].product_id === returnItem.product_id) {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Item already added!', life: 3000 });
                return;
            }
        }

        setSelectedReturnItems([...selectedReturnItems, returnItem]);
    };

    const onDeleteFromReturnList = (rowData) => {
        console.log("DELETE RETURN ITEM::", rowData);
        let newReturnItems = [...selectedReturnItems];
        newReturnItems.splice(rowData.index, 1);
        setSelectedReturnItems(newReturnItems);
    };

    ///// Events -- CANCEL CONDITIONAL ORDER DIALOG /////
    const cancelOrderWithCharge = charge => {
        console.log("cancelOrderWithCharge::", charge);
        setCancelData(charge)
        setTriggerConfirmDialog(triggerConfirmDialog+1);
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
        let isNew = true;
        let isDraft = false;
        let isReturn = false;
        let isConditionalPending = false;
        if(sales) {
            isNew = false;
            if(sales.status === 'draft') {
                isDraft = true;
            } else if(sales.status === 'approved') {
                if(customerCategory==='CONDITIONAL' && sales.trx_status === 'pending') {
                    isConditionalPending = true;
                } else {
                    isReturn = true;
                }
            }
        } 
        return (
        <>
            {(isNew || isDraft) && <div className="field col-12 md:col-2">
                <Button type="submit" label="Clear" className="p-button-outlined p-button-warning" 
                    onClick={() => resetAll()}
                />
            </div>}
            {(isDraft || isConditionalPending) && <div className="field col-12 md:col-3">
                <Button type="submit" label="Cancel Order" className="p-button-outlined p-button-danger" 
                    onClick={handleSubmit((d) => onSubmit('cancel', d))}
                />
            </div>}
            {(isNew || isDraft) && <div className="field col-12 md:col-3">
                <Button type="submit" label="Save Order" className="p-button p-button-success" 
                    onClick={handleSubmit((d) => onSubmit('save', d))}
                />
            </div>}
            {(isNew || isDraft) && <div className="field col-12 md:col-4">
                <Button type="submit" label="Confirm Order" className="p-button p-button-info" 
                    onClick={handleSubmit((d) => showPaymentDialog(d) )}
                />
            </div>}
            {isConditionalPending && <div className="field col-12 md:col-4">
                <Button type="submit" label="Confirm Payment" className="p-button p-button-info" 
                    onClick={handleSubmit((d) => confirmPayment(d) )}
                />
            </div>}
            {isReturn && <div className="field col-12 md:col-4">
                <Button type="submit" label="Confirm Return" className="p-button p-button-info" 
                    onClick={handleSubmit((d) => confirmReturnItems() )}
                />
            </div>}
        </>
        )
    }
    const renderForm = () => {
        let readOnly = false;
        if(sales && sales.status !== 'draft') {
            readOnly = true;
        }
        return (
            <>
            <div className="field col-12 md:col-4">
                {readOnly && <>
                    <label>Customer Category</label>
                    <InputText readOnly="true" value={sales.customer_category} placeholder="empty" />
                </>}
                {!readOnly && <Controller
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
                )}/>}
                </div>
                <div className="field col-12 md:col-8">
                <Controller
                    name="notes"
                    control={control}
                    render={({ field, fieldState }) => (
                        <>
                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Notes</label>
                    <InputTextarea readOnly={readOnly} inputId={field.name} value={field.value} inputRef={field.ref}  onChange={(e) => field.onChange(e.target.value)} className={classNames({ 'p-invalid': fieldState.error })}/>
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
                    <InputText readOnly={readOnly} inputId={field.name} value={field.value} inputRef={field.ref}  onChange={(e) => field.onChange(e.target.value)} className={classNames({ 'p-invalid': fieldState.error })}/>
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
                    <InputText readOnly={readOnly} inputId={field.name} value={field.value} inputRef={field.ref}  onChange={(e) => field.onChange(e.target.value)} className={classNames({ 'p-invalid': fieldState.error })}/>
                        </>
                    )}/>
                </div>
                </div>)}
                {(customerCategory !== "WALKIN") && (<div className="grid col-12 md:col-12">
                <div className="field col-12 md:col-6">
                {readOnly && <>
                    <label>Customer</label>
                    <InputText readonly="true" value={sales.party_id} placeholder="empty" />
                </>}
                {!readOnly && <Controller
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
                )}/>}
                </div>
                <div className="field col-12 md:col-3">
                    <label>Last Voucher</label>
                    <InputText value={customerLastOrder} readOnly={true}/>
                </div>
                <div className="field col-12 md:col-3">
                    <label>Balance</label>
                    <InputText value={customerBalance} readOnly={true}/>
                </div>
                </div>)}
            </>
        )
    }

    const renderActionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => onDeleteFromReturnList(rowData)} />
            </>
        );
    };

    const renderReturnUI = () => {
        return (
            <>
            {selectedReturnItems && selectedReturnItems.length>0 && <div className="col-12">
            <h5>New Returns:</h5>
            <DataTable value={selectedReturnItems} stripedRows showGridlines scrollable scrollHeight="25rem" >
                <Column body={renderActionBodyTemplate} frozen headerStyle={{ minWidth: '6.4rem' }}></Column>
                <Column field="product_name" header="Product Name" sortable></Column>
                <Column field="return_qty" header="Returned Qty" sortable></Column>
                <Column field="reason" header="Reason" sortable></Column>
            </DataTable>
        </div>}

        {returnItems && returnItems.length>0 && <div className="col-12">
            <h5>Returned Items:</h5>
            <DataTable value={returnItems} stripedRows showGridlines scrollable scrollHeight="25rem" >
                <Column field="product_name" header="Product Name" sortable></Column>
                <Column field="return_qty" header="Returned Qty" sortable></Column>
                <Column field="reason" header="Reason" sortable></Column>
                <Column field="created_at" header="Returned Date" sortable></Column>
            </DataTable>
        </div>}
        <ReturnItemDialog 
            trigger={returnDlgTrigger} 
            selectedReturnItem={selectedReturnItem}
            onAddReturnItem={(dt) => onAddReturnItem(dt)}
            />   
            </>
        );
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
        <SalesProductForm 
            salesItems={salesItems}
            editMode={editMode} 
            returnMode={returnMode} onReturnItem={(dt) => onReturnItem(dt)}
            addSalesItem={(item) => addSalesItem(item)}
            updateSalesItem={(item, index) => updateSalesItem(item, index)}
            removeSalesItem={(index) => removeSalesItem(index)}
            deselectProductFromList={() => deselectProductFromList()}
            selectProductFromList={(id) => selectProductFromList(id)}
            selectedItem={selectedProductItem}
            onChangeVat={(value) => setVat(value)}
            onChangeDeliveryCost={(value) => setDeliveryCost(value)}
            onChangeAdditionalDiscount={(value) => setAdditionalDiscount(value)}
            vat={sales===undefined?0:sales.duty_vat} 
            deliveryCost={sales===undefined?0:sales.transport}
            addDiscount={sales===undefined?0:sales.additional_discount}
            />

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

        <CancellationFeeDialog
            trigger={cancellationFeeDlgTrigger} 
            onCancelOrder={(data) => cancelOrderWithCharge(data)}
            />

        {/* RETURN UI */}
        {renderReturnUI()}

        <Dialog visible={returnDialog} style={{ width: '450px' }} header="Confirm" modal footer={returnDialogFooter} onHide={hideReturnDialog}>
            <div className="flex align-items-center justify-content-center">
                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                <span>
                    Are you sure you want to return these products?
                </span>
            </div>
        </Dialog>
    </div>     
    </div>
    );
});
                 
export default Form;