import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputSwitch } from 'primereact/inputswitch';
import { Dialog } from 'primereact/dialog';
import { ProductService } from '../../services/ProductService';

export default function SelectProduct() {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [rowClick, setRowClick] = useState(true);
    const [deleteProfilesDialog, setDeleteProfilesDialog] = useState(false);

    useEffect(() => {
        // ProductService.getProductsMini().then((data) => setProducts(data));
    }, []);

    const deleteProfilesDialogFooter = (
        <>
            {/* <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProfilesDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedProfiles} /> */}
        </>
    );

    return (
        <Dialog visible={deleteProfilesDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProfilesDialogFooter} 
        // onHide={hideDeleteProfilesDialog}
        >
            {/* <div className="flex align-items-center justify-content-center"> */}
            {/* <div className="flex justify-content-center align-items-center mb-4 gap-2">
                <InputSwitch inputId="input-rowclick" checked={rowClick} onChange={(e) => setRowClick(e.value)} />
                <label htmlFor="input-rowclick">Row Click</label>
            </div> */}
            <DataTable value={products} selectionMode={rowClick ? null : 'radiobutton'} selection={selectedProduct} onSelectionChange={(e) => setSelectedProduct(e.value)} dataKey="id" tableStyle={{ minWidth: '50rem' }}>
                <Column selectionMode="single" headerStyle={{ width: '3rem' }}></Column>
                <Column field="code" header="Code"></Column>
                <Column field="name" header="Name"></Column>
                <Column field="category" header="Category"></Column>
                <Column field="quantity" header="Quantity"></Column>
            </DataTable>
                {/* <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                {dtProfile && <span>Are you sure you want to delete the selected items?</span>} */}
            {/* </div> */}
        </Dialog>
    
    );
}