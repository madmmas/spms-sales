import React, { useState, useRef, useEffect } from 'react';
import { useForm, Controller, set } from 'react-hook-form';
import { roundNumber } from '../../../../utils';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { classNames } from 'primereact/utils';

import SalesProductDetail from './SalesProductDetail';

import { ProductService } from '../../../../services/ProductService';

export default function SalesProductForm({
    salesItems,
    editMode, returnMode, onReturnItem,
    selectedItem,
    addSalesItem, updateSalesItem, removeSalesItem, 
    selectProductFromList, deselectProductFromList,
    onChangeVat, onChangeDeliveryCost, onChangeAdditionalDiscount,
    onChangeGross, onChangeDiscount, onChangeNet,
    vat, deliveryCost, addDiscount, gross, net, discount, lastTradePrice, Id
}) {

    const {
        register,
        control,
        formState: { errors },
        reset,
        setValue,
        handleSubmit
    } = useForm({
        defaultValues: {}
    });

    const quantityRef = useRef(null);

    const [salesProduct, setSalesProduct] = useState(null);
    const [productName, setProductName] = useState('');
    const [min_trade_price, setMinPrice] = useState(0);
    const [current_stock, setCurrentStock] = useState(0);
    const [isEdit, setIsEdit] = useState(false);

    const [selectedItemIndex, setSelectedItemIndex] = useState(null);

    const resetForm = () => {
        reset({ 
            "product_id": "",
            "code": "",
            "qty": 1,
            "min_trade_price": 0.00,
            "trade_price": 0.00,
            "remarks": "",
            "totalPrice": 0.00,
            "discount_profit": 0.00,
            "discountedAmount": 0.00,
            "netPrice": 0.00,
            "lastTradePrice": 0.00,
         });
        setSalesProduct(null);
        setMinPrice(0);
        setProductAndItsStock('', 0);
    };

    const setProductAndItsStock = (name, stock) => {
        console.log('setProductAndItsStock', name, stock)
        setProductName(name);
        setCurrentStock(stock);
    };

    useEffect(() => {
        console.log("salesItems-UPDATED::",salesItems);
        if(salesItems && salesItems.length > 0){
            let _total = 0.00;
            salesItems.forEach((item) => {
                _total += Number(item.netPrice);
            });
            console.log("_total::", _total)
            // setTotalAmount(_total);
        }
    }, [salesItems]);

    useEffect(() => {
        if (selectedItem && selectedItem.id) {
            setIsEdit(false);
            selectProduct(selectedItem);
        }else{
            resetForm();
        }
    }, [selectedItem]);

    useEffect(() => {
        console.log("lastTradePrice::===>", lastTradePrice)
        let _saleProduct = { ...salesProduct };
        _saleProduct['lastTradePrice'] = lastTradePrice;
        setSalesProduct(_saleProduct);

        setValue('lastTradePrice', lastTradePrice);
    }, [lastTradePrice]);

    const calculatePrice = (_saleProduct) => {
        _saleProduct.totalPrice = roundNumber(Number(_saleProduct.trade_price) * Number(_saleProduct.qty));
        _saleProduct.discountedAmount = roundNumber(_saleProduct.totalPrice * Number(_saleProduct.discount_profit) / 100);
        _saleProduct.netPrice = roundNumber(_saleProduct.totalPrice -  _saleProduct.discountedAmount);

        setSalesProduct(_saleProduct);

        setValue('totalPrice', _saleProduct.totalPrice);
        setValue('discountedAmount', _saleProduct.discountedAmount);
        setValue('netPrice', _saleProduct.netPrice);
    };
    
    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || 0;
        let _saleProduct = { ...salesProduct };
        _saleProduct[`${name}`] = val;
        calculatePrice(_saleProduct);

        setValue(name, val);
    };

    const selectProduct = async item => {
        console.log("selectProduct::", item)
        // get product current stock
        let _productStock = item.current_stock;

        // set focus to qty
        let _saleProduct = { ...salesProduct };
        _saleProduct['product_id'] = item.id;
        _saleProduct['product_name'] = item.name;
        _saleProduct['min_trade_price'] = item.min_trade_price;
        _saleProduct['trade_price'] = item.trade_price;
        _saleProduct['current_stock'] = _productStock;
        _saleProduct['qty'] = item.qty || 1;
        _saleProduct['discount_profit'] = item.discount_profit || 0.00;
        _saleProduct['remarks'] = item.remarks || '';
        // _saleProduct['lastTradePrice'] = item.lastTradePrice;

        setSalesProduct(_saleProduct);

        reset({ ..._saleProduct });
        setMinPrice(item.min_trade_price);
        setProductAndItsStock(item["name"], _productStock);

        quantityRef.current.focus();
        
        calculatePrice(_saleProduct);
    };

    const addItem = item => {
        resetForm();

        addSalesItem(item);
    };

    const updateItem = item => {
        setIsEdit(false);
        resetForm();

        updateSalesItem(item, selectedItemIndex);
    };

    const removeItem = (index) => {
        removeSalesItem(index);
    };

    const onCancelEditItem = () => {
        setIsEdit(false);
        resetForm();
        deselectProductFromList();
    };

    ///// Events -- PRODUCT-LIST /////
    const editSalesProduct = item => {
        console.log("editSalesProduct::", item)
        setIsEdit(true);
        setSelectedItemIndex(item.index);

        selectProduct({
            "id": item.product_id,
            "name": item.product_name,
            "min_trade_price": item.min_trade_price,
            "trade_price": item.trade_price,
            "current_stock": item.current_stock,
            "qty": item.qty,
            "discount_profit": item.discount_profit,
            "remarks": item.remarks,
            // "lastTradePrice": item.lastTradePrice,
        });

        selectProductFromList(item.product_id);
    };
    
    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    const renderForm = () => {
        return (
            <div className="card p-fluid formgrid grid">
            <div className="field col-12 md:col-2">
            <Controller
                name="product_id"
                control={control}
                rules={{ required: 'Product is required.' }}
                    render={({ field, fieldState }) => (
                    <>
                        <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Product Name*</label>
                        <InputText readonly="true" value={productName} placeholder="Select Product" />
                        <InputText hidden inputId={field.name} value={field.value} inputRef={field.ref}  className={classNames({ 'p-invalid': fieldState.error })}/>
                        {getFormErrorMessage(field.name)}
                    </>
                )}/>
            </div>
            <div className="field col-12 md:col-2">
            <Controller
                name="lastTradePrice"
                control={control}
                render={({ field, fieldState }) => (
                    <>
                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Last Trade Price</label>
                {/* <a href={"#/invoice/"+Id} target="_blank"></a> */}
                <InputNumber 
                    inputId={field.name} value={field.value} inputRef={field.ref} 
                    className={classNames({ 'p-invalid': fieldState.error })} 
                    onClick={(e) => {
                        e.preventDefault();
                        if(Id){
                            window.open("#/invoice/"+Id, '_blank');
                        }
                    }}
                    disabled={true} />
                    </>
                )}/>
            </div>            
            <div className="field col-12 md:col-2">
            <Controller
                name="min_trade_price"
                control={control}
                render={({ field, fieldState }) => (
                    <>
                        <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Min Trade Price</label>
                        <InputText inputId={field.name} value={field.value} inputRef={field.ref} disabled={true}  className={classNames({ 'p-invalid': fieldState.error })}/>
                        {getFormErrorMessage(field.name)}
                    </>
                )}/>
            </div>
            <div className="field col-12 md:col-2">
                <label>Current Stock</label>
                <InputText readonly="true" value={current_stock} placeholder="Current Stock" />
            </div>
            <div className="field col-12 md:col-2">
            <Controller
                name="qty"
                control={control}
                rules={{ 
                    required: 'Quantity is required.', 
                    max: { value: current_stock, message: 'Must be less than or equal to current stock.' } 
                }}
                render={({ field, fieldState }) => (
                    <>
                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Quantity</label>
                <InputNumber ref={quantityRef}
                    onFocus={(e) => e.target.select()}
                    inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })}
                    onValueChange={(e) => onInputChange(e, 'qty')} min={1} max={10000000} />
                    </>
                )}/>
            </div>
            <div className="field col-12 md:col-2">
            <Controller
                name="trade_price"
                control={control}
                rules={{ 
                    required: 'Trade Price is required.', 
                    min: { value: min_trade_price, message: 'Must be less than or equal to current stock.' } 
                }}
                render={({ field, fieldState }) => (
                    <>
                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Trade Price</label>
                <InputNumber
                    onFocus={(e) => e.target.select()}
                    inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })}
                    onValueChange={(e) => onInputChange(e, 'trade_price')} min={min_trade_price} max={10000000} />
                    </>
                )}/>
            </div>
            <div className="field col-12 md:col-2">
            <Controller
                name="totalPrice"
                control={control}
                render={({ field, fieldState }) => (
                    <>
                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Total Price</label>
                <InputNumber 
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
                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Discount %</label>
                <InputNumber
                    onFocus={(e) => e.target.select()}
                    inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })}
                    onValueChange={(e) => onInputChange(e, 'discount_profit')} min={0.00} maxFractionDigits={2} />
                    </>
                )}/>
            </div>

            <div className="field col-12 md:col-2">
            <Controller
                name="netPrice"
                control={control}
                render={({ field, fieldState }) => (
                    <>
                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Net Price</label>
                <InputNumber 
                inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })}
                disabled={true} />
                    </>
                )}/>
            </div>

            <div className="field col-12 md:col-4">
            <Controller
                name="remarks"
                control={control}
                render={({ field, fieldState }) => (
                    <>
                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Remarks</label>
                <InputText inputId={field.name} value={field.value} inputRef={field.ref} 
                    onChange={(e) => onInputChange(e, 'remarks')} disabled={true} 
                    className={classNames({ 'p-invalid': fieldState.error })}
                    />
                    </>
                )}/>
            </div>

            <div className=" field col-12 md:col-2 align-items-center">
                {isEdit && <Button  label="Update" className="p-button-primary mr-2" onClick={handleSubmit((d) => updateItem(d))}></Button>}

                {!isEdit && <Button type="submit" label="Add" className="p-button-primary" onClick={handleSubmit((d) => addItem(d))}/>}                
                <Button label="Cancel" className="p-button-outlined p-button-warning mt-2" onClick={() => onCancelEditItem()}></Button>
            </div>
        </div>
        );
    };

    return (
        <>    
            {editMode && renderForm()}
            <SalesProductDetail salesItems={salesItems}
                    editMode={editMode} 
                    returnMode={returnMode} onReturnItem={(dt) => onReturnItem(dt)}        
                    onEdit={(dt) => editSalesProduct(dt)}
                    onDelete={(index) => removeItem(index)}
                    onChangeVat={(e) => onChangeVat(e)}
                    onChangeDeliveryCost={(e) => onChangeDeliveryCost(e)}
                    onChangeAdditionalDiscount={(e) => onChangeAdditionalDiscount(e)}
                    onChangeGross={(e) => onChangeGross(e)}
                    onChangeDiscount={(e) => onChangeDiscount(e)}
                    onChangeNet={(e) => onChangeNet(e)}
                    vat={vat} deliveryCost={deliveryCost} addDiscount={addDiscount}
                    gross={gross} net={net} discount={discount}
                />
        </>
    );
}