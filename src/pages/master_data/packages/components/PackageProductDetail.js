import React from 'react';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { Badge } from 'primereact/badge';

const PackageProductDetail = ({sales, totalPrice, netAmount, totalDiscount, vat, onVATChange, onDeliveryCostChange, onEdit, onDelete}) => {

    const roundNumber = (num) => {
        return Math.round((num + Number.EPSILON) * 100) / 100;
    };

    const footer = (
        <table  className="col-12"><tbody>
            <tr>
                <td><b>Net Amount:</b></td><td><Badge value={roundNumber(netAmount)} size="large" severity="success"></Badge></td>
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
            <Column field="brandName"  header="Brand Name"  headerStyle={{ minWidth: '10rem' }}></Column>
            <Column field="modelNo"  header="Model No"  headerStyle={{ minWidth: '10rem' }}></Column>
            <Column field="partNumber" header="Part Number" headerStyle={{ minWidth: '10rem' }}></Column>
            <Column field="quantity" header="Quantity" headerStyle={{ minWidth: '10rem' }}></Column>
            <Column field="unitTradePrice" header="Trade Price" headerStyle={{ minWidth: '10rem' }}></Column>
            <Column field="netPrice" header="Net Cost" headerStyle={{ minWidth: '10rem' }}></Column>
        </DataTable>
    );
}

export default PackageProductDetail;