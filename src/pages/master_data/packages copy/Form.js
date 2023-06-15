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

// import SelectMasterDataTable from '../../components/SelectMasterDataTable';
import SelectMasterDataOL from '../../components/SelectMasterDataOL';

import { HRService } from '../../../services/HRService';
import { PACKAGE_MODEL, PRODUCT_MODEL } from '../../../constants/models';

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
        navigate("/packages");
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
            <h6 className="p-m-0">package Items</h6>
            <div className="formgroup-inline">
                <div className="field">
                    <div className="p-inputgroup">
                        {/* <InputText readonly="true" value={packageItem.productName} placeholder="Select a Product" 
                            onClick={() => setTrigger((trigger) => trigger + 1)} />
                        <SelectMasterDataTable trigger={trigger} fieldName="itemName" fieldValue={packageItem._id} modelName={PRODUCT_MODEL}
                            onSelect={(e) => {onItemSelect(e)}} selRow={packageItem}
                            caption="Select a Product" displayField="productName"
                            columns={[
                                {field: 'productId', header: 'Product ID', filterPlaceholder: 'Filter by Supplier ID'}, 
                                {field: 'productName', header: 'Product Name', filterPlaceholder: 'Filter by Supplier Name'}
                            ]} /> */}
                        {/* <SelectMasterDataOL field={field} modelName={PRODUCT_MODEL}
                            displayField="name"
                            className={classNames({ 'p-invalid': fieldState.error })} 
                            onSelect={onProductSelect}
                            defaultFilters={defaultFilters}
                            columns={[
                                {field: 'name', header: 'Product Name', filterPlaceholder: 'Filter by Product Name', width: '50rem'}, 
                                {field: 'brandName', header: 'Brand Name', filterPlaceholder: 'Filter by Barnd Name', width: '15rem'},
                                {field: 'modelNo', header: 'Model No', filterPlaceholder: 'Filter by Model No', width: '15rem'},
                                {field: 'partNumber', header: 'Part Number', filterPlaceholder: 'Filter by Part Number', width: '15rem'},
                                {field: 'dtProductCategory_id_shortname', header: 'Product Category', filterPlaceholder: 'Filter by Product Category', width: '15rem'}
                            ]} /> */}
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
                    {packages ? packages.length : 0} products.
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
                {packageProfile==null && <Button onClick={() => gotoList()} className="p-button-outlined" label="Go Back to List" />}
                <h5>{packageProfile==null?"New":"Edit"} package</h5>

                <div className="p-fluid formgrid grid">
                    <div className="field col-12 md:col-4">
                        <Controller
                            name="packageId"
                            control={control}
                            rules={{ required: 'package ID is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>package ID*</label>
                                <InputText  inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>
                    <div className="field col-12 md:col-4">
                        <Controller
                            name="packageName"
                            control={control}
                            rules={{ required: 'package Name is required.' }}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>package Name*</label>
                                <InputText  inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                {getFormErrorMessage(field.name)}
                            </>
                        )}/>
                    </div>
                </div>
                <DataTable value={packages} 
                    stripedRows showGridlines scrollable scrollHeight="400px" 
                    header={header} footer={footer} 
                >
                    <Column body={actionBodyTemplate} headerStyle={{ width: '6.4rem' }}></Column>
                    <Column field="itemName" header="Item Name"></Column>
                    <Column field="quantity" header="Quantity"></Column>
                    <Column field="packagePrice" header="package Price"></Column>
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