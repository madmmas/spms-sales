import * as moment from 'moment';
import React, {useEffect, useRef, useState} from 'react'

import { getDateWithFormat, getDateFormatted } from '../../utils';

import ReportCss from './ReportCss'
import { ComponentToPrint } from './ComponentToPrint'

import { TransactionService } from '../../services/TransactionService';

export const CashFlow = () => {
    
    const [cashFlowData, setCashFlowData] = useState([]);
    const [trigger, setTrigger] = useState(0)

    const transactionService = new TransactionService();

    useEffect(() => {
        if(cashFlowData.length === 0){

            transactionService.getReport('cashflow', {
                "ondate": getDateWithFormat(new Date(), "YYYY-MM-DD"),
                // "ondate": getDateWithFormat('2023-11-09', "YYYY-MM-DD"),
            }).then(data => {
                setCashFlowData(data);
                console.log(data);
            });
        }
    }, [cashFlowData]);

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
            <p class="line">Daily Statement of Showroom: SPARE PARTS Dated at {getDateWithFormat(new Date(), "DD-MMM-YYYY")}</p>
            <table className="bill-details">
                <tbody>
                    <tr>
                        <th className="center-align line" colSpan="2"><span className="receipt">Cash Flow</span></th>
                    </tr>
                </tbody>
            </table>
            <table className="lineitems">
                <thead>
                    <tr>
                        <th className="heading qty left-align">Cash inflow</th>
                        <th className="heading qty left-align">Cash outflow</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="left-align">
                            <table className="lineitems">
                                <thead>
                                    <tr>
                                        <th colSpan="2" className="bottom-line left-align">Bank Drawings</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="left-align">Bank name 1</td>
                                        <td className="right-align qty">{Number.parseFloat(3000.00).toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td className="left-align">Bank name 2</td>
                                        <td className="right-align qty">{Number.parseFloat(989.00).toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td className="left-align">Bank name 3</td>
                                        <td className="right-align qty">{Number.parseFloat(2000.00).toFixed(2)}</td>
                                    </tr>
                                </tbody>
                            </table> 
                            <table className="lineitems">
                                <thead>
                                    <tr>
                                        <th colSpan="2" className="bottom-line left-align">MFS Drawings</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="left-align">BKash</td>
                                        <td className="right-align qty">{Number.parseFloat(3000.00).toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td className="left-align">Nagad</td>
                                        <td className="right-align qty">{Number.parseFloat(989.00).toFixed(2)}</td>
                                    </tr>
                                </tbody>
                            </table> 
                            <table className="lineitems">
                                <thead>
                                    <tr>
                                        <th colSpan="2" className="bottom-line left-align">Party Collection</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="left-align">1000 Party 1</td>
                                        <td className="right-align qty">{Number.parseFloat(10.00).toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td className="left-align">1002 Party 2</td>
                                        <td className="right-align qty">{Number.parseFloat(675.00).toFixed(2)}</td>
                                    </tr>
                                </tbody>
                            </table> 
                            <table className="lineitems">
                                <thead>
                                    <tr>
                                        <th colSpan="2" className="bottom-line left-align">Sales</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="left-align">New Sales</td>
                                        <td className="right-align qty">{Number.parseFloat(cashFlowData["new_sales"]).toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td className="left-align">Advance Payment Sales on Condition</td>
                                        <td className="right-align qty">{Number.parseFloat(cashFlowData["advance_payment_conditional_sales"]).toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td className="left-align">Cash Collection Sales on Condition</td>
                                        <td className="right-align qty">{Number.parseFloat(cashFlowData["cash_collection_conditional_sales"]).toFixed(2)}</td>
                                    </tr>
                                </tbody>
                            </table> 
                            <table className="lineitems box">
                                <tbody>
                                    <tr>
                                        <td className="left-align"><b>TOTAL ----</b></td>
                                        <td className="right-align qty"><b>{Number.parseFloat(40000.00).toFixed(2)}</b></td>
                                    </tr>
                                </tbody>
                            </table> 
                            <table className="lineitems">
                                <tbody>
                                    <tr>
                                        <td className="left-align"><b>Closing Cash</b></td>
                                        <td> = Opening Cash + Total Inflow + Total Outflow</td>
                                    </tr>
                                    <tr>
                                        <td className="left-align"></td>
                                        <td>= {Number.parseFloat(cashFlowData["opening_cash_balance"]).toFixed(2)} + 
                                                49689.00 + 233423.00</td>
                                    </tr>
                                    <tr>
                                        <td className="left-align"></td>
                                        <td>= 9877899.00</td>
                                    </tr>
                                </tbody>
                            </table> 
                            <table className="lineitems">
                                <tbody>
                                    <tr>
                                        <th colSpan="5" className="bottom-line left-align">Customer's Payment Through Bank</th>
                                    </tr>
                                    <tr>
                                        <th className="left-align">SI</th>
                                        <th className="left-align">Customer Name (Shop Name)</th>
                                        <th className="left-align">Bank Name</th>
                                        <th className="left-align">Acc. Number</th>
                                        <th className="left-align">Amount</th>   
                                    </tr>
                                    <tr>
                                        <td className="left-align">1</td>  
                                        <td className="left-align">Shop 1</td>  
                                        <td className="left-align">Bank 1</td>  
                                        <td className="left-align">2802309876</td>  
                                        <td className="left-align">10,000</td>  
                                    </tr>
                                    <tr>
                                        <td className="left-align">2</td>  
                                        <td className="left-align">Shop 2</td>  
                                        <td className="left-align">Bank 2</td>  
                                        <td className="left-align">2802309878</td>  
                                        <td className="left-align">20,000</td>  
                                    </tr>
                                    <tr>
                                        <td className="left-align">3</td>  
                                        <td className="left-align">Shop 3</td>  
                                        <td className="left-align">Bank 3</td>  
                                        <td className="left-align">2802309879</td>  
                                        <td className="left-align">30,000</td>  
                                    </tr>
                                </tbody>
                            </table> 
                        </td>
                        <td className="left-align">
                            <table className="lineitems">
                                <thead>
                                    <tr>
                                        <th colSpan="2" className="bottom-line left-align">Bank Deposit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="left-align">Bank name</td>
                                        <td className="right-align qty">{Number.parseFloat(10.00).toFixed(2)}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <table className="lineitems">
                                <thead>
                                    <tr>
                                        <th colSpan="2" className="bottom-line left-align">Cash Payments</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="left-align">Suppier's Payment</td>
                                        <td className="right-align qty">{Number.parseFloat(10.00).toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td className="left-align">Sales Return</td>
                                        <td className="right-align qty">{Number.parseFloat(10.00).toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td className="left-align">Dispatch Amount</td>
                                        <td className="right-align qty">{Number.parseFloat(10.00).toFixed(2)}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <table className="lineitems">
                                <thead>
                                    <tr>
                                        <th colSpan="2" className="bottom-line left-align">MFS Deposit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="left-align">BKash</td>
                                        <td className="right-align qty">{Number.parseFloat(3000.00).toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td className="left-align">Nagad</td>
                                        <td className="right-align qty">{Number.parseFloat(989.00).toFixed(2)}</td>
                                    </tr>
                                </tbody>
                            </table>                             
                            <table className="lineitems">
                                <thead>
                                    <tr>
                                        <th colSpan="2" className="bottom-line left-align">General Expenses</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="left-align">Petty</td>
                                        <td className="right-align qty">{Number.parseFloat(10.00).toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td className="left-align">Office Expenses</td>
                                        <td className="right-align qty">{Number.parseFloat(10.00).toFixed(2)}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <table className="lineitems box">
                                <tbody>
                                    <tr>
                                        <td className="left-align"><b>TOTAL ----</b></td>
                                        <td className="right-align qty"><b>{Number.parseFloat(40000.00).toFixed(2)}</b></td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>            
        </div>
      </div>
    )
}
