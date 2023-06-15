import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { Dialog } from 'primereact/dialog';

import SelectMasterData from '../../components/SelectMasterData';

import { ON_PURCHASE_PRODUCT } from '../../../constants/transactions';

import { TransactionService } from '../../../services/TransactionService';
import PackageProductForm from './components/PackageProductForm';
import PackageProductDetail from './components/PackageProductDetail';

const Form = () => {

    let navigate = useNavigate();

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

    let defaultPackageProduct = {
        dtProduct_id: null, // select product
        barCode: null, // fetch from selected product
        lastPackagePrice: 0.00, // fetch from selected product

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

    const toast = useRef(null);

    const [totalCostAmountF, setTotalAmountF] = useState(0.00);
    const [totalCostAmountBDT, setTotalAmountBDT] = useState(0.00);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [totalTransport, setTotalTransport] = useState(0.00);
    const [totalDuty, setTotalDuty] = useState(0.00);
    const [netCostAmountBDT, setNetAmountBDT] = useState(0.00);
    const [purchases, setPackages] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(defaultPackageProduct);
    const [deleteProfileDialog, setDeletePackageProductDialog] = useState(false);
    const [selectedSupplier_currency, setSelectedSupplier_currency] = useState("INR");

    const transactionService = new TransactionService();

    const {
        register,
        control,
        formState: { errors },
        resetField,
        handleSubmit
    } = useForm({
        defaultValues: defaultValue //async () =>  hrManagementService.getById(modelName, PackageProfile)
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
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Package Record Created', life: 3000 });
                navigate("/purchases");
            });
        }
        catch (err){
            console.log(err)
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Package Record Created', life: 3000 });
            navigate("/purchases");
        }
    };

    const gotoList = () => {
        navigate("/purchases");
    };

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    const addToPackageList = (addedItem) => {
        let newPackages = [...purchases];
        addedItem['index'] = purchases.length;
        newPackages.push(addedItem);
        console.log("NEWPURCHASE::", newPackages);
        setPackages(newPackages);
        console.log("PURCHASES::", purchases);
        calculateTotals(newPackages);
    };

    const updatePackagelist = (dtPackageProduct) => {
        let newPackages = [...purchases];
        newPackages[selectedProduct.index] = dtPackageProduct;
        console.log("EDIT::", dtPackageProduct);
        setPackages(newPackages);
        calculateTotals(newPackages);
    };

    const removeItem = () => {
        let newPackages = [...purchases];
        newPackages.splice(selectedProduct.index, 1);
        setPackages(newPackages);
        setDeletePackageProductDialog(false);
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

    const editPackageProduct = (dtPackageProduct) => {
        console.log("EDIT::", dtPackageProduct);
        setSelectedProduct(dtPackageProduct);
        console.log("SET SELECTED PRODUCT::", selectedProduct);
    };

    const confirmDeletePackageProduct = (dtPackageProduct) => {
        // setSelectedProduct(dtPackageProduct);
        setDeletePackageProductDialog(true);
    };

    const hideDeletePackageProductDialog = () => {
        setDeletePackageProductDialog(false);
    };

    const deleteProfileDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeletePackageProductDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={removeItem} />
        </>
    );

    const onSupplierSelect = (selectedRow) => {
        console.log("SELECTED SUPPLIER::", selectedRow);
        setSelectedSupplier_currency(selectedRow.currency);
    };

    return (

<div className="grid h-screen">    
    <Toast ref={toast} />    
    <div className="col-3">
        <div class="card">
            <Button onClick={() => gotoList()} className="p-button-outlined" label="Go to Package List" /> 
            <h5>Package Detail</h5>
            <div className=" col-12 md:col-12">
                <div className="p-fluid formgrid grid">
                    <div className="field col-12">
                        <label htmlFor="fldSupplierCurrency">Supplier Currency</label>
                        <InputText readonly="true" value={selectedSupplier_currency} placeholder="Currency" />
                    </div>
                    <div className="field col-12">
                        <Controller
                            name="CnF"
                            control={control}
                            render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>CnF</label>
                                <InputText inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
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
    <div className="card col-9" >
        <div className="col-12">
            {/* <h5><Button onClick={() => gotoList()} className="p-button-outlined" label="Go Back" /> Add Product</h5> */}
            <PackageProductForm 
                onAdd={(dt) => addToPackageList(dt)} 
                onEdit={(dt) => updatePackagelist(dt)}
                currency={selectedSupplier_currency} 
                defaultPackageProduct={defaultPackageProduct} 
                selectedProduct={selectedProduct}
                />
        </div>
        <div className="col-12">
            <PackageProductDetail purchases={purchases} supplierCurrency={selectedSupplier_currency}
                onEdit={(dt) => editPackageProduct(dt)} onDelete={(dt) => confirmDeletePackageProduct(dt)}
            />
        </div>
        <Dialog visible={deleteProfileDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProfileDialogFooter} onHide={hideDeletePackageProductDialog}>
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