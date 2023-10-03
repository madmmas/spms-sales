import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller, set } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';
import { classNames } from 'primereact/utils';
import { Dialog } from 'primereact/dialog';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputNumber } from 'primereact/inputnumber';

import SelectMasterData from '../../components/SelectMasterData';

import { PURCHASE_MODEL, SUPPLIER_MODEL } from '../../../constants/models';

import { OrderService } from '../../../services/OrderService';
import { MasterDataService } from '../../../services/MasterDataService';
import { ConfigurationService } from '../../../services/ConfigurationService';

import PurchaseProductForm from './components/PurchaseProductForm';
import PurchaseProductDetail from './components/PurchaseProductDetail';
import ReturnItemDialog from '../../components/ReturnItemDialog';
import ConfirmDialog from '../../components/ConfirmDialog';
import moment from 'moment';

const Form = ({ purchase }) => {

    let navigate = useNavigate();

    let defaultValue = {
        id: null,
        party_type: 'dtSupplier',
        party_id: null,
        currency: null,
        cnf: null,
        be_no: null,
        lc_no: null,
        notes: null,
    };

    let defaultPurchaseProduct = {
        product_id: "", // select product
        warehouse_id: "", // select warehouse
        bar_code: "", // fetch from selected product
        last_purchase_price: 0.00, // fetch from selected product

        quantity: 1,  
        unit_cost_f: 0.00,
        totalCostF: 0.00,
        conversion_rate: 1,
        unit_cost: 0.00,
        totalCostBDT: 0.00,

        transport: 0.00,
        duty_vat: 0.00,

        netUnitCostBDT: 0.00,
        netCostBDT: 0.00,

        discount_profit: 0,
        profit: 0.00,

        trade_price: 0.00,

        min_trade_price: 0.00,
    };

    const toast = useRef(null);

    const [purchases, setPurchases] = useState([]);
    const [purchaseData, setPurchaseData] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(defaultPurchaseProduct);
    const [returnDialog, setReturnDialog] = useState(false);
    const [statusChangeDialog, setStatusChangeDialogFooter] = useState(false);
    const [supplierId, setSupplierId] = useState(null);
    const [selectedSupplier_currency, setSelectedSupplier_currency] = useState("INR");
    const [trxNo, setTrxNo] = useState('XXXXX');
    const [dialogMsg, setDialogMsg] = useState('');
    const [status, setStatus] = useState('draft');
    const [editMode, setEditMode] = useState(true);

    const [conversionRate, setConversionRate] = useState(1);

    const [returnMode, setReturnMode] = useState(false);
    const [selectedReturnItem, setSelectedReturnItem] = useState({});
    const [selectedReturnItems, setSelectedReturnItems] = useState([]);
    const [returnItems, setReturnItems] = useState([]);
    const [trigger, setTrigger] = useState(false);

    const [defaultWarehouse, setDefaultWarehouse] = useState(null);
    
    const [triggerRemoveItem, setTriggerRemoveItem] = useState(0);

    const orderService = new OrderService();
    const masterDataService = new MasterDataService();
    const configurationService = new ConfigurationService();

    const {
        reset,
        control,
        formState: { errors },
        setValue,
        handleSubmit
    } = useForm({
        defaultValues: defaultValue
    });

    useEffect(() => {
        // get default warehouse
        masterDataService.getDefaultItem('dtWarehouse').then(data => {
            if(data){
                console.log("DEFAULT WAREHOUSE::", data);
                setDefaultWarehouse(data._id);    
            }
        });
        if (purchase===null || purchase===undefined) {
            if (trxNo === 'XXXXX') {
                configurationService.getNextId(PURCHASE_MODEL).then(data => {
                    setTrxNo(data.nextID);
                    console.log("NEXT ID::", data.nextID);
                });
            }
        } else {
            console.log("FETCHED-PURCHASE::", purchase);
            let conversionRate = purchase.conversion_rate || 1;
            reset({
                id: purchase.id,
                party_type: purchase.party_type,
                party_id: purchase.party_id,
                currency: purchase.currency,
                conversion_rate: conversionRate,
                cnf: purchase.cnf,
                be_no: purchase.be_no,
                lc_no: purchase.lc_no,
                notes: purchase.notes,
            });
            setSelectedSupplier_currency(purchase.currency);
            setPurchases(purchase.items);
            setReturnItems(purchase.return_items);
            // calculateTotals(purchase.items);
            setConversionRate(conversionRate);
            setTrxNo(purchase.voucher_no);
            setEditMode(purchase.status === 'draft');
            setReturnMode(purchase.status === 'approved');
            console.log("EDIT MODE:::=>", purchase.status, purchase.status === 'draft');
        }

        console.log("EDIT MODE::", editMode);
    }, [purchase]);

    const confirmReturnItems = () => {
        if (selectedReturnItems.length === 0) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Please select at least one item to return', life: 3000 });
            return;
        }
        setReturnDialog(true);
    };

    const submitReturnItems = () => {
        console.log("COFIRM RETURN ITEMS::", selectedReturnItems);
        orderService.return(PURCHASE_MODEL, purchase.id, selectedReturnItems).then(data => {
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Purchase Record Created', life: 3000 });
            navigate("/purchases");
        });
    };

    const onSubmit = (action, formData) => {
        if(action === 'save'){
            setStatus('draft');
            submitForm(formData);
        } else {
            if(purchases.length === 0){
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Please add at least one product to purchase', life: 3000 });
                return;
            }
            if(action === 'approve'){
                setStatus('approved');
                setDialogMsg('Are you sure you want to approve this purchase?');
            } else if(action === 'cancel'){
                setStatus('cancelled');
                setDialogMsg('Are you sure you want to cancel this purchase?');
            }
            // show confirmation dialog
            setStatusChangeDialogFooter(true);
            // save the form data
            setPurchaseData(formData);
        }
    };

    const sumbitFormData = () => {
        submitForm(purchaseData);
    };

    const submitForm = (formData) => {
        formData.status = status;
        formData.currency = selectedSupplier_currency;
        formData.voucher_no = trxNo;

        formData.items = purchases;

        let totalCostAmountBDT = 0;
        let totalTransport = 0;
        let totalDuty = 0;
        let netCostAmountBDT = 0;

        for(let i=0; i<purchases.length; i++) {
            totalCostAmountBDT += purchases[i].totalCostBDT;
            totalTransport += purchases[i].transport;
            totalDuty += purchases[i].duty_vat;
            netCostAmountBDT += purchases[i].netCostBDT;
        }

        formData.gross = totalCostAmountBDT;
        formData.transport = totalTransport;
        formData.duty_vat = totalDuty;
        formData.net = netCostAmountBDT;

        console.log("FORMDATA::", formData);

        try {
            if(purchase){
                if(status === 'approved'){
                    orderService.commit(PURCHASE_MODEL, purchase.id, formData).then(data => {
                        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Purchase Record Created', life: 3000 });
                        navigate("/purchases");
                    });
                } else {
                    orderService.update(PURCHASE_MODEL, purchase.id, formData).then(data => {
                        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Purchase Record Created', life: 3000 });
                        navigate("/purchases");
                    });
                }
            } else {
                orderService.create(PURCHASE_MODEL, formData).then(data => {
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Purchase Record Created', life: 3000 });
                    navigate("/purchases");
                });
            }
        }
        catch (err){
            console.log(err)
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to create Purchase Record!', life: 3000 });
            // navigate("/purchases");  
        }
    };

    const gotoList = () => {
        navigate("/purchases");
    };

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    const addToPurchaseList = async (addedItem) => {
        // check if already added
        console.log("OOO-PURCHASES::", purchases);
        for(let i=0; i<purchases.length; i++) {
            console.log("PURCHASES::", purchases[i]);
            if(purchases[i].product_id === addedItem.product_id) {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Item already added!', life: 3000 });
                return;
            }
        }

        let newPurchases = [...purchases];
        addedItem['index'] = purchases.length;
        newPurchases.push(addedItem);
        console.log("NEWPURCHASE::", newPurchases);
        setPurchases(newPurchases);
        console.log("PURCHASES::", purchases);
        // calculateTotals(newPurchases);
    };

    const updatePurchaselist = (dtPurchaseProduct) => {
        let newPurchases = [...purchases];
        newPurchases[selectedProduct.index] = dtPurchaseProduct;
        console.log("EDIT::", dtPurchaseProduct);
        setPurchases(newPurchases);
        // calculateTotals(newPurchases);
    };

    const removeItem = () => {
        let newPurchases = [...purchases];
        newPurchases.splice(selectedProduct.index, 1);
        setPurchases(newPurchases);
        // setDeletePurchaseProductDialog(false);
    };

    const editPurchaseProduct = (dtPurchaseProduct) => {
        console.log("EDIT::", dtPurchaseProduct);
        setSelectedProduct({...dtPurchaseProduct});
        console.log("SET SELECTED PRODUCT::", selectedProduct);
    };

    const hideReturnDialog = () => {
        setReturnDialog(false);
    };

    const hideStatusChangeDialog = () => {
        setStatus('draft');
        setStatusChangeDialogFooter(false);
    };

    const returnDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideReturnDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={submitReturnItems} />
        </>
    );

    const statusChangeDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideStatusChangeDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={sumbitFormData} />
        </>
    );

    const onSupplierSelect = (selectedRow) => {
        console.log("SELECTED SUPPLIER::", selectedRow, selectedRow._id);
        setSupplierId(selectedRow._id);
        setSelectedSupplier_currency(selectedRow.currency);
    };

    const onReturnItem = (selectedRow) => {
        console.log("SELECTED RETURN ITEM::", selectedRow);
        setSelectedReturnItem(selectedRow);
        setTrigger((trigger) => trigger + 1);
    };

    const onAddReturnItem = (returnItem) => {
        console.log("SELECTED RETURN ITEM::", returnItem);
        // add index to return item
        returnItem['index'] = selectedReturnItems.length;
        // add timestamp
        // returnItem['created_at'] = new Date();
        returnItem['created_at'] = moment();
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

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => onDeleteFromReturnList(rowData)} />
            </>
        );
    };

    const showConfirmDialog = (dlgName) => {
        if(dlgName === 'removeItem') {
            setTriggerRemoveItem((triggerRemoveItem) => triggerRemoveItem + 1);
        }
    };

    return (

<div className="grid h-screen">    
    <Toast ref={toast} />    
    <div className="col-3">
        <div class="card">
            {!purchase && <Button onClick={() => gotoList()} className="p-button-outlined" label="Go to Purchase List" /> }
            <h5>Purchase Detail :: VoucherNo ({trxNo}) {purchase && <Tag severity="warning" value={purchase.status}></Tag>}</h5>
            
            <div className=" col-12 md:col-12">
                <div className="p-fluid formgrid grid">
                    
                    <div className="field col-12">
                        {!editMode && <>
                            <label>Supplier Name</label>
                            <InputText readonly="true" value={purchase.party_id} placeholder="empty" />
                        </>}
                        {editMode && <Controller
                            name="party_id"
                            control={control}
                            rules={{ required: 'Supplier is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Supplier*</label>
                                <SelectMasterData field={field} modelName={SUPPLIER_MODEL}
                                    displayField="name"
                                    onSelect={onSupplierSelect}
                                    className={classNames({ 'p-invalid': fieldState.error })} 
                                    columns={[
                                        {field: 'name', header: 'Supplier Name', filterPlaceholder: 'Filter by Supplier Name'}
                                    ]} />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>}
                    </div>
                    <div className="field col-12">
                        <label htmlFor="fldSupplierCurrency">Supplier Currency</label>
                        <InputText readonly="true" value={selectedSupplier_currency} placeholder="Currency" />
                    </div>
                    <div className="field col-12">
                    <Controller
                        name="conversion_rate"
                        control={control}
                        rules={{ required: 'Conversion Rate is required.' }}
                        render={({ field, fieldState }) => (
                            <>
                        <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Conversion Rate</label>
                        <InputNumber 
                            inputId={field.name} value={field.value} inputRef={field.ref} 
                            className={classNames({ 'p-invalid': fieldState.error })}
                            onChange={(e) => {
                                setConversionRate(e.value);
                                field.onChange(e.value)
                            }}
                            min={1} maxFractionDigits={2}
                            />
                            </>
                        )}/>
                    </div>   
                    <div className="field col-12">
                        {!editMode && <>
                            <label>CnF</label>
                            <InputText readonly="true" value={purchase.cnf} placeholder="empty" />
                        </>}
                        {editMode && <Controller

                            name="cnf"
                            control={control}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>CnF</label>
                                <InputText inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>}
                    </div>
                    <div className="field col-12">
                        {!editMode && <>
                            <label>B/E No.</label>
                            <InputText readonly="true" value={purchase.be_no} placeholder="empty" />
                        </>}
                        {editMode && <Controller

                            name="be_no"
                            control={control}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>B/E No.</label>
                                <InputText  inputId={field.name} value={field.value} inputRef={field.ref}  className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>}
                    </div>
                    <div className="field col-12">
                        {!editMode && <>
                            <label>LC No.</label>
                            <InputText readonly="true" value={purchase.lc_no} placeholder="empty" />
                        </>}
                        {editMode && <Controller

                            name="lc_no"
                            control={control}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>LC No.</label>
                                <InputText  inputId={field.name} value={field.value} inputRef={field.ref}  className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>}
                    </div>
                    <div className="field col-12">
                        {!editMode && <>
                            <label>Notes</label>
                            <InputText readonly="true" value={purchase.notes} placeholder="empty" />
                        </>}
                        {editMode && <Controller

                            name="notes"
                            control={control}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Notes</label>
                                <InputTextarea inputId={field.name} value={field.value} inputRef={field.ref}  className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} rows={3} cols={20} />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>}
                    </div>
                </div>
            </div>
            {editMode && <>
                <Button type="submit" label="Save as Draft" className="mt-2 m-1" onClick={handleSubmit((d) => onSubmit('save', d))}/>
                <Button type="submit" label="Confirm Purchase" className="mt-2 m-1 p-button-warning" onClick={handleSubmit((d) => onSubmit('approve', d))}/>
                <Button type="submit" label="Cancel Purchase" className="mt-2 m-1 p-button-outlined p-button-warning" onClick={handleSubmit((d) => onSubmit('cancel', d))}/>
            </>}
            {returnMode && <Button type="submit" label="Return Purchases" className="mt-2 m-1 p-button-outlined p-button-warning" onClick={handleSubmit((d) => confirmReturnItems())}/>}
        </div>
    </div>
    <div className="card col-9" >
        {editMode && <div className="col-12">
            <PurchaseProductForm 
                defaultWarehouse={defaultWarehouse}
                onAdd={(dt) => addToPurchaseList(dt)} 
                onEdit={(dt) => updatePurchaselist(dt)}
                currency={selectedSupplier_currency}
                conversionRate={conversionRate}
                supplierId={supplierId}
                defaultPurchaseProduct={defaultPurchaseProduct} 
                selectedProduct={selectedProduct}
                />
        </div>}
        <div className="col-12">
            {purchases && <PurchaseProductDetail 
                editMode={editMode} 
                returnMode={returnMode} onReturnItem={(dt) => onReturnItem(dt)}
                purchases={purchases} 
                supplierCurrency={selectedSupplier_currency} conversion_rate={conversionRate}
                onEdit={(dt) => editPurchaseProduct(dt)} 
                onDelete={() => showConfirmDialog('removeItem')}
            />}
        </div>

        {selectedReturnItems && selectedReturnItems.length>0 && <div className="col-12">
            <h5>New Returns:</h5>
            <DataTable value={selectedReturnItems} stripedRows showGridlines scrollable scrollHeight="25rem" >
                <Column body={actionBodyTemplate} frozen headerStyle={{ minWidth: '6.4rem' }}></Column>
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

        <ConfirmDialog 
            message="Are you sure you want to delete?"
            trigger={triggerRemoveItem}
            onConfirm={removeItem}
            />

        <Dialog visible={returnDialog} style={{ width: '450px' }} header="Confirm" modal footer={returnDialogFooter} onHide={hideReturnDialog}>
            <div className="flex align-items-center justify-content-center">
                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                <span>
                    Are you sure you want to return these products?
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

        <ReturnItemDialog 
            trigger={trigger} 
            selectedReturnItem={selectedReturnItem}
            onAddReturnItem={(dt) => onAddReturnItem(dt)}
            />   
            
    </div>
    </div>
    );
};
                 
export default Form;