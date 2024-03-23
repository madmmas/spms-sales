import React, {useEffect, useRef, useState} from 'react'
import { useParams } from 'react-router-dom';
import { getNumToWords, getDateFormatted, getTimeFormatted } from '../../../../utils';
import { SALES_MODEL, CUSTOMER_MODEL } from '../../../../constants/models';

import AuthService from "../../../../services/AuthService";
import { OrderService } from '../../../../services/OrderService';
import { MasterDataDBService } from '../../../../services/MasterDataDBService';

import InvoiceCss from './InvoiceCss'

import { PrintPOS } from '../../../components/PrintPOS'
import { ComponentToPrint } from '../../../components/ComponentToPrint'

export const PrintInvoiceSalesReturn = () => {
    
    let { id } = useParams();

    const orderService = new OrderService();
    const masterDataDBService = new MasterDataDBService();

    const [invoice, setInvoice] = useState(null);
    const [printme, setPrintme] = useState(true)
    const [printmePos, setPrintmePos] = useState(false)
    const [trigger, setTrigger] = useState(0)
    const [render, setRender] = useState(false)
    const [salesMan, setSalesMan] = useState("");
    const [totalReturningAmount,setTotalReturningAmount] = useState('');
    const divPrint = useRef(null);

    useEffect(() => {
        console.log("ID CHANGED::", id)
        orderService.getById(SALES_MODEL, id).then(data => {
            AuthService.GetUsername(data.updated_by).then(salesMan => {
                setSalesMan(salesMan.username)
            });
            if(data && data.customer_category!=="WALKIN"){
                masterDataDBService.getById(CUSTOMER_MODEL, data.party_id).then(party => {
                    data.party = {
                        "line1": party.name,
                        "line2": party.address,
                        "line3": party.phone,
                    };
                    orderService.getLedgerBalance("dtCustomer", data.party_id).then(party_balance => {
                        let dr_amount = Number(party_balance.dr_amount)||0;
                        let cr_amount = Number(party_balance.cr_amount)||0;
                        let balance = dr_amount - cr_amount;
                        console.log("balance::", party_balance);
                        data.balance = balance;
                        setInvoice(data);
                        console.log(data)
                        console.log(data)
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
        for(let i = 0; i<invoice?.items.length; i++){
            for(let j = 0; j<invoice.return_items.length; j++){
                if(invoice.items[i].product_id === invoice.return_items[j].product_id){
                       invoice.return_items[j].product_part_number = invoice.items[i].product_part_number;
                       invoice.return_items[j].trade_price = invoice.items[i].trade_price;
                       invoice.return_items[j].product_model_no = masterDataDBService.getShortnameById('dtProductModel', invoice.items[i].product_model_id);
                       invoice.return_items[j].product_brand_name = masterDataDBService.getShortnameById('dtProductBrand', invoice.items[i].product_brand_id);
               }
            }
        }

        let totalReturningAmountLocal = 0;
        for(let i = 0; i<invoice?.return_items.length; i++){
            totalReturningAmountLocal = totalReturningAmountLocal + invoice.return_items[i].return_qty * Number.parseFloat(invoice.return_items[i].trade_price)
        }

        setTotalReturningAmount(totalReturningAmountLocal)
        setRender((prevState)=>!prevState)

        console.log(invoice)
        
    }, [invoice]);

    useEffect(() => {
        if(trigger>0){
            window.print();
        }
    }, [trigger]);

    const PrintElem = (elem) => {
        // window.print();
        var mywindow = window.open('', 'PRINT', 'height=400,width=600');

        mywindow.document.write('<html><head><title>' + document.title  + '</title>');
        mywindow.document.write('</head><body >');
        mywindow.document.write('<h1>' + document.title  + '</h1>');
        mywindow.document.write(document.getElementById(elem).innerHTML);
        mywindow.document.write('</body></html>');

        mywindow.document.close(); // necessary for IE >= 10
        mywindow.focus(); // necessary for IE >= 10*/

        mywindow.print();
        mywindow.close();

        return true;
    }
    const handlePrint = () => {
        setPrintme(true);
        setPrintmePos(false);
        setTrigger(trigger+1);
        // PrintElem("printme");
    }

    const handlePrintPOS = () => {
        let elHeight = document.getElementById('printme').clientHeight
        // alert(elHeight);
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
        
        {invoice && <div className='printme' id='printme' ref={divPrint}>
            <header>
                <p>M/S JONONI MOTORS</p>
                <p>R.N ROAD,JASHORE,BANGLADESH</p>
                <p>MOBILE NO - 01712202310, 01913959501</p>
            </header>
            <p  class="line">Sales Invoice Number : {invoice.voucher_no} [Previous Total Amount : <span className="price">{invoice.gross}</span>]</p>
            <p>Sales Invoice Date : {getDateFormatted(invoice.created_at)} {getTimeFormatted(invoice.created_at)}</p>
            <table className="bill-details">
                <tbody>
                    <tr><td class="line">Bill To {getBillTo(invoice.customer_category)}:</td></tr>
                    {invoice.party && <tr>
                        <td  class="line"><span>{invoice.party.line1}</span><br/>
                            <span>{invoice.party.line2}</span><br/>
                            <span>{invoice.party.line3}</span></td>
                            <span style={{marginLeft:'15rem'}}>Sales Created by ({salesMan})</span>
                    </tr>}
                    {!invoice.party && <tr>
                        <td><span>{invoice.customer_name}</span><br/>
                            <span>{invoice.customer_phone}</span></td>
                            <span style={{marginLeft:'15rem'}}>Sales Created by ({salesMan})</span>
                    </tr>}
                    <tr>
                        <th className="center-align line" colSpan="2"><span className="receipt">SALES RETURN INVOICE ({invoice.voucher_no + ".R"})</span></th>
                    </tr>
                </tbody>
            </table>
            {printme && <table className="lineitems">
                <thead>
                    <tr>
                        {/* <th className="heading name">Sl</th> */}
                        <th className="heading qty left-align">Date</th>
                        <th className="heading qty left-align">Qty</th>
                        <th className="heading name left-align">Product Name</th>
                        <th className="heading brand left-align">Brand</th>
                        <th className="heading brand left-align">Part No</th>
                        <th className="heading brand left-align">Model</th>
                        <th className="heading unit right-align">Unit Price</th>
                        <th className="heading amount right-align">Amount</th>
                    </tr>
                </thead>
            
                <tbody>
                {invoice?.return_items.map( item => 
                    <tr>
                        <td className="left-align">{getDateFormatted(item.created_at)}</td>
                        <td className="left-align">{Number.parseFloat(item.return_qty).toFixed(0)}</td>
                        <td className="left-align">{item.product_name}</td>
                        <td className="left-align">{item.product_brand_name}</td>
                        <td className="left-align">{item.product_part_number}</td>
                        <td className="left-align">{item.product_model_no}</td>
                        <td className="right-align">{Number.parseFloat(item.trade_price).toFixed(2)}</td>
                        <td className="right-align">{Number.parseFloat(item.return_qty*item.trade_price).toFixed(2) }</td>
                    </tr>)}
                    <tr>
                        <th colSpan="7" className="total text line">Total Returning Amount</th>
                        <th className="total price right-align line">{Number.parseFloat(totalReturningAmount).toFixed(2)}</th>
                    </tr>
                    
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
                    <tr>
                        <th className="sum-up">Total Amount</th>
                        <th className="total price right-align">{ Number.parseFloat(invoice.net).toFixed(2)}</th>
                    </tr>
                    {invoice.balance_forward!==-99999999 && <tr>
                        <th className="total text">(+) B/F Balance</th>
                        <th className="total price right-align">{ Number.parseFloat(invoice.balance_forward).toFixed(2)}</th>
                    </tr>}
                </tbody>
            </table>}
            <section>
                { invoice.customer_category === "REGISTERED" && invoice.balance_forward===-99999999 &&
                    <p>
                      <b>In Words : <i>{getNumToWords(totalReturningAmount)} Taka only</i> </b>
                   </p>
                }
                { invoice.customer_category === "REGISTERED" && invoice.balance_forward!==-99999999 &&
                    <p>
                      <b>In Words : <i>{getNumToWords(totalReturningAmount)} Taka only</i> </b>
                   </p>
                }
                { invoice.customer_category === "WALKIN" &&
                    <p>
                      <b>In Words : <i>{getNumToWords(totalReturningAmount)} Taka only</i> </b>
                   </p>
                }
                { invoice.customer_category === "CONDITIONAL" && invoice.balance_forward!==-99999999 &&
                    <p>
                      <b>In Words : <i>{getNumToWords(totalReturningAmount)} Taka only</i> </b>
                   </p>
                }
                { invoice.customer_category === "CONDITIONAL" && invoice.balance_forward===-99999999 &&
                    <p>
                      <b>In Words : <i>{getNumToWords(totalReturningAmount)} Taka only</i> </b>
                    </p>
                }
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
