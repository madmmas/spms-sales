import * as moment from 'moment';
import React, {useEffect, useRef, useState} from 'react'

import { getDateWithFormat, getDateFormatted } from '../../utils';

import ReportCss from './ReportCss';
import { ComponentToPrint } from './ComponentToPrint'

import { TransactionService } from '../../services/TransactionService';

export const PurchaseReport = () => {
    
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
            <header style={{textAlign:"center"}} className="bottom-line">
                <p>M/S JONONI MOTORS</p>
                <p>R.N ROAD,JASHORE,BANGLADESH</p>
                <p>MOBILE NO - 01712202310, 01913959501</p>
            </header>
            <p style={{textAlign:"center"}}>Vat Regd. No::</p>
            <p style={{textAlign:"center"}}>Total Sale {getDateWithFormat(new Date(), "DD-MMM-YYYY")}</p>
            <table className="bill-details">
                <tbody>
                    <tr>
                        <th style={{textAlign:"left"}} className="line" colSpan="2"><span className="receipt">Sales Report</span></th>
                    </tr>
                    <tr>
                       <input style={{height:"20px", width:"50px", marginRight:"5px", color:"black"}} placeholder='Date wise total sale (Sale & Replacement Sale)'></input>
                       <input style={{height:"20px", width:"50px", marginRight:"5px", color:"black"}} placeholder='Detail Sale Voucher '></input>
                       <input style={{height:"20px", width:"50px", marginRight:"5px", color:"black"}} placeholder='Seller wise sales'></input>
                       <input style={{height:"20px", width:"50px", marginRight:"5px", color:"black"}} placeholder='Item Wise Sales History '></input>
                       <input style={{height:"20px", width:"50px", marginRight:"5px", color:"black"}} placeholder='Client wise sale history'></input>
                       <input style={{height:"20px", width:"50px", marginRight:"5px", color:"black"}} placeholder='Vouchers waiting for approval '></input>
                       <input style={{height:"20px", width:"50px", marginRight:"5px", color:"black"}} placeholder='Date wise sales on condition'></input>
                       <input style={{height:"20px", width:"50px", marginRight:"5px", color:"black"}} placeholder='Date wise collection of sales on condition'></input>
                       <input style={{height:"20px", width:"50px", marginRight:"5px", color:"black"}} placeholder='All due of sales on condition '></input>
                       <input style={{height:"20px", width:"50px", marginRight:"5px", color:"black"}} placeholder='Date wise return of sales on condition'></input> 
                    </tr>
                    <br></br>
                    {/* <tr>
                        <th className="center-align line" colSpan="2"><span className="receipt"></span></th>
                    </tr> */}
                </tbody>
            </table>
            <table className="lineitems">
               
                <tbody>
                    <tr>
                        <td className="left-align"> 
                            <table className="lineitems tableOfContent">
                                <tbody>
                                    
                                    <tr>
                                            <th className="left-align contentHeading">Showroom</th>
                                            <th className="left-align contentHeading">Date</th>
                                            <th className="left-align contentHeading">Voucher</th>
                                            <th className="left-align contentHeading">Client/Party</th>
                                            <th className="left-align contentHeading">Total Amount</th>   
                                            <th className="left-align contentHeading">Vat</th>   
                                            <th className="left-align contentHeading">Dis.</th>   
                                            <th className="left-align contentHeading">Other</th>   
                                            <th className="left-align contentHeading">Net Amount</th>   
                                            <th className="left-align contentHeading">Total Receive</th>   
                                            <th className="left-align contentHeading">Cash Receive </th>   
                                            <th className="left-align contentHeading">Due</th>   
                                            <th className="left-align contentHeading">Remarks</th>
                                        
                                    </tr>
                                    <tr>
                                        <td className="left-align contentData">Shop Name</td>  
                                        <td className="left-align contentData">14/11/2023</td>  
                                        <td className="left-align contentData">SL.1234</td>  
                                        <td className="left-align contentData">Client1</td>  
                                        <td className="left-align contentData">10,000</td>  
                                        <td className="left-align contentData">10,000</td>  
                                        <td className="left-align contentData">10,000</td>  
                                        <td className="left-align contentData">10,000</td>  
                                        <td className="left-align contentData">10,000</td>  
                                        <td className="left-align contentData">10,000</td>  
                                        <td className="left-align contentData">10,000</td>  
                                        <td className="left-align contentData">10,000</td>  
                                        <td className="left-align contentData"></td>  
                                    </tr>
                                    <tr>
                                        <td className="left-align contentData">Shop Name</td>  
                                        <td className="left-align contentData">14/11/2023</td>  
                                        <td className="left-align contentData">SL.1234</td>  
                                        <td className="left-align contentData">Client2</td>  
                                        <td className="left-align contentData">10,000</td>  
                                        <td className="left-align contentData">10,000</td>  
                                        <td className="left-align contentData">10,000</td>  
                                        <td className="left-align contentData">10,000</td>  
                                        <td className="left-align contentData">10,000</td>  
                                        <td className="left-align contentData">10,000</td>  
                                        <td className="left-align contentData">10,000</td>  
                                        <td className="left-align contentData">10,000</td>  
                                        <td className="left-align contentData"></td>   
                                    </tr>
                                    <tr>
                                        <td className="left-align contentData">Shop Name</td>  
                                        <td className="left-align contentData">14/11/2023</td>  
                                        <td className="left-align contentData">SL.1234</td>  
                                        <td className="left-align contentData">Client3</td>  
                                        <td className="left-align contentData">10,000</td>  
                                        <td className="left-align contentData">10,000</td>  
                                        <td className="left-align contentData">10,000</td>  
                                        <td className="left-align contentData">10,000</td>  
                                        <td className="left-align contentData">10,000</td>  
                                        <td className="left-align contentData">10,000</td>  
                                        <td className="left-align contentData">10,000</td>  
                                        <td className="left-align contentData">10,000</td>  
                                        <td className="left-align contentData"></td>  
                                    </tr>
                                    <tr>
                                        <td className="left-align contentData">Shop Name</td>  
                                        <td className="left-align contentData">14/11/2023</td>  
                                        <td className="left-align contentData">SL.1234</td>  
                                        <td className="left-align contentData">Client3</td>  
                                        <td className="left-align contentData">10,000</td>  
                                        <td className="left-align contentData">10,000</td>  
                                        <td className="left-align contentData">10,000</td>  
                                        <td className="left-align contentData">10,000</td>  
                                        <td className="left-align contentData">10,000</td>  
                                        <td className="left-align contentData">10,000</td>  
                                        <td className="left-align contentData">10,000</td>  
                                        <td className="left-align contentData">10,000</td>  
                                        <td className="left-align contentData"></td>  
                                    </tr>
                                    <tr>
                                        <td className="left-align contentData">Shop Name</td>  
                                        <td className="left-align contentData">14/11/2023</td>  
                                        <td className="left-align contentData">SL.1234</td>  
                                        <td className="left-align contentData">Client3</td>  
                                        <td className="left-align contentData">10,000</td>  
                                        <td className="left-align contentData">10,000</td>  
                                        <td className="left-align contentData">10,000</td>  
                                        <td className="left-align contentData">10,000</td>  
                                        <td className="left-align contentData">10,000</td>  
                                        <td className="left-align contentData">10,000</td>  
                                        <td className="left-align contentData">10,000</td>  
                                        <td className="left-align contentData">10,000</td>  
                                        <td className="left-align contentData"></td>  
                                    </tr>
                                    
                                    <tr className="bottom-line">
                                        <td style={{visibility:"hidden"}} className="left-align">Shop Name</td>  
                                        <td style={{visibility:"hidden"}} className="left-align">14/11/2023</td>  
                                        <td style={{visibility:"hidden"}} className="left-align">SL.1234</td>  
                                        <td className="left-align"><b>Daily Total</b></td>  
                                        <td className="left-align">10,000</td>  
                                        <td className="left-align">10,000</td>  
                                        <td className="left-align">10,000</td>  
                                        <td className="left-align">10,000</td>  
                                        <td className="left-align">10,000</td>  
                                        <td className="left-align">10,000</td>  
                                        <td className="left-align">10,000</td>  
                                        <td className="left-align">10,000</td>  
                                        <td className="left-align"></td>  
                                    </tr>
                                    <tr className="bottom-line">
                                        <td style={{visibility:"hidden"}} className="left-align">Shop Name</td>  
                                        <td style={{visibility:"hidden"}} className="left-align">14/11/2023</td>  
                                        <td style={{visibility:"hidden"}} className="left-align">SL.1234</td>  
                                        <td className="left-align"><b>Branch Total</b></td>  
                                        <td className="left-align">10,000</td>  
                                        <td className="left-align">10,000</td>  
                                        <td className="left-align">10,000</td>  
                                        <td className="left-align">10,000</td>  
                                        <td className="left-align">10,000</td>  
                                        <td className="left-align">10,000</td>  
                                        <td className="left-align">10,000</td>  
                                        <td className="left-align">10,000</td>  
                                        <td className="left-align"></td>  
                                    </tr>
                                    <tr className="bottom-line">
                                        <td style={{visibility:"hidden"}} className="left-align">Shop Name</td>  
                                        <td style={{visibility:"hidden"}} className="left-align">14/11/2023</td>  
                                        <td style={{visibility:"hidden"}} className="left-align">SL.1234</td>  
                                        <td className="left-align"><b>Grand Total</b></td>  
                                        <td className="left-align">10,000</td>  
                                        <td className="left-align">10,000</td>  
                                        <td className="left-align">10,000</td>  
                                        <td className="left-align">10,000</td>  
                                        <td className="left-align">10,000</td>  
                                        <td className="left-align">10,000</td>  
                                        <td className="left-align">10,000</td>  
                                        <td className="left-align">10,000</td>  
                                        <td className="left-align"></td>  
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
