import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom';
import { getNumToWords, getDateFormatted, getTimeFormatted } from '../../../../utils';
import { SALES_MODEL, CUSTOMER_MODEL } from '../../../../constants/models';
import { OrderService } from '../../../../services/OrderService';
import { MasterDataService } from '../../../../services/MasterDataService';

import InvoiceCss from './InvoiceCss'

import { PrintPOS } from './PrintPOS'
import { ComponentToPrint } from './ComponentToPrint'

export const PrintInvoice = () => {
    
    let { id } = useParams();

    const orderService = new OrderService();
    const masterDataService = new MasterDataService();

    const [invoice, setInvoice] = useState(null);

    const [printme, setPrintme] = useState(true)
    const [printmePos, setPrintmePos] = useState(false)
    const [trigger, setTrigger] = useState(0)

    useEffect(() => {
        console.log("ID CHANGED::", id)
        orderService.getById(SALES_MODEL, id).then(data => {
            if(data && data.customer_category!=="WALKIN"){
                masterDataService.getById(CUSTOMER_MODEL, data.party_id).then(party => {
                    data.party = {
                        "line1": party.shopName,
                        "line2": party.address,
                        "line3": party.phone,
                    };
                    orderService.getLedgerBalance("trxACReceivable", data.party_id).then(party_balance => {
                        let dr_amount = Number(party_balance.dr_amount)||0;
                        let cr_amount = Number(party_balance.cr_amount)||0;
                        let balance = dr_amount - cr_amount;
                        console.log("balance::", party_balance);
                        data.balance = balance;
                        setInvoice(data);
                    });
                }); 
            }else{
                data.balance = 0;
                setInvoice(data);
            }
        });  
    }, [id]);

    useEffect(() => {
        console.log("invoice::", invoice);
    }, [invoice]);

    useEffect(() => {
        if(trigger>0){
            window.print();
        }
    }, [trigger]);

    const handlePrint = () => {
        setPrintme(true);
        setPrintmePos(false);
        setTrigger(trigger+1);
    }

    const handlePrintPOS = () => {
        setPrintme(false);
        setPrintmePos(true);
        setTrigger(trigger+1);
    }

    const getBillTo = (customer_category) => {
        if(customer_category==="WALKIN"){
            return "Walk-in Customer";
        }else if(customer_category==="REGISTERED"){
            return "Registered Customer";
        }else if(customer_category==="CONDITIONAL"){
            return "Conditional Sales";
        }else{
            return "";
        }
    }

    return (
      <div>
        <InvoiceCss />
        <button className = "no-printme" onClick={() =>handlePrint()}>PRINT</button>
        <button className = "no-printme" onClick={() =>handlePrintPOS()}>PRINT-POS</button>
        {printmePos && <PrintPOS />}
        {printme && <ComponentToPrint />}
        
        {invoice && <div className='printme'>
            <header>
                <p>M/S JONONI MOTORS</p>
                <p>R.N ROAD,JASHORE,BANGLADESH</p>
                <p>MOBILE NO - 01712202310, 01913959501</p>
            </header>
            <p  class="line">Invoice Number : {invoice.voucher_no}</p>
            <p>Invoice Date : {getTimeFormatted(invoice.created_at)}</p>
            <table className="bill-details">
                <tbody>
                    <tr><td class="line">Bill To {getBillTo(invoice.customer_category)}:</td></tr>
                    {invoice.party && <tr>
                        <td  class="line"><span>{invoice.party.line1}</span><br/>
                            <span>{invoice.party.line2}</span><br/>
                            <span>{invoice.party.line3}</span></td>
                    </tr>}
                    {!invoice.party && <tr>
                        <td><span>{invoice.customer_name}</span><br/>
                            <span>{invoice.customer_phone}</span></td>
                    </tr>}
                    <tr>
                        <th className="center-align line" colSpan="2"><span className="receipt">SALES INVOICE</span></th>
                    </tr>
                </tbody>
            </table>
            {printme && <table className="lineitems">
                <thead>
                    <tr>
                        {/* <th className="heading name">Sl</th> */}
                        <th className="heading qty left-align">Qty</th>
                        <th className="heading name left-align">Product Name</th>
                        <th className="heading brand left-align">Brand</th>
                        <th className="heading brand left-align">Part No</th>
                        <th className="heading brand left-align">Model</th>
                        <th className="heading brand right-align">Unit Price</th>
                        <th className="heading qty center-align">D %</th>
                        <th className="heading amount right-align">Amount</th>
                    </tr>
                </thead>
            
                <tbody>
                {invoice.items.map( item => 
                    <tr>
                        <td className="left-align">{Number.parseFloat(item.qty).toFixed(0)}</td>
                        <td className="left-align">{item.product_name}</td>
                        <td className="left-align">{item.product_brand_name}</td>
                        <td className="left-align">{item.product_part_number}</td>
                        <td className="left-align">{item.product_model_no}</td>
                        <td className="right-align">{Number.parseFloat(item.trade_price).toFixed(2)}</td>
                        <td className="center-align">{item.discount_profit}</td>
                        <td className="right-align">{Number.parseFloat(item.qty*(item.trade_price-(item.trade_price*item.discount_profit/100))).toFixed(2) }</td>
                    </tr>)}

                    <tr>
                        <td colSpan="7" className="sum-up line">Total Amount</td>
                        <td className="line price right-align">{ Number.parseFloat(invoice.gross).toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colSpan="7" className="sum-up">(-) Discount</td>
                        <td className="price right-align">{ Number.parseFloat(invoice.discount).toFixed(2)}</td>
                    </tr>
                    <tr>
                        <th colSpan="7" className="total text line">Net Amount</th>
                        <th className="total price right-align line">{ Number.parseFloat(invoice.net).toFixed(2)}</th>
                    </tr>
                    <tr>
                        <td colSpan="7" className="sum-up">(-) Payment</td>
                        <td className="price right-align">{ Number.parseFloat(invoice.paid).toFixed(2)}</td>
                    </tr>
                    {invoice.balance_forward!==-99999999 && <tr>
                        <th colSpan="7" className="total text line">(+) B/F Balance</th>
                        <th className="total price right-align line">{ Number.parseFloat(invoice.balance_forward).toFixed(2)}</th>
                    </tr>}
                </tbody>
            </table>}
            {printmePos && <table className="lineitems">            
                <tbody>
                {invoice.items.map( item => 
                    <tr>
                        <td className="left-align">{item.product_name}-{item.product_brand_name}-{item.product_part_number}-{item.product_model_no}
                        <br/><b>{Number.parseFloat(item.qty).toFixed(0)}X{Number.parseFloat(item.trade_price).toFixed(2)} ({item.discount_profit}%)</b></td>
                        <td className="right-align">{Number.parseFloat(item.qty*(item.trade_price-(item.trade_price*item.discount_profit/100))).toFixed(2) }</td>
                    </tr>)}

                    <tr>
                        <td className="sum-up line">Total Amount</td>
                        <td className="line price right-align">{ Number.parseFloat(invoice.gross).toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td className="sum-up">Total Discount</td>
                        <td className="price right-align">{ Number.parseFloat(invoice.discount).toFixed(2)}</td>
                    </tr>
                    <tr>
                        <th className="sum-up">Net Amount</th>
                        <th className="total price right-align">{ Number.parseFloat(invoice.net).toFixed(2)}</th>
                    </tr>
                    {invoice.balance_forward!==-99999999 && <tr>
                        <th className="total text">(+) B/F Balance</th>
                        <th className="total price right-align">{ Number.parseFloat(invoice.balance_forward).toFixed(2)}</th>
                    </tr>}
                </tbody>
            </table>}
            <section>
                <p>
                    <b>In Words :</b> <i>{getNumToWords(Number.parseFloat(invoice.net).toFixed(2))} Taka</i>
                </p>
                {/* <p>
                    Paid by : <span>CASH</span>
                </p> */}
                <p> 
                    <b>Remarks :</b> <span>{invoice.notes}</span>
                </p>
            </section>
            <footer>
                <table style={{"textAlign": "center"}}>
                    <tbody>
                        <tr>
                            <td className="line">Customer Signature</td>
                            <td className="line">Account Signature</td>
                            <td className="line">Authorised Signature</td>
                        </tr>
                    </tbody>
                </table>
            </footer>
        </div>}
      </div>
    )
}
