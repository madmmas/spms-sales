import React, { useEffect, useState }  from 'react';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';

const SalesProductList = ({enableReturn, items, addToSalesReturn}) => {

    const [selectedItem, setSelectedItem] = useState({});

    useEffect(() => {
        console.log("items:::   ", items);
    }, []);

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => addToSalesReturn(rowData)} />
            </>
        );
    };

    return (
        <DataTable value={items} stripedRows showGridlines scrollable scrollHeight="25rem" >
            {enableReturn && <Column body={actionBodyTemplate} frozen headerStyle={{ minWidth: '6.4rem' }}></Column>}
            <Column field="productName" frozen header="Product Name"  headerStyle={{ minWidth: '10rem' }}></Column>
            <Column field="brandName"  header="Brand Name"  headerStyle={{ minWidth: '10rem' }}></Column>
            <Column field="modelNo"  header="Model No"  headerStyle={{ minWidth: '10rem' }}></Column>
            <Column field="partNumber" header="Part Number" headerStyle={{ minWidth: '10rem' }}></Column>
            <Column field="quantity" header="Quantity" headerStyle={{ minWidth: '10rem' }}></Column>
            <Column field="returned" header="Returned" headerStyle={{ minWidth: '10rem' }}></Column>
            {enableReturn && <Column field="returnQuantity" header="Return Qty" headerStyle={{ minWidth: '10rem' }}></Column>}
            {enableReturn && <Column field="returnReason" header="Return Reason" headerStyle={{ minWidth: '10rem' }}></Column>}
            <Column field="unitTradePrice" header="Trade Price" headerStyle={{ minWidth: '10rem' }}></Column>
            <Column field="discountedAmount" header={`Discounted Amount`} headerStyle={{ minWidth: '10rem' }}></Column>
            <Column field="netPrice" header="Net Cost" headerStyle={{ minWidth: '10rem' }}></Column>
            <Column field="lastSalePrice" header="Last Sale Price" headerStyle={{ minWidth: '10rem' }}></Column>
            <Column field="remarks" header="Remarks" headerStyle={{ minWidth: '10rem' }}></Column>
        </DataTable>
    );
}

export default SalesProductList;