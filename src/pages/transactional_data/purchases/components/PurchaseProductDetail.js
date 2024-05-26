import React, { useEffect, useState } from 'react';
import { roundNumber } from '../../../../utils.js';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';

import { MasterDataDBService } from '../../../../services/MasterDataDBService';

const PurchaseProductDetail = ({
    purchases, supplierCurrency, discount,
    onEdit, onDelete, onReturnItem, onDiscountChange,
    editMode = true, returnMode = false
}) => {

    const [totalCostAmountF, setTotalAmountF] = useState(0.00);
    const [totalCostAmountBDT, setTotalAmountBDT] = useState(0.00);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [totalTransport, setTotalTransport] = useState(0.00);
    const [totalDuty, setTotalDuty] = useState(0.00);
    const [purchaseDiscount, setPurchaseDiscount] = useState(0.00);
    const [netCostAmountBDT, setNetAmountBDT] = useState(0.00);

    const [purchaseRows, setPurchaseRows] = useState([]);

    const [displayProducts, setDisplayProducts] = useState([]);

    const calculateTotals = (allpurchases, _discount = 0) => {
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
        // apply discount
        setTotalQuantity(purchases.length);
        setTotalAmountBDT(totalCostAmountBDT);
        setTotalAmountF(totalCostAmountF);
        setTotalTransport(totalTransport);
        setTotalDuty(totalDuty);
        setPurchaseDiscount(_discount);
        console.log("DISCOUNT-AMOUNT::", _discount);
        let discountAmount = totalCostAmountBDT * _discount / 100;
        console.log("DISCOUNT-AMOUNT-2::", discountAmount);
        netCostAmountBDT = totalCostAmountBDT - discountAmount;
        console.log("NET-COST-AMOUNT::", netCostAmountBDT);
        setNetAmountBDT(netCostAmountBDT);
        console.log("ALL-TOTAL::", totalQuantity, totalCostAmountF, totalCostAmountBDT, totalTransport, totalDuty, netCostAmountBDT);
    };
    
    const onPurDiscountChange = (value) => {
        console.log("DISCOUNT-CHANGE::", value);
        if(Number(value) >= 0) {
            console.log("DISCOUNT-CHANGE-2::", value);
            calculateTotals(purchases, value);
            onDiscountChange(value);
        }
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
        console.log("ALL-ROWS-PURCHASES::", allpurchases)
        setPurchaseRows(allpurchases);
    };

    useEffect(() => {
        console.log("ALL-ROWS-PURCHASES::", purchases)
        recalculateAllRows(purchases);
        calculateTotals(purchases);
        // get all products ids from purchases
        let productIds = [];
        if(purchases && purchases.length > 0) {
            for(let i=0; i<purchases.length; i++) {
                productIds.push(purchases[i].product_id);
            }
        }
        const masterDataDBService = new MasterDataDBService();
        masterDataDBService.getAllByIdsInMap("dtProduct", productIds).then((data) => {
            // console.log("PRODUCTS-FETCHED-FROM-CACHE::", data);
            setDisplayProducts(data);
        });
    }, [purchases]);

    const footer = (
        <>
            <table  className="col-12"><tbody>
                <tr>
                    <td><b>Total Cost ({supplierCurrency}):</b></td><td>{totalCostAmountF}</td>
                    {/* <td><b>Conversion Rate ({supplierCurrency} to BDT):</b></td><td>{conversion_rate}</td> */}
                    <td><b>Total Cost (BDT):</b></td><td>{totalCostAmountBDT}</td>
                    <td><b>Discount</b></td><td>
                        {!editMode && <>
                            <InputNumber readonly="true" value={discount} placeholder="empty" />
                        </>}
                        {editMode && <InputNumber value={discount}
                            placeholder=""
                            min={0} maxFractionDigits={2}
                            className="mx-2"
                            style={{"width": "fit-content(20em)"}}
                            onValueChange={(e) => onPurDiscountChange(e.value)} 
                            />}
                    </td>
                </tr><tr>
                    <td><b>Total Transport Cost:</b></td><td>{totalTransport}</td>
                    <td><b>Total Duty:</b></td><td>{totalDuty}</td>
                    <td><b>Total Net Cost:</b></td><td>{netCostAmountBDT}</td>
                </tr>
            </tbody></table>
        </>
        
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

    const codeNameBodyTemplate = (rowData) =>{
        let code = "";
        console.log("displayProducts::code", displayProducts)
        if(displayProducts !== undefined && displayProducts[rowData.product_id] !== undefined) {
            code = displayProducts[rowData.product_id].code;
        }
        return(
            <>
               {code}
            </>
        )
    }

    const brandNameBodyTemplate = (rowData) =>{
        let brand_name = "";
        console.log("displayProducts::brand", displayProducts)
        if(displayProducts !== undefined && displayProducts[rowData.product_id] !== undefined) {
            brand_name = displayProducts[rowData.product_id].dtProductBrand_id_shortname;
        }
        return(
            <>
                {brand_name}       
            </>
        )
    }

    const partNumberBodyTemplate = (rowData) =>{
        let part_number = "";
        console.log("displayProducts::partnumber", displayProducts)
        if(displayProducts !== undefined && displayProducts[rowData.product_id] !== undefined) {
            part_number = displayProducts[rowData.product_id].part_number;
        }
        return(
            <>
                {part_number}
            </>
        )
    }

    const modelNumberBodyTemplate = (rowData) =>{
        let model_no = "";
        console.log("displayProducts::model", displayProducts)
        if(displayProducts !== undefined && displayProducts[rowData.product_id] !== undefined) {
            model_no = displayProducts[rowData.product_id].dtProductModel_id_shortname;
        }
        return(
            <>
                {model_no}
            </>
        )
    }

    return (
        <DataTable value={purchaseRows} 
            stripedRows showGridlines scrollable scrollHeight="25rem" 
            header={footer} 
        >
            <Column body={actionBodyTemplate} frozen headerStyle={{ minWidth: '6.4rem' }}></Column>
            <Column field="product_name" frozen header="Product Name"  headerStyle={{ minWidth: '10rem' }}></Column>
            <Column field="code" header="Code" body={codeNameBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
            <Column field="dtProductBrand_id" header="Brand Name" body={brandNameBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
            <Column field="dtProductModel_id" header="Model No." body={modelNumberBodyTemplate} headerStyle={{ minWidth: '6rem' }}></Column>
            <Column field="part_number" header="Part Number" body={partNumberBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>

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