import React, { useEffect, useState } from 'react';
import { roundNumber } from '../../../../utils.js';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';

const PurchaseProductDetail = ({
    purchases, supplierCurrency, conversion_rate,
    onEdit, onDelete, onReturnItem, 
    editMode = true, returnMode = false
}) => {

    const [totalCostAmountF, setTotalAmountF] = useState(0.00);
    const [totalCostAmountBDT, setTotalAmountBDT] = useState(0.00);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [totalTransport, setTotalTransport] = useState(0.00);
    const [totalDuty, setTotalDuty] = useState(0.00);
    const [netCostAmountBDT, setNetAmountBDT] = useState(0.00);

    const [purchaseRows, setPurchaseRows] = useState([]);

    const calculateTotals = (allpurchases) => {
        console.log("CALCULATE-PURCHASES::", allpurchases)
        let totalCostAmountF = 0;
        let totalCostAmountBDT = 0;
        let totalTransport = 0;
        let totalDuty = 0;
        let netCostAmountBDT = 0;

        if(allpurchases && allpurchases.length > 0) {
            for(let i=0; i<allpurchases.length; i++) {
                totalCostAmountF += Number(allpurchases[i].totalCostF);
                totalCostAmountBDT += Number(allpurchases[i].totalCostBDT);
                totalTransport += Number(allpurchases[i].transport);
                totalDuty += Number(allpurchases[i].duty_vat);
                netCostAmountBDT += Number(allpurchases[i].netCostBDT);
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
    
    const recalculateAllRows = (allpurchases) => {
        if(allpurchases && allpurchases.length > 0) {
            for(let i=0; i<allpurchases.length; i++) {
                let unit_cost_f = roundNumber(Number(allpurchases[i].unit_cost_f));
                let qty = roundNumber(Number(allpurchases[i].qty));
                let unit_cost = roundNumber(Number(allpurchases[i].unit_cost));
                let transport = roundNumber(Number(allpurchases[i].transport));
                let duty_vat = roundNumber(Number(allpurchases[i].duty_vat));
                allpurchases[i].totalCostF = roundNumber(unit_cost_f * qty);
                allpurchases[i].totalCostBDT = roundNumber(unit_cost * qty);
                allpurchases[i].netUnitCostBDT = roundNumber(unit_cost + (transport / qty) + (duty_vat / qty));
                allpurchases[i].netCostBDT = roundNumber(allpurchases[i].netUnitCostBDT * qty);

                let discount_profit = Number(allpurchases[i].discount_profit);
                let profit = allpurchases[i].netUnitCostBDT * discount_profit / 100;
                allpurchases[i].profit = roundNumber(profit);
            }
        }
        setPurchaseRows(allpurchases);
    };

    useEffect(() => {
        recalculateAllRows(purchases);
        calculateTotals(purchases);
    }, [purchases]);

    const footer = (
        <table  className="col-12"><tbody>
            <tr>
                <td><b>Total Cost ({supplierCurrency}):</b></td><td>{totalCostAmountF}</td>
                <td><b>Conversion Rate ({supplierCurrency} to BDT):</b></td><td>{conversion_rate}</td>
                <td><b>Total Cost (BDT):</b></td><td>{totalCostAmountBDT}</td>
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
        <DataTable value={purchaseRows} 
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

            <Column field="min_price" header="Minimum Trade Price" headerStyle={{ minWidth: '10rem' }}></Column>
            <Column field="trade_price" header="Trade Price (U)" headerStyle={{ minWidth: '10rem' }}></Column>
        </DataTable>
    );
}

export default PurchaseProductDetail;