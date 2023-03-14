import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { Fieldset } from 'primereact/fieldset';
import { Column } from 'primereact/column';
import { Calendar } from 'primereact/calendar';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';

import SelectMasterDataTable from '../../components/SelectMasterDataTable';
import SelectMasterData from '../../components/SelectMasterData';

import { HRService } from '../../../services/HRService';
import { PURCHASE_MODEL, PRODUCT_MODEL, SUPPLIER_MODEL } from '../../../constants/models';

const Form = ({purchaseProfile}) => {

    const modelName = PURCHASE_MODEL;

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
    const [purchases, setPurchases] = useState([]);
    const [purchaseItem, setPurchaseItem] = useState({});
    const [purchaseQuantity, setPurchaseQuantity] = useState(1);
    const [purchasePrice, setPurchasePrice] = useState(0);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [deleteProfileDialog, setDeleteProfileDialog] = useState(false);
    const [supplierDialog, setSupplierDialog] = useState(false);
    const [date, setDate] = useState(null);



    const [trigger, setTrigger] = useState(0);

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
        console.log(formData);
        formData.items = purchases;
        // if(purchaseProfile==null){
        //     hrManagementService.create(modelName, formData).then(data => {
        //         toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Purchase Created', life: 3000 });
        //         navigate("/purchases/" + data.ID);
        //     });
        // }else{
        //     hrManagementService.update(modelName, formData._id, formData).then(data => {
        //         toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Purchase Updated', life: 3000 });
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
        setPurchaseItem({_id: null, productName: ""});
        setPurchaseQuantity(1);
        setPurchasePrice(0);
    };

    const addItem = () => {
        if(purchaseItem==null || purchaseItem._id == null) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Please select an item', life: 3000 });
            return;
        }
        if(purchaseQuantity==null || purchaseQuantity <= 0) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Please enter a valid quantity', life: 3000 });
            return;
        }
        if(purchasePrice==null || purchasePrice <= 0) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Please enter a valid price', life: 3000 });
            return;
        }

        let newPurchases = [...purchases];
        newPurchases.push({
            index: purchases.length,
            itemId: purchaseItem._id,
            itemName: purchaseItem.productName,
            quantity: parseFloat(purchaseQuantity),
            purchasePrice: parseFloat(purchasePrice),
            amount: parseFloat(purchasePrice) * parseFloat(purchaseQuantity),
            // discount: null,
            // netAmount: null,
            // tax: null,
            // taxAmount: null,
            // totalAmount: null,
        });
        setPurchases(newPurchases);
        resetItemSelection();
    };

    const removeItem = () => {
        let newPurchases = [...purchases];
        newPurchases.splice(selectedProduct.index, 1);
        setPurchases(newPurchases);
        setDeleteProfileDialog(false);
    };

    const updateItem = () => {
        let newPurchases = [...purchases];
        newPurchases[selectedProduct.index] = {
            index: selectedProduct.index,
            itemId: purchaseItem._id,
            itemName: purchaseItem.productName,
            quantity: parseFloat(purchaseQuantity),
            purchasePrice: parseFloat(purchasePrice),
            amount: parseFloat(purchasePrice) * parseFloat(purchaseQuantity),
            // discount: null,
            // netAmount: null,
            // tax: null,
            // taxAmount: null,
            // totalAmount: null,
        };
        setPurchases(newPurchases);
        setIfAdd(true);
        resetItemSelection();
    };

    const cancelUpdateItem = () => {
        setIfAdd(true);
        resetItemSelection();
    };

    const getTotalPrice = () => {
        let total = 0;
        if(purchases && purchases.length > 0) {
            for(let i=0; i<purchases.length; i++) {
                total += purchases[i].amount;
            }
        }
        return total;
    };

    const onItemSelect = (e) => {
        setPurchaseItem(e.value);
    };

    const editProfile = (dtProfile) => {
        setSelectedProduct(dtProfile);
        setPurchaseItem({_id: dtProfile.itemId, productName: dtProfile.itemName});
        setPurchaseQuantity(dtProfile.quantity);
        setPurchasePrice(dtProfile.purchasePrice);
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
            <h6 className="p-m-0">Purchase Items</h6>
            <div className="formgroup-inline">
                <div className="field">
                    <div className="p-inputgroup">
                        <InputText readonly="true" value={purchaseItem.productName} placeholder="Select a Product" 
                            onClick={() => setTrigger((trigger) => trigger + 1)} />
                        <SelectMasterDataTable trigger={trigger} fieldName="itemName" fieldValue={purchaseItem._id} modelName={PRODUCT_MODEL}
                            onSelect={(e) => {onItemSelect(e)}} selRow={purchaseItem}
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
                    <InputNumber id="qunatity" value={purchaseQuantity} type="text" placeholder="Quantity" onValueChange={(e) => setPurchaseQuantity(e.value)} />
                </div>
                <div className="field">
                    <label htmlFor="purchasePrice" className="p-sr-only">
                        Purchase Price
                    </label>
                    <InputNumber id="purchasePrice" value={purchasePrice} type="text" placeholder="Purchase Price" onValueChange={(e) => setPurchasePrice(e.value)}/>
                </div>
                {ifAdd ?
                <Button  label="Add" className="p-button-success" onClick={() => addItem()}></Button>
                :
                <>
                    <Button label="Update" className="p-button-primary mr-2" onClick={() => updateItem()}></Button>
                    <Button label="Cancel" className="p-button-warning" onClick={() => cancelUpdateItem()}></Button>
                </>}
            </div>
        </div>
    );

    const footer = (
        <table><tbody>
            <tr>
                <td>
                    <b>Total:</b>
                </td>
                <td>
                    {purchases ? purchases.length : 0} products.
                </td>
                <td>
                    <b>Total Price:</b>
                </td>
                <td>
                    ${getTotalPrice()}
                </td>
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
        <div className="form-demo">
            <Toast ref={toast} />
            <div className="card col-12">
                {purchaseProfile==null && <Button onClick={() => gotoList()} className="p-button-outlined" label="Go Back to List" />}
                <h5>{purchaseProfile==null?"New":"Edit"} Purchase</h5>

                <div className="p-fluid formgrid grid">
                    <div className="field col-12 md:col-4">
                        <Controller
                            name="purchaseId"
                            control={control}
                            rules={{ required: 'Purchase ID is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Purchase ID*</label>
                                <InputText  inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>
                    <div className="field col-12 md:col-4">
                        <Controller
                            name="purchaseName"
                            control={control}
                            rules={{ required: 'Purchase Name is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Purchase Name*</label>
                                <InputText  inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>
                </div>
                <div className=" col-12 md:col-12">
                        <Fieldset legend="Supplier Information">
                        <div className="p-fluid formgrid grid">
                            <div className="field col-12 md:col-6">
                                <Controller
                                    name="dtSupplier_supplierId"
                                    control={control}
                                    rules={{ required: 'Supplier is required.' }}
                                    render={({ field, fieldState }) => (
                                    <>
                                        <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Suppier*</label>
                                        <SelectMasterData field={field} modelName={SUPPLIER_MODEL}
                                            displayField="supplierName"
                                            className={classNames({ 'p-invalid': fieldState.error })} 
                                            columns={[
                                                {field: 'supplierId', header: 'Supplier ID', filterPlaceholder: 'Filter by Supplier ID'}, 
                                                {field: 'supplierName', header: 'Supplier Name', filterPlaceholder: 'Filter by Supplier Name'}
                                            ]} />
                                        {getFormErrorMessage(field.name)}
                                    </>
                                )}/>
                            </div>
                            <div className="field col-12 md:col-6">
                                <Controller
                                    name="fldCnF"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                    <>
                                        <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>CnF</label>
                                        <InputText  inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                        {getFormErrorMessage(field.name)}
                                    </>
                                )}/>
                            </div>
                            <div className="field col-12 md:col-6">
                                <Controller
                                    name="fldBENo"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                    <>
                                        <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>B/E No.</label>
                                        <InputText  inputId={field.name} value={field.value} inputRef={field.ref}  className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                        {getFormErrorMessage(field.name)}
                                    </>
                                )}/>
                            </div>
                            <div className="field col-12 md:col-6">
                                <Controller
                                    name="fldLCNo"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                    <>
                                        <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>LC No.</label>
                                        <InputText  inputId={field.name} value={field.value} inputRef={field.ref}  className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                        {getFormErrorMessage(field.name)}
                                    </>
                                )}/>
                            </div>
                        </div>
                        </Fieldset>
                    </div>
                <DataTable value={purchases} 
                    stripedRows showGridlines scrollable scrollHeight="400px" 
                    header={header} footer={footer} 
                >
                    <Column body={actionBodyTemplate} headerStyle={{ width: '6.4rem' }}></Column>
                    <Column field="itemName" header="Item Name"></Column>
                    <Column field="quantity" header="Quantity"></Column>
                    <Column field="purchasePrice" header="Purchase Price"></Column>
                    <Column field="amount" header="Total Price"></Column>
                </DataTable>
                <>
                    <Button type="submit" label="Submit" className="mt-2" onClick={handleSubmit((d) => onSubmit(d))}/>
                </>
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
    );
}
                 
export default Form;