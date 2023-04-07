import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { Fieldset } from 'primereact/fieldset';
import { Column } from 'primereact/column';
import { Calendar } from 'primereact/calendar';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';

import ModalPurchaseForm from '../../components/ModalPurchaseForm';
import SelectMasterDataTable from '../../components/SelectMasterDataTable';
import SelectMasterData from '../../components/SelectMasterData';

import { HRService } from '../../../services/HRService';
import { TransactionService } from '../../../services/TransactionService';
import { ON_PURCHASE_PRODUCT } from '../../../constants/transactions';

import { PURCHASE_MODEL, SUPPLIER_MODEL, WAREHOUSES_MODEL } from '../../../constants/models';

const Form = ({purchaseProfile}) => {

    let navigate = useNavigate();

    let defaultPurchaseProduct = {
        dtProduct_id: null, // select product
        barCode: null, // fetch from selected product
        lastPurchasePrice: 0.00, // fetch from selected product

        quantity: 1,  
        unitCostF: 0.00,
        totalCostF: 0.00,
        conversionRate: 1,
        unitCostBDT: 0.00,
        totalCostBDT: 0.00,

        transport: 0.00,
        duty: 0.00,

        netUnitCostBDT: 0.00,
        netCostBDT: 0.00,

        profit: 0.00,

        tradeUnitPriceBDT: 0.00,

        minimumTradePrice: 0.00,
    };

    let defaultValue = {
        _id: null,
        date: Date.now(),
        dtSupplier_id: null,
        currency: null,
        dtWarehouse_id: null,
        CnF: null,
        BENo: null,
        LCNo: null,
        notes: null,
        items: [],
        totalQuantity: 0,
        totalCostAmountF: 0.00,
        totalCostAmountBDT: 0.00,
        totalTransport: 0.00,
        totalDuty: 0.00,
        netCostAmountBDT: 0.00
    };

    const toast = useRef(null);

    const [totalCostAmountF, setTotalAmountF] = useState(0.00);
    const [totalCostAmountBDT, setTotalAmountBDT] = useState(0.00);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [totalTransport, setTotalTransport] = useState(0.00);
    const [totalDuty, setTotalDuty] = useState(0.00);
    const [netCostAmountBDT, setNetAmountBDT] = useState(0.00);
    const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);    
    const [purchases, setPurchases] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(defaultPurchaseProduct);
    const [deleteProfileDialog, setDeleteProfileDialog] = useState(false);
    const [trigger, setTrigger] = useState(0);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [selectedSupplier_currency, setSelectedSupplier_currency] = useState("INR");

    const transactionService = new TransactionService();

    const {
        register,
        control,
        formState: { errors },
        resetField,
        handleSubmit
    } = useForm({
        defaultValues: defaultValue //async () =>  hrManagementService.getById(modelName, PurchaseProfile)
      });

    const onSubmit = (formData) => {
        formData.items = purchases;
        formData.totalCostAmountF = totalCostAmountF;
        formData.totalCostAmountBDT = totalCostAmountBDT;
        formData.totalQuantity = totalQuantity;
        formData.totalTransport = totalTransport;
        formData.totalDuty = totalDuty;
        formData.netCostAmountBDT = netCostAmountBDT;
        console.log("FORMDATA::", formData);

        try {
            transactionService.processTransaction(ON_PURCHASE_PRODUCT, formData).then(data => {
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Purchase Record Created', life: 3000 });
                navigate("/purchases");
            });
        }
        catch (err){
            console.log(err)
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Purchase Record Created', life: 3000 });
            navigate("/purchases");
        }
    };

    const gotoList = () => {
        navigate("/purchases");
    };

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };
    
    const addToPurchaseList = (addedItem) => {
        let newPurchases = [...purchases];
        addedItem['index'] = purchases.length;
        newPurchases.push(addedItem);
        console.log("NEWPURCHASE::", newPurchases);
        setPurchases(newPurchases);
        console.log("PURCHASES::", purchases);
        calculateTotals(newPurchases);
    };

    const removeItem = () => {
        let newPurchases = [...purchases];
        newPurchases.splice(selectedProduct.index, 1);
        setPurchases(newPurchases);
        setDeleteProfileDialog(false);
    };

    const calculateTotals = (allpurchases) => {
        console.log("CALCULATE-PURCHASES::", allpurchases)
        let totalCostAmountF = 0;
        let totalCostAmountBDT = 0;
        let totalTransport = 0;
        let totalDuty = 0;
        let netCostAmountBDT = 0;

        if(allpurchases && allpurchases.length > 0) {
            for(let i=0; i<allpurchases.length; i++) {
                totalCostAmountF += allpurchases[i].totalCostF;
                totalCostAmountBDT += allpurchases[i].totalCostBDT;
                totalTransport += allpurchases[i].transport;
                totalDuty += allpurchases[i].duty;
                netCostAmountBDT += allpurchases[i].netCostBDT;
            }
        }
        setTotalQuantity(purchases.length);
        setTotalAmountBDT(totalCostAmountBDT);
        setTotalAmountF(totalCostAmountF);
        setTotalTransport(totalTransport);
        setTotalDuty(totalDuty);
        setNetAmountBDT(netCostAmountBDT);
        console.log("ALL-TOTAL::", totalQuantity, totalCostAmountF, totalCostAmountBDT, totalTransport, totalDuty, netCostAmountBDT);
    };

    const editProfile = (dtProfile) => {
        setTrigger((trigger) => trigger + 1)
        console.log("EDIT::", dtProfile);
        setSelectedProduct(dtProfile);
        console.log("SET SELECTED PRODUCT::", selectedProduct);
        openPurchaseProductDialog();
    };

    const confirmDeleteProfile = (dtProfile) => {
        // setSelectedProduct(dtProfile);
        setDeleteProfileDialog(true);
    };

    const hideDeleteProfileDialog = () => {
        setDeleteProfileDialog(false);
    };

    const openPurchaseProductDialog = () => {
        
        setShowPurchaseDialog(true);
    };

    const hidePurchaseProductDialog = () => {
        setShowPurchaseDialog(false);
    };

    const deleteProfileDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProfileDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={removeItem} />
        </>
    );

    const header = (
        <div className="table-header">
            <h6 className="p-m-0">Purchase Items</h6>
            <Button onClick={() => openPurchaseProductDialog()} className="p-button-outlined" label="Add Product" />
        </div>
    );

    const footer = (
        <table><tbody>
            <tr>
                <td><b>Total Quantity:</b></td><td>{purchases ? purchases.length : 0} products.</td>
            </tr><tr>
                <td><b>Total Cost ({selectedSupplier_currency}):</b></td><td>{totalCostAmountF}</td>
                <td><b>Total Cost (BDT):</b></td><td>{totalCostAmountBDT}</td>
            </tr><tr>
                <td><b>Total Transport Cost (BDT):</b></td><td>{totalTransport}</td>
                <td><b>Total Duty (BDT):</b></td><td>{totalDuty}</td>
            </tr><tr>
                <td><b>Total Net Cost (BDT):</b></td><td>{netCostAmountBDT}</td>
            </tr>
        </tbody></table>
    );

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editProfile(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteProfile(rowData)} />
            </>
        );
    };

    const onSupplierSelect = (selectedRow) => {
        console.log("SELECTED SUPPLIER::", selectedRow);
        setSelectedSupplier(selectedRow);
        setSelectedSupplier_currency(selectedRow.currency);
    };

    return (
        <div className="form-demo">
            <Toast ref={toast} />
            <div className="card col-12">
                {purchaseProfile==null && <Button onClick={() => gotoList()} className="p-button-outlined" label="Go Back to List" />}
                <h5>{purchaseProfile==null?"New":"Edit"} Purchase</h5>
                <div className=" col-12 md:col-12">
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-3">
                            <Controller
                                name="dtSupplier_id"
                                control={control}
                                rules={{ required: 'Supplier is required.' }}
                                render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Suppier*</label>
                                    <SelectMasterData field={field} modelName={SUPPLIER_MODEL}
                                        displayField="name"
                                        onSelect={onSupplierSelect}
                                        className={classNames({ 'p-invalid': fieldState.error })} 
                                        columns={[
                                            {field: 'name', header: 'Supplier Name', filterPlaceholder: 'Filter by Supplier Name'}
                                        ]} />
                                    {getFormErrorMessage(field.name)}
                                </>
                            )}/>
                        </div>
                        <div className="field col-12 md:col-3">
                            <label htmlFor="fldSupplierCurrency">Supplier Currency</label>
                            <InputText readonly="true" value={selectedSupplier_currency} placeholder="Currency" />
                        </div>
                        <div className="field col-12 md:col-3">
                            <Controller
                                name="dtWarehouse_id"
                                control={control}
                                rules={{ required: 'Warehouse is required.' }}
                                render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Warehouse*</label>
                                    <SelectMasterData field={field} modelName={WAREHOUSES_MODEL}
                                        displayField="name"
                                        onSelect={onSupplierSelect}
                                        className={classNames({ 'p-invalid': fieldState.error })} 
                                        columns={[
                                            {field: 'name', header: 'Warehouse Name', filterPlaceholder: 'Filter by Warehouse Name'}
                                        ]} />
                                    {getFormErrorMessage(field.name)}
                                </>
                            )}/>
                        </div>
                        <div className="field col-12 md:col-3">
                            <Controller
                                name="CnF"
                                control={control}
                                render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>CnF</label>
                                    <InputText  inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                    {getFormErrorMessage(field.name)}
                                </>
                            )}/>
                        </div>
                        <div className="field col-12 md:col-3">
                            <Controller
                                name="BENo"
                                control={control}
                                render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>B/E No.</label>
                                    <InputText  inputId={field.name} value={field.value} inputRef={field.ref}  className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                    {getFormErrorMessage(field.name)}
                                </>
                            )}/>
                        </div>
                        <div className="field col-12 md:col-3">
                            <Controller
                                name="LCNo"
                                control={control}
                                render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>LC No.</label>
                                    <InputText  inputId={field.name} value={field.value} inputRef={field.ref}  className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                    {getFormErrorMessage(field.name)}
                                </>
                            )}/>
                        </div>
                        <div className="field col-12 md:col-6">
                            <Controller
                                name="notes"
                                control={control}
                                render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Notes</label>
                                    <InputTextarea inputId={field.name} value={field.value} inputRef={field.ref}  className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} rows={3} cols={20} />
                                    {getFormErrorMessage(field.name)}
                                </>
                            )}/>
                        </div>
                    </div>
                </div>

                <ModalPurchaseForm visible={showPurchaseDialog} currency="INR" 
                    onHideDialog={hidePurchaseProductDialog} 
                    onAdd={addToPurchaseList}
                    defaultPurchaseProduct={defaultPurchaseProduct}
                    selectedProduct={selectedProduct}
                    trigger={trigger}
                ></ModalPurchaseForm>

                <DataTable value={purchases} 
                    stripedRows showGridlines scrollable scrollHeight="400px" 
                    header={header} footer={footer} 
                >
                    <Column body={actionBodyTemplate} headerStyle={{ width: '6.4rem' }}></Column>
                    <Column field="productName" header="Product Name"  headerStyle={{ minWidth: '10rem' }}></Column>
                    <Column field="barCode" header="barcode" headerStyle={{ minWidth: '10rem' }}></Column>
                    <Column field="lastPurchasePrice" header="Last Purchase Price" headerStyle={{ minWidth: '10rem' }}></Column>

                    <Column field="quantity" header="Quantity" headerStyle={{ minWidth: '10rem' }}></Column>
                    <Column field="unitCostF" header={`Unit Cost (${selectedSupplier_currency})`} headerStyle={{ minWidth: '10rem' }}></Column>
                    <Column field="totalCostF" header={`Total Cost (${selectedSupplier_currency})`} headerStyle={{ minWidth: '10rem' }}></Column>
                    <Column field="conversionRate" header="Conversion Rate" headerStyle={{ minWidth: '10rem' }}></Column>
                    <Column field="unitCostBDT" header="UnitCost (BDT)" headerStyle={{ minWidth: '10rem' }}></Column>
                    <Column field="totalCostBDT" header="Total Cost (BDT)" headerStyle={{ minWidth: '10rem' }}></Column>

                    <Column field="transport" header="Transport (BDT)" headerStyle={{ minWidth: '10rem' }}></Column>
                    <Column field="duty" header="Duty  (BDT)" headerStyle={{ minWidth: '10rem' }}></Column>

                    <Column field="netUnitCostBDT" header="Net Unit Cost (BDT)" headerStyle={{ minWidth: '10rem' }}></Column>
                    <Column field="netCostBDT" header="Net Cost (BDT)" headerStyle={{ minWidth: '10rem' }}></Column>

                    <Column field="profit" header="Profit (BDT)" headerStyle={{ minWidth: '10rem' }}></Column>

                    <Column field="tradeUnitPriceBDT" header="Unit Trade Price (BDT)" headerStyle={{ minWidth: '10rem' }}></Column>
                    <Column field="minimumTradePrice" header="Minimum Trade Price (BDT)" headerStyle={{ minWidth: '10rem' }}></Column>
                </DataTable>
                <>
                    <Button type="submit" label="Submit" className="mt-2" onClick={handleSubmit((d) => onSubmit(d))}/>
                </>
            </div>
            
            <Dialog visible={deleteProfileDialog}
                style={{ width: '450px' }} header="Confirm" modal 
                footer={deleteProfileDialogFooter} onHide={hideDeleteProfileDialog}>
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    <span>
                        Are you sure you want to delete?
                    </span>
                </div>
            </Dialog>
        </div>
    );
}
                 
export default Form;