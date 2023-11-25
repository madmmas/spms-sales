import React, {useEffect, useRef, useState} from 'react'
import { useParams } from 'react-router-dom';

import { getDateFormatted, getTimeFormatted } from '../../utils';

import ReportCss from './ReportCss'
import { ComponentToPrint } from './ComponentToPrint'

export const PrintReport = () => {
    
    let { id } = useParams();

    const [invoice, setInvoice] = useState({items:[]});
    const [trigger, setTrigger] = useState(0)

    useEffect(() => {
        console.log("ID CHANGED::", id)
        // orderService.getById(SALES_MODEL, id).then(data => {
        //     if(data && data.customer_category!=="WALKIN"){
        //         masterDataService.getById(CUSTOMER_MODEL, data.party_id).then(party => {
        //             data.party = {
        //                 "line1": party.shopName,
        //                 "line2": party.address,
        //                 "line3": party.phone,
        //             };
        //             orderService.getLedgerBalance("dtCustomer", data.party_id).then(party_balance => {
        //                 let dr_amount = Number(party_balance.dr_amount)||0;
        //                 let cr_amount = Number(party_balance.cr_amount)||0;
        //                 let balance = dr_amount - cr_amount;
        //                 console.log("balance::", party_balance);
        //                 data.balance = balance;
        //                 setInvoice(data);
        //                 console.log(data)
        //                 console.log(data)
        //             });
        //         }); 
        //     }else{
        //         data.balance = 0;
        //         setInvoice(data);
        //     }
        // });  
    }, [id]);

    useEffect(() => {
        console.log("invoice::", invoice);
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
        setTrigger(trigger+1);
        // PrintElem("printme");
    }

    return (
      <div>
        <ReportCss />
        <button className = "no-printme" onClick={() =>handlePrint()}>PRINT</button>

        <ComponentToPrint />
        
        <div className='printme' id='printme'>
            <header>
                <p>M/S JONONI MOTORS</p>
                <p>R.N ROAD,JASHORE,BANGLADESH</p>
                <p>MOBILE NO - 01712202310, 01913959501</p>
            </header>
            {/* <p>Date : {getDateFormatted(invoice.created_at)} {getTimeFormatted(invoice.created_at)}</p> */}
            <p class="line">Date : 11/11/2023</p>
            <table className="bill-details">
                <tbody>
                    <tr>
                        <th className="center-align line" colSpan="2"><span className="receipt">CASH LEDGER</span></th>
                    </tr>
                </tbody>
            </table>
            <table className="lineitems">
                <thead>
                    <tr>
                        <th className="heading qty left-align">Sl</th>
                        <th className="heading qty left-align">Date</th>
                        <th className="heading name left-align">Voucher No</th>
                        <th className="heading brand left-align">Description</th>
                        <th className="heading brand left-align">Dr</th>
                        <th className="heading brand left-align">Cr</th>
                        <th className="heading brand left-align">Balance</th>
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
                    </tr>)}

                    <tr>
                        <td colSpan="6" className="sum-up line">Total Amount</td>
                        <td className="line price right-align">{ Number.parseFloat(invoice.gross).toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colSpan="6" className="sum-up">(-) Discount</td>
                        <td className="price right-align">{ Number.parseFloat(invoice.discount).toFixed(2)}</td>
                    </tr>
                    <tr>
                        <th colSpan="6" className="total text line">Net Amount</th>
                        <th className="total price right-align line">{ Number.parseFloat(invoice.net).toFixed(2)}</th>
                    </tr>
                </tbody>
            </table>
            
            <section>
                <p> 
                    <b>Remarks :</b> <span>{invoice.notes}</span>
                </p>
            </section>
        </div>
      </div>
    )
}
