import React, { useEffect, useState } from 'react';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';

const PurchaseProductDetail = ({purchases, supplierCurrency, onEdit, onDelete, onReturnItem, editMode = true, returnMode = false}) => {

    const [totalCostAmountF, setTotalAmountF] = useState(0.00);
    const [totalCostAmountBDT, setTotalAmountBDT] = useState(0.00);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [totalTransport, setTotalTransport] = useState(0.00);
    const [totalDuty, setTotalDuty] = useState(0.00);
    const [netCostAmountBDT, setNetAmountBDT] = useState(0.00);

    const calculateTotals = (allpurchases) => {
        console.log("CALCULATE-PURCHASES::", allpurchases)
        let totalCostAmountF = 0;
        let totalCostAmountBDT = 0;
        let totalTransport = 0;
        let totalDuty = 0;
        let netCostAmountBDT = 0;

        if(allpurchases && allpurchases.length > 0) {
            for(let i=0; i<allpurchases.length; i++) {
                totalCostAmountF += allpurchases[i].totalCostF;
                totalCostAmountBDT += allpurchases[i].totalCostBDT;
                totalTransport += allpurchases[i].transport;
                totalDuty += allpurchases[i].duty;
                netCostAmountBDT += allpurchases[i].netCostBDT;
            }
        }
        setTotalQuantity(purchases.length);
        setTotalAmountBDT(totalCostAmountBDT);
        setTotalAmountF(totalCostAmountF);
        setTotalTransport(totalTransport);
        setTotalDuty(totalDuty);
        setNetAmountBDT(netCostAmountBDT);
        console.log("ALL-TOTAL::", totalQuantity, totalCostAmountF, totalCostAmountBDT, totalTransport, totalDuty, netCostAmountBDT);
    };

    useEffect(() => {
        console.log("HELOO:::",purchases);
        calculateTotals(purchases);
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
                {editMode && <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => onEdit(rowData)} />}
                {editMode && <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => onDelete(rowData)} />}
                {returnMode && <Button icon="pi pi-minus" className="p-button-rounded p-button-warning" onClick={() => onReturnItem(rowData)} />}
            </>
        );
    };

    return (
        <DataTable value={purchases} 
            stripedRows showGridlines scrollable scrollHeight="25rem" 
            header={footer} 
        >
            <Column body={actionBodyTemplate} frozen headerStyle={{ minWidth: '6.4rem' }}></Column>
            <Column field="product_name" frozen header="Product Name"  headerStyle={{ minWidth: '10rem' }}></Column>
            {/* <Column field="product_code" header="Code" headerStyle={{ minWidth: '10rem' }}></Column> */}

            <Column field="qty" header="Quantity" headerStyle={{ minWidth: '10rem' }}></Column>
            {returnMode && <Column field="return_qty" header="Return Qty" headerStyle={{ minWidth: '10rem' }}></Column>}
            <Column field="unit_cost_f" header={`Unit Cost (${supplierCurrency})`} headerStyle={{ minWidth: '10rem' }}></Column>
            <Column field="totalCostF" header={`Total Cost (${supplierCurrency})`} headerStyle={{ minWidth: '10rem' }}></Column>
            <Column field="conversion_rate" header="Conversion Rate" headerStyle={{ minWidth: '10rem' }}></Column>
            <Column field="unit_cost" header="UnitCost" headerStyle={{ minWidth: '10rem' }}></Column>
            <Column field="totalCostBDT" header="Total Cost" headerStyle={{ minWidth: '10rem' }}></Column>

            <Column field="transport" header="Transport" headerStyle={{ minWidth: '10rem' }}></Column>
            <Column field="duty_vat" header="Duty " headerStyle={{ minWidth: '10rem' }}></Column>

            <Column field="netUnitCostBDT" header="Net Unit Cost" headerStyle={{ minWidth: '10rem' }}></Column>
            <Column field="netCostBDT" header="Net Cost" headerStyle={{ minWidth: '10rem' }}></Column>

            <Column field="discount_profit" header="Profit Percentage" headerStyle={{ minWidth: '10rem' }}></Column>
            <Column field="profit" header="Profit" headerStyle={{ minWidth: '10rem' }}></Column>

            <Column field="min_trade_price" header="Minimum Trade Price" headerStyle={{ minWidth: '10rem' }}></Column>
            <Column field="trade_price" header="Trade Price (U)" headerStyle={{ minWidth: '10rem' }}></Column>
        </DataTable>
    );
}

export default PurchaseProductDetail;