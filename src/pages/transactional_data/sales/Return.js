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
import { PRODUCT_MODEL, SALES_MODEL, CUSTOMER_MODEL } from '../../../constants/models';

import { TransactionService } from '../../../services/TransactionService';
import { ProductService } from '../../../services/ProductService';

import SalesReturnProductForm from './components/SalesReturnProductForm';
import SalesReturnProductDetail from './components/SalesReturnProductDetail';
import SalesProductDetailReturn from './components/SalesProductDetailReturn';

const Form = ({ salesId }) => {

    const modelName = SALES_MODEL;

    let navigate = useNavigate();

    let defaultFormValues = {
        notes: '',
        dtCustomer_id: '',
        customerCategory: 'WALKIN',
        customerMobileNumber: '',
        customerName: '',
    };

    // let defaultValue = {
    //     _id: null,
    //     date: Date.now(),
    //     customerCategory: "WALKIN",
    //     dtCustomer_id: null,
    //     notes: '',
    //     items: [],
    //     totalQuantity: 0,
    //     totalPrice: 0.00,
    //     totalDiscount: 0.00,
    //     deliveryCost: 0.00,
    //     vat: 0.00,
    //     netAmount: 0.00,
    //     isPaid: false,
    //     dueAmount: 0.00,
    //     payment: {}
    // };

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

    const [sales, setSales] = useState([]);
    const [salesReturn, setSalesReturn] = useState([]);
    const [salesData, setSalesData] = useState([]);
    const [voucherNo, setVoucherNo] = useState('');
    const [selectedItem, setSelectedItem] = useState({});
    const [selectedTableItem, setSelectedTableItem] = useState({});
    const [selectedProduct, setSelectedProduct] = useState(defaultSalesProduct);
    const [deleteProductDialog, setDeleteSalesProductDialog] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedCustomer_currency] = useState("INR");
    const [customerCategory, setCustomerCategory] = useState("WALKIN");
    const [updateSaleItemMode, setUpdateSaleItemMode] = useState(false);
    const [trigger, setTrigger] = useState(0);

    const transactionService = new TransactionService();
    const productService = new ProductService();

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
        transactionService.getById(modelName, salesId).then(data => {
            setSalesData(data);
            setSales(data.items);
        });  
    }, []);

    const onSubmit = (formData) => {
        // paymentDialog(true);
        if(sales.length === 0) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'No Product Added', life: 3000 });
            return;
        }

        if(customerCategory !== "CONDITIONAL") {
            setTrigger((trigger) => trigger + 1);
            return;
        }

        onPaymnetSubmit({});
    };

    const onPaymnetSubmit = (paymentData) => {
        let formData = {};

        formData.items = sales;
        formData.totalQuantity = totalQuantity;
        formData.totalPrice = totalPrice;
        formData.totalDiscount = totalDiscount;
        formData.totalDiscountedAmount = totalDiscountedAmount;
        formData.deliveryCost = 0.00;
        formData.vat = vat;
        formData.netAmount = netAmount;
        formData.payment = paymentData;
        formData.dueAmount = paymentData.dueAmount;
        formData.isPaid = paymentData.dueAmount === 0.00;

        try {
            transactionService.processTransaction(ON_SALES_PRODUCT, formData).then(data => {
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Sale Record Created', life: 3000 });
                navigate("/sales");
            });
        }
        catch (err){
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Sale Record Created', life: 3000 });
            navigate("/sales");
        }
    };

    const gotoList = () => {
        navigate("/sales");
    };

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    const addToSalesReturnList = (addedItem) => {
        let newSalesReturn = [...salesReturn];
        addedItem['index'] = salesReturn.length;
        newSalesReturn.push(addedItem);
        setSalesReturn(newSalesReturn);
        // calculateTotals(newSales);
        // clearProductSelection();
    };

    const addToSaleList = (addedItem) => {
        let newSales = [...sales];
        addedItem['index'] = sales.length;
        newSales.push(addedItem);
        setSales(newSales);
        calculateTotals(newSales);
        clearProductSelection();
    };

    const updateSalelist = (dtSalesProduct) => {
        let newSales = [...sales];
        newSales[selectedProduct.index] = dtSalesProduct;
        setSales(newSales);
        calculateTotals(newSales);
        clearProductSelection();
    };

    const onVATChange = (vatPercentage) => {
        setVatPercentage(vatPercentage);
        let newSales = [...sales];
        calculateTotals(newSales);
    };

    const onDeliveryCostChange = (deliveryCost) => {
        setDeliveryCost(deliveryCost);
        let newSales = [...sales];
        calculateTotals(newSales);
    };

    const clearProductSelection = () => {
        setSelectedProduct(defaultSalesProduct);
        setSelectedItem({});
        setSelectedTableItem({});
        setUpdateSaleItemMode(false);
    };

    const clearAll = () => {
        setSales([]);
        setTotalPrice(0.00);
        setTotalDiscount(0.00);
        setTotalQuantity(0);
        setVat(0.00);
        setDeliveryCost(0.00);
        setVatPercentage(0.00);
        setNetAmount(0.00);
        setCustomerCategory("WALKIN");
        setSelectedCustomer(null);
        reset(defaultFormValues);
    };

    const removeItem = () => {
        let newSalesReturn = [...salesReturn];
        newSalesReturn.splice(selectedProduct.index, 1);
        setSalesReturn(newSalesReturn);
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
        setSelectedProduct(dtSalesProduct);
        setSelectedTableItem({ "_id": dtSalesProduct.dtProduct_id });
        setUpdateSaleItemMode(true);
    };

    const onCustomerSelect = (selectedRow) => {
        setSelectedCustomer(selectedRow);
    };

    const onCustomerCategoryChange = (value) => {
        setCustomerCategory(value);
        if(value === "WALKIN") {
            setSelectedCustomer('');
            setValue('dtCustomer_id', '');
            setValue('notes', '');
            setValue('customerMobileNumber', '');
            setValue('customerName', '');
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
            sales.forEach(sale => {
                if(sale.dtProduct_id === productSelected._id) {
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

            setSelectedTableItem({ "_id": productSelected._id });
            setSelectedItem(productSelected);
        } else {
            toast.current.show({ severity: 'warn', summary: 'Please Select Customer', detail: 'Select a Customer First', life: 3000 });
        }
    }

    let defaultFilters = {
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
        <h5><Button onClick={() => gotoList()} className="p-button-outlined" label="Go Back" /> Sale Detail</h5>
        <div className="card col-12 md:col-12">
            <SalesReturnProductDetail sales={sales}
                totalPrice={totalPrice} netAmount={netAmount} 
                totalDiscount={totalDiscountedAmount} 
                vat={vat} onVATChange={onVATChange}
                onDeliveryCostChange={onDeliveryCostChange}
                onEdit={(dt) => editSalesProduct(dt)} 
                onDelete={(dt) => confirmDeleteSalesProduct(dt)}
            />
        </div>
        <div className="card col-12 md:col-12">
            <div className="p-fluid formgrid grid">
                <div className="field col-12 md:col-4">
                    <label>Voucher No</label>
                    <InputText value={voucherNo}  readOnly={true}/>
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
                    <Button type="submit" label="Submit Order" className="p-button p-button-success" 
                        onClick={handleSubmit((d) => onSubmit(d))}
                    />
                </div>
            </div>
        </div>
    </div>
    <div className="card col-7" >
        <SalesReturnProductForm 
            onAdd={(dt) => addToSalesReturnList(dt)} 
            // onEdit={(dt) => updateSalelist(dt)}
            onCancel={() => clearProductSelection()}
            currency={selectedCustomer_currency} 
            defaultSalesProduct={defaultSalesProduct} 
            selectedItem={selectedItem}
            selectedProduct={selectedProduct}
            />
        <SalesProductDetailReturn sales={salesReturn}
            // onEdit={(dt) => editSalesProduct(dt)}
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
}
                 
export default Form;