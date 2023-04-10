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

import SelectMasterData from '../../../components/SelectMasterData';

import { MasterDataService } from '../../../../services/MasterDataService';
import { PRODUCT_MODEL } from '../../../../constants/models';

export default function SalesProductForm({ visible, trigger, onAdd, onEdit, currency, selectedProduct, defaultPurchaseProduct }) {

    let emptyPurchaseProduct = {
        dtProduct_id: "", // select product
        barCode: "", // fetch from selected product
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

    const {
        register,
        control,
        formState: { errors },
        reset,
        setValue,
        handleSubmit
    } = useForm({
        defaultValues: emptyPurchaseProduct //async () =>  hrManagementService.getById(modelName, ProductProfile)
    });

    const quantityRef = useRef(null);

    const [purchaseProduct, setPurchaseProduct] = useState(defaultPurchaseProduct);
    const [submitted, setSubmitted] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        if (selectedProduct) {
            // showDialog();
            reset({ ...selectedProduct });
            setPurchaseProduct(selectedProduct);
            console.log("Selected Product :::: ", selectedProduct);
            setIsEdit(true);
        }
    }, [selectedProduct]);

    const roundNumber = (num) => {
        return Math.round((num + Number.EPSILON) * 100) / 100;
    };

    const calculateCost = (_purchaseProduct) => {
        _purchaseProduct.totalCostF = roundNumber(_purchaseProduct.unitCostF * _purchaseProduct.quantity);
        _purchaseProduct.unitCostBDT = roundNumber(_purchaseProduct.unitCostF * _purchaseProduct.conversionRate);
        _purchaseProduct.totalCostBDT = roundNumber(_purchaseProduct.unitCostBDT * _purchaseProduct.quantity);
        _purchaseProduct.netUnitCostBDT = roundNumber(_purchaseProduct.unitCostBDT + (_purchaseProduct.transport/_purchaseProduct.quantity) + (_purchaseProduct.duty/_purchaseProduct.quantity));
        _purchaseProduct.netCostBDT = roundNumber(_purchaseProduct.netUnitCostBDT * _purchaseProduct.quantity);

        _purchaseProduct.tradeUnitPriceBDT = roundNumber(_purchaseProduct.netUnitCostBDT + _purchaseProduct.profit);
        _purchaseProduct.minimumTradePrice = _purchaseProduct.tradeUnitPriceBDT;
        setPurchaseProduct(_purchaseProduct);

        setValue('totalCostF', _purchaseProduct.totalCostF);
        setValue('unitCostBDT', _purchaseProduct.unitCostBDT);
        setValue('totalCostBDT', _purchaseProduct.totalCostBDT);
        setValue('netUnitCostBDT', _purchaseProduct.netUnitCostBDT);
        setValue('netCostBDT', _purchaseProduct.netCostBDT);
        setValue('tradeUnitPriceBDT', _purchaseProduct.tradeUnitPriceBDT);
        setValue('minimumTradePrice', _purchaseProduct.minimumTradePrice);
    };

    const onProfitChange = (profit) => {
        let _purchaseProduct = { ...purchaseProduct };
        _purchaseProduct.profit = roundNumber(profit);
        // _purchaseProduct.profit =  _purchaseProduct.netCostBDT * roundNumber(profit) / 100;
        _purchaseProduct.tradeUnitPriceBDT = roundNumber(_purchaseProduct.netUnitCostBDT + _purchaseProduct.profit);
        _purchaseProduct.minimumTradePrice = _purchaseProduct.tradeUnitPriceBDT;
        setPurchaseProduct(_purchaseProduct);

        setValue('profit', _purchaseProduct.profit);
        setValue('tradeUnitPriceBDT', _purchaseProduct.tradeUnitPriceBDT);
        setValue('minimumTradePrice', _purchaseProduct.minimumTradePrice);
    };

    const onTradePriceChange = (tradeUnitPriceBDT) => {
        let _purchaseProduct = { ...purchaseProduct };
        _purchaseProduct.tradeUnitPriceBDT = roundNumber(tradeUnitPriceBDT);
        _purchaseProduct.profit = roundNumber(_purchaseProduct.tradeUnitPriceBDT - _purchaseProduct.netUnitCostBDT);
        _purchaseProduct.minimumTradePrice = _purchaseProduct.tradeUnitPriceBDT;
        setPurchaseProduct(_purchaseProduct);

        setValue('tradeUnitPriceBDT', _purchaseProduct.tradeUnitPriceBDT);
        setValue('profit', _purchaseProduct.profit);
        setValue('minimumTradePrice', _purchaseProduct.minimumTradePrice);
    };
    
    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || 0;
        let _purchaseProduct = { ...purchaseProduct };
        _purchaseProduct[`${name}`] = val;
        calculateCost(_purchaseProduct);

        setValue(name, val);
    };

    const onProductSelect = (selectedRow) => {
        // set focus to quantity
        quantityRef.current.focus();
        console.log("PRODUCT SELECTED::", selectedRow)
        let _purchaseProduct = { ...purchaseProduct };
        console.log(selectedRow.barCode)
        console.log(selectedRow.lastPurchasePrice)
        _purchaseProduct['dtProduct_id'] = selectedRow._id;
        _purchaseProduct['productName'] = selectedRow.name;
        _purchaseProduct['barCode'] = selectedRow.barCode;
        _purchaseProduct['lastPurchasePrice'] = selectedRow.lastPurchasePrice;
        setPurchaseProduct(_purchaseProduct);

        setValue('dtProduct_id', selectedRow._id);
        setValue('barCode', selectedRow.barCode);
        setValue('productName', selectedRow.name);
        setValue('lastPurchasePrice', selectedRow.lastPurchasePrice);
    };

    const onAddItem = (dt) => {
        console.log(dt);
        onAdd(dt);
        // setPurchaseProduct(emptyPurchaseProduct);
        reset({ ...emptyPurchaseProduct });
    };

    const onEditItem = (dt) => {
        console.log(dt);
        onEdit(dt);
        setIsEdit(false);
        reset({ ...emptyPurchaseProduct });
    };

    const onCancelEditItem = () => {
        setIsEdit(false);
        reset({ ...emptyPurchaseProduct });
    };

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    return (
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
            <Controller
                name="barCode"
                control={control}
                render={({ field, fieldState }) => (
                    <>
                        <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Barcode</label>
                        <InputText inputId={field.name} value={field.value} inputRef={field.ref} disabled={true} />
                        {getFormErrorMessage(field.name)}
                    </>
                )}/>
            </div>
            <div className="field col-12 md:col-2">
            <Controller
                name="lastPurchasePrice"
                control={control}
                render={({ field, fieldState }) => (
                    <>
                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Last Purchase Price</label>
                <InputNumber 
                    inputId={field.name} value={field.value} inputRef={field.ref} 
                    className={classNames({ 'p-invalid': fieldState.error })} 
                    disabled={true} />
                    </>
                )}/>
            </div>            

            <div className="field col-12 md:col-2">
            <Controller
                name="quantity"
                control={control}
                render={({ field, fieldState }) => (
                    <>
                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Quantity</label>
                <InputNumber ref={quantityRef}
                    onFocus={(e) => e.target.select()}
                    inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })}
                    onValueChange={(e) => onInputChange(e, 'quantity')} min={1} max={10000000} />
                    </>
                )}/>
            </div>
            <div className="field col-12 md:col-2">
            <Controller
                name="unitCostF"
                control={control}
                render={({ field, fieldState }) => (
                    <>
                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Unit Cost ({currency})</label>
                <InputNumber
                    onFocus={(e) => e.target.select()}
                    inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })}
                    onValueChange={(e) => onInputChange(e, 'unitCostF')}  maxFractionDigits={2} />
                    </>
                )}/>
            </div>
            <div className="field col-12 md:col-2">
            <Controller
                name="totalCostF"
                control={control}
                render={({ field, fieldState }) => (
                    <>
                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Total Cost ({currency})</label>
                <InputNumber
                inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })}
                disabled={true} />
                    </>
                )}/>
            </div>
            <div className="field col-12 md:col-2">
            <Controller
                name="conversionRate"
                control={control}
                render={({ field, fieldState }) => (
                    <>
                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Conversion Rate</label>
                <InputNumber
                    onFocus={(e) => e.target.select()}
                    inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })}
                    onValueChange={(e) => onInputChange(e, 'conversionRate')} min={1} maxFractionDigits={2} />
                    </>
                )}/>
            </div>
            <div className="field col-12 md:col-2">
            <Controller
                name="unitCostBDT"
                control={control}
                render={({ field, fieldState }) => (
                    <>
                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Unit Cost</label>
                <InputNumber
                inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })}
                disabled={true} />
                    </>
                )}/>
            </div>
            <div className="field col-12 md:col-2">
            <Controller
                name="totalCostBDT"
                control={control}
                render={({ field, fieldState }) => (
                    <>
                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Total Cost</label>
                <InputNumber 
                inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })}
                disabled={true} />
                    </>
                )}/>
            </div>

            <div className="field col-12 md:col-2">
            <Controller
                name="transport"
                control={control}
                render={({ field, fieldState }) => (
                    <>
                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Transport</label>
                <InputNumber
                    onFocus={(e) => e.target.select()}
                    inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })}
                    onValueChange={(e) => onInputChange(e, 'transport')} min={0.00} maxFractionDigits={2} />
                    </>
                )}/>
            </div>
            <div className="field col-12 md:col-2">
            <Controller
                name="duty"
                control={control}
                render={({ field, fieldState }) => (
                    <>
                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Duty</label>
                <InputNumber
                    onFocus={(e) => e.target.select()}
                    inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })}
                    onValueChange={(e) => onInputChange(e, 'duty')} maxFractionDigits={2} />
                    </>
                )}/>
            </div>
    
            <div className="field col-12 md:col-2">
            <Controller
                name="netUnitCostBDT"
                control={control}
                render={({ field, fieldState }) => (
                    <>
                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Net Unit Cost</label>
                <InputNumber 
                inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })}
                disabled={true} />
                    </>
                )}/>
            </div>
            <div className="field col-12 md:col-2">
            <Controller
                name="netCostBDT"
                control={control}
                render={({ field, fieldState }) => (
                    <>
                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Net Cost</label>
                <InputNumber 
                inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })}
                disabled={true} />
                    </>
                )}/>
            </div>

            <div className="field col-12 md:col-2">
            <Controller
                name="profit"
                control={control}
                render={({ field, fieldState }) => (
                    <>
                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Unit Profit</label>
                <InputNumber
                    onFocus={(e) => e.target.select()}
                    inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })}
                    onValueChange={(e) => onProfitChange(e.value)}  maxFractionDigits={2} />
                    </>
                )}/>
            </div>

            <div className="field col-12 md:col-2">
            <Controller
                name="tradeUnitPriceBDT"
                control={control}
                render={({ field, fieldState }) => (
                    <>
                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Unit Trade Price</label>
                <InputNumber
                    onFocus={(e) => e.target.select()}
                    inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })}
                    onValueChange={(e) => onTradePriceChange(e.value)}  maxFractionDigits={2} />
                    </>
                )}/>
            </div>
            
            <div className="field col-12 md:col-2">
            <Controller
                name="minimumTradePrice"
                control={control}
                render={({ field, fieldState }) => (
                    <>
                <label htmlFor="minimumTradePrice">Min Trade Price (U)</label>
                <InputNumber
                    onFocus={(e) => e.target.select()}
                    inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })}
                    onValueChange={(e) => onInputChange(e, 'minimumTradePrice')}  maxFractionDigits={2} />
                    </>
                )}/>
            </div>
            <div className="flex field col-12 md:col-4 align-items-center">
                {isEdit && <Button  label="Update" className="p-button-primary mr-2" onClick={handleSubmit((d) => onEditItem(d))}></Button>}
                {isEdit && <Button label="Cancel" className="p-button-warning" onClick={() => onCancelEditItem()}></Button>}            

                {!isEdit && <Button type="submit" label="Add" className="mt-2" onClick={handleSubmit((d) => onAddItem(d))}/>}                
            </div>
        </div>
    );
}