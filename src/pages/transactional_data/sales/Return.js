import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

import { SALES_MODEL } from '../../../constants/models';
import { ON_CANCEL_SALES_ORDER, ON_CONFIRM_SALES_ORDER } from '../../../constants/transactions';

import { TransactionService } from '../../../services/TransactionService';
import SalesCancelDialog from './components/SalesCancelDialog';
import { set } from 'react-hook-form';
import SalesConfirmDialog from './components/SalesConfirmDialog';
import SalesProductList from './components/SalesProductList';
import SalesReturnDialog from './components/SalesReturnDialog';

const Return = ({ sales }) => {

    const modelName = SALES_MODEL;

    // fetch data
    // const [sales, setSales] = useState(null);
    const toast = useRef(null);

    const [triggerCancel, setTriggerCancel] = useState(0);
    const [triggerConfirm, setTriggerConfirm] = useState(0);
    const [triggerReturn, setTriggerReturn] = useState(0);

    const [isConditional, setIsConditional] = useState(false);

    // for general sales return
    const [items, setItems] = useState([]);
    const [enableReturn, setEnableReturn] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [salesReturnItems, setSalesReturnItems] = useState([]);

    const navigate = useNavigate();

    const transactionService = new TransactionService();

    useEffect(() => {
        console.log("SALES:::   ", sales);
        setItems(sales.items);
        setIsConditional(sales.customerCategory==="CONDITIONAL" && sales.salesStatus==="PENDING")
        setEnableReturn(sales.customerCategory!=="CONDITIONAL")
    }, []);

    // cancelOrder
    const cancelOrder = () => {
        console.log("cancelOrder:::   ");
        setTriggerCancel((trigger) => trigger + 1);
    };

    // onCancelOrder
    const onCancelOrder = (dt) => {
        console.log("onCancelOrder:::   ", dt);
        setTriggerCancel((triggerCancel) => triggerCancel + 1);
        let data = {
            salesOrderId: sales._id,
            cancelRemarks: dt.cancelRemarks,
            cancelationCharge: dt.cancelationCharge,
        };

        try {
            transactionService.processTransaction(ON_CANCEL_SALES_ORDER, data).then(data => {
                if(data===null){
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to Cancel', life: 3000 });
                } else {
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Sale Order Cancelled', life: 3000 });
                }
                // navigate("/sales");
            });
        }
        catch (err){
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to Cancel', life: 3000 });
            // navigate("/sales");
        }
    };

    // confirmOrder
    const confirmOrder = () => {
        console.log("confirmOrder:::   ");
        setTriggerConfirm((triggerConfirm) => triggerConfirm + 1);
    };

    // onConfirmOrder
    const onConfirmOrder = (dt) => {
        console.log("onConfirmOrder:::   ", dt);
        setTriggerConfirm((triggerConfirm) => triggerConfirm + 1);
        let data = {
            salesOrderId: sales._id,
            notes: dt.notes
        };

        try {
            transactionService.processTransaction(ON_CONFIRM_SALES_ORDER, data).then(data => {
                if(data===null){
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to Confirm', life: 3000 });
                } else {
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Sale Order Confirmed', life: 3000 });
                }
                // navigate("/sales");
            });
        }
        catch (err){
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to Cancel', life: 3000 });
            // navigate("/sales");
        }
    };

    // addToSalesReturn
    const addToSalesReturn = (dt) => {
        console.log("addToSalesReturn:::   ", dt);
        let data = {
            // salesOrderId: sales._id,
            productId: dt.productId,
            returnQuantity: dt.returnQuantity,
            returnAmount: dt.returnAmount,
            returnReason: dt.returnReason,
        };
        console.log("addToSalesReturn:::   ", data);
        setSalesReturnItems((salesReturnItems) => [...salesReturnItems, data]);
    };

    // showSalesReturnDialog
    const showSalesReturnDialog = (dt) => {
        console.log("showSalesReturnDialog:::   ", dt);
        setSelectedItem(dt);
        setTriggerReturn((triggerReturn) => triggerReturn + 1);
    };

    const returnSalesOrder = () => {
        console.log("returnSalesOrder:::   ", salesReturnItems);
    };

    return (
        <div className="col-12">
            <Toast ref={toast} />    
            <h3>Sales Return</h3>
            <div class="grid">
                {isConditional && <div class="col-12">                    
                    <Button type="submit" label="Cancel Order" className="p-button-outlined p-button-warning" 
                        onClick={() => cancelOrder()}
                    /> &nbsp;
                    <Button type="submit" label="Confirm Order" className="p-button p-button-success" 
                        onClick={() => confirmOrder()}
                    />
                </div>}
                {!isConditional && <div class="col-12">                    
                    <Button type="submit" label="Submit Return" className="p-button p-button-success" 
                        onClick={() => returnSalesOrder()}
                    /> &nbsp;
                </div>}
                <div class="col-12">
                    <div class="grid">
                        <table  className="col-6"><tbody>
                            <tr>
                                <td><b>Invoice No:</b></td><td>{sales.voucherNo}</td>
                            </tr>
                            <tr>
                                <td><b>Customer Name:</b></td><td>{sales.customerName}</td>
                            </tr>
                            <tr>
                                <td><b>Customer Address:</b></td><td>{sales.customerAddress}</td>
                            </tr>
                            <tr>
                                <td><b>Customer Mobile No:</b></td><td>{sales.customerMobileNumber}</td>
                            </tr>
                        </tbody></table>
                        {sales.isPaid && <div class="card col-6">
                            Payment Detail
                        </div>}
                    </div>
                </div>
                <div class="card col-12">
                    <SalesProductList enableReturn={enableReturn} items={items} addToSalesReturn={showSalesReturnDialog}/>
                </div>
            </div>

            <SalesCancelDialog 
                trigger={triggerCancel}
                onCancelOrder={(dt) => onCancelOrder(dt)}
                />

            <SalesConfirmDialog
                trigger={triggerConfirm}
                confirmOrder={(dt) => onConfirmOrder(dt)}
                />

            <SalesReturnDialog 
                trigger={triggerReturn} 
                selectedItem={selectedItem} 
                addToSalesReturn={(dt) => addToSalesReturn(dt)}
                />

        </div>
    );
}

export default Return;