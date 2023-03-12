import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';

import SelectMasterDataTable from '../../components/SelectMasterDataTable';

import { HRService } from '../../../services/HRService';
import { SALE_MODEL, PRODUCT_MODEL } from '../../../constants/models';

const Form = ({saleProfile}) => {

    const modelName = SALE_MODEL;

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
    const [sales, setsales] = useState([]);
    const [saleItem, setsaleItem] = useState({});
    const [saleQuantity, setsaleQuantity] = useState(1);
    const [salePrice, setsalePrice] = useState(0);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [deleteProfileDialog, setDeleteProfileDialog] = useState(false);

    const [trigger, setTrigger] = useState(0);

    const {
        register,
        control,
        formState: { errors },
        resetField,
        handleSubmit
    } = useForm({
        defaultValues: defaultValue //async () =>  hrManagementService.getById(modelName, saleProfile)
      });

    const onSubmit = (formData) => {
        console.log(formData);
        formData.items = sales;
        // if(saleProfile==null){
        //     hrManagementService.create(modelName, formData).then(data => {
        //         toast.current.show({ severity: 'success', summary: 'Successful', detail: 'sale Created', life: 3000 });
        //         navigate("/sales/" + data.ID);
        //     });
        // }else{
        //     hrManagementService.update(modelName, formData._id, formData).then(data => {
        //         toast.current.show({ severity: 'success', summary: 'Successful', detail: 'sale Updated', life: 3000 });
        //     });
        // }
    };

    const gotoList = () => {
        navigate("/sales");
    };

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    const resetItemSelection = () => {
        setsaleItem({_id: null, productName: ""});
        setsaleQuantity(1);
        setsalePrice(0);
    };

    const addItem = () => {
        if(saleItem==null || saleItem._id == null) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Please select an item', life: 3000 });
            return;
        }
        if(saleQuantity==null || saleQuantity <= 0) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Please enter a valid quantity', life: 3000 });
            return;
        }
        if(salePrice==null || salePrice <= 0) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Please enter a valid price', life: 3000 });
            return;
        }

        let newsales = [...sales];
        newsales.push({
            index: sales.length,
            itemId: saleItem._id,
            itemName: saleItem.productName,
            quantity: parseFloat(saleQuantity),
            salePrice: parseFloat(salePrice),
            amount: parseFloat(salePrice) * parseFloat(saleQuantity),
            // discount: null,
            // netAmount: null,
            // tax: null,
            // taxAmount: null,
            // totalAmount: null,
        });
        setsales(newsales);
        resetItemSelection();
    };

    const removeItem = () => {
        let newsales = [...sales];
        newsales.splice(selectedProduct.index, 1);
        setsales(newsales);
        setDeleteProfileDialog(false);
    };

    const updateItem = () => {
        let newsales = [...sales];
        newsales[selectedProduct.index] = {
            index: selectedProduct.index,
            itemId: saleItem._id,
            itemName: saleItem.productName,
            quantity: parseFloat(saleQuantity),
            salePrice: parseFloat(salePrice),
            amount: parseFloat(salePrice) * parseFloat(saleQuantity),
            // discount: null,
            // netAmount: null,
            // tax: null,
            // taxAmount: null,
            // totalAmount: null,
        };
        setsales(newsales);
        setIfAdd(true);
        resetItemSelection();
    };

    const cancelUpdateItem = () => {
        setIfAdd(true);
        resetItemSelection();
    };

    const getTotalPrice = () => {
        let total = 0;
        if(sales && sales.length > 0) {
            for(let i=0; i<sales.length; i++) {
                total += sales[i].amount;
            }
        }
        return total;
    };

    const onItemSelect = (e) => {
        setsaleItem(e.value);
    };

    const editProfile = (dtProfile) => {
        setSelectedProduct(dtProfile);
        setsaleItem({_id: dtProfile.itemId, productName: dtProfile.itemName});
        setsaleQuantity(dtProfile.quantity);
        setsalePrice(dtProfile.salePrice);
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
            <h6 className="p-m-0">sale Items</h6>
            <div className="formgroup-inline">
                <div className="field">
                    <div className="p-inputgroup">
                        <InputText readonly="true" value={saleItem.productName} placeholder="Select a Product" 
                            onClick={() => setTrigger((trigger) => trigger + 1)} />
                        <SelectMasterDataTable trigger={trigger} fieldName="itemName" fieldValue={saleItem._id} modelName={PRODUCT_MODEL}
                            onSelect={(e) => {onItemSelect(e)}} selRow={saleItem}
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
                    <InputNumber id="qunatity" value={saleQuantity} type="text" placeholder="Quantity" onValueChange={(e) => setsaleQuantity(e.value)} />
                </div>
                <div className="field">
                    <label htmlFor="salePrice" className="p-sr-only">
                        sale Price
                    </label>
                    <InputNumber id="salePrice" value={salePrice} type="text" placeholder="sale Price" onValueChange={(e) => setsalePrice(e.value)}/>
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
                    {sales ? sales.length : 0} products.
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
                {saleProfile==null && <Button onClick={() => gotoList()} className="p-button-outlined" label="Go Back to List" />}
                <h5>{saleProfile==null?"New":"Edit"} sale</h5>

                <div className="p-fluid formgrid grid">
                    <div className="field col-12 md:col-4">
                        <Controller
                            name="saleId"
                            control={control}
                            rules={{ required: 'sale ID is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>sale ID*</label>
                                <InputText  inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>
                    <div className="field col-12 md:col-4">
                        <Controller
                            name="saleName"
                            control={control}
                            rules={{ required: 'sale Name is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>sale Name*</label>
                                <InputText  inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>
                </div>
                <DataTable value={sales} 
                    stripedRows showGridlines scrollable scrollHeight="400px" 
                    header={header} footer={footer} 
                >
                    <Column body={actionBodyTemplate} headerStyle={{ width: '6.4rem' }}></Column>
                    <Column field="itemName" header="Item Name"></Column>
                    <Column field="quantity" header="Quantity"></Column>
                    <Column field="salePrice" header="sale Price"></Column>
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