import React, { useEffect, useState } from 'react';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { Badge } from 'primereact/badge';

import { MasterDataDBService } from '../../../../services/MasterDataDBService';

const SalesProductDetail = ({
    salesItems, 
    editMode, returnMode, onReturnItem,
    onEdit, onDelete,
    onChangeVat, onChangeDeliveryCost, onChangeAdditionalDiscount,
    vat, deliveryCost, addDiscount, 
    onChangeGross, onChangeDiscount, onChangeNet
}) => {

    const [totalPrice, setTotalPrice] = useState(0.00);
    const [totalDiscount, setTotalDiscount] = useState(0.00);
    const [totalDiscountedAmount, setTotalDiscountedAmount] = useState(0.00);
    const [additionalDiscount, setAdditionalDiscount] = useState(0.00);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [vatVal, setVatVal] = useState(0.00);
    const [delivery, setDelivery] = useState(0.00);
    const [vatPercentage, setVatPercentage] = useState(0.00);
    const [netAmount, setNetAmount] = useState(0.00);

    const [salesRows, setSalesRows] = useState([]);
    const masterDataDBService = new MasterDataDBService();

    useEffect(() => {
        console.log("HELOO:::",salesItems);
        if(salesItems) {
            setVatPercentage(vat);
            setDelivery(deliveryCost);
            setAdditionalDiscount(addDiscount);
            recalculateAllRows(salesItems);
            calculateTotals(salesItems);
        }
    }, [salesItems, vat, deliveryCost]);

    const roundNumber = (num) => {
        return Math.round((num + Number.EPSILON) * 100) / 100;
    };

    const onVATChange = (vatPercentage) => {
        setVatPercentage(vatPercentage);
        let newSales = [...salesItems];
        calculateTotals(newSales);
        onChangeVat(vatPercentage);
    };

    const onDeliveryCostChange = (deliveryCost) => {
        setDelivery(deliveryCost);
        let newSales = [...salesItems];
        calculateTotals(newSales);
        onChangeDeliveryCost(deliveryCost);
    };

    const onDiscountChange = (discount) => {
        setTotalDiscountedAmount(totalDiscount + discount);
        setAdditionalDiscount(discount);
        let newSales = [...salesItems];
        calculateTotals(newSales);
        onChangeAdditionalDiscount(discount);        
    };

    const calculateTotals = (allsales) => {
        let total = 0.00;
        let discount = 0.00;
        let discountedAmount = 0.00;
        let quantity = 0;
        let vat = 0.00;
        let netAmount = 0.00;
        allsales.forEach(sale => {
            console.log("ALLSALES::",sale);
            total += Number(sale.trade_price) * Number(sale.qty);
            discountedAmount += Number(sale.trade_price) * Number(sale.qty) * Number(sale.discount_profit) / 100;
            quantity += Number(sale.qty);
        });
        vat = (total - discountedAmount - additionalDiscount) * (vatPercentage / 100);
        netAmount = total - discountedAmount - additionalDiscount + vat + delivery;
        setTotalPrice(total);
        setTotalDiscount(discountedAmount);
        setTotalDiscountedAmount(discountedAmount + additionalDiscount);
        setTotalQuantity(quantity);
        setNetAmount(netAmount);
        setVatVal(vat);
        onChangeGross(total);
        onChangeDiscount(discountedAmount + additionalDiscount);
        onChangeNet(netAmount);
    };

    const recalculateAllRows = async (allsales) => {
        if(allsales && allsales.length > 0) {
            for(let i=0; i<allsales.length; i++) {
                console.log("ALLSALES::",i,allsales[i]);
                let product = await getProductName(allsales[i].product_id);                
                allsales[i].product_name = product.name;
                allsales[i].unit = product.unit;
                allsales[i].brand_name = product.brand_name;
                allsales[i].model_no = product.model_no;
                allsales[i].part_number = product.part_number;
                let trade_price = roundNumber(Number(allsales[i].trade_price));
                let qty = roundNumber(Number(allsales[i].qty));
                let discount_profit = roundNumber(Number(allsales[i].discount_profit));
                let discountedAmount = roundNumber(trade_price * qty * discount_profit / 100);
                let netPrice = roundNumber(trade_price * qty - discountedAmount);
                allsales[i].totalPrice = roundNumber(trade_price * qty);
                allsales[i].discountedAmount = discountedAmount;
                allsales[i].netPrice = netPrice;
            }
        }
        setSalesRows(allsales);
    };

    const actionBodyTemplate = (rowData) => {
        let returnFlg = returnMode? (Number(rowData.qty) - Number(rowData.return_qty)) > 0 : false;
        return (
            <>
                {editMode && <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => onEdit(rowData)} />}
                {editMode && <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => onDelete(rowData)} />}
                {returnFlg && <Button icon="pi pi-minus" className="p-button-rounded p-button-warning" onClick={() => onReturnItem(rowData)} />}
            </>
        );
    };

    const brandNameBodyTemplate = (rowData) =>{
        console.log("BRAND::",rowData);
        return(
            <>
               {rowData.brand_name}
            </>
        )
    }

    const unitBodyTemplate = (rowData) =>{
        console.log("UNIT::",rowData);
        return(
            <>
               {rowData.unit}
            </>
        )
    }

    const partNumberBodyTemplate = (rowData) =>{
        return(
            <>
               {rowData.part_number}
            </>
        )
    }

    const modelNumberBodyTemplate = (rowData) =>{
        return(
            <>
               {rowData.model_no}
            </>
        )
    }

    const getProductName = async (product_id) => {
        let product = await masterDataDBService.getById("dtProduct", product_id);
        let brand_name = await masterDataDBService.getShortnameById("dtProductBrand", product.dtProductBrand_id);
        let model_no = await masterDataDBService.getShortnameById("dtProductModel", product.dtProductModel_id);
        product.brand_name = brand_name;
        product.model_no = model_no;
        return product;
    }

    return (
        <>
            <table  className="col-12"><tbody>
                <tr>
                    <td><b>Total Quantity:</b></td><td>{salesItems ? salesItems.length : 0}</td>
                    <td><b>Gross Amount:</b></td><td>{roundNumber(totalPrice)}</td>
                    <td><b>Total Discount :</b></td><td>{roundNumber(totalDiscountedAmount)}</td>                
                    <td><b>Net Amount:</b></td><td><Badge value={roundNumber(netAmount)} size="large" severity="success"></Badge></td>
                </tr><tr>
                    <td class="vatInput"><b>Vat %</b>
                        <InputNumber 
                            readOnly={!editMode}
                            value={vat}
                            placeholder="VAT %"
                            max={100} min={0} maxFractionDigits={2}
                            className="mx-2"
                            style={{"width": "fit-content(20em)"}}
                            onValueChange={(e) => onVATChange(e.value)} 
                            />
                        <b>:</b>
                    </td>
                    <td>
                        {roundNumber(vatVal)}
                    </td>
                    <td><b>Delivery Cost:</b>
                    </td>
                    <td class="vatInput">
                        <InputNumber 
                            readOnly={!editMode}
                            value={deliveryCost} 
                            placeholder="Delivery Cost %"
                            max={100} min={0} maxFractionDigits={2}
                            className="mx-2"
                            style={{"width": "fit-content(20em)"}}
                            onValueChange={(e) => onDeliveryCostChange(e.value)} 
                            />
                    </td>
                    <td><b>Discount:</b>
                    </td>
                    <td class="vatInput">
                        <InputNumber value={addDiscount}
                            placeholder=""
                            min={0} maxFractionDigits={2}
                            className="mx-2"
                            style={{"width": "fit-content(20em)"}}
                            onValueChange={(e) => onDiscountChange(e.value)} 
                            />
                    </td>
                </tr>
            </tbody></table>
            <DataTable value={salesRows} 
                stripedRows showGridlines scrollable scrollHeight="25rem" 
            >
                <Column body={actionBodyTemplate} frozen headerStyle={{ minWidth: '6.4rem' }}></Column>
                <Column field="product_name" frozen header="Product Name"  headerStyle={{ minWidth: '18rem' }}></Column>
                <Column field="qty" header="Quantity" headerStyle={{ minWidth: '3rem' }}></Column>
                <Column field="unit" header="Unit" body={unitBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                <Column field="brand_name" header="Brand Name" body={brandNameBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                <Column field="model_no" header="Model No." body={modelNumberBodyTemplate} headerStyle={{ minWidth: '6rem' }}></Column>
                <Column field="part_number" header="Part Number" body={partNumberBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                <Column field="trade_price" header="Trade Price" headerStyle={{ minWidth: '10rem' }}></Column>
                <Column field="totalPrice" header={`Total Price`} headerStyle={{ minWidth: '10rem' }}></Column>
                <Column field="discount_profit" header={`Discount (%)`} headerStyle={{ minWidth: '10rem' }}></Column>
                <Column field="discountedAmount" header={`Discounted Amount`} headerStyle={{ minWidth: '10rem' }}></Column>
                <Column field="netPrice" header="Net Cost" headerStyle={{ minWidth: '10rem' }}></Column>
                <Column field="lastTradePrice" header="Last Sale Price" headerStyle={{ minWidth: '10rem' }}></Column>
                <Column field="remarks" header="Remarks" headerStyle={{ minWidth: '10rem' }}></Column>
            </DataTable>
        </>
    );
}

export default SalesProductDetail;