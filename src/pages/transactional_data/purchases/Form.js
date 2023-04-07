import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';

import SelectMasterDataTable from '../../components/SelectMasterDataTable';
import SelectMasterData from '../../components/SelectMasterData';

import { HRService } from '../../../services/HRService';
import { PACKAGE_MODEL, PRODUCT_MODEL } from '../../../constants/models';
import { ON_PURCHASE_PRODUCT } from '../../../constants/transactions';

import { PURCHASE_MODEL, SUPPLIER_MODEL, WAREHOUSES_MODEL } from '../../../constants/models';

const Form = ({packageProfile}) => {

    const modelName = PACKAGE_MODEL;

    let navigate = useNavigate();

    let defaultValue = {
        _id: null,
        voucherNo: null,
        voucherDate: null,
        supplierId: null,
        items: [
            {
                itemId: null,
                itemName: null,
                quantity: null,
                unitPrice: null,
                amount: null,
                discount: null,
                netAmount: null,
                // tax: null,
                // taxAmount: null,
                totalAmount: null,
            }
        ],
    };

    const toast = useRef(null);
    const hrManagementService = new HRService();
    
    const [ifAdd, setIfAdd] = useState(true);
    const [packages, setpackages] = useState([]);
    const [packageItem, setpackageItem] = useState({});
    const [packageQuantity, setpackageQuantity] = useState(1);
    const [packagePrice, setpackagePrice] = useState(0);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [deleteProfileDialog, setDeleteProfileDialog] = useState(false);

    const [purchases, setPurchases] = useState([
        {"productName":"P-1"},
        {"productName":"P-1"},
        {"productName":"P-1"},
        {"productName":"P-1"},
        {"productName":"P-1"},
        {"productName":"P-1"},
        {"productName":"P-1"},
        {"productName":"P-1"},
        {"productName":"P-1"},
        {"productName":"P-1"},
        {"productName":"P-1"},
        {"productName":"P-1"},
        {"productName":"P-1"},
    ]);
    const [selectedSupplier_currency, setSelectedSupplier_currency] = useState("INR");
    const [currency, setCurrency] = useState("INR");
    const [purchaseProduct, setPurchaseProduct] = useState({});

    const onInputChange = (e, name) => {
        // const val = (e.target && e.target.value) || '';
        // let _purchaseProduct = { ...purchaseProduct };
        // _purchaseProduct[`${name}`] = val;
        // calculateCost(_purchaseProduct);
    };

    const onProfitChange = (profit) => {
        // let _purchaseProduct = { ...purchaseProduct };
        // _purchaseProduct.profit = roundNumber(profit);
        // _purchaseProduct.tradeUnitPriceBDT = roundNumber(_purchaseProduct.netUnitCostBDT + _purchaseProduct.profit);
        // _purchaseProduct.minimumTradePrice = _purchaseProduct.tradeUnitPriceBDT;
        // setPurchaseProduct(_purchaseProduct);
    };
    const onTradePriceChange = (profit) => {
    };

    const [trigger, setTrigger] = useState(0);

    const {
        register,
        control,
        formState: { errors },
        resetField,
        handleSubmit
    } = useForm({
        defaultValues: defaultValue //async () =>  hrManagementService.getById(modelName, packageProfile)
      });

    const onSubmit = (formData) => {
        console.log(formData);
        formData.items = packages;
        // if(packageProfile==null){
        //     hrManagementService.create(modelName, formData).then(data => {
        //         toast.current.show({ severity: 'success', summary: 'Successful', detail: 'package Created', life: 3000 });
        //         navigate("/packages/" + data.ID);
        //     });
        // }else{
        //     hrManagementService.update(modelName, formData._id, formData).then(data => {
        //         toast.current.show({ severity: 'success', summary: 'Successful', detail: 'package Updated', life: 3000 });
        //     });
        // }
    };

    const gotoList = () => {
        navigate("/purchases");
    };

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    const resetItemSelection = () => {
        setpackageItem({_id: null, productName: ""});
        setpackageQuantity(1);
        setpackagePrice(0);
    };

    const addItem = () => {
        if(packageItem==null || packageItem._id == null) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Please select an item', life: 3000 });
            return;
        }
        if(packageQuantity==null || packageQuantity <= 0) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Please enter a valid quantity', life: 3000 });
            return;
        }
        if(packagePrice==null || packagePrice <= 0) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Please enter a valid price', life: 3000 });
            return;
        }

        let newpackages = [...packages];
        newpackages.push({
            index: packages.length,
            itemId: packageItem._id,
            itemName: packageItem.productName,
            quantity: parseFloat(packageQuantity),
            packagePrice: parseFloat(packagePrice),
            amount: parseFloat(packagePrice) * parseFloat(packageQuantity),
            // discount: null,
            // netAmount: null,
            // tax: null,
            // taxAmount: null,
            // totalAmount: null,
        });
        setpackages(newpackages);
        resetItemSelection();
    };

    const removeItem = () => {
        let newpackages = [...packages];
        newpackages.splice(selectedProduct.index, 1);
        setpackages(newpackages);
        setDeleteProfileDialog(false);
    };

    const updateItem = () => {
        let newpackages = [...packages];
        newpackages[selectedProduct.index] = {
            index: selectedProduct.index,
            itemId: packageItem._id,
            itemName: packageItem.productName,
            quantity: parseFloat(packageQuantity),
            packagePrice: parseFloat(packagePrice),
            amount: parseFloat(packagePrice) * parseFloat(packageQuantity),
            // discount: null,
            // netAmount: null,
            // tax: null,
            // taxAmount: null,
            // totalAmount: null,
        };
        setpackages(newpackages);
        setIfAdd(true);
        resetItemSelection();
    };

    const cancelUpdateItem = () => {
        setIfAdd(true);
        resetItemSelection();
    };

    const getTotalPrice = () => {
        let total = 0;
        if(packages && packages.length > 0) {
            for(let i=0; i<packages.length; i++) {
                total += packages[i].amount;
            }
        }
        return total;
    };

    const onItemSelect = (e) => {
        setpackageItem(e.value);
    };

    const editProfile = (dtProfile) => {
        setSelectedProduct(dtProfile);
        setpackageItem({_id: dtProfile.itemId, productName: dtProfile.itemName});
        setpackageQuantity(dtProfile.quantity);
        setpackagePrice(dtProfile.packagePrice);
        setIfAdd(false);
    };

    const confirmDeleteProfile = (dtProfile) => {
        setSelectedProduct(dtProfile);
        setDeleteProfileDialog(true);
    };

    const hideDeleteProfileDialog = () => {
        setDeleteProfileDialog(false);
    };

    const deleteProfileDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProfileDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={removeItem} />
        </>
    );

    const header = (
        <div className="table-header">
{/* 
            <div className="formgroup-inline">
                <div className="field">
                    <div className="p-inputgroup">
                        <InputText readonly="true" value={packageItem.productName} placeholder="Select a Product" 
                            onClick={() => setTrigger((trigger) => trigger + 1)} />
                        <SelectMasterDataTable trigger={trigger} fieldName="itemName" fieldValue={packageItem._id} modelName={PRODUCT_MODEL}
                            onSelect={(e) => {onItemSelect(e)}} selRow={packageItem}
                            caption="Select a Product" displayField="productName"
                            columns={[
                                {field: 'productId', header: 'Product ID', filterPlaceholder: 'Filter by Supplier ID'}, 
                                {field: 'productName', header: 'Product Name', filterPlaceholder: 'Filter by Supplier Name'}
                            ]} />
                    </div>
                </div>
                <div className="field">
                    <label htmlFor="qunatity" className="p-sr-only">
                        Quantity
                    </label>
                    <InputNumber id="qunatity" value={packageQuantity} type="text" placeholder="Quantity" onValueChange={(e) => setpackageQuantity(e.value)} />
                </div>
                <div className="field">
                    <label htmlFor="packagePrice" className="p-sr-only">
                        package Price
                    </label>
                    <InputNumber id="packagePrice" value={packagePrice} type="text" placeholder="package Price" onValueChange={(e) => setpackagePrice(e.value)}/>
                </div>
                {ifAdd ?
                <Button  label="Add" className="p-button-success" onClick={() => addItem()}></Button>
                :
                <>
                    <Button label="Update" className="p-button-primary mr-2" onClick={() => updateItem()}></Button>
                    <Button label="Cancel" className="p-button-warning" onClick={() => cancelUpdateItem()}></Button>
                </>}
            </div> */}
        </div>
    );

    const footer = (
        <table className="col-12"><tbody>
            <tr>
                <td><b>Total Quantity:</b></td><td> products.</td>
            {/* </tr><tr> */}
                <td><b>Total Cost ({selectedSupplier_currency}):</b></td><td>0</td>
                <td><b>Total Cost (BDT):</b></td><td>0</td>
            </tr><tr>
                <td><b>Total Transport Cost (BDT):</b></td><td>0</td>
                <td><b>Total Duty (BDT):</b></td><td>0</td>
            {/* </tr><tr> */}
                <td><b>Total Net Cost (BDT):</b></td><td>0</td>
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

    return (

<div className="grid h-screen">    
    <Toast ref={toast} />    
    
      
    <div className="card col-9" >
        <div className="col-12">
        <h5><Button onClick={() => gotoList()} className="p-button-outlined" label="Go Back" /> Add Product</h5>
        
        <div className="p-fluid formgrid grid">
            <div className="field col-12 md:col-2">
            <Controller
                name="dtProduct_id"
                control={control}
                rules={{ required: 'Product is required.' }}
                    render={({ field, fieldState }) => (
                    <>
                        <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Product*</label>
                        <SelectMasterData field={field} modelName={PRODUCT_MODEL}
                            displayField="name"
                            className={classNames({ 'p-invalid': fieldState.error })} 
                            // onSelect={onProductSelect}
                            columns={[
                                {field: 'name', header: 'Product Name', filterPlaceholder: 'Filter by Product Name'}, 
                                {field: 'dtProductCategory_id_shortname', header: 'Product Category', filterPlaceholder: 'Filter by Product Category'}
                            ]} />
                        {getFormErrorMessage(field.name)}
                    </>
                )}/>
            </div>
            <div className="field col-12 md:col-2">
                <label htmlFor="name">Barcode</label>
                <InputText id="barCode" value={purchaseProduct.barCode} disabled={true} />
            </div>
            <div className="field col-12 md:col-2">
                <label htmlFor="name">Last Purchase Price</label>
                <InputNumber id="lastPurchasePrice" value={purchaseProduct.lastPurchasePrice} disabled={true} />
            </div>            

            <div className="field col-12 md:col-2">
                <label htmlFor="name">Quantity</label>
                <InputNumber id="quantity" value={purchaseProduct.quantity} onValueChange={(e) => onInputChange(e, 'quantity')} min={1} max={10000000} />
            </div>
            <div className="field col-12 md:col-2">
                <label htmlFor="name">Unit Cost ({currency})</label>
                <InputNumber id="unitCostF" value={purchaseProduct.unitCostF} onValueChange={(e) => onInputChange(e, 'unitCostF')}  maxFractionDigits={2} />
            </div>
            <div className="field col-12 md:col-2">
                <label htmlFor="name">Total Cost ({currency})</label>
                <InputNumber id="totalCostF" value={purchaseProduct.totalCostF} disabled={true} />
            </div>
            <div className="field col-12 md:col-2">
                <label htmlFor="name">Conversion Rate</label>
                <InputNumber id="conversionRate" value={purchaseProduct.conversionRate} onValueChange={(e) => onInputChange(e, 'conversionRate')}  maxFractionDigits={2} />
            </div>
            <div className="field col-12 md:col-2">
                <label htmlFor="name">Unit Cost (BDT)</label>
                <InputNumber id="unitCostBDT" value={purchaseProduct.unitCostBDT} disabled={true} />
            </div>
            <div className="field col-12 md:col-2">
                <label htmlFor="name">Total Cost (BDT)</label>
                <InputNumber id="totalCostBDT" value={purchaseProduct.totalCostBDT} disabled={true} />
            </div>

            <div className="field col-12 md:col-2">
                <label htmlFor="name">Transport (BDT)</label>
                <InputNumber id="transport" value={purchaseProduct.transport} onValueChange={(e) => onInputChange(e, 'transport')}  maxFractionDigits={2} />
            </div>
            <div className="field col-12 md:col-2">
                <label htmlFor="name">Duty (BDT)</label>
                <InputNumber id="duty" value={purchaseProduct.duty} onValueChange={(e) => onInputChange(e, 'duty')}  maxFractionDigits={2} />
            </div>
    
            <div className="field col-12 md:col-2">
                <label htmlFor="name">Net Unit Cost (BDT)</label>
                <InputNumber id="netUnitCostBDT" value={purchaseProduct.netUnitCostBDT} disabled={true} />
            </div>
            <div className="field col-12 md:col-2">
                <label htmlFor="name">Net Cost (BDT)</label>
                <InputNumber id="netCostBDT" value={purchaseProduct.netCostBDT} disabled={true} />
            </div>

            <div className="field col-12 md:col-2">
                <label htmlFor="name">Unit Profit (BDT)</label>
                <InputNumber id="profit" value={purchaseProduct.profit} onValueChange={(e) => onProfitChange(e.value)}  maxFractionDigits={2} />
            </div>

            <div className="field col-12 md:col-2">
                <label htmlFor="name">Unit Trade Price (BDT)</label>
                <InputNumber id="tradeUnitPriceBDT" value={purchaseProduct.tradeUnitPriceBDT} onValueChange={(e) => onTradePriceChange(e.value)}  maxFractionDigits={2} />
            </div>
            
            <div className="field col-12 md:col-2">
                <label htmlFor="minimumTradePrice">Min Trade Price (U)</label>
                <InputNumber id="minimumTradePrice" value={purchaseProduct.minimumTradePrice} onValueChange={(e) => onInputChange(e, 'minimumTradePrice')}  maxFractionDigits={2} />
            </div>
            <div className="flex field col-12 md:col-4 align-items-center">
                <Button  label="Update" className="p-button-primary mr-2" onClick={() => updateItem()}></Button>
                <Button label="Cancel" className="p-button-warning" onClick={() => cancelUpdateItem()}></Button>
            </div>
            </div>
        </div>
        <div className="col-12">
        
            <DataTable value={purchases} 
                stripedRows showGridlines scrollable scrollHeight="25rem" 
                 header={footer} 
        
            >
                <Column body={actionBodyTemplate} frozen headerStyle={{ minWidth: '6.4rem' }}></Column>
                <Column field="productName" frozen header="Product Name"  headerStyle={{ minWidth: '10rem' }}></Column>
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

                <Column field="minimumTradePrice" header="Minimum Trade Price (BDT)" headerStyle={{ minWidth: '10rem' }}></Column>
                <Column field="tradeUnitPriceBDT" header="Trade Price (U)" headerStyle={{ minWidth: '10rem' }}></Column>
            </DataTable>
            </div>
            <Dialog visible={deleteProfileDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProfileDialogFooter} onHide={hideDeleteProfileDialog}>
            <div className="flex align-items-center justify-content-center">
                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                <span>
                    Are you sure you want to delete?
                </span>
            </div>
            </Dialog>

      </div>     

      <div className="col-3">
        <div class="card">
            <h5>{packageProfile==null?"New":"Edit"} package </h5>
            <div className=" col-12 md:col-12">
                <div className="p-fluid formgrid grid">
                    <div className="field col-12">
                        <Controller
                            name="dtSupplier_id"
                            control={control}
                            rules={{ required: 'Supplier is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Suppier*</label>
                                <SelectMasterData field={field} modelName={SUPPLIER_MODEL}
                                    displayField="name"
                                    // onSelect={onSupplierSelect}
                                    className={classNames({ 'p-invalid': fieldState.error })} 
                                    columns={[
                                        {field: 'name', header: 'Supplier Name', filterPlaceholder: 'Filter by Supplier Name'}
                                    ]} />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>
                    <div className="field col-12">
                        <label htmlFor="fldSupplierCurrency">Supplier Currency</label>
                        <InputText readonly="true" value="" placeholder="Currency" />
                    </div>
                    <div className="field col-12">
                        <Controller
                            name="dtWarehouse_id"
                            control={control}
                            rules={{ required: 'Warehouse is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Warehouse*</label>
                                <SelectMasterData field={field} modelName={WAREHOUSES_MODEL}
                                    displayField="name"
                                    // onSelect={onSupplierSelect}
                                    className={classNames({ 'p-invalid': fieldState.error })} 
                                    columns={[
                                        {field: 'name', header: 'Warehouse Name', filterPlaceholder: 'Filter by Warehouse Name'}
                                    ]} />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>
                    <div className="field col-12">
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
                    <div className="field col-12">
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
                    <div className="field col-12">
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
                    <div className="field col-12">
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
            
            <>
                <Button type="submit" label="Submit" className="mt-2" onClick={handleSubmit((d) => onSubmit(d))}/>
            </>

        </div>
    </div>

    </div>
    );
}
                 
export default Form;