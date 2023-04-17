import React from 'react';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';

const SalesProductDetail = ({sales, totalPrice, netAmount, totalDiscount, vat, onEdit, onDelete}) => {

    const roundNumber = (num) => {
        return Math.round((num + Number.EPSILON) * 100) / 100;
    };

    const footer = (
        <table  className="col-12"><tbody>
            <tr>
                <td><b>Total Quantity:</b></td><td>{sales ? sales.length : 0} products.</td>
                <td><b>Gross Amount:</b></td><td>{roundNumber(totalPrice)}</td>
                <td><b>Net Amount:</b></td><td>{roundNumber(netAmount)}</td>
            </tr><tr>
                <td><b>Total Discount:</b></td><td>{roundNumber(totalDiscount)}</td>                
                <td><b>Vat:</b></td><td>{roundNumber(vat)}</td>
            </tr>
        </tbody></table>
    );

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => onEdit(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => onDelete(rowData)} />
            </>
        );
    };

    return (
        <DataTable value={sales} 
            stripedRows showGridlines scrollable scrollHeight="25rem" 
            header={footer} 
        >
            <Column body={actionBodyTemplate} frozen headerStyle={{ minWidth: '6.4rem' }}></Column>
            <Column field="productName" frozen header="Product Name"  headerStyle={{ minWidth: '10rem' }}></Column>
            <Column field="barCode" header="barcode" headerStyle={{ minWidth: '10rem' }}></Column>
            <Column field="lastSalePrice" header="Last Sale Price" headerStyle={{ minWidth: '10rem' }}></Column>
            <Column field="unitTradePrice" header="Trade Price" headerStyle={{ minWidth: '10rem' }}></Column>
            <Column field="quantity" header="Quantity" headerStyle={{ minWidth: '10rem' }}></Column>
            <Column field="totalPrice" header={`Total Price`} headerStyle={{ minWidth: '10rem' }}></Column>
            <Column field="discount" header={`Discount`} headerStyle={{ minWidth: '10rem' }}></Column>
            <Column field="netPrice" header="Net Cost" headerStyle={{ minWidth: '10rem' }}></Column>
            <Column field="remarks" header="Remarks" headerStyle={{ minWidth: '10rem' }}></Column>
        </DataTable>
    );
}

export default SalesProductDetail;