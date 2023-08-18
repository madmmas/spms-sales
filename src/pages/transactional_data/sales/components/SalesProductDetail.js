import React, { useEffect, useState } from 'react';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { Badge } from 'primereact/badge';
import { Dialog } from 'primereact/dialog';

const SalesProductDetail = ({salesItems, onEdit, onDelete}) => {

    const [totalPrice, setTotalPrice] = useState(0.00);
    const [totalDiscount, setTotalDiscount] = useState(0.00);
    const [totalDiscountedAmount, setTotalDiscountedAmount] = useState(0.00);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [vat, setVat] = useState(0.00);
    const [deliveryCost, setDeliveryCost] = useState(0.00);
    const [vatPercentage, setVatPercentage] = useState(0.00);
    const [netAmount, setNetAmount] = useState(0.00);

    const [selectedProductIndex, setSelectedProductIndex] = useState(null);

    //// STATE DeleteProductDialog ////
    const [deleteProductDialog, setDeleteSalesProductDialog] = useState(false);

    useEffect(() => {
        console.log("HELOO:::",salesItems);
        if(salesItems) {
            calculateTotals(salesItems);
        }
    }, [salesItems]);

    const roundNumber = (num) => {
        return Math.round((num + Number.EPSILON) * 100) / 100;
    };

    const onVATChange = (vatPercentage) => {
        setVatPercentage(vatPercentage);
        let newSales = [...salesItems];
        calculateTotals(newSales);
    };

    const onDeliveryCostChange = (deliveryCost) => {
        setDeliveryCost(deliveryCost);
        let newSales = [...salesItems];
        calculateTotals(newSales);
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
            // total += sale.totalPrice;
            total += sale.trade_price * sale.qty;
            // discount += sale.discount;
            discount += sale.discount_profit;
            // discountedAmount += sale.discount_profit ;
            quantity += sale.qty;
        });
        vat = (total - discountedAmount) * (vatPercentage / 100);
        netAmount = total - discountedAmount + vat + deliveryCost;
        setTotalPrice(total);
        setTotalDiscount(discount);
        setTotalDiscountedAmount(discountedAmount);
        setTotalQuantity(quantity);
        setVat(vat);
        setNetAmount(netAmount);
    };

    const hideDeleteSalesProductDialog = () => {
        setSelectedProductIndex(null);
        setDeleteSalesProductDialog(false);
    };

    const removeItem = () => {
        onDelete(selectedProductIndex);
        setDeleteSalesProductDialog(false);
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => onEdit(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteSalesProduct(rowData)} />
            </>
        );
    };

    const confirmDeleteSalesProduct = item => {
        setSelectedProductIndex(item.index);
        setDeleteSalesProductDialog(true);
    };

    const deleteProductDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteSalesProductDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={removeItem} />
        </>
    );

    return (
        <>
            <table  className="col-12"><tbody>
                <tr>
                    <td><b>Total Quantity:</b></td><td>{salesItems ? salesItems.length : 0}</td>
                    <td><b>Gross Amount:</b></td><td>{roundNumber(totalPrice)}</td>
                    <td><b>Total Discount :</b></td><td>{roundNumber(totalDiscount)}</td>                
                    <td><b>Net Amount:</b></td><td><Badge value={roundNumber(netAmount)} size="large" severity="success"></Badge></td>
                </tr><tr>
                    <td class="vatInput"><b>Vat %</b>
                        <InputNumber value="0" 
                            placeholder="VAT %"
                            max={100} min={0}
                            className="mx-2"
                            style={{"width": "fit-content(20em)"}}
                            onValueChange={(e) => onVATChange(e.value)} 
                            />
                        <b>:</b>
                    </td>
                    <td>
                        {roundNumber(vat)}
                    </td>
                    <td><b>Delivery Cost:</b>
                    </td>
                    <td class="vatInput">
                        <InputNumber value="0" 
                            placeholder="Delivery Cost %"
                            max={100} min={0}
                            className="mx-2"
                            style={{"width": "fit-content(20em)"}}
                            onValueChange={(e) => onDeliveryCostChange(e.value)} 
                            />
                    </td>
                </tr>
            </tbody></table>
            <DataTable value={salesItems} 
                stripedRows showGridlines scrollable scrollHeight="25rem" 
            >
                <Column body={actionBodyTemplate} frozen headerStyle={{ minWidth: '6.4rem' }}></Column>
                <Column field="product_name" frozen header="Product Name"  headerStyle={{ minWidth: '10rem' }}></Column>
                {/* <Column field="product_brand_name"  header="Brand Name"  headerStyle={{ minWidth: '10rem' }}></Column>
                <Column field="product_model_no"  header="Model No"  headerStyle={{ minWidth: '10rem' }}></Column>
                <Column field="product_part_number" header="Part Number" headerStyle={{ minWidth: '10rem' }}></Column> */}
                <Column field="qty" header="Quantity" headerStyle={{ minWidth: '10rem' }}></Column>
                <Column field="trade_price" header="Trade Price" headerStyle={{ minWidth: '10rem' }}></Column>
                <Column field="totalPrice" header={`Total Price`} headerStyle={{ minWidth: '10rem' }}></Column>
                <Column field="discount_profit" header={`Discount (%)`} headerStyle={{ minWidth: '10rem' }}></Column>
                <Column field="discountedAmount" header={`Discounted Amount`} headerStyle={{ minWidth: '10rem' }}></Column>
                <Column field="netPrice" header="Net Cost" headerStyle={{ minWidth: '10rem' }}></Column>
                {/* <Column field="lastSalePrice" header="Last Sale Price" headerStyle={{ minWidth: '10rem' }}></Column> */}
                <Column field="remarks" header="Remarks" headerStyle={{ minWidth: '10rem' }}></Column>
            </DataTable>

            <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteSalesProductDialog}>
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    <span>
                        Are you sure you want to delete?
                    </span>
                </div>
            </Dialog>

        </>
    );
}

export default SalesProductDetail;