import React, {useEffect, useRef, useState} from 'react'
import { useParams } from 'react-router-dom';
import { getNumToWords, getDateFormatted, getTimeFormatted } from '../../../../utils';
import { SALES_MODEL, CUSTOMER_MODEL, PURCHASE_MODEL, SUPPLIER_MODEL } from '../../../../constants/models';
import { OrderService } from '../../../../services/OrderService';

import { MasterDataDBService } from '../../../../services/MasterDataDBService';
import AuthService from "../../../../services/AuthService";

import InvoiceCss from './InvoiceCss';

import { PrintPOS } from '../../../components/PrintPOS'
import { ComponentToPrint } from '../../../components/ComponentToPrint'

export const PrintPurchaseInvoice = () => {
    
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
    const [salesMan, setSalesMan] = useState("");
    const [totalReturningAmount,setTotalReturningAmount] = useState('');
    const divPrint = useRef(null);

    const populateProductDetailsInItems = async (items) => {
        console.log("items::", items)
        for(let i = 0; i<items?.length; i++){
            let productDetails = await masterDataDBService.getById('dtProduct', items[i].product_id);
            console.log("productDetails::", productDetails)
            items[i].product_name = productDetails.name;
            items[i].product_unit = productDetails.unit;
            items[i].product_part_number = productDetails.part_number;
            items[i].product_model_id = productDetails.dtProductModel_id;
            items[i].product_brand_id = productDetails.dtProductBrand_id;
            items[i].product_model_no = masterDataDBService.getShortnameById("dtProductModel", productDetails.dtProductModel_id);
            console.log("product_model_no::", masterDataDBService.getShortnameById("dtProductModel", productDetails.dtProductModel_id));
            items[i].product_brand_name = masterDataDBService.getShortnameById("dtProductBrand", productDetails.dtProductBrand_id);
        }
        return items;
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
            return_items[i].product_model_no = masterDataDBService.getShortnameById("dtProductModel", productDetails.dtProductModel_id);
            return_items[i].product_brand_name = masterDataDBService.getShortnameById("dtProductBrand", productDetails.dtProductBrand_id);
        }
        return return_items;
    }

    useEffect(() => {
        console.log("ID CHANGED::", id)
        orderService.getById(PURCHASE_MODEL, id).then((data) => {
            console.log("purchase-data::", data)
            AuthService.GetUsername(data.updated_by).then(salesMan => {
                setSalesMan(salesMan.username)
            });
            masterDataDBService.getById(SUPPLIER_MODEL, data.party_id).then((party) => {
                console.log("supplier-party::", party)
                data.party = {
                    "line1": party.name,
                    "line2": party.address,
                    "line3": party.phone,
                };
                // orderService.getLedgerBalance("dtCustomer", data.party_id).then((party_balance) => {
                //     let dr_amount = Number(party_balance.dr_amount)||0;
                //     let cr_amount = Number(party_balance.cr_amount)||0;
                //     let balance = dr_amount - cr_amount;
                //     // console.log("balance::", party_balance);
                //     data.balance = balance;

                populateProductDetailsInItems(data.items).then((items) => {
                    console.log("SUPPLIER-data::items", items)
                    data.items = items;
                    populateProductDetailsInReturnItems(data.return_items).then((return_items) => {
                        console.log("SUPPLIER-data::return_items", return_items)
                        data.return_items = return_items;
                        setInvoice(data);
                    });
                });
                //     // setInvoice(data);
                // });
            });
        });  
    }, [id]);

    useEffect(() => {
        console.log("invoice::", invoice);
        

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
        <button className = "no-printme mr-2" onClick={() =>handlePrint()}>PRINT</button>
        {/* <button className = "no-printme mr-2" onClick={() =>handlePrintOnlySales()}>PRINT ONLY SALES</button>
        <button className = "no-printme mr-2" onClick={() =>handlePrintOnlySalesReturn()}>PRINT ONLY SALES RETURN</button> */}
        <button className = "no-printme" onClick={() =>handlePrintPOS()}>PRINT-POS</button>
        {printmePos && <PrintPOS />}
        {printme && <ComponentToPrint />}
        
        {invoice && <div className='printme' id='printme' ref={divPrint}>
            <header>
                <p>M/S JONONI MOTORS</p>
                <p>R.N ROAD,JASHORE,BANGLADESH</p>
                <p>MOBILE NO - 01712202310, 01913959501</p>
            </header>
            <table className="bill-details">
                <tbody>
                    <tr>
                        <td className="line heading name15"><b>Invoice Number :</b></td><td className="line name35">{invoice.voucher_no}</td>
                        <td className="line heading name15"><b>Invoice Date :</b></td><td className="line name35">{getDateFormatted(invoice.created_at)} {getTimeFormatted(invoice.created_at)}</td>
                    </tr>
                    <tr>
                        <td className="heading name15"><b>Invoice Created By :</b></td><td>{salesMan}</td>
                    </tr>
                    <tr>
                        <td className="heading name15"><b>Party Invoice No :</b></td><td>{invoice.cnf}</td>
                        <td className="heading name15"><b>Party LC No :</b></td><td>{invoice.lc_no}</td>
                    </tr>
                </tbody>
            </table>
            {/* <p  class="line"> {invoice.voucher_no}</p>
            <p>Invoice Date : {getDateFormatted(invoice.created_at)} {getTimeFormatted(invoice.created_at)}</p>
            <p>Invoice Created By : {salesMan}</p> */}
            <table className="bill-details">
                <tbody>
                    
                    {invoice.party && <tr>
                        <td  class="line"><b><span>{invoice.party.line1}</span></b><br/>
                            <span>{invoice.party.line2}</span><br/>
                            <span>{invoice.party.line3}</span></td>
                    </tr>}
                
                    <tr>
                        <th className="center-align line" colSpan="2"><span className="receipt">PURCHASE INVOICE</span></th>
                    </tr>
                    
                </tbody>
            </table>
            {printme && <table className="lineitems">
                <thead>
                    <tr>
                        <th className="heading qty">Sl</th>
                        <th className="heading qty left-align">Qty</th>
                        <th className="heading name left-align">Product Name</th>
                        <th className="heading brand left-align">Brand</th>
                        <th className="heading brand left-align">Part No</th>
                        <th className="heading brand left-align">Model</th>
                        <th className="heading brand right-align">Unit C (F)</th>
                        <th className="heading brand right-align">Total C (F)</th>
                        <th className="heading brand right-align">CR</th>
                        <th className="heading brand right-align">Transport</th>
                        <th className="heading brand right-align">Duty</th>
                        <th className="heading brand right-align">Unit Cost</th>
                        <th className="heading brand right-align">Total Cost</th>
                        <th className="heading brand center-align">Profit %</th>
                        <th className="heading brand right-align">Unit S. Price</th>
                    </tr>
                </thead>
                <tbody>
                    {invoice.items.map( (item, i) => 
                    <tr>
                        <td className="line left-align">{i+1}</td>
                        <td className="line left-align">{Number.parseFloat(item.qty).toFixed(0)} {item.product_unit}</td>
                        <td className="line left-align">{item.product_name}</td>
                        <td className="line left-align">{item.product_brand_name}</td>
                        <td className="line left-align">{item.product_part_number}</td>
                        <td className="line left-align">{item.product_model_no}</td>
                        <td className="line right-align">{Number.parseFloat(item.unit_cost_f).toFixed(2)}</td>
                        <td className="line right-align">{Number.parseFloat(item.unit_cost_f*item.qty).toFixed(2)}</td>
                        <td className="line right-align">{Number.parseFloat(item.conversion_rate).toFixed(2)}</td>
                        <td className="line right-align">{Number.parseFloat(item.transport).toFixed(2)}</td>
                        <td className="line right-align">{Number.parseFloat(item.duty_vat).toFixed(2)}</td>
                        <td className="line right-align">{Number.parseFloat(item.unit_cost).toFixed(2)}</td>
                        <td className="line right-align">{Number.parseFloat(item.unit_cost*item.qty).toFixed(2)}</td>
                        <td className="line center-align">{item.discount_profit}</td>
                        <td className="line right-align">{Number.parseFloat(item.trade_price).toFixed(2) }</td>
                    </tr>)}

                    <tr>
                        <td colSpan="12" className="sum-up line">Gross Amount</td>
                        <td className="line price right-align">{ Number.parseFloat(invoice.gross).toFixed(2)}</td>
                        <td colSpan="2" className="sum-up line"></td>
                    </tr>
                    <tr>
                        <td colSpan="12" className="sum-up">(-) Discount</td>
                        <td className="price right-align">{ Number.parseFloat(invoice.discount).toFixed(2)}</td>
                        <td colSpan="2" className="sum-up"></td>
                    </tr>
                    <tr>
                        <th colSpan="12" className="total text line">Net Amount</th>
                        <th className="total price right-align line">{ Number.parseFloat(invoice.net).toFixed(2)}</th>
                        <td colSpan="2" className="sum-up line"></td>
                    </tr>
                </tbody>
            </table>}
            {printmePos && <table className="lineitems">            
            <thead>
                    <tr>
                        <th className="heading qty">Sl</th>
                        <th className="heading qty left-align">Qty</th>
                        <th className="heading name left-align">Product Name</th>
                        <th className="heading brand left-align">Brand</th>
                        <th className="heading brand left-align">Part No</th>
                        <th className="heading brand left-align">Model</th>
                        <th className="heading brand right-align">Unit Sell Price</th>
                        <th className="heading qty center-align">Unit Profit %</th>
                        <th className="heading amount right-align">Amount</th>
                    </tr>
                </thead>
            
                <tbody>
                
                {invoice.items.map( (item, i) => 
                    <tr>
                        <td className="left-align">{i+1}</td>
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
                        <td colSpan="8" className="sum-up line">Gross Amount</td>
                        <td className="line price right-align">{ Number.parseFloat(invoice.gross).toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colSpan="8" className="sum-up">(-) Discount</td>
                        <td className="price right-align">{ Number.parseFloat(invoice.discount).toFixed(2)}</td>
                    </tr>
                    <tr>
                        <th colSpan="8" className="total text line">Net Amount</th>
                        <th className="total price right-align line">{ Number.parseFloat(invoice.net).toFixed(2)}</th>
                    </tr>
                </tbody>
            </table>}
            <section>
               
                
                { printOnlySales &&
                    <p>
                      <b>In Words : <br></br>
                      Total Amount : <i>{getNumToWords((Number.parseFloat(invoice.net) - Number.parseFloat(invoice.paid)).toFixed(2))} Taka only</i> </b>
                   </p>
                }
                {/* <p>
                    Paid by : <span>CASH</span>
                </p> */}
                {printOnlySales && <p> 
                    <b>Remarks :</b> <span>{invoice.notes}</span>
                </p>}
            </section>
            
            <footer style={{marginTop:"5rem"}}>
                <table style={{"textAlign": "center"}}>
                    <tbody>
                        <tr>
                            <td className="line">Supplier Signature</td>
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
