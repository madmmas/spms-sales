import React, { useState, useRef, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { classNames } from 'primereact/utils';

import { ProductService } from '../../../../services/ProductService';

export default function SalesProductForm({ 
    onAdd, onEdit, onCancel, 
    selectedItem, selectedProduct, defaultSalesProduct
}) {

    let emptySalesProduct = {
        dtProduct_id: "",
        barCode: "",
        lastTradePrice: 0.00,
        unitTradePrice: 0.00,

        quantity: 1,  
        totalPrice: 0.00,
        discount: 0.00,
        discountedAmount: 0.00,
        netPrice: 0.00,

        remarks: "",
    };

    const {
        register,
        control,
        formState: { errors },
        reset,
        setValue,
        handleSubmit
    } = useForm({
        defaultValues: emptySalesProduct //async () =>  hrManagementService.getById(modelName, ProductProfile)
    });

    const quantityRef = useRef(null);

    const [salesProduct, setSalesProduct] = useState(defaultSalesProduct);
    const [productName, setProductName] = useState('');
    const [currentStock, setCurrentStock] = useState(0);
    const [isEdit, setIsEdit] = useState(false);

    const productService = new ProductService();

    const resetForm = () => {
        reset({ ...emptySalesProduct });
        setSalesProduct(emptySalesProduct);
        setProductAndItsStock('', 0);
    };

    const setProductAndItsStock = (name, stock) => {
        setProductName(name);
        setCurrentStock(stock);
    };

    useEffect(() => {
        if (selectedItem._id) {
            setIsEdit(false);
            onProductSelect(selectedItem);
        }else{
            resetForm();
        }
    }, [selectedItem]);

    useEffect(() => {
        if (selectedProduct.dtProduct_id) {
            reset({ ...selectedProduct });
            setSalesProduct(selectedProduct);
            setIsEdit(true);
            setProductAndItsStock(selectedProduct["productName"], selectedProduct["currentStock"]);
            quantityRef.current.focus();
        }else{
            setIsEdit(false);
            resetForm();
        }
    }, [selectedProduct]);

    const roundNumber = (num) => {
        return Math.round((num + Number.EPSILON) * 100) / 100;
    };

    const calculatePrice = (_saleProduct) => {
        _saleProduct.totalPrice = roundNumber(_saleProduct.unitTradePrice * _saleProduct.quantity);
        _saleProduct.discountedAmount = roundNumber(_saleProduct.totalPrice * _saleProduct.discount / 100);
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

    const onProductSelect = async (productSelected) => {
        // get product current stock
        let productStock = await productService.getProductCurrentStock(productSelected._id);

        // set focus to quantity
        let _saleProduct = { ...salesProduct };
        _saleProduct['dtProduct_id'] = productSelected._id;
        _saleProduct['productName'] = productSelected.name;
        _saleProduct['brandName'] = productSelected.brandName;
        _saleProduct['modelNo'] = productSelected.modelNo;
        _saleProduct['partNumber'] = productSelected.partNumber;
        // _saleProduct['barCode'] = productSelected.barCode;
        _saleProduct['unitTradePrice'] = productSelected.unitTradePrice;
        _saleProduct['lastTradePrice'] = productSelected.lastTradePrice;
        _saleProduct['currentStock'] = productStock;
        _saleProduct['quantity'] = 1;
        _saleProduct['discount'] = 0;
        _saleProduct['remarks'] = productSelected.remarks===null ? '' : productSelected.remarks;

        setSalesProduct(_saleProduct);

        reset({ ..._saleProduct });

        setProductAndItsStock(productSelected["name"], productStock);

        quantityRef.current.focus();
        
        calculatePrice(_saleProduct);
    };

    const onAddItem = (dt) => {
        onAdd(dt);
        resetForm();
    };

    const onEditItem = (dt) => {
        onEdit(dt);
        setIsEdit(false);
        resetForm();
    };

    const onCancelEditItem = () => {
        onCancel();
        setIsEdit(false);
        resetForm();
    };

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    return (
        <>
        <div className="card p-fluid formgrid grid">
            <div className="field col-12 md:col-2">
            <Controller
                name="dtProduct_id"
                control={control}
                rules={{ required: 'Product is required.' }}
                    render={({ field, fieldState }) => (
                    <>
                        <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Add Product*</label>
                        <InputText readonly="true" value={productName} placeholder="Select Product" />
                        <InputText hidden inputId={field.name} value={field.value} inputRef={field.ref} />
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
                name="lastTradePrice"
                control={control}
                render={({ field, fieldState }) => (
                    <>
                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Last Trade Price</label>
                <InputNumber 
                    inputId={field.name} value={field.value} inputRef={field.ref} 
                    className={classNames({ 'p-invalid': fieldState.error })} 
                    disabled={true} />
                    </>
                )}/>
            </div>            

            <div className="field col-12 md:col-2">
            <Controller
                name="unitTradePrice"
                control={control}
                render={({ field, fieldState }) => (
                    <>
                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Trade Price</label>
                <InputNumber
                    inputId={field.name} value={field.value} inputRef={field.ref} 
                    className={classNames({ 'p-invalid': fieldState.error })}
                    disabled={true} />
                    </>
                )}/>
            </div>
            <div className="field col-12 md:col-2">
                <label>Current Stock</label>
                <InputText readonly="true" value={currentStock} placeholder="Current Stock" />
            </div>
            <div className="field col-12 md:col-2">
            <Controller
                name="quantity"
                control={control}
                rules={{ 
                    required: 'Quantity is required.', 
                    max: { value: currentStock, message: 'Must be less than or equal to current stock.' } 
                }}
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
                name="discount"
                control={control}
                render={({ field, fieldState }) => (
                    <>
                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Discount %</label>
                <InputNumber
                    onFocus={(e) => e.target.select()}
                    inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })}
                    onValueChange={(e) => onInputChange(e, 'discount')} min={0.00} maxFractionDigits={2} />
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
                    onChange={(e) => onInputChange(e, 'remarks')} disabled={true} />
                    </>
                )}/>
            </div>

            <div className=" field col-12 md:col-2 align-items-center">
                {isEdit && <Button  label="Update" className="p-button-primary mr-2" onClick={handleSubmit((d) => onEditItem(d))}></Button>}

                {!isEdit && <Button type="submit" label="Add" className="p-button-primary" onClick={handleSubmit((d) => onAddItem(d))}/>}                
                <Button label="Cancel" className="p-button-outlined p-button-warning mt-2" onClick={() => onCancelEditItem()}></Button>
            </div>
        </div>
    </>
    );
}