import React, { useEffect, useState } from 'react';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';

const SalesProductDetail = ({purchases, supplierCurrency, onEdit, onDelete}) => {

    const [totalCostAmountF, setTotalAmountF] = useState(0.00);
    const [totalCostAmountBDT, setTotalAmountBDT] = useState(0.00);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [totalTransport, setTotalTransport] = useState(0.00);
    const [totalDuty, setTotalDuty] = useState(0.00);
    const [netCostAmountBDT, setNetAmountBDT] = useState(0.00);

    useEffect(() => {
        console.log("HELOO:::",purchases);
    }, [purchases]);

    const footer = (
        <table  className="col-12"><tbody>
            <tr>
                <td><b>Total Quantity:</b></td><td>{purchases ? purchases.length : 0} products.</td>
                <td><b>Total Cost ({supplierCurrency}):</b></td><td>{totalCostAmountF}</td>
                <td><b>Total Cost:</b></td><td>{totalCostAmountBDT}</td>
            </tr><tr>
                <td><b>Total Transport Cost:</b></td><td>{totalTransport}</td>
                <td><b>Total Duty:</b></td><td>{totalDuty}</td>
                <td><b>Total Net Cost:</b></td><td>{netCostAmountBDT}</td>
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
        <DataTable value={purchases} 
            stripedRows showGridlines scrollable scrollHeight="25rem" 
            header={footer} 
        >
            <Column body={actionBodyTemplate} frozen headerStyle={{ minWidth: '6.4rem' }}></Column>
            <Column field="productName" frozen header="Product Name"  headerStyle={{ minWidth: '10rem' }}></Column>
            <Column field="barCode" header="barcode" headerStyle={{ minWidth: '10rem' }}></Column>
            <Column field="lastPurchasePrice" header="Last Purchase Price" headerStyle={{ minWidth: '10rem' }}></Column>

            <Column field="quantity" header="Quantity" headerStyle={{ minWidth: '10rem' }}></Column>
            <Column field="unitCostF" header={`Unit Cost (${supplierCurrency})`} headerStyle={{ minWidth: '10rem' }}></Column>
            <Column field="totalCostF" header={`Total Cost (${supplierCurrency})`} headerStyle={{ minWidth: '10rem' }}></Column>
            <Column field="conversionRate" header="Conversion Rate" headerStyle={{ minWidth: '10rem' }}></Column>
            <Column field="unitCostBDT" header="UnitCost" headerStyle={{ minWidth: '10rem' }}></Column>
            <Column field="totalCostBDT" header="Total Cost" headerStyle={{ minWidth: '10rem' }}></Column>

            <Column field="transport" header="Transport" headerStyle={{ minWidth: '10rem' }}></Column>
            <Column field="duty" header="Duty " headerStyle={{ minWidth: '10rem' }}></Column>

            <Column field="netUnitCostBDT" header="Net Unit Cost" headerStyle={{ minWidth: '10rem' }}></Column>
            <Column field="netCostBDT" header="Net Cost" headerStyle={{ minWidth: '10rem' }}></Column>

            <Column field="profit" header="Profit" headerStyle={{ minWidth: '10rem' }}></Column>

            <Column field="minimumTradePrice" header="Minimum Trade Price" headerStyle={{ minWidth: '10rem' }}></Column>
            <Column field="tradeUnitPriceBDT" header="Trade Price (U)" headerStyle={{ minWidth: '10rem' }}></Column>
        </DataTable>
    );
}

export default SalesProductDetail;