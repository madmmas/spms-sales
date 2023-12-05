import * as moment from 'moment';
import React, {useEffect, useRef, useState} from 'react'
import { Calendar } from 'primereact/calendar';
import { getDateWithFormat, getFormattedNumber, getLedgerFormattedNumber } from '../../utils';

import ReportCss from './ReportCss'
import { ComponentToPrint } from './ComponentToPrint'

import { TransactionService } from '../../services/TransactionService';

export const CashFlow = () => {
    
    const [cashFlowData, setCashFlowData] = useState([]);
    const [cashflowTotal, setCashflowTotal] = useState(0);
    const [cashInflowTotal, setCashInflowTotal] = useState(0);
    const [cashOutflowTotal, setCashOutflowTotal] = useState(0);
    const [trigger, setTrigger] = useState(0)
    const [reportDate, setReportDate] = useState(new Date())

    const transactionService = new TransactionService();

    useEffect(() => {
        loadCashFlowData();
    }, [reportDate]);

    useEffect(() => {
        if(trigger>0){
            window.print();
        }
    }, [trigger]);

    const loadCashFlowData = () => {
        let ondate = moment(reportDate).format("YYYY-MM-DD");
        transactionService.getReport('cashflow', {
            "ondate": ondate,
        }).then(data => {
            setCashFlowData(data);
            calculateCashflowTotal(data);
            console.log("CashFlowData::", data);
        });
        transactionService.getLedgerBalanceUpto('dtCash', ondate).then(data => {
            console.log("dtCash::", data);
            setCashFlowData(prevState => {
                return {...prevState, opening_cash_balance: data.balance}
            });
        });
    }

    const calculateCashflowTotal = (data) => {
        let total = 0;
        let inflow = calculateCashInflowTotal(data);
        let outflow = calculateCashOutflowTotal(data);
        total = inflow - outflow;
        setCashInflowTotal(inflow);
        setCashOutflowTotal(outflow);
        setCashflowTotal(total);
    }

    const calculateCashInflowTotal = (data) => {
        let total = 0;
        if(data['bank_drawings']){
            data['bank_drawings'].forEach(item => {
                total += parseFloat(item.amount);
            });
        }
        if(data['mfs_drawings']){
            data['mfs_drawings'].forEach(item => {
                total += parseFloat(item.amount);
            });
        }
        if(data['general_income']){
            data['general_income'].forEach(item => {
                total += parseFloat(item.amount);
            });
        }
        if(data['party_collection']){
            data['party_collection'].forEach(item => {
                total += parseFloat(item.amount);
            });
        }
        if(data['new_sales']){
            total += parseFloat(data['new_sales']);
        }
        if(data['advance_payment_conditional_sales']){
            total += parseFloat(data['advance_payment_conditional_sales']);
        }
        if(data['cash_collection_conditional_sales']){
            total += parseFloat(data['cash_collection_conditional_sales']);
        }
        return total;
    }

    const calculateCashOutflowTotal = (data) => {
        let total = 0;
        if(data['bank_deposit']){
            data['bank_deposit'].forEach(item => {
                total += parseFloat(item.amount);
            });
        }
        if(data['party_payment']){
            data['party_payment'].forEach(item => {
                total += parseFloat(item.amount);
            });
        }
        if(data['mfs_deposit']){
            data['mfs_deposit'].forEach(item => {
                total += parseFloat(item.amount);
            });
        }
        if(data['general_expenses']){
            data['general_expenses'].forEach(item => {
                total += parseFloat(item.amount);
            });
        }

        return total;
    }

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
        <div className="no-printme">
        <Calendar value={reportDate} 
            onChange={(e) => setReportDate(e.value)} 
            dateFormat="mm/dd/yy" placeholder="mm/dd/yy" mask="99/99/9999" 
            />
        <button className = "no-printme" onClick={() =>loadCashFlowData()}>Refresh</button>
        <button className = "no-printme" onClick={() =>handlePrint()}>PRINT</button>
        </div>
        <ComponentToPrint />
        
        <div className='printme' id='printme'>
            <header>
                <p>M/S JONONI MOTORS</p>
                <p>R.N ROAD,JASHORE,BANGLADESH</p>
                <p>MOBILE NO - 01712202310, 01913959501</p>
            </header>
            <p class="line">Daily Statement of Showroom: SPARE PARTS Dated at <b>{getDateWithFormat(reportDate, "DD-MMM-YYYY")}</b></p>
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
                                    {cashFlowData['bank_drawings'] && cashFlowData['bank_drawings'].map((item) =>
                                    <tr>
                                        <td className="left-align">{item.particular}</td>
                                        <td className="right-align qty">{getFormattedNumber(item.amount)}</td>
                                    </tr>)}
                                    {(cashFlowData['bank_drawings'] === undefined || 
                                        cashFlowData['bank_drawings'].length==0) &&
                                    <tr>
                                        <td className="left-align" colSpan="2">No Record ...</td>
                                    </tr>}
                                </tbody>
                            </table> 
                            <table className="lineitems">
                                <thead>
                                    <tr>
                                        <th colSpan="2" className="bottom-line left-align">MFS Drawings</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cashFlowData['mfs_drawings'] && cashFlowData['mfs_drawings'].map((item) =>
                                    <tr>
                                        <td className="left-align">{item.particular}</td>
                                        <td className="right-align qty">{getFormattedNumber(item.amount)}</td>
                                    </tr>)}
                                    {(cashFlowData['mfs_drawings'] === undefined || 
                                        cashFlowData['mfs_drawings'].length==0) &&
                                    <tr>
                                        <td className="left-align" colSpan="2">No Record ...</td>
                                    </tr>}
                                </tbody>
                            </table> 
                            <table className="lineitems">
                                <thead>
                                    <tr>
                                        <th colSpan="2" className="bottom-line left-align">Party Collection</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cashFlowData['party_collection'] && cashFlowData['party_collection'].map((item) =>
                                    <tr>
                                        <td className="left-align">{item.particular}</td>
                                        <td className="right-align qty">{getFormattedNumber(item.amount)}</td>
                                    </tr>)}
                                    {(cashFlowData['party_collection'] === undefined || 
                                        cashFlowData['party_collection'].length==0) &&
                                    <tr>
                                        <td className="left-align" colSpan="2">No Record ...</td>
                                    </tr>}
                                </tbody>
                            </table>
                            <table className="lineitems">
                                <thead>
                                    <tr>
                                        <th colSpan="2" className="bottom-line left-align">General Income</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cashFlowData['general_income'] && cashFlowData['general_income'].map((item) =>
                                    <tr>
                                        <td className="left-align">{item.particular}</td>
                                        <td className="right-align qty">{getFormattedNumber(item.amount)}</td>
                                    </tr>)}
                                    {(cashFlowData['general_income'] === undefined || 
                                        cashFlowData['general_income'].length==0) &&
                                    <tr>
                                        <td className="left-align" colSpan="2">No Record ...</td>
                                    </tr>}
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
                                        <td className="right-align qty">{getFormattedNumber(cashFlowData["new_sales"] || "0")}</td>
                                    </tr>
                                    <tr>
                                        <td className="left-align">Advance Payment Sales on Condition</td>
                                        <td className="right-align qty">{getFormattedNumber(cashFlowData["advance_payment_conditional_sales"] || "0")}</td>
                                    </tr>
                                    <tr>
                                        <td className="left-align">Cash Collection Sales on Condition</td>
                                        <td className="right-align qty">{getFormattedNumber(cashFlowData["cash_collection_conditional_sales"] || "0")}</td>
                                    </tr>
                                </tbody>
                            </table> 
                            <table className="lineitems box">
                                <tbody>
                                    <tr>
                                        <td className="left-align"><b>TOTAL ----</b></td>
                                        <td className="right-align qty"><b>{getFormattedNumber(cashInflowTotal)}</b></td>
                                    </tr>
                                </tbody>
                            </table> 
                            <table className="lineitems">
                                <tbody>
                                    <tr>
                                        <td className="left-align"><b>Closing Cash</b></td>
                                        <td> = Opening Cash + Total Inflow - Total Outflow</td>
                                    </tr>
                                    <tr>
                                        <td className="left-align"></td>
                                        <td>= {getFormattedNumber(cashFlowData["opening_cash_balance"] || "0")} + {getFormattedNumber(cashInflowTotal)} - {getFormattedNumber(cashOutflowTotal)}</td>
                                    </tr>
                                    <tr>
                                        <td className="left-align"></td>
                                        <td>= {getLedgerFormattedNumber(cashflowTotal)}</td>
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
                                    {cashFlowData['bank_deposit'] && cashFlowData['bank_deposit'].map((item) =>
                                    <tr>
                                        <td className="left-align">{item.particular}</td>
                                        <td className="right-align qty">{getFormattedNumber(item.amount)}</td>
                                    </tr>)}
                                    {(cashFlowData['bank_deposit'] === undefined || 
                                        cashFlowData['bank_deposit'].length==0) &&
                                    <tr>
                                        <td className="left-align" colSpan="2">No Record ...</td>
                                    </tr>}
                                </tbody>
                            </table>
                            <table className="lineitems">
                                <thead>
                                    <tr>
                                        <th colSpan="2" className="bottom-line left-align">Cash Payments</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cashFlowData['party_payment'] && cashFlowData['party_payment'].map((item) =>
                                    <tr>
                                        <td className="left-align">{item.particular}</td>
                                        <td className="right-align qty">{getFormattedNumber(item.amount)}</td>
                                    </tr>)}
                                    {(cashFlowData['party_payment'] === undefined || 
                                        cashFlowData['party_payment'].length==0) &&
                                    <tr>
                                        <td className="left-align" colSpan="2">No Record ...</td>
                                    </tr>}
                                </tbody>
                            </table>
                            <table className="lineitems">
                                <thead>
                                    <tr>
                                        <th colSpan="2" className="bottom-line left-align">MFS Deposit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cashFlowData['mfs_deposit'] && cashFlowData['mfs_deposit'].map((item) =>
                                    <tr>
                                        <td className="left-align">{item.particular}</td>
                                        <td className="right-align qty">{getFormattedNumber(item.amount)}</td>
                                    </tr>)}
                                    {(cashFlowData['mfs_deposit'] === undefined || 
                                        cashFlowData['mfs_deposit'].length==0) &&
                                    <tr>
                                        <td className="left-align" colSpan="2">No Record ...</td>
                                    </tr>}
                                </tbody>
                            </table>                             
                            <table className="lineitems">
                                <thead>
                                    <tr>
                                        <th colSpan="2" className="bottom-line left-align">General Expenses</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cashFlowData['general_expenses'] && cashFlowData['general_expenses'].map((item) =>
                                    <tr>
                                        <td className="left-align">{item.particular}</td>
                                        <td className="right-align qty">{getFormattedNumber(item.amount)}</td>
                                    </tr>)}
                                    {(cashFlowData['general_expenses'] === undefined || 
                                        cashFlowData['general_expenses'].length==0) &&
                                    <tr>
                                        <td className="left-align" colSpan="2">No Record ...</td>
                                    </tr>}
                                </tbody>
                            </table>
                            <table className="lineitems box">
                                <tbody>
                                    <tr>
                                        <td className="left-align"><b>TOTAL ----</b></td>
                                        <td className="right-align qty"><b>{getFormattedNumber(cashOutflowTotal)}</b></td>
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
