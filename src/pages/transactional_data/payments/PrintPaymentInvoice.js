import React, {useEffect, useRef, useState} from 'react'
import { useParams } from 'react-router-dom';

import { RegisterService } from '../../../services/RegisterService';
import { MasterDataDBService } from '../../../services/MasterDataDBService';
import { OrderService } from '../../../services/OrderService';
import AuthService from "../../../services/AuthService";

import PaymentInvoiceCss from './PaymentInvoiceCss'

import { PrintPOS } from '../../../pages/components/PrintPOS'
import { ComponentToPrint } from '../../../pages/components/ComponentToPrint'

import { getNumToWords, getDateFormatted, getTimeFormatted } from '../../../utils';

export const PrintPaymentInvoice = () => {
    
    let { id } = useParams();

    const orderService = new OrderService();
    const registerService = new RegisterService();
    const masterDataDBService = new MasterDataDBService();

    const [printme, setPrintme] = useState(true)
    const [printOnlySales, setPrintOnlySales] = useState(true)
    const [printmePos, setPrintmePos] = useState(false)
    const [trigger, setTrigger] = useState(0)
    const divPrint = useRef(null);

    const [paymentData, setPaymentData] = useState({});
    const [salesMan, setSalesMan] = useState(""); // name
    const [partyInfo, setPartyInfo] = useState({});

    useEffect(() => {
        if(id){
            registerService.getById(id).then(data => {
                // orderService.getLedgerBalance("dtCustomer", 1).then(async (party_balance) => {
                //     let dr_amount = Number(party_balance.dr_amount)||0;
                //     let cr_amount = Number(party_balance.cr_amount)||0;
                //     let balance = dr_amount - cr_amount;
                // });

                masterDataDBService.getById(data.party_type, data.party_id).then(partyInfo => {
                    setPartyInfo(partyInfo);
                    console.log(partyInfo);
                });
                AuthService.GetUsername(data.register_by).then(salesMan => {
                    setSalesMan(salesMan.username)
                });
                setPaymentData(data.register_details);
                console.log(data);
            });
        }
    }, [id]);
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
        alert(elHeight);
        setPrintme(false);
        setPrintmePos(true);
        setTrigger(trigger+1);
    }

    return (
      <div>
        <PaymentInvoiceCss />
        <button className = "no-printme mr-2" onClick={() =>handlePrint()}>PRINT</button>
        <button className = "no-printme" onClick={() =>handlePrintPOS()}>PRINT-POS</button>
        {printmePos && <PrintPOS />}
        {printme && <ComponentToPrint />}
        
      <div className='printme' id='printme' ref={divPrint}>
            <header>
                <p>M/S JONONI MOTORS</p>
                <p>R.N ROAD,JASHORE,BANGLADESH</p>
                <p>MOBILE NO - 01712202310, 01913959501</p>
            </header>
            <p  class="line">Invoice Number : {paymentData.payment_no} </p>
            <p>Invoice Date : {getDateFormatted(paymentData.payment_date)} {getTimeFormatted(paymentData.payment_date)}</p>
            <table className="line">
                <tbody>
                    <tr>
                        {/* <td>
                            {partyInfo && <><span>{partyInfo.name}</span><br/>
                            <span>{partyInfo.address}</span><br/>
                            <span>{partyInfo.phone}</span></>}
                        </td> */}
                    </tr>
                    <tr>
                        <td className="line">
                            <span>Payment via ({salesMan}) </span><br/>
                        </td>
                    </tr>
                    <tr>
                        <th className="center-align line" colSpan="2"><span className="receipt">PAYMENT INVOICE</span></th>
                    </tr>
                </tbody>
            </table>

            {printme && printOnlySales && <table className="lineitems">
               <div className="line">
                         <div className="parentPayment">
                            <div><b>Ledger Balance</b></div>
                            <div className="price"><b>{paymentData.current_balance}</b></div>
                         </div>
               </div>
               <div>
                         <div className="parentPayment">
                            {paymentData.payment_method === 'CASH' && <div><b>[CASH] (-)Payment</b></div>}
                            {paymentData.payment_method === 'MFS' && <div><b>[MFS] (-)Payment</b></div>}
                            {paymentData.payment_method === 'BANK' && <div><b>[BANK] (-)Payment</b></div>}
                            <div className="price"><b>{paymentData.amount}</b></div>
                         </div>
               </div>
               <div className="line">
                         <div className="parentPayment">
                            <div><b>Balance After Payment</b></div>
                            <div className="price"><b>{Number(paymentData.current_balance) - Number(paymentData.amount)}</b></div>
                         </div>
               </div>
            </table>}

            {printmePos && <table className="lineitems">            
            <div className="line">
                         <div className="parentPayment">
                            <div><b>Ledger Balance</b></div>
                            <div className="price"><b>{paymentData.current_balance}</b></div>
                         </div>
               </div>
               <div>
                         <div className="parentPayment">
                            <div><b>[Bank/MFS/CASH] (-)Payment</b></div>
                            <div className="price"><b>{paymentData.amount}</b></div>
                         </div>
               </div>
               <div className="line">
                         <div className="parentPayment">
                            <div><b>Balance After Payment</b></div>
                            <div className="price"><b>{Number(paymentData.current_balance) - Number(paymentData.amount)}</b></div>
                         </div>
               </div>
            </table>}
            <br></br>
            <br></br>
            <section>
                    <p>
                      <b>In Words : {getNumToWords(Number.parseFloat(paymentData.amount).toFixed(2))} Taka only, Thank you.</b>
                   </p>

                <p> 
                    <b>Remarks :</b> <span><b>{paymentData.remarks}</b></span>
                </p>
            </section>
            <footer style={{marginTop:"5rem"}}>
                <table style={{"textAlign": "center"}}>
                    <tbody>
                        <tr>
                            <td className="line">Party Signature</td>
                            <td className="line">Account Signature</td>
                            <td className="line">Authorised Signature</td>
                        </tr>
                    </tbody>
                </table>
            </footer>
        </div>
      </div>
    )
}
