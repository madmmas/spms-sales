import React from 'react';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';

const SalesReturnProductDetail = ({sales, onEdit}) => {

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => onEdit(rowData)} />
            </>
        );
    };

    return (
        <DataTable value={sales} 
            stripedRows showGridlines scrollable scrollHeight="25rem" 
        >
            <Column body={actionBodyTemplate} frozen headerStyle={{ minWidth: '6.4rem' }}></Column>
            <Column field="productName" frozen header="Product Name"  headerStyle={{ minWidth: '10rem' }}></Column>
            <Column field="brandName"  header="Brand Name"  headerStyle={{ minWidth: '10rem' }}></Column>
            <Column field="modelNo"  header="Model No"  headerStyle={{ minWidth: '10rem' }}></Column>
            <Column field="partNumber" header="Part Number" headerStyle={{ minWidth: '10rem' }}></Column>
            <Column field="quantity" header="Quantity" headerStyle={{ minWidth: '10rem' }}></Column>
            <Column field="unitTradePrice" header="Trade Price" headerStyle={{ minWidth: '10rem' }}></Column>
            <Column field="discountedAmount" header={`Discounted Amount`} headerStyle={{ minWidth: '10rem' }}></Column>
            <Column field="netPrice" header="Net Cost" headerStyle={{ minWidth: '10rem' }}></Column>
            <Column field="lastSalePrice" header="Last Sale Price" headerStyle={{ minWidth: '10rem' }}></Column>
            <Column field="remarks" header="Remarks" headerStyle={{ minWidth: '10rem' }}></Column>
        </DataTable>
    );
}

export default SalesReturnProductDetail;