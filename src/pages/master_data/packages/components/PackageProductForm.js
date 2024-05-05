import React, { useState, useRef, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { classNames } from 'primereact/utils';

export default function PackageProductForm({ 
    onAdd, onEdit, onCancel, 
    selectedItem, selectedProduct, defaultPackageProduct
}) {

    let emptyPackageProduct = {
        dtProduct_id: "",
        code: "",
        price: 0.00,
        quantity: 1,  
        totalPrice: 0.00,
    };

    const {
        control,
        formState: { errors },
        reset,
        setValue,
        handleSubmit
    } = useForm({
        defaultValues: emptyPackageProduct //async () =>  masterDataDBService.getById(modelName, ProductProfile)
    });

    const quantityRef = useRef(null);

    const [packagesProduct, setPackageProduct] = useState(defaultPackageProduct);
    const [product_name, setProductName] = useState('');
    const [currentStock, setCurrentStock] = useState(0);
    const [isEdit, setIsEdit] = useState(false);

    const resetForm = () => {
        reset({ ...emptyPackageProduct });
        setPackageProduct(emptyPackageProduct);
        setProductAndItsStock('', 0);
    };

    const setProductAndItsStock = (name, stock) => {
        setProductName(name);
        setCurrentStock(stock);
    };

    useEffect(() => {
        console.log("1 selectedItem=>>",selectedItem);
        console.log("1 selectedProduct=>>",selectedProduct);
        if (selectedItem.id) {
            setIsEdit(false);
            onProductSelect(selectedItem);
        }else{
            resetForm();
        }
    }, [selectedItem]);

    useEffect(() => {
        console.log("2 selectedItem=>>",selectedItem);
        console.log("2 selectedProduct=>>",selectedProduct);
        if (selectedProduct.dtProduct_id) {
            reset({ ...selectedProduct });
            setPackageProduct(selectedProduct);
            setIsEdit(true);
            setProductAndItsStock(selectedProduct["product_name"], selectedProduct["current_stock"]);
            quantityRef.current.focus();
        }else{
            setIsEdit(false);
            resetForm();
        }
    }, [selectedProduct]);

    const roundNumber = (num) => {
        return Math.round((num + Number.EPSILON) * 100) / 100;
    };

    const calculatePrice = (_packageProduct) => {
        _packageProduct.totalPrice = roundNumber(_packageProduct.price * _packageProduct.quantity);

        setPackageProduct(_packageProduct);

        setValue('totalPrice', _packageProduct.totalPrice);
    };
    
    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || 0;
        let _packageProduct = { ...packagesProduct };
        _packageProduct[`${name}`] = val;
        calculatePrice(_packageProduct);

        setValue(name, val);
    };

    const onProductSelect = async (productSelected) => {
        // set focus to quantity
        let _packageProduct = { ...packagesProduct };
        _packageProduct['dtProduct_id'] = productSelected.id;
        _packageProduct['product_name'] = productSelected.name;
        _packageProduct['brand_name'] = productSelected.brand_name;
        _packageProduct['model_no'] = productSelected.model_no;
        _packageProduct['part_number'] = productSelected.part_number;
        _packageProduct['price'] = productSelected.price;
        _packageProduct['code'] = productSelected.code;
        _packageProduct['quantity'] = 1;
        _packageProduct['remarks'] = productSelected.remarks===null ? '' : productSelected.remarks;

        setPackageProduct(_packageProduct);

        reset({ ..._packageProduct });

        setProductAndItsStock(productSelected["name"], productSelected.current_stock);

        quantityRef.current.focus();
        
        calculatePrice(_packageProduct);
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
                        <InputText readonly="true" value={product_name} placeholder="Select Product" />
                        <InputText hidden inputId={field.name} value={field.value} inputRef={field.ref} />
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
                name="price"
                control={control}
                render={({ field, fieldState }) => (
                    <>
                <label htmlFor={field.name} className={classNames({ 'p-error': errors.value })}>Trade Price</label>
                <InputNumber
                    inputId={field.name} value={field.value} inputRef={field.ref} 
                    maxFractionDigits={2}
                    className={classNames({ 'p-invalid': fieldState.error })}
                    disabled={true} />
                    </>
                )}/>
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
                    maxFractionDigits={2}
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
                maxFractionDigits={2}
                inputId={field.name} value={field.value} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })}
                disabled={true} />
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