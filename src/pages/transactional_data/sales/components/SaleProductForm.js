import React, { useState, useRef, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { classNames } from 'primereact/utils';

import SelectMasterData from '../../../components/SelectMasterData';
import SelectMasterDataOL from '../../../components/SelectMasterDataOL';

import { PRODUCT_MODEL, WAREHOUSE_MODEL } from '../../../../constants/models';

export default function SaleProductForm({ onAdd, onEdit, currency, selectedProduct, defaultSaleProduct }) {

    let emptySaleProduct = {
        dtProduct_id: "", // select product
        dtWarehouse_id: "", // select warehouse
        barCode: "", // fetch from selected product
        lastSalePrice: 0.00, // fetch from selected product

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

        profitPercentage: 0,
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
        defaultValues: emptySaleProduct //async () =>  hrManagementService.getById(modelName, ProductProfile)
    });

    const quantityRef = useRef(null);

    const [saleProduct, setSaleProduct] = useState(defaultSaleProduct);
    const [submitted, setSubmitted] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        if (selectedProduct.dtProduct_id) {
            // showDialog();
            reset({ ...selectedProduct });
            setSaleProduct(selectedProduct);
            console.log("Selected Product :::: ", selectedProduct);
            setIsEdit(true);
        }
    }, [selectedProduct]);

    const roundNumber = (num) => {
        return Math.round((num + Number.EPSILON) * 100) / 100;
    };

    const calculateCost = (_saleProduct) => {
        _saleProduct.totalCostF = roundNumber(_saleProduct.unitCostF * _saleProduct.quantity);
        _saleProduct.unitCostBDT = roundNumber(_saleProduct.unitCostF * _saleProduct.conversionRate);
        _saleProduct.totalCostBDT = roundNumber(_saleProduct.unitCostBDT * _saleProduct.quantity);
        _saleProduct.netUnitCostBDT = roundNumber(_saleProduct.unitCostBDT + (_saleProduct.transport/_saleProduct.quantity) + (_saleProduct.duty/_saleProduct.quantity));
        _saleProduct.netCostBDT = roundNumber(_saleProduct.netUnitCostBDT * _saleProduct.quantity);

        _saleProduct.tradeUnitPriceBDT = roundNumber(_saleProduct.netUnitCostBDT + _saleProduct.profit);
        _saleProduct.minimumTradePrice = _saleProduct.tradeUnitPriceBDT;
        setSaleProduct(_saleProduct);

        setValue('totalCostF', _saleProduct.totalCostF);
        setValue('unitCostBDT', _saleProduct.unitCostBDT);
        setValue('totalCostBDT', _saleProduct.totalCostBDT);
        setValue('netUnitCostBDT', _saleProduct.netUnitCostBDT);
        setValue('netCostBDT', _saleProduct.netCostBDT);
        setValue('tradeUnitPriceBDT', _saleProduct.tradeUnitPriceBDT);
        setValue('minimumTradePrice', _saleProduct.minimumTradePrice);
    };

    const onProfitPercentageChange = (profitPercentage) => {
        let _saleProduct = { ...saleProduct };
        _saleProduct.profitPercentage = roundNumber(profitPercentage);
        _saleProduct.profit = _saleProduct.netUnitCostBDT * roundNumber(profitPercentage) / 100;
        _saleProduct.tradeUnitPriceBDT = roundNumber(_saleProduct.netUnitCostBDT + _saleProduct.profit);
        _saleProduct.minimumTradePrice = _saleProduct.tradeUnitPriceBDT;
        setSaleProduct(_saleProduct);

        setValue('profit', _saleProduct.profit);
        setValue('profitPercentage', _saleProduct.profitPercentage);
        setValue('tradeUnitPriceBDT', _saleProduct.tradeUnitPriceBDT);
        setValue('minimumTradePrice', _saleProduct.minimumTradePrice);
    };

    const onProfitChange = (profit) => {
        let _saleProduct = { ...saleProduct };
        _saleProduct.profit = roundNumber(profit);
        _saleProduct.profitPercentage =  roundNumber(_saleProduct.profit / _saleProduct.netUnitCostBDT * 100);
        _saleProduct.tradeUnitPriceBDT = roundNumber(_saleProduct.netUnitCostBDT + _saleProduct.profit);
        _saleProduct.minimumTradePrice = _saleProduct.tradeUnitPriceBDT;
        setSaleProduct(_saleProduct);

        setValue('profit', _saleProduct.profit);
        setValue('profitPercentage', _saleProduct.profitPercentage);
        setValue('tradeUnitPriceBDT', _saleProduct.tradeUnitPriceBDT);
        setValue('minimumTradePrice', _saleProduct.minimumTradePrice);
    };

    const onTradePriceChange = (tradeUnitPriceBDT) => {
        let _saleProduct = { ...saleProduct };
        _saleProduct.tradeUnitPriceBDT = roundNumber(tradeUnitPriceBDT);
        _saleProduct.profit = roundNumber(_saleProduct.tradeUnitPriceBDT - _saleProduct.netUnitCostBDT);
        _saleProduct.profitPercentage =  roundNumber(_saleProduct.profit / _saleProduct.netUnitCostBDT * 100);
        _saleProduct.minimumTradePrice = _saleProduct.tradeUnitPriceBDT;
        setSaleProduct(_saleProduct);

        setValue('tradeUnitPriceBDT', _saleProduct.tradeUnitPriceBDT);
        setValue('profit', _saleProduct.profit);
        setValue('profitPercentage', _saleProduct.profitPercentage);
        setValue('minimumTradePrice', _saleProduct.minimumTradePrice);
    };
    
    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || 0;
        let _saleProduct = { ...saleProduct };
        _saleProduct[`${name}`] = val;
        calculateCost(_saleProduct);

        setValue(name, val);
    };

    const onProductSelect = (selectedRow) => {
        // set focus to quantity
        quantityRef.current.focus();
        console.log("PRODUCT SELECTED::", selectedRow)
        let _saleProduct = { ...saleProduct };
        console.log(selectedRow.barCode)
        console.log(selectedRow.lastSalePrice)
        _saleProduct['dtProduct_id'] = selectedRow._id;
        _saleProduct['productName'] = selectedRow.name;
        _saleProduct['barCode'] = selectedRow.barCode;
        _saleProduct['lastSalePrice'] = selectedRow.lastSalePrice;
        setSaleProduct(_saleProduct);

        setValue('dtProduct_id', selectedRow._id);
        setValue('barCode', selectedRow.barCode);
        setValue('productName', selectedRow.name);
        setValue('lastSalePrice', selectedRow.lastSalePrice);
        setValue('dtWarehouse_id', selectedRow.dtWarehouse_id);
    };

    const onAddItem = (dt) => {
        console.log(dt);
        onAdd(dt);
        // setSaleProduct(emptySaleProduct);
        reset({ ...emptySaleProduct });
    };

    const onEditItem = (dt) => {
        console.log(dt);
        onEdit(dt);
        setIsEdit(false);
        reset({ ...emptySaleProduct });
    };

    const onCancelEditItem = () => {
        setIsEdit(false);
        reset({ ...emptySaleProduct });
    };

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    let defaultFilters = {
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
                        <SelectMasterDataOL field={field} modelName={PRODUCT_MODEL}
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
                            ]} />
                        {getFormErrorMessage(field.name)}
                    </>
                )}/>
            </div>
            <div className="field col-12 md:col-2">
            <Controller
                name="dtWarehouse_id"
                control={control}
                rules={{ required: 'Warehouse is required.' }}
                    render={({ field, fieldState }) => (
                    <>
                        <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Warehouse*</label>
                        <SelectMasterData field={field} modelName={WAREHOUSE_MODEL}
                            displayField="name"
                            className={classNames({ 'p-invalid': fieldState.error })} 
                            // onSelect={onWarehouseSelect}
                            columns={[
                                {field: 'name', header: 'Warehouse', filterPlaceholder: 'Filter by Warehouse'}, 
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
                name="lastSalePrice"
                control={control}
                render={({ field, fieldState }) => (
                    <>
                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Last Sale Price</label>
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
                name="profitPercentage"
                control={control}
                render={({ field, fieldState }) => (
                    <>
                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Profit (%)</label>
                <InputNumber
                    onFocus={(e) => e.target.select()}
                    inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })}
                    onValueChange={(e) => onProfitPercentageChange(e.value)} />
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

                {!isEdit && <Button type="submit" label="Add Product" className="mt-2" onClick={handleSubmit((d) => onAddItem(d))}/>}                
            </div>
        </div>
    );
}