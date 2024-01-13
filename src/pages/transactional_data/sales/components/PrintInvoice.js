import React, {useEffect, useRef, useState} from 'react'
import { useParams } from 'react-router-dom';
import { getNumToWords, getDateFormatted, getTimeFormatted } from '../../../../utils';
import { SALES_MODEL, CUSTOMER_MODEL } from '../../../../constants/models';
import { OrderService } from '../../../../services/OrderService';

import { MasterDataDBService } from '../../../../services/MasterDataDBService';

import InvoiceCss from './InvoiceCss'

import { PrintPOS } from './PrintPOS'
import { ComponentToPrint } from './ComponentToPrint'

export const PrintInvoice = () => {
    
    let { id } = useParams();

    const orderService = new OrderService();
    const masterDataDBService = new MasterDataDBService();

    const [invoice, setInvoice] = useState(null);
    const [printme, setPrintme] = useState(true)
    const [printOnlySales, setPrintOnlySales] = useState(true)
    const [printOnlySalesReturn, setPrintOnlySalesReturn] = useState(true)
    const [printmePos, setPrintmePos] = useState(false)
    const [trigger, setTrigger] = useState(0)
    const [render, setRender] = useState(false)
    const [totalReturningAmount,setTotalReturningAmount] = useState('');
    const divPrint = useRef(null);

    const populateProductDetailsInItems = async (items) => {
        for(let i = 0; i<items?.length; i++){
            let productDetails = await masterDataDBService.getById('dtProduct', items[i].product_id);
            items[i].product_name = productDetails.name;
            items[i].product_part_number = productDetails.part_number;
            items[i].product_model_id = productDetails.dtProductModel_id;
            items[i].product_brand_id = productDetails.dtProductBrand_id;
        }
    }

    const populateProductDetailsInReturnItems = async (return_items) => {
        for(let i = 0; i<return_items?.length; i++){
            let productDetails = await masterDataDBService.getById('dtProduct', return_items[i].product_id);
            // console.log("productDetails::", productDetails)
            return_items[i].product_name = productDetails.name;
            return_items[i].trade_price = productDetails.price;
            return_items[i].product_part_number = productDetails.part_number;
            return_items[i].product_model_id = productDetails.dtProductModel_id;
            return_items[i].product_brand_id = productDetails.dtProductBrand_id;
            // return_items[i].product_model_no = masterDataDBService.getShortnameById("dtProductModel", productDetails.dtProductModel_id);
            // console.log("productDetails::", masterDataDBService.getShortnameById("dtProductModel", productDetails.dtProductModel_id))
            // return_items[i].product_brand_name = masterDataDBService.getShortnameById("dtProductBrand", productDetails.dtProductBrand_id);
            // console.log("productDetails::", masterDataDBService.getShortnameById("dtProductBrand", productDetails.dtProductBrand_id))
            // console.log("return-productDetails::", return_items)
        }
    }

    useEffect(() => {
        console.log("ID CHANGED::", id)
        orderService.getById(SALES_MODEL, id).then(async (data) => {
            if(data && data.customer_category!=="WALKIN"){
                masterDataDBService.getById(CUSTOMER_MODEL, data.party_id).then(async (party) => {
                    data.party = {
                        "line1": party.name,
                        "line2": party.address,
                        "line3": party.phone,
                    };
                    orderService.getLedgerBalance("dtCustomer", data.party_id).then(async (party_balance) => {
                        let dr_amount = Number(party_balance.dr_amount)||0;
                        let cr_amount = Number(party_balance.cr_amount)||0;
                        let balance = dr_amount - cr_amount;
                        // console.log("balance::", party_balance);
                        data.balance = balance;

                        // populate product details both for items and return_items
                        await populateProductDetailsInItems(data.items);
                        // populate the return items
                        await populateProductDetailsInReturnItems(data.return_items);

                        setInvoice(data);
                        console.log(data)
                        console.log(data)
                    });
                }); 
            }else{
                data.balance = 0;
                // populate product details both for items and return_items
                await populateProductDetailsInItems(data.items);
                // populate the return items
                await populateProductDetailsInReturnItems(data.return_items);
                console.log("WALKIN-data::", data)
                setInvoice(data);
            }
        });  
    }, [id]);

    useEffect(() => {
        console.log("invoice::", invoice);
        // for(let i = 0; i<invoice?.items?.length; i++){
        //     for(let j = 0; j<invoice?.return_items?.length; j++){
        //         if(invoice.items[i].product_id === invoice.return_items[j].product_id){
        //             invoice.return_items[j].product_part_number = invoice.items[i].product_part_number;
        //             invoice.return_items[j].trade_price = invoice.items[i].trade_price;
        //             invoice.return_items[j].product_model_no = masterDataDBService.getShortnameById("dtProductModel", invoice.items[i].product_model_id);
        //             invoice.return_items[j].product_brand_name = masterDataDBService.getShortnameById("dtProductBrand", invoice.items[i].product_brand_id);
        //        }
        //     }
        // }

        let totalReturningAmountLocal = 0;
        for(let i = 0; i<invoice?.return_items?.length; i++){
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
        setPrintOnlySales(true);
        setPrintOnlySalesReturn(true);
        setPrintmePos(false);
        setTrigger(trigger+1);
        // PrintElem("printme");
    }

    const handlePrintOnlySales = () => {
        setPrintOnlySales(true);
        setPrintOnlySalesReturn(false);
        setPrintmePos(false);
        setTrigger(trigger+1);
        // PrintElem("printme");
    }

    const handlePrintOnlySalesReturn = () => {
        setPrintOnlySales(false);
        setPrintOnlySalesReturn(true);
        setPrintmePos(false);
        setTrigger(trigger+1);
        // PrintElem("printme");
    }

    const handlePrintPOS = () => {
        let elHeight = document.getElementById('printme').clientHeight
        alert(elHeight);
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
        <button className = "no-printme mr-2" onClick={() =>handlePrint()}>PRINT</button>
        <button className = "no-printme mr-2" onClick={() =>handlePrintOnlySales()}>PRINT ONLY SALES</button>
        <button className = "no-printme mr-2" onClick={() =>handlePrintOnlySalesReturn()}>PRINT ONLY SALES RETURN</button>
        <button className = "no-printme" onClick={() =>handlePrintPOS()}>PRINT-POS</button>
        {printmePos && <PrintPOS />}
        {printme && <ComponentToPrint />}
        
        {invoice && <div className='printme' id='printme' ref={divPrint}>
            <header>
                <p>M/S JONONI MOTORS</p>
                <p>R.N ROAD,JASHORE,BANGLADESH</p>
                <p>MOBILE NO - 01712202310, 01913959501</p>
            </header>
            <p  class="line">Invoice Number : {invoice.voucher_no}</p>
            <p>Invoice Date : {getDateFormatted(invoice.created_at)} {getTimeFormatted(invoice.created_at)}</p>
            <table className="bill-details">
                <tbody>
                    {invoice.customer_category === "CONDITIONAL" && <tr><td class="line">Bill To <b>{getBillTo(invoice.customer_category)}</b>:</td></tr>}
                    {invoice.customer_category !== "CONDITIONAL" && <tr><td class="line">Bill To {getBillTo(invoice.customer_category)}:</td></tr>}
                    {invoice.party && <tr>
                        <td  class="line"><span>{invoice.party.line1}</span><br/>
                            <span>{invoice.party.line2}</span><br/>
                            <span>{invoice.party.line3}</span></td>
                    </tr>}
                    {!invoice.party && <tr>
                        <td><span>{invoice.customer_name}</span><br/>
                            <span>{invoice.customer_phone}</span></td>
                    </tr>}
                    {printOnlySales && invoice.status !== 'draft' && <tr>
                        <th className="center-align line" colSpan="2"><span className="receipt">SALES INVOICE</span></th>
                    </tr>}
                    {printOnlySales && invoice.status === 'draft' && <tr>
                        <th className="center-align line" colSpan="2"><span className="receipt">SALES INVOICE [DRAFT]</span></th>
                    </tr>}
                </tbody>
            </table>
            {printme && printOnlySales && <table className="lineitems">
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
                        <td className="left-align">{masterDataDBService.getShortnameById("dtProductBrand", item.product_brand_id)}</td>
                        <td className="left-align">{item.product_part_number}</td>
                        <td className="left-align">{masterDataDBService.getShortnameById("dtProductModel", item.product_model_id)}</td>
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
                    {invoice.customer_category === "REGISTERED" && invoice.balance_forward!==-99999999 && <tr>
                        <th colSpan="7" className="total text line">(+) B/F Balance</th>
                        <th className="total price right-align line">{ Number.parseFloat(invoice.balance_forward).toFixed(2)}</th>
                    </tr>}
                    {invoice.customer_category === "REGISTERED" && invoice.balance_forward!==-99999999 && <tr>
                       <th colSpan="7" className="total text line">Total Amount</th>
                        <th className="total price right-align line">{ Number.parseFloat(Number.parseFloat(invoice.net).toFixed(2)) + Number.parseFloat(Number.parseFloat(invoice.balance_forward).toFixed(2))}</th>
                    </tr>}
                    {invoice.customer_category === "REGISTERED" && invoice.balance_forward ===-99999999 && <tr>
                       <th colSpan="7" className="total text line">Total Amount</th>
                        <th className="total price right-align line">{ Number.parseFloat(invoice.net).toFixed(2) }</th>
                    </tr>}
                    {invoice.payment && <tr>
                        <td colSpan="7" className="sum-up">
                              {invoice.customer_category !== "CONDITIONAL" && <span>
                                [
                                    Bank : <span className="price">{invoice.payment.bank_amount} </span>
                                    Cash : <span className="price">{invoice.payment.cash_amount} </span>
                                    MFS : <span className="price">{invoice.payment.mfs_amount} </span>
                                ]
                              </span>}
                              {invoice.advance_payment && invoice.customer_category === "CONDITIONAL" &&  <span>
                                [
                                    <>Bank : <span className="price">{invoice.advance_payment.bank_amount} </span></>
                                    {invoice.trx_status === "pending" && <>Cash : <span className="price">{invoice.advance_payment.cash_amount} </span></>}
                                    {invoice.trx_status === "completed" && <>Cash : <span className="price">{invoice.advance_payment.cash_amount} </span> + <span className="price">{invoice.advance_payment.current_balance} </span></>}
                                    <>MFS : <span className="price">{invoice.advance_payment.mfs_amount} </span></>
                                ]
                              </span>}
                        {invoice.customer_category === "REGISTERED" && "(-) Payment Collection"}
                        {invoice.customer_category !== "REGISTERED" && "(-) Payment"}

                        </td>
                        {invoice.customer_category !== "REGISTERED" && <td className="price right-align">{ Number.parseFloat(invoice.paid).toFixed(2)}</td>}
                        {invoice.customer_category === "REGISTERED" && <td className="price right-align">{ Number.parseFloat(invoice.payment.cash_amount + invoice.payment.bank_amount + invoice.payment.mfs_amount).toFixed(2)}</td>}
                    </tr>}
                    
                    {invoice.customer_category === "CONDITIONAL" && invoice.balance_forward!==-99999999 && <tr>
                       <th colSpan="7" className="total text line">Receivable (Conditional)</th>
                        <th className="total price right-align line">{ Number.parseFloat(Number.parseFloat(invoice.net).toFixed(2)) - Number.parseFloat(Number.parseFloat(invoice.paid).toFixed(2))}</th>
                    </tr>}
                    {invoice.customer_category === "CONDITIONAL" && invoice.balance_forward === -99999999 && <tr>
                       <th colSpan="7" className="total text line">Receivable (Conditional)</th>
                        <th className="total price right-align line">{ Number.parseFloat(Number.parseFloat(invoice.net).toFixed(2)) - Number.parseFloat(Number.parseFloat(invoice.paid).toFixed(2))}</th>
                    </tr>}
                    {invoice.customer_category === "CONDITIONAL" && invoice.balance_forward!==-99999999 && <tr>
                       <th colSpan="7" className="total text line">B/F Balance</th>
                        <th className="total price right-align line">{ Number.parseFloat(invoice.balance_forward).toFixed(2) }</th>
                    </tr>}
                    {invoice.customer_category === "CONDITIONAL" && invoice.balance_forward!==-99999999 && <tr>
                       <th colSpan="7" className="total text line">Total Receivable (Ledger)</th>
                        <th className="total price right-align line">{ Number.parseFloat((Number.parseFloat(invoice.net).toFixed(2)) - Number.parseFloat(Number.parseFloat(invoice.paid).toFixed(2))) + Number.parseFloat(Number.parseFloat(invoice.balance_forward).toFixed(2)) }</th>
                    </tr>}

                    {invoice.payment && invoice.customer_category === "REGISTERED" && invoice.balance_forward ===-99999999 && <tr>
                        <th colSpan="7" className="total text line">(+) Balance</th>
                        <th className="total price right-align line">{ Number.parseFloat(Number.parseFloat(invoice.net).toFixed(2)) - Number.parseFloat(Number.parseFloat(invoice.payment.cash_amount + invoice.payment.bank_amount + invoice.payment.mfs_amount).toFixed(2)) }</th>
                    </tr>}
                    {invoice.payment && invoice.customer_category === "REGISTERED" && invoice.balance_forward !==-99999999 && <tr>
                        <th colSpan="7" className="total text line">(+) Balance</th>
                        <th className="total price right-align line">{ Number.parseFloat(Number.parseFloat(invoice.net).toFixed(2)) + Number.parseFloat(Number.parseFloat(invoice.balance_forward).toFixed(2)) -  Number.parseFloat(Number.parseFloat(invoice.payment.cash_amount + invoice.payment.bank_amount + invoice.payment.mfs_amount).toFixed(2))}</th>
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
                { printOnlySales && invoice.customer_category === "REGISTERED" && invoice.balance_forward===-99999999 &&
                    <p>
                      <b>In Words (Invoice Amount) : <i>{getNumToWords(Number.parseFloat(invoice.net).toFixed(2))} Taka only</i> </b>
                   </p>
                }
                { printOnlySales && invoice.customer_category === "REGISTERED" && invoice.balance_forward!==-99999999 && (invoice.balance_forward + invoice.net) > 0 &&
                    <p>
                      <b>In Words (Invoice Amount) : <i>{getNumToWords((Number.parseFloat(invoice.net) + Number.parseFloat(invoice.balance_forward)).toFixed(2))} Taka only</i> </b>
                   </p>
                }
                { printOnlySales && invoice.customer_category === "REGISTERED" && invoice.balance_forward!==-99999999 && (invoice.balance_forward + invoice.net) < 0 &&
                    <p>
                      <b>In Words (Invoice Amount) : <i>{getNumToWords(Number.parseFloat((-1) * (invoice.balance_forward + invoice.net)).toFixed(2))} Taka only [Advance]</i> </b>
                   </p>
                }
                { printOnlySales && invoice.customer_category === "WALKIN" &&
                    <p>
                      <b>In Words : <i>{getNumToWords(Number.parseFloat(invoice.net).toFixed(2))} Taka only</i> </b>
                   </p>
                }
                { printOnlySales && invoice.customer_category === "CONDITIONAL" && invoice.balance_forward!==-99999999 &&
                    <p>
                      <b>In Words : <br></br>
                      Conditional Amount : <i>{getNumToWords((Number.parseFloat(invoice.net) - Number.parseFloat(invoice.paid)).toFixed(2))} Taka only</i> <br></br>
                      Ledger Balance : <i>{getNumToWords(((Number.parseFloat(invoice.net) - Number.parseFloat(invoice.paid)) + Number.parseFloat(invoice.balance_forward)).toFixed(2))} Taka only</i> </b>
                   </p>
                }
                { printOnlySales && invoice.customer_category === "CONDITIONAL" && invoice.balance_forward===-99999999 &&
                    <p>
                      <b>In Words : <br></br>
                      Total Recievable : <i>{getNumToWords((Number.parseFloat(invoice.net) - Number.parseFloat(invoice.paid)).toFixed(2))} Taka only</i> </b>
                   </p>
                }
                {/* <p>
                    Paid by : <span>CASH</span>
                </p> */}
                {printOnlySales && <p> 
                    <b>Remarks :</b> <span>{invoice.notes}</span>
                </p>}
            </section>
            {(invoice?.return_items?.length > 0 && printOnlySalesReturn) && <section>
                <table className="bill-details">
                    <tbody>
                        <tr>
                            <th className="center-align line" colSpan="2"><span className="receipt">SALES RETURN INFORMATION</span></th>
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
                            <td className="left-align">{masterDataDBService.getShortnameById("dtProductBrand", item.product_brand_id)}</td>
                            <td className="left-align">{item.product_part_number}</td>
                            <td className="left-align">{masterDataDBService.getShortnameById("dtProductModel", item.product_model_id)}</td>
                            <td className="right-align">{Number.parseFloat(item.trade_price).toFixed(2)}</td>
                            <td className="right-align">{Number.parseFloat(item.return_qty*item.trade_price).toFixed(2) }</td>
                        </tr>)}
                        <tr>
                            <th colSpan="7" className="total text line">Total Returned Amount</th>
                            <th className="total price right-align line">{Number.parseFloat(totalReturningAmount).toFixed(2)}</th>
                        </tr>
                        
                    </tbody>
                </table>}
                <p>
                      <b>In Words : <i>{getNumToWords(totalReturningAmount)} Taka only</i> </b>
                   </p>
                <p> 
                    <b>Remarks :</b> <span>{invoice.notes}</span>
                </p>
            </section>}
            <footer style={{marginTop:"5rem"}}>
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
