import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller, set } from 'react-hook-form';
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
import { Dropdown } from 'primereact/dropdown';
import { InputSwitch } from 'primereact/inputswitch';
        
import ConfirmDialog from '../../components/ConfirmDialog';

import SelectConstData from '../../components/SelectConstData';
import SelectMasterDataTableList from '../../components/SelectMasterDataTableList';

import Customer from '../../components/master_data/Customer';

import { CUSTOMER_CATEGORY } from '../../../constants/lookupData';
import { PRODUCT_MODEL, PRODBRAND_MODEL, PRODMODEL_MODEL, SALES_MODEL } from '../../../constants/models';

import PaymentDialog from '../../components/PaymentDialog';
import ReturnItemDialog from '../../components/ReturnItemDialog';

import SalesProductForm from './components/SalesProductForm';

import { ConfigurationService } from '../../../services/ConfigurationService';
import { MasterDataDBService } from '../../../services/MasterDataDBService';

import { OrderService } from '../../../services/OrderService';

import CancellationFeeDialog from '../../components/CancellationFeeDialog';

const Form = React.memo(({ sales }) => {

    const toast = useRef(null);
    let navigate = useNavigate();

    const [trxNo, setTrxNo] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [status, setStatus] = useState('draft');
    const [trxStatus, setTrxStatus] = useState('draft');

    const [latestSaleVoucher, setLatestSaleVoucher] = useState('');
    const [Id, setId] = useState('');

    // GlobalFilter Ref
    const globalFilter = useRef(null);

    // STATES FOR SALE ITEMS

    const [salesItems, setSalesItems] = useState([]);
    const [salesData, setSalesData] = useState([]);
    const [vat, setVat] = useState(0.00);
    const [deliveryCost, setDeliveryCost] = useState(0.00);
    const [additionalDiscount, setAdditionalDiscount] = useState(0.00);

    // need to add gross, net, discount, due, paid
    const [salesGross, setSalesGross] = useState(0.00);
    const [salesDiscount, setSalesDiscount] = useState(0.00);
    const [salesNet, setSalesNet] = useState(0.00);
    const [salesDue, setSalesDue] = useState(0.00);
    const [salesPaid, setSalesPaid] = useState(0.00);

    // STATES FOR PRODUCT SELECT TABLE
    const [selectProductTableItem, setSelectProductTableItem] = useState({});
    const [selectedProductItem, setSelectedProductItem] = useState(null);
    const [selectedAddedProduct, setSelectedAddedProduct] = useState(null);

    const [dtProductBrands, setDtProductBrands] = useState(null);
    const [dtProductModels, setDtProductModels] = useState(null);

    const [lastTradePrice, setLastTradePrice] = useState(0.00);
    const [lastTradePriceTrigger, setLastTradePriceTrigger] = useState(0);

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
    const [showOptions, setShowOptions] = useState(false);

    // STATES FOR FORM RETURN
    const [returnMode, setReturnMode] = useState(false);
    const [selectedReturnItem, setSelectedReturnItem] = useState({});
    const [selectedReturnItems, setSelectedReturnItems] = useState([]);
    const [returnItems, setReturnItems] = useState([]);
    const [returnedAmount, setReturnedAmount] = useState(0.00);
    const [returnDlgTrigger, setReturnDlgTrigger] = useState(0);
    const [returnDialog, setReturnDialog] = useState(false);

    // STATES FOR CANCELLATION FEE DIALOG
    const [cancelData, setCancelData] = useState(null);
    const [cancellationFeeDlgTrigger, setCancellationFeeDlgTrigger] = useState(0);
    const [totalReturnedAmount, setTotalReturnedAmount] = useState('');
    
    ///// Default Values -- Start /////
    let defaultProductFilters = {
        fields: ['id', 'name', 'code', 'brand_name', 'model_no', 'part_number', 'current_stock', 'min_trade_price', 'price'],
        first: 0,
        rows: 10,
        page: 1,
        sortField: null,
        sortOrder: null,
        filters: {
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            name: { value: null, matchMode: FilterMatchMode.CONTAINS },
            code: { value: null, matchMode: FilterMatchMode.CONTAINS },
            dtProductBrand_id: { value: null, matchMode: FilterMatchMode.EQUALS },
            dtProductModel_id: { value: null, matchMode: FilterMatchMode.EQUALS },
            part_number: { value: null, matchMode: FilterMatchMode.CONTAINS }
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
        mfs_account_id: null,
        current_balance: 0,
        amount: 0,
        reference: '',
        remarks: '',
    };
    ///// Default Values -- END /////

    ///// Initialization -- Start /////
    const orderService = new OrderService();
    const masterDataDBService = new MasterDataDBService();
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
        console.log("lastTradePriceTrigger => selectedProductItem::", selectedProductItem);
        if(selectedProductItem!==null) {
            if(selectedCustomer===null){
                // lastTradePrice = await orderService.getOrderProductLastPrice("trxSales", selectedProductItem.id);
                orderService.getOrderProductLastPrice("trxSales", selectedProductItem.id).then(data => {
                    if(data){
                        console.log("lastTradePrice::", data);
                        setLastTradePrice(data.prev_price);
                        setId(data.order_id);    
                    }
                });
            }else{
                // lastTradePrice = await orderService.getOrderProductLastPriceByParty("trxSales", selectedProductItem.id, selectedCustomer.id);
                orderService.getOrderProductLastPriceByParty("trxSales", selectedProductItem.id, selectedCustomer.id).then(data => {
                    if(data){
                        console.log("lastTradePrice::", data);
                        setLastTradePrice(data.prev_price);
                        setId(data.order_id);    
                    }
                });
            }
        } else {
            setLastTradePrice(0.00);
        }
    }, [lastTradePriceTrigger, selectedProductItem]);

    useEffect(() => {
        resetAll();
        masterDataDBService.getAll(PRODBRAND_MODEL).then(data => {
            setDtProductBrands(data.rows);
        });
        masterDataDBService.getAll(PRODMODEL_MODEL).then(data => {
            setDtProductModels(data.rows);
        });
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
            setStatus(sales.status);
            setTrxNo(sales.voucher_no);
            sales.items.forEach((item, index) => {
                item['index'] = index;
            });
            setSalesItems(sales.items);
            let totalReturnedPrice = 0;
            let arrayOfSalesReturnItems = sales?.return_items?.map((item)=>{
                for (let i = 0; i < sales.items.length; i++){
                    if(item.product_id === sales.items[i].product_id){
                        totalReturnedPrice = totalReturnedPrice + item.return_qty * sales.items[i].trade_price;
                        return {
                           ...item,
                           code : sales.items[i].code,
                           brand_name : sales.items[i].brand_name,
                           model_no : sales.items[i].model_no,
                           part_number : sales.items[i].part_number,
                           trade_price : sales.items[i].trade_price
                        }
                    }
                }
            })
            setTotalReturnedAmount(totalReturnedPrice)
            setReturnItems(arrayOfSalesReturnItems);
            setEditMode(sales.status === 'draft');
            setCustomerCategory(sales.customer_category);
            setCustomerLastOrder(sales.last_trx_id);
            
            setReturnMode(sales.status === 'approved' && sales.trx_status === 'completed');
            setVat(Number(sales.duty_vat));
            setDeliveryCost(Number(sales.transport));
            setAdditionalDiscount(Number(sales.additional_discount));
            // need to add gross, net, discount, due, paid
            setSalesGross(Number(sales.gross));
            setSalesDiscount(Number(sales.discount));
            setSalesNet(Number(sales.net));
            setSalesDue(Number(sales.due));
            setSalesPaid(Number(sales.paid));

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

    const loadLazyData = async () => {
        await orderService.getLastOrder().then(data => {
            if(data){
                console.log(data)
                setLatestSaleVoucher(data.voucher_no)
            }
        });
    }

    useEffect(()=>{
        loadLazyData()
    },[])

    const prepareSalesData = formData => {
        console.log("prepareSalesData::", formData)
        let _salesItems = [];
        for(let item of salesItems) {
            _salesItems.push(prepareSalesItem(item));
        }
        let party_id = formData.party_id==""?null:formData.party_id;

        let _payment = {};
        let _advance_payment = {};
        if(formData.customer_category === "CONDITIONAL") {
            _advance_payment = paymentData;
        } else {
            _payment = paymentData;
        }
        let _sales = {
            "voucher_no": trxNo,
            "customer_category": formData.customer_category,
            "party_id": party_id,
            "customer_name": formData.customer_name,
            "last_trx_id": customerLastOrder,
            "customer_phone": formData.customer_phone,
            "notes": formData.notes,
            "status": status,
            "trx_status": trxStatus,
            "items": _salesItems,
            "payment": _payment,
            "advance_payment": _advance_payment,
            "duty_vat": vat,
            "transport": deliveryCost,
            "additional_discount": additionalDiscount,
            "gross": salesGross,
            "discount": salesDiscount,
            "net": salesNet,
            "due": formData.customer_category === "REGISTERED"?0.00:salesDue,
            "paid": formData.customer_category === "REGISTERED"?0.00:salesPaid,
            "balance_forward": -99999999,
        };
        
        if(includeDueAmount) {
            _sales['balance_forward'] = customerBalance;
        }

        console.log("WHAT SALES:::", _sales);
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
                        // orderService.confirmOrder(sales.id, _sales).then(data => {
                        //     toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Sales Record Committed', life: 3000 });
                        //     navigate("/sales");
                        //     if(_sales.status === 'approved' && _sales.trx_status === 'completed') {
                        //         window.open("#/invoice/" + sales.id, "_blank");
                        //     }
                        // });                                                
                    } else {
                        orderService.commit(SALES_MODEL, sales.id, _sales).then(data => {
                            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Sales Record Committed', life: 3000 });
                            navigate("/sales");
                            if(_sales.status === 'approved' && _sales.trx_status === 'completed') {
                                window.open("#/invoice/" + sales.id, "_blank");
                            }
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
                    if(_sales.status === 'approved' && _sales.trx_status === 'completed') {
                        window.open("#/invoice/" + data.id, "_blank");
                    }
                });
            }
        }
        catch (err){
            console.log(err)
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to create Sales Record!', life: 3000 });
            navigate("/sales");  
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

    ///// Functions -- End /////

    ///// Events -- Start /////
    ///// Events -- PRODUCT /////
    const resetProductSelection = () => {
        setLastTradePrice(0.00);
        setSelectedProductItem(null);
        setSelectedAddedProduct(null);
        setSelectProductTableItem(null);
        // focus on global filter
        if (globalFilter.current) {
            globalFilter.current.focus();
        }
    };

    const selectProductFromList = product_id => {
        setSelectProductTableItem({ "id": product_id });
    };
    const deselectProductFromList = () => {
        resetProductSelection();
    };

    const onSelectProductFromTable = async (e) => {
        
        let _productSelected = e.value;
        // fetch current stock
        let data = await masterDataDBService.getById("dtProduct", _productSelected.id);
        _productSelected['current_stock'] = data.current_stock;
        _productSelected['price'] = data.price;
        _productSelected['min_trade_price'] = data.min_trade_price;
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

            selectProductFromList(_productSelected.id);
            
            let _product = { 
                ..._productSelected,
                "trade_price": Number(_productSelected.price),
                "current_stock": Number(_productSelected.current_stock),
                "min_trade_price": Number(_productSelected.min_trade_price),
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
        setCustomerBalance(0.00);
        setIncludeDueAmount(false);
        setValue("customer_category", value);

        // need to reload lastTradePrice
        setLastTradePriceTrigger(lastTradePriceTrigger+1);

        // if(value === "WALKIN") {
        //     setShowOptions(false);
        // } else {
        //     setShowOptions(true);
        // }
    };

    const getPartyBalance = (partyId) => {
        console.log("getPartyBalance-PartyID::", partyId);
        if(partyId === null || partyId === undefined || partyId === "") {
            return;
        }
        orderService.getLedgerBalance("dtCustomer", partyId).then(data => {
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
        let _voucher_no = item.last_trx_id?item.last_trx_id:"";
        setCustomerLastOrder(_voucher_no);
        setSelectedCustomer(item);
        getPartyBalance(item.id);
        setLastTradePriceTrigger(lastTradePriceTrigger+1);
    };

    ///// Events -- PRODUCT-FORM /////
    const addSalesItem = item => {
        let _newSales = [...salesItems];
        item['index'] = salesItems.length;
        _newSales.unshift(item);
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
                navigate("/sales");
            });
        } else if (action === 'confirm_conditional_sales') {
            orderService.confirmOrder(sales.id).then(data => {
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Sales Record Committed', life: 3000 });
                navigate("/sales");
                window.open("#/invoice/" + sales.id, "_blank");
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
            if (customerCategory === "CONDITIONAL") {
                if(sales && sales.trx_status === 'pending') {
                    setTrxStatus("completed");
                } else {
                    setTrxStatus("pending");
                }
            } else {
                setTrxStatus("completed");
            }    
    
            console.log("confirm_payment::", formData);
            setConfirmDialogMessage("Are you sure you want to complete this order?");
            setTriggerConfirmDialog(triggerConfirmDialog+1);
        }
    }

    ///// Events -- PAYMENT DIALOG /////
    const confirmPayment = () => {
        setSelAction('confirm_conditional_sales');
        setConfirmDialogMessage("Are you sure you want to complete this order?");
        setTriggerConfirmDialog(triggerConfirmDialog+1);
    }

    const showPaymentDialog = formData => {
        console.log("customerCategory::", customerCategory);
        setSalesData(formData);

        if (customerCategory === "WALKIN" || withPayment) {
            let data = getCalculatedValues()
            console.log("DATA::", data)
            let _customerBalance = 0;
            if(includeDueAmount) {
                _customerBalance = customerBalance;
            }    
            setInitPayment({
                ...emptyPayment,
                ...{
                    "previous_balance": _customerBalance,
                    "invoice_amount": data.net,
                    "current_balance": data.net + _customerBalance,
                    "cash_amount": 0,
                    "bank_amount": 0,
                    "mfs_amount": 0,
                    "amount": 0,
                }
            });
        
            console.log("InitPayment::", initPayment);
            setPaymentDlgTrigger(paymentDlgTrigger + 1);
        } else {
            onSubmit('approve', formData)
        }
    }

    const onPaymnetCallback = (data) => {
        console.log("onPaymnetCallback", data);
        setSalesDue(Number(data.current_balance))
        setSalesPaid(Number(data.amount))
        setPaymentData(data);
        if(customerCategory === "CONDITIONAL") {
            onSubmit('confirm_payment', salesData);
        } else {
            onSubmit('approve', salesData);
        }
    }

    ///// Events -- RETURN /////
    useEffect(() => {
        // calculate returned amount
        let _returnedAmount = 0.00;
        console.log("selectedReturnItems::", selectedReturnItems);
        selectedReturnItems.forEach(item => {
            _returnedAmount += item.return_qty * item.trade_price;
        });
        setReturnedAmount(_returnedAmount);
    }, [selectedReturnItems]);

    const hideReturnDialog = () => {
        setReturnDialog(false);
    };

    const submitReturnItems = () => {
        console.log("COFIRM RETURN ITEMS::", selectedReturnItems);
        orderService.return(SALES_MODEL, sales.id, selectedReturnItems).then(data => {
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Purchase Record Created', life: 3000 });
            navigate("/sales");
            window.open("#/invoice/" + sales.id, "_blank");
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
        returnItem['created_at'] = moment();
        // check if already added
        for(let i=0; i<selectedReturnItems.length; i++) {
            if(selectedReturnItems[i].product_id === returnItem.product_id) {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Item already added!', life: 3000 });
                return;
            }
        }
        // calculate return amount
        returnItem['return_amount'] = returnItem.return_qty * returnItem.trade_price;
        setReturnedAmount(returnedAmount + returnItem.return_amount);
        // add to return items
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

    const brandFilterTemplate = (options) => {
        return <Dropdown value={options.value} optionValue="id" optionLabel="name" options={dtProductBrands} onChange={(e) => options.filterApplyCallback(e.value, options.index)} placeholder="Select Brand" className="p-column-filter" />;
    };

    const modelFilterTemplate = (options) => {
        return <Dropdown value={options.value} optionValue="id" optionLabel="name" options={dtProductModels} onChange={(e) => options.filterApplyCallback(e.value, options.index)} placeholder="Select Model" className="p-column-filter" />;
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

    const renderProductSelectionTable = () => {
        return (
            <>
            {editMode && <div className="card col-12 md:col-12">
                <SelectMasterDataTableList displayField="name"
                    caption="Select Product"
                    modelName={PRODUCT_MODEL} 
                    fieldValue=""
                    globalFilter={globalFilter}
                    scrollHeight="300px"
                    defaultFilters={defaultProductFilters}
                    selectedItem={selectProductTableItem}
                    onSelect={onSelectProductFromTable}
                    columns={[
                        {field: 'name', header: 'Product Name', filterPlaceholder: 'Filter by Product Name', width: '50rem'}, 
                        {field: 'code', header: 'Product Code', filterPlaceholder: 'Filter by Product Code', width: '15rem'},
                        {field: 'dtProductBrand_id', header: 'Brand Name', body: brandNameBodyTemplate, filterPlaceholder: 'Filter by Barnd Name', filterElement: brandFilterTemplate, width: '15rem'},
                        {field: 'dtProductModel_id', header: 'Model No', body: modelNoBodyTemplate, filterPlaceholder: 'Filter by Model No', filterElement: modelFilterTemplate, width: '15rem'},
                        {field: 'part_number', header: 'Part Number', filterPlaceholder: 'Filter by Part Number', width: '15rem'},
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
                <Button type="submit" label="Confirm Sales" className="p-button p-button-info" 
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
    
    const [withPayment, setWithPayment] = useState(true);

    const [includeDueAmount, setIncludeDueAmount] = useState(false);

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
                {customerCategory === "WALKIN" && <div className="field col-12 md:col-5">
                    <label>Last Voucher</label>
                    <InputText value={latestSaleVoucher} readOnly={true}/>
                </div>}

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
                <div className="field col-12 md:col-12">
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
                {(customerCategory !== "WALKIN") && (<div className="grid col-12 md:col-12">
                <div className="field col-12 md:col-6">
                {readOnly && <>
                    <label>Customer</label>
                    <InputText readonly="true" value={masterDataDBService.getShortnameById("dtCustomer", sales.party_id)} placeholder="empty" />
                </>}
                {!readOnly && <Controller
                    name="party_id"
                    control={control}
                    rules={{ required: 'Customer is required.' }}
                    render={({ field, fieldState }) => (
                    <>
                        <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Customer*</label>
                        <Customer field={field} fieldState={fieldState} onSelect={onCustomerSelect} />
                        {getFormErrorMessage(field.name)}
                    </>
                )}/>}
                </div>
                <div className="field col-12 md:col-3">
                    <label>Last Voucher</label>
                    <InputText value={latestSaleVoucher} readOnly={true}/>
                </div>
                <div className="field col-12 md:col-3">
                    <label>Balance</label>
                    <InputText value={customerBalance} readOnly={true}/>
                </div>
                {customerCategory !== "WALKIN" && <div className="field col-12 md:col-6">
                    <InputSwitch inputId="withPayment" checked={customerCategory === "CONDITIONAL"} onChange={(e) => setWithPayment(e.value)} />
                    <label htmlFor="withPayment">With Payment</label>
                </div>}
                {(customerCategory === "REGISTERED") && 
                <div className="field col-12 md:col-6">
                    <InputSwitch inputId="includeDueAmount" checked={true} onChange={(e) => setIncludeDueAmount(e.value)} />
                    <label htmlFor="includeDueAmount">Include Due Amount</label>
                </div>}
                </div>)}
            </>
        )
    }

    const totalPriceBodyTemplate = (rowData) => {
        return (
           <>
               {rowData.return_qty * rowData.trade_price}
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

    const returnQtyBodyTemplate = (rowData) => {
        return (
            <>
                {parseInt(rowData.return_qty)}
            </>
        );
    };

    const renderReturnUI = () => {
        return (
            <>
            {selectedReturnItems && selectedReturnItems.length>0 && <div className="col-12">
            <h5>New Returns:</h5>
            <label><b>Returning Amount : </b></label>
            <InputText readOnly="true" value={returnedAmount}/>
            <br></br>
            <DataTable value={selectedReturnItems} stripedRows showGridlines scrollable scrollHeight="25rem" >
                <Column body={renderActionBodyTemplate} frozen headerStyle={{ minWidth: '6.4rem' }}></Column>
                <Column field="product_name" header="Product Name" sortable></Column>
                <Column field="return_qty" header="Returned Qty" body={returnQtyBodyTemplate} sortable></Column>
                <Column field="trade_price" header="Trade Price" sortable></Column>
                <Column field="return_amount" header="Total Amount" sortable></Column>
                <Column field="reason" header="Reason" sortable></Column>
                {/* <Column field="code" header="Code" sortable></Column>
                <Column field="brand_name" header="Brand Name" sortable></Column>
                <Column field="model_no" header="Model No." sortable></Column>
                <Column field="part_number" header="Part Number" sortable></Column> */}
            </DataTable>
            
        </div>}

        {returnItems && returnItems.length>0 && <div className="col-12">
            <h5>Returned Items:</h5>
            <DataTable value={returnItems} stripedRows showGridlines scrollable scrollHeight="25rem" >
                <Column field="product_name" header="Product Name" sortable></Column>
                <Column field="code" header="Code" sortable></Column>
                <Column field="brand_name" header="Brand Name" sortable></Column>
                <Column field="model_no" header="Model No." sortable></Column>
                <Column field="part_number" header="Part Number" sortable></Column>
                <Column field="return_qty" header="Returned Qty" sortable></Column>
                <Column field="trade_price" header="Trade Price" sortable></Column>
                <Column field="" header="Total Price" body={totalPriceBodyTemplate} sortable></Column>
                <Column field="reason" header="Reason" sortable></Column>
                <Column field="created_at" header="Returned Date" sortable></Column>
            </DataTable>
            <br></br>
            <label><b>Total Returned Price : </b></label>
            <InputText readOnly="true" value={totalReturnedAmount}/>
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
        <div style={{marginBottom:"1rem"}}>
            {!sales && <Button className="p-button-outlined" label="Go to Sales List" 
                            onClick={() => navigate("/sales")}/>}
            <div style={{textAlign:"center",display:"inline-block"}}>
                <h5 style={{marginLeft:"0.5rem"}}>Sale Detail :: VoucherNo ({trxNo}) 
                    {sales && <Tag severity="warning" value={sales.status}></Tag>}</h5>
            </div>
        </div>
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
            onChangeGross={(value)=> setSalesGross(value)}
            onChangeDiscount={(value)=> setSalesDiscount(value)}
            onChangeNet={(value)=> setSalesNet(value)}
            vat={sales===undefined?0:sales.duty_vat} 
            deliveryCost={sales===undefined?0:sales.transport}
            addDiscount={sales===undefined?0:sales.additional_discount}
            gross={sales===undefined?0:sales.gross} 
            net={sales===undefined?0:sales.net} 
            discount={sales===undefined?0:sales.discount}
            lastTradePrice={lastTradePrice}
            Id={Id}
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