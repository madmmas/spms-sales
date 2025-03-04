import React, { useState, useRef, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';

import Warehouse from '../../../components/master_data/Warehouse';

import SelectMasterDataOL from '../../../components/SelectMasterDataOL';

import { OrderService } from '../../../../services/OrderService';
import { MasterDataDBService } from '../../../../services/MasterDataDBService';

import { PRODUCT_MODEL, PRODBRAND_MODEL, PRODMODEL_MODEL } from '../../../../constants/models';

export default function PurchaseProductForm({ 
    onAdd, onEdit, cancelEdit,
    currency, conversionRate, supplierId,
    selectedProduct, defaultPurchaseProduct, defaultWarehouse 
}) {

    let emptyPurchaseProduct = {
        product_id: "", // select product
        warehouse_id: "", // select warehouse
        code: "", // fetch from selected product
        brand_name: "", // fetch from selected product
        model_no: "", // fetch from selected product
        part_number: "", // fetch from selected product
        last_purchase_price: 0.00, // fetch from selected product

        qty: 1,  
        unit_cost_f: 0.00,
        totalCostF: 0.00,
        conversion_rate: conversionRate,
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

    const {
        register,
        control,
        formState: { errors },
        reset,
        setValue,
        handleSubmit
    } = useForm({
        defaultValues: emptyPurchaseProduct //async () =>  masterDataDBService.getById(modelName, ProductProfile)
    });

    const quantityRef = useRef(null);

    const [purchaseProduct, setPurchaseProduct] = useState(defaultPurchaseProduct);
    const [isEdit, setIsEdit] = useState(false);
    const [selSupplierId, setSelSupplierId] = useState(null);

    const [dtProductBrands, setDtProductBrands] = useState(null);
    const [dtProductModels, setDtProductModels] = useState(null);

    const orderService = new OrderService();
    const masterDataDBService = new MasterDataDBService();

    useEffect(() => {
        masterDataDBService.getAll(PRODBRAND_MODEL, {
            rows: 1000,
        }).then(data => {
            data.rows.sort((a, b) => a.name.localeCompare(b.name));
            setDtProductBrands(data.rows);
        });
        masterDataDBService.getAll(PRODMODEL_MODEL, {
            rows: 1000,
        }).then(data => {
            data.rows.sort((a, b) => a.name.localeCompare(b.name));
            setDtProductModels(data.rows);
        });
    }, []);

    useEffect(() => {
        console.log("SUPPLIER ID::", supplierId)
        if(supplierId){
            setSelSupplierId(supplierId);
        }
    }, [supplierId]);

    useEffect(() => {
        setValue('warehouse_id', defaultWarehouse);
    }, [defaultWarehouse]);

    useEffect(() => {
        setValue('conversion_rate', conversionRate);
        let _purchaseProduct = { ...purchaseProduct };
        _purchaseProduct['conversion_rate'] = conversionRate;
        setPurchaseProduct(_purchaseProduct);
    }, [conversionRate]);

    useEffect(() => {
        if (selectedProduct.product_id) {
            reset({ ...selectedProduct });
            setPurchaseProduct(selectedProduct);
            console.log("Selected Product :::: ", selectedProduct);
            setIsEdit(true);
        }
    }, [selectedProduct]);

    useEffect(() => {
        if (cancelEdit) {
            reset({ ...emptyPurchaseProduct });
            setIsEdit(false);
        }
    }, [cancelEdit]);

    const roundNumber = (num) => {
        return Math.round((num + Number.EPSILON) * 100) / 100;
    };

    const calculateCost = (_purchaseProduct) => {
        console.log("CALCULATING COST:::=>>", purchaseProduct.conversion_rate);
        _purchaseProduct.totalCostF = roundNumber(_purchaseProduct.unit_cost_f * _purchaseProduct.qty);
        _purchaseProduct.unit_cost = roundNumber(_purchaseProduct.unit_cost_f * _purchaseProduct.conversion_rate);
        _purchaseProduct.totalCostBDT = roundNumber(_purchaseProduct.unit_cost * _purchaseProduct.qty);
        _purchaseProduct.netUnitCostBDT = roundNumber(_purchaseProduct.unit_cost + (_purchaseProduct.transport/_purchaseProduct.qty) + (_purchaseProduct.duty_vat/_purchaseProduct.qty));
        _purchaseProduct.netCostBDT = roundNumber(_purchaseProduct.netUnitCostBDT * _purchaseProduct.qty);

        _purchaseProduct.trade_price = roundNumber(_purchaseProduct.netUnitCostBDT + _purchaseProduct.profit);
        _purchaseProduct.min_trade_price = _purchaseProduct.min_trade_price;
        setPurchaseProduct(_purchaseProduct);

        setValue('totalCostF', _purchaseProduct.totalCostF);
        setValue('unit_cost', _purchaseProduct.unit_cost);
        setValue('totalCostBDT', _purchaseProduct.totalCostBDT);
        setValue('netUnitCostBDT', _purchaseProduct.netUnitCostBDT);
        setValue('netCostBDT', _purchaseProduct.netCostBDT);
        setValue('trade_price', _purchaseProduct.trade_price);
        setValue('min_trade_price', _purchaseProduct.min_trade_price);
    };

    const onProfitPercentageChange = (discount_profit) => {
        let _purchaseProduct = { ...purchaseProduct };
        _purchaseProduct.discount_profit = roundNumber(discount_profit);
        _purchaseProduct.profit = _purchaseProduct.netUnitCostBDT * roundNumber(discount_profit) / 100;
        _purchaseProduct.trade_price = roundNumber(_purchaseProduct.netUnitCostBDT + _purchaseProduct.profit);
        _purchaseProduct.min_trade_price = _purchaseProduct.min_trade_price;
        setPurchaseProduct(_purchaseProduct);

        setValue('profit', _purchaseProduct.profit);
        setValue('discount_profit', _purchaseProduct.discount_profit);
        setValue('trade_price', _purchaseProduct.trade_price);
        setValue('min_trade_price', _purchaseProduct.min_trade_price);
    };

    const onProfitChange = (profit) => {
        let _purchaseProduct = { ...purchaseProduct };
        _purchaseProduct.profit = roundNumber(profit);
        _purchaseProduct.discount_profit =  roundNumber(_purchaseProduct.profit / _purchaseProduct.netUnitCostBDT * 100);
        _purchaseProduct.trade_price = roundNumber(_purchaseProduct.netUnitCostBDT + _purchaseProduct.profit);
        _purchaseProduct.min_trade_price = _purchaseProduct.min_trade_price;
        setPurchaseProduct(_purchaseProduct);

        setValue('profit', _purchaseProduct.profit);
        setValue('discount_profit', _purchaseProduct.discount_profit);
        setValue('trade_price', _purchaseProduct.trade_price);
        setValue('min_trade_price', _purchaseProduct.min_trade_price);
    };

    const onTradePriceChange = (trade_price) => {
        let _purchaseProduct = { ...purchaseProduct };
        _purchaseProduct.trade_price = roundNumber(trade_price);
        _purchaseProduct.profit = roundNumber(_purchaseProduct.trade_price - _purchaseProduct.netUnitCostBDT);
        _purchaseProduct.discount_profit =  roundNumber(_purchaseProduct.profit / _purchaseProduct.netUnitCostBDT * 100);
        _purchaseProduct.min_trade_price = _purchaseProduct.min_trade_price;
        setPurchaseProduct(_purchaseProduct);

        setValue('trade_price', _purchaseProduct.trade_price);
        setValue('profit', _purchaseProduct.profit);
        setValue('discount_profit', _purchaseProduct.discount_profit);
        setValue('min_trade_price', _purchaseProduct.min_trade_price);
    };
    
    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || 0;
        let _purchaseProduct = { ...purchaseProduct };
        _purchaseProduct[`${name}`] = val;
        setValue(name, val);
        calculateCost(_purchaseProduct);
    };

    const onProductSelect = async (selectedRow) => {

        console.log("supplierId::", selSupplierId)
        let lastTradePrice = 0
        if(selSupplierId===null){
            alert("Select a supplier first.")
            return;
        }

        if(selSupplierId!==null){
            // crash here
            let resp = await orderService.getOrderProductLastPriceByParty("trxPurchase", selectedRow.id, selSupplierId);
            lastTradePrice = resp.prev_price;
        }
        console.log("LAST TRADE PRICE::", lastTradePrice);

        // set focus to qty
        quantityRef.current.focus();
        console.log("PRODUCT SELECTED::", selectedRow);
        console.log("DEFAULT PURCHASE PRODUCT:::=>>", defaultPurchaseProduct);
        let _purchaseProduct = { ...defaultPurchaseProduct };
        _purchaseProduct['product_id'] = selectedRow.id;
        _purchaseProduct['product_name'] = selectedRow.name;
        _purchaseProduct['code'] = selectedRow.code;
        _purchaseProduct['brand_name'] = selectedRow.brand_name;
        _purchaseProduct['model_no'] = selectedRow.model_no;
        _purchaseProduct['part_number'] = selectedRow.part_number;
        _purchaseProduct['last_purchase_price'] = lastTradePrice;
        setPurchaseProduct(_purchaseProduct);
        console.log("SELECTED __PRODUCT:::=>>", _purchaseProduct)
        console.log("SELECTED PRODUCT:::=>>", purchaseProduct)
        console.log("SELECTED PRODUCT ID :::=>>", selectedRow.id)
        setValue('product_id', selectedRow.id);
        setValue('code', selectedRow.code);
        setValue('brand_name', selectedRow.brand_name);
        setValue('model_no', selectedRow.model_no);
        setValue('part_number', selectedRow.part_number);
        setValue('product_name', selectedRow.name);
        setValue('last_purchase_price', lastTradePrice);
        setValue('warehouse_id', defaultWarehouse);
    };

    const onWarehouseSelect = (selectedRow) => {
        console.log("WAREHOUSE SELECTED::", selectedRow);
        setValue('warehouse_id', selectedRow.id);
    };

    const onAddItem = (dt) => {
        console.log("PRODUCT-GOING-TOBE-ADDED",dt);
        reset({ ...emptyPurchaseProduct });
        onAdd(dt);
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

    let defaultFilters = {
        globalFilterFields: ['name', 'code', 'part_number'],
        fields: ['id', 'name', 'brand_name', 'model_no', 'part_number'],
        first: 0,
        rows: 10,
        page: 1,
        sortField: null,
        sortOrder: null,
        filters: {
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            name: { value: null, matchMode: FilterMatchMode.CONTAINS },
            code: { value: null, matchMode: FilterMatchMode.CONTAINS },
            part_number: { value: null, matchMode: FilterMatchMode.CONTAINS },
            dtProductBrand_id: { value: null, matchMode: FilterMatchMode.EQUALS },
            dtProductModel_id: { value: null, matchMode: FilterMatchMode.EQUALS },
        }
    }

    const brandFilterTemplate = (options) => {
        return <Dropdown filter value={options.value} optionValue="id" optionLabel="name" options={dtProductBrands} onChange={(e) => options.filterApplyCallback(e.value, options.index)} placeholder="Select Brand" className="p-column-filter" />;
    };

    const modelFilterTemplate = (options) => {
        return <Dropdown filter value={options.value} optionValue="id" optionLabel="name" options={dtProductModels} onChange={(e) => options.filterApplyCallback(e.value, options.index)} placeholder="Select Model" className="p-column-filter" />;
    };

    const brandNameBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.dtProductBrand_id_shortname}
            </>
        );
    };

    const modelNoBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.dtProductModel_id_shortname}
            </>
        );
    };

    return (
        <div className="p-fluid formgrid grid">
            <div className="field col-12 md:col-2">
            <Controller
                name="product_id"
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
                                {field: 'part_number', header: 'Part Number', filterPlaceholder: 'Filter by Part Number', width: '15rem'},
                                {field: 'dtProductBrand_id', header: 'Brand Name', body: brandNameBodyTemplate, filterPlaceholder: 'Filter by Barnd Name', filterElement: brandFilterTemplate, width: '15rem'},
                                {field: 'dtProductModel_id', header: 'Model No', body: modelNoBodyTemplate, filterPlaceholder: 'Filter by Model No', filterElement: modelFilterTemplate, width: '15rem'},
                                {field: 'code', header: 'Product Code', filterPlaceholder: 'Filter by Product Code', width: '15rem'},
                            ]} />
                        {getFormErrorMessage(field.name)}
                    </>
                )}/>
            </div>
            <div className="field col-12 md:col-2">
            <Controller
                name="warehouse_id"
                control={control}
                rules={{ required: 'Warehouse is required.' }}
                    render={({ field, fieldState }) => (
                    <>
                        <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Warehouse*</label>
                        <Warehouse field={field} fieldState={fieldState} onSelect={onWarehouseSelect} />
                        {getFormErrorMessage(field.name)}
                    </>
                )}/>
            </div>
            <div className="field col-12 md:col-2">
            <Controller
                name="code"
                control={control}
                render={({ field, fieldState }) => (
                    <>
                        <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Code</label>
                        <InputText inputId={field.name} value={field.value} inputRef={field.ref} disabled={true} />
                        {getFormErrorMessage(field.name)}
                    </>
                )}/>
            </div>
            <div className="field col-12 md:col-2">
            <Controller
                name="last_purchase_price"
                control={control}
                render={({ field, fieldState }) => (
                    <>
                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Last Purchase Price</label>
                <InputNumber maxFractionDigits={2}
                    inputId={field.name} value={field.value} inputRef={field.ref} 
                    className={classNames({ 'p-invalid': fieldState.error })} 
                    disabled={true} />
                    </>
                )}/>
            </div>            

            <div className="field col-12 md:col-2">
            <Controller
                name="qty"
                control={control}
                render={({ field, fieldState }) => (
                    <>
                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Quantity</label>
                <InputNumber ref={quantityRef}
                    onFocus={(e) => e.target.select()}
                    maxFractionDigits={2}
                    inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })}
                    onValueChange={(e) => onInputChange(e, 'qty')} min={1} max={10000000} />
                    </>
                )}/>
            </div>
            <div className="field col-12 md:col-2">
            <Controller
                name="unit_cost_f"
                control={control}
                render={({ field, fieldState }) => (
                    <>
                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Unit Cost ({currency})</label>
                <InputNumber
                    onFocus={(e) => e.target.select()}
                    inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })}
                    onValueChange={(e) => onInputChange(e, 'unit_cost_f')}  maxFractionDigits={2} />
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
                <InputNumber maxFractionDigits={2}
                inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })}
                disabled={true} />
                    </>
                )}/>
            </div>
            <div className="field col-12 md:col-2">
            <Controller
                name="conversion_rate"
                control={control}
                render={({ field, fieldState }) => (
                    <>
                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Conversion Rate</label>
                <InputNumber 
                    onFocus={(e) => e.target.select()}
                    inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })}
                    onValueChange={(e) => onInputChange(e, 'conversion_rate')} min={1} maxFractionDigits={2} 
                    // readOnly={true}  
                    // disabled={true}
                    />
                    </>
                )}/>
            </div>
            <div className="field col-12 md:col-2">
            <Controller
                name="unit_cost"
                control={control}
                render={({ field, fieldState }) => (
                    <>
                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Unit Cost</label>
                <InputNumber maxFractionDigits={2}
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
                <InputNumber maxFractionDigits={2}
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
                name="duty_vat"
                control={control}
                render={({ field, fieldState }) => (
                    <>
                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Duty</label>
                <InputNumber
                    onFocus={(e) => e.target.select()}
                    inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })}
                    onValueChange={(e) => onInputChange(e, 'duty_vat')} maxFractionDigits={2} />
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
                <InputNumber  maxFractionDigits={2}
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
                <InputNumber maxFractionDigits={2}
                inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })}
                disabled={true} />
                    </>
                )}/>
            </div>

            <div className="field col-12 md:col-2">
            <Controller
                name="discount_profit"
                control={control}
                render={({ field, fieldState }) => (
                    <>
                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Profit (%)</label>
                <InputNumber maxFractionDigits={2}
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
                name="trade_price"
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
                name="min_trade_price"
                control={control}
                render={({ field, fieldState }) => (
                    <>
                <label htmlFor="min_trade_price">Min Trade Price (U)</label>
                <InputNumber
                    onFocus={(e) => e.target.select()}
                    inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })}
                    onValueChange={(e) => onInputChange(e, 'min_trade_price')}  maxFractionDigits={2} />
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