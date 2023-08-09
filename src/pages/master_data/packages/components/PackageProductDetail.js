import React from 'react';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';

const PackageProductDetail = ({products, totalPrice, onEdit, onDelete}) => {

    const roundNumber = (num) => {
        return Math.round((num + Number.EPSILON) * 100) / 100;
    };

    const footer = (
        <table  className="col-12"><tbody>
            <tr>
                <td><b>Total Amount:</b></td><td><Badge value={roundNumber(totalPrice)} size="large" severity="success"></Badge></td>
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
        <DataTable value={products} 
            stripedRows showGridlines scrollable scrollHeight="25rem" 
            header={footer} 
        >
            <Column body={actionBodyTemplate} frozen headerStyle={{ minWidth: '6.4rem' }} />
            <Column field="product_name" frozen header="Product Name"  headerStyle={{ minWidth: '10rem' }} />
            <Column field="code" frozen header="Product Code"  headerStyle={{ minWidth: '10rem' }} />
            <Column field="brand_name"  header="Brand Name"  headerStyle={{ minWidth: '10rem' }} />
            <Column field="model_no"  header="Model No"  headerStyle={{ minWidth: '10rem' }} />
            <Column field="part_number" header="Part Number" headerStyle={{ minWidth: '10rem' }} />
            <Column field="quantity" header="Quantity" headerStyle={{ minWidth: '10rem' }} />
            <Column field="price" header="Trade Price" headerStyle={{ minWidth: '10rem' }} />
            <Column field="totalPrice" header="total Cost" headerStyle={{ minWidth: '10rem' }} />
        </DataTable>
    );
}

export default PackageProductDetail;