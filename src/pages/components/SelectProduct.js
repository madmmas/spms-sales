import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { ProductService } from '../../services/ProductService';

export default function SelectProduct({ field, className, value }) {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(value);
    const [rowClick, setRowClick] = useState(true);
    const [deleteProfilesDialog, setDeleteProfilesDialog] = useState(false);
    const [supplierDialog, setSupplierDialog] = useState(false);

    const productService = new ProductService();

    useEffect(() => {
        productService.getProductsSmall().then((data) => setProducts(data));
    }, []);

    const hideDialog = () => {
        setSupplierDialog(false);
    };

    const selectAndHideDialog = () => {
        setSupplierDialog(false);
    };

    const showDialog = () => {
        setSupplierDialog(true);
    };

    const deleteProfilesDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Ok" icon="pi pi-check" className="p-button-text" onClick={selectAndHideDialog} />
        </>
    );

    return (
        <>
            <div className="p-inputgroup">
                <InputText disabled inputId={field.name} value={field.value} inputRef={field.ref}  className={className} />
                <Button icon="pi pi-search" className="p-button-warning" onClick={(e)=>{e.preventDefault(); showDialog()}} />
            </div>
            <Dialog visible={supplierDialog} header="Confirm" modal footer={deleteProfilesDialogFooter} onHide={hideDialog}>
                <DataTable value={products} selectionMode="radiobutton" selection={selectedProduct} onSelectionChange={(e) => {field.onChange(e.value.name); setSelectedProduct(e.value)}} dataKey="id" tableStyle={{ minWidth: '50rem' }}>
                    <Column selectionMode="single" headerStyle={{ width: '3rem' }}></Column>
                    <Column field="code" header="Code"></Column>
                    <Column field="name" header="Name"></Column>
                    <Column field="category" header="Category"></Column>
                    <Column field="quantity" header="Quantity"></Column>
                </DataTable>
            </Dialog>
        </>
    );
}