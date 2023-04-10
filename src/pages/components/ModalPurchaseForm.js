import React, { useState, useRef, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { DataTable } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';
import { classNames } from 'primereact/utils';

import SelectMasterData from '../components/SelectMasterData';

import { MasterDataService } from '../../services/MasterDataService';
import { PRODUCT_MODEL } from '../../constants/models';

export default function ModalPurchaseForm({ visible, trigger, onAdd, onHideDialog, currency, selectedProduct, defaultPurchaseProduct }) {

    const {
        register,
        control,
        formState: { errors },
        resetField,
        handleSubmit
    } = useForm({
        defaultValues: selectedProduct //async () =>  hrManagementService.getById(modelName, ProductProfile)
    });

    const dt = useRef(null);

    const contextPath = '~';
    const [purchaseProduct, setPurchaseProduct] = useState(defaultPurchaseProduct);
    const [submitted, setSubmitted] = useState(false);
    const [dialogVisible, setDialogVisible] = useState(visible);

    useEffect(() => {
        if (trigger) {
            // showDialog();
            setPurchaseProduct(selectedProduct);
            console.log("Selected Product :::: ", selectedProduct);
        }
    }, [trigger]);

    const hideDialog = () => {
        onHideDialog(false);
    };

    const roundNumber = (num) => {
        return Math.round((num + Number.EPSILON) * 100) / 100;
    };

    const calculateCost = (_purchaseProduct) => {
        _purchaseProduct.totalCostF = roundNumber(_purchaseProduct.unitCostF * _purchaseProduct.quantity);
        _purchaseProduct.unitCostBDT = roundNumber(_purchaseProduct.unitCostF * _purchaseProduct.conversionRate);
        _purchaseProduct.totalCostBDT = roundNumber(_purchaseProduct.unitCostBDT * _purchaseProduct.quantity);
        _purchaseProduct.netUnitCostBDT = roundNumber(_purchaseProduct.unitCostBDT + (_purchaseProduct.transport/_purchaseProduct.quantity) + (_purchaseProduct.duty/_purchaseProduct.quantity));
        _purchaseProduct.netCostBDT = roundNumber(_purchaseProduct.netUnitCostBDT * _purchaseProduct.quantity);
        setPurchaseProduct(_purchaseProduct);
    };

    const onProfitChange = (profit) => {
        let _purchaseProduct = { ...purchaseProduct };
        _purchaseProduct.profit = roundNumber(profit);
        _purchaseProduct.tradeUnitPriceBDT = roundNumber(_purchaseProduct.netUnitCostBDT + _purchaseProduct.profit);
        _purchaseProduct.minimumTradePrice = _purchaseProduct.tradeUnitPriceBDT;
        setPurchaseProduct(_purchaseProduct);
    };

    const onTradePriceChange = (tradeUnitPriceBDT) => {
        let _purchaseProduct = { ...purchaseProduct };
        _purchaseProduct.tradeUnitPriceBDT = roundNumber(tradeUnitPriceBDT);
        _purchaseProduct.profit = roundNumber(_purchaseProduct.tradeUnitPriceBDT - _purchaseProduct.netUnitCostBDT);
        _purchaseProduct.minimumTradePrice = _purchaseProduct.tradeUnitPriceBDT;
        setPurchaseProduct(_purchaseProduct);
    };
    
    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _purchaseProduct = { ...purchaseProduct };
        _purchaseProduct[`${name}`] = val;
        calculateCost(_purchaseProduct);
    };

    const onProductSelect = (selectedRow) => {
        console.log("PRODUCT SELECTED::", selectedRow)
        let _purchaseProduct = { ...purchaseProduct };
        console.log(selectedRow.barCode)
        console.log(selectedRow.lastPurchasePrice)
        _purchaseProduct['dtProduct_id'] = selectedRow._id;
        _purchaseProduct['productName'] = selectedRow.name;
        _purchaseProduct['barCode'] = selectedRow.barCode;
        _purchaseProduct['lastPurchasePrice'] = selectedRow.lastPurchasePrice;
        setPurchaseProduct(_purchaseProduct);
    };

    const onAddAndAddAnother = () => {
        console.log(purchaseProduct);
        onAdd(purchaseProduct);
        setPurchaseProduct(defaultPurchaseProduct);
    };

    const onAddItem = () => {
        console.log(purchaseProduct);
        onAdd(purchaseProduct);
        setPurchaseProduct(defaultPurchaseProduct);
        hideDialog();
    };

    const empProfileDialogFooter = (
        <>
            <Button type="submit" label="Save and Add Another" className="mt-2" onClick={handleSubmit((d) => onAddAndAddAnother(d))}/>
            <Button type="submit" label="Add" className="mt-2" onClick={handleSubmit((d) => onAddItem(d))}/>
        </>
    );

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    return (
        <Dialog visible={visible} position='top' style={{ width: '80rem' }} header={`Add Product`} modal 
            className="p-fluid" footer={empProfileDialogFooter} onHide={hideDialog} >                    
            {/* {purchaseProduct.image && <img src={`${contextPath}/demo/images/purchaseProduct/${purchaseProduct.image}`} alt={purchaseProduct.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />} */}
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
                            onSelect={onProductSelect}
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
                <label htmlFor="name">Min Trade Price (U)</label>
                <InputNumber id="minimumTradePrice" value={purchaseProduct.minimumTradePrice} onValueChange={(e) => onInputChange(e, 'minimumTradePrice')}  maxFractionDigits={2} />
            </div>
            </div>
        </Dialog>
    );
}