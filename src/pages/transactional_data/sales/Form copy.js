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

import SelectConstData from '../../components/SelectConstData';
import SelectMasterDataTableList from '../../components/SelectMasterDataTableList';
import SelectMasterData from '../../components/SelectMasterData';

import { CUSTOMER_CATEGORY } from '../../../constants/lookupData';
import { PRODUCT_MODEL, CUSTOMER_MODEL, SALES_MODEL } from '../../../constants/models';

import PaymentDialog from '../../components/PaymentDialog';

import SalesProductForm from './components/SalesProductForm';
import SalesProductDetail from './components/SalesProductDetail';
import SalesProductTotal from './components/SalesProductTotal';

import { ConfigurationService } from '../../../services/ConfigurationService';
import { OrderService } from '../../../services/OrderService';

const Form = React.memo(({ sales }) => {

    let navigate = useNavigate();

    let defaultFormValues = {
        notes: '',
        party_id: '',
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
    };

    const toast = useRef(null);

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

    const [salesData, setSalesData] = useState([]);

    const [status, setStatus] = useState('draft');
    const [trxStatus, setTrxStatus] = useState('pending');
    const [statusChangeDialog, setStatusChangeDialogFooter] = useState(false);

    const [editMode, setEditMode] = useState(false);

    const [dlgTrigger, setDlgTrigger] = useState(0);
    const [paymentData, setPaymentData] = useState([]);
    const [initPayment, setInitPayment] = useState(emptyPayment);

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
                });
            }
            setEditMode(true);
        } else {
            console.log("FETCHED-SALES::", sales);        
            reset({
                id: sales.id,
                party_id: sales.party_id,
                customer_category: sales.customer_category,
                customer_phone: sales.customer_phone,
                customer_name: sales.customer_name,
                notes: sales.notes,
            });
            setSalesItems(sales.items);
            setTrxNo(sales.voucher_no);
            setEditMode(sales.status === 'draft');
            setCustomerCategory(sales.customer_category);
            // console.log("EDIT MODE:::=>", sales.status, sales.status === 'draft');
        }
    }, [sales]);

    const onPaymnetCallback = (data) => {
        console.log("onPaymnetCallback", data);
        setPaymentData(data);
        sumbitFormData();
    }

    const onSubmit = (action, formData) => {
        if(action === 'save'){
            setStatus('draft');
            submitForm(formData);
        } else {
            if(salesItems.length === 0) {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'No Product Added', life: 3000 });
                return;
            }
            if(action === 'approve'){
                setStatus('approved');
                if(customerCategory === "CONDITIONAL") {
                    setTrxStatus("pending");
                } else {
                    setTrxStatus("completed");
                }
        
                setDialogMsg('Are you sure you want to approve this sales?');
            } else if(action === 'cancel'){
                setStatus('cancelled');
                setTrxStatus("cancelled");
                setDialogMsg('Are you sure you want to cancel this sales?');
            }
            // show confirmation dialog
            setStatusChangeDialogFooter(true);
            // save the form data
            setSalesData(formData);
        }
    }

    const ifPaymentDialog = (d) => {
        console.log("customerCategory::", customerCategory);
        if (customerCategory === "REGISTERED") {
            // setShowPaymentDialog(true);
            // sumbitFormData();
            onSubmit('approve', d)
        } else if (customerCategory === "WALKIN") {
            console.log("salesData:::", salesData)
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
            setDlgTrigger(dlgTrigger + 1);
        } else if(customerCategory === "CONDITIONAL") {
            // sumbitFormData();
            onSubmit('approve', d);
        }
    }

    const sumbitFormData = () => {
        console.log("sumbitFormData::", salesData);
        submitForm(salesData);
    };

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

    const submitForm = (formData) => {

        formData.party_type = CUSTOMER_MODEL;
        formData.status = status;
        formData.trx_status = trxStatus;
        formData.voucher_no = trxNo;

        formData.items = salesItems;

        formData = {
            ...formData,
            ...getCalculatedValues()
        }
        // save only for WALKIN
        if(customerCategory=="WALKIN"){
            formData.payment = paymentData
        }
        console.log(formData)
        try {
            if (sales) {
                if(status === 'approved'){
                    orderService.commit(SALES_MODEL, sales.id, formData).then(data => {
                        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Sales Record Committed', life: 3000 });
                        // navigate("/sales");
                    });
                } else {
                    orderService.update(SALES_MODEL, sales.id, formData).then(data => {
                        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Sales Record Updated', life: 3000 });
                        navigate("/sales");
                    });
                }
             
            } else {
                orderService.create(SALES_MODEL, formData).then(data => {
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
        clearProductSelection();
    };

    const updateSalelist = (dtSalesProduct) => {
        let newSales = [...salesItems];
        newSales[selectedProduct.index] = dtSalesProduct;
        setSalesItems(newSales);
        clearProductSelection();
    };

    const clearProductSelection = () => {
        setSelectedProduct(defaultSalesProduct);
        setSelectedItem({});
        setSelectedTableItem({});
        setUpdateSaleItemMode(false);
    };

    const clearAll = () => {
        setSalesItems([]);
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
            setValue('party_id', '');
            setValue('notes', '');
            setValue('customer_phone', '');
            setValue('customer_name', '');
        }
    };

    const onSelection = async (e) => {
        let productSelected = e.value;
        console.log("productSelected::", productSelected);
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
            let selProduct = { 
                ...productSelected,  
                "unit_cost": Number(productSelected.cost),
                "trade_price": Number(productSelected.price),
                "current_stock": Number(productSelected.current_stock),
            };

            setSelectedItem(selProduct);
        } else {
            toast.current.show({ severity: 'warn', summary: 'Please Select Customer', detail: 'Select a Customer First', life: 3000 });
        }
    }

    let defaultFilters = {
        fields: ['id', 'name', 'code', 'bar_code', 'brand_name', 'model_no', 'part_number', 'current_stock', 'cost', 'price'],
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

    const hideStatusChangeDialog = () => {
        setStatus('draft');
        setStatusChangeDialogFooter(false);
    };

    const deleteProductDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteSalesProductDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={removeItem} />
        </>
    );

    const statusChangeDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideStatusChangeDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={ifPaymentDialog} />
        </>
    );


    return (

    <div className="grid h-screen">    
    <Toast ref={toast} />    
    <div className="card col-5">
    {!sales && <Button onClick={() => gotoList()} className="p-button-outlined" label="Go to Sales List" /> }
        <h5>Sale Detail :: VoucherNo ({trxNo}) {sales && <Tag severity="warning" value={sales.status}></Tag>}</h5>
        {editMode && <div className="card col-12 md:col-12">
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
        </div>}
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

                {(customerCategory === "WALKIN") && (<div className="grid col-12 md:col-12">
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
                    <InputText  readOnly={true}/>
                </div>
                </div>)}

                <>
                    <div className="field col-12 md:col-2">
                        <Button type="submit" label="Clear" className="p-button-outlined p-button-warning" 
                            onClick={() => clearAll()}
                        />
                    </div>
                    <div className="field col-12 md:col-3">
                        <Button type="submit" label="Cancel Order" className="p-button-outlined p-button-danger" 
                            onClick={handleSubmit((d) => onSubmit('cancel', d))}
                        />
                    </div>
                    <div className="field col-12 md:col-3">
                        <Button type="submit" label="Save Order" className="p-button p-button-success" 
                            onClick={handleSubmit((d) => onSubmit('save', d))}
                        />
                    </div>
                    <div className="field col-12 md:col-4">
                        <Button type="submit" label="Confirm Order" className="p-button p-button-info" 
                            onClick={handleSubmit((d) => ifPaymentDialog(d) )}
                        />
                    </div>
                </>

            </div>
        </div>
    </div>
    <div className="card col-7" >
        {editMode && <SalesProductForm 
            onAdd={(dt) => addToSaleList(dt)} 
            onEdit={(dt) => updateSalelist(dt)}
            onCancel={() => clearProductSelection()}
            currency={selectedCustomer_currency} 
            defaultSalesProduct={defaultSalesProduct} 
            selectedItem={selectedItem}
            selectedProduct={selectedProduct}
            />}

        <SalesProductDetail salesItems={salesItems}
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

        <Dialog visible={statusChangeDialog} style={{ width: '450px' }} header="Confirm" modal footer={statusChangeDialogFooter} onHide={hideStatusChangeDialog}>
            <div className="flex align-items-center justify-content-center">
                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                <span>
                    ${dialogMsg}
                </span>
            </div>
        </Dialog>

        {/* <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteSalesProductDialog}>
            <div className="flex align-items-center justify-content-center">
                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                <span>
                    Are you sure you want to delete?
                </span>
            </div>
        </Dialog> */}

        <PaymentDialog 
                trigger={dlgTrigger} 
                initPayment={initPayment}
                readOnly={customerCategory==="WALKIN"}
                onPaymnetCallback={onPaymnetCallback}
                />

    </div>     
    </div>
    );
});
                 
export default Form;