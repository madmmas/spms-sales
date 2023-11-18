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
            <p style={{textAlign:"center"}}>Purchase {getDateWithFormat(new Date(), "DD-MMM-YYYY")}</p>
            <table className="bill-details">
                <tbody>
                    <tr>
                        <th style={{textAlign:"left"}} className="line" colSpan="2"><span className="receipt">Purchase Report</span></th>
                    </tr>
                    <tr>
                       <input style={{height:"20px", width:"50px", marginRight:"5px", color:"black"}} placeholder='Date wise Purchase'></input>
                       <input style={{height:"20px", width:"50px", marginRight:"5px", color:"black"}} placeholder='Detail Voucher (Received)'></input>
                       <input style={{height:"20px", width:"50px", marginRight:"5px", color:"black"}} placeholder='Item Wise Purchase History'></input>
                       <input style={{height:"20px", width:"50px", marginRight:"5px", color:"black"}} placeholder='Supplier wise Purchase'></input>
                       <input style={{height:"20px", width:"50px", marginRight:"5px", color:"black"}} placeholder='Vouchers canceled'></input>
                       <input style={{height:"20px", width:"50px", marginRight:"5px", color:"black"}} placeholder='Vouchers waiting for approval'></input>
                    
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
                                            <th className="left-align contentHeading">Voucher</th>
                                            <th className="left-align contentHeading">Supplier</th>
                                            <th className="left-align contentHeading">CNF</th>
                                            <th className="left-align contentHeading">Total Amount</th>
                                            <th className="left-align contentHeading">Foreign Currency</th>   
                                            <th className="left-align contentHeading">Cur. Unit</th>   
                                            <th className="left-align contentHeading">Duty</th>   
                                            <th className="left-align contentHeading">Dis.</th>   
                                            <th className="left-align contentHeading">Transport</th>   
                                            <th className="left-align contentHeading">Net Amount</th>   
                                        
                                    </tr>
                                    <tr>
                                        <td className="left-align contentData">SL.1234</td>  
                                        <td className="left-align contentData">Supplier1</td>  
                                        <td className="left-align contentData">-</td>  
                                        <td className="left-align contentData">20,000</td>  
                                        <td className="left-align contentData">30,000</td>  
                                        <td className="left-align contentData">INR</td>  
                                        <td className="left-align contentData">0</td>  
                                        <td className="left-align contentData">0</td>  
                                        <td className="left-align contentData">0</td>  
                                        <td className="left-align contentData">10,000</td>    
                                    </tr>
                                    <tr>
                                        <td className="left-align contentData">SL.1234</td>  
                                        <td className="left-align contentData">Supplier1</td>  
                                        <td className="left-align contentData">-</td>  
                                        <td className="left-align contentData">20,000</td>  
                                        <td className="left-align contentData">30,000</td>  
                                        <td className="left-align contentData">INR</td>  
                                        <td className="left-align contentData">0</td>  
                                        <td className="left-align contentData">0</td>  
                                        <td className="left-align contentData">0</td>  
                                        <td className="left-align contentData">10,000</td>    
                                    </tr>
                                    <tr>
                                        <td className="left-align contentData">SL.1234</td>  
                                        <td className="left-align contentData">Supplier1</td>  
                                        <td className="left-align contentData">-</td>  
                                        <td className="left-align contentData">20,000</td>  
                                        <td className="left-align contentData">30,000</td>  
                                        <td className="left-align contentData">INR</td>  
                                        <td className="left-align contentData">0</td>  
                                        <td className="left-align contentData">0</td>  
                                        <td className="left-align contentData">0</td>  
                                        <td className="left-align contentData">10,000</td>    
                                    </tr>
                                    
                                    
                                    <tr className="bottom-line">
                                        <td style={{visibility:"hidden"}} className="left-align">Shop Name</td>  
                                        <td style={{visibility:"hidden"}} className="left-align">14/11/2023</td>  
                                         
                                        <td className="left-align"><b>Daily Total</b></td>  
                                        <td className="left-align">10,000</td>  
                                        <td className="left-align">10,000</td>  
                                        <td style={{visibility:"hidden"}} className="left-align">10,000</td>  
                                        <td className="left-align">0</td>  
                                        <td className="left-align">0</td>  
                                        <td className="left-align">0</td>  
                                        <td className="left-align">10,000</td>  
                                         
                                    </tr>
                                    <tr className="bottom-line">
                                        <td style={{visibility:"hidden"}} className="left-align">Shop Name</td>  
                                        <td style={{visibility:"hidden"}} className="left-align">14/11/2023</td>  
                                          
                                        <td className="left-align"><b>Grand Total</b></td>  
                                        <td className="left-align">10,000</td>  
                                        <td className="left-align">10,000</td>  
                                        <td style={{visibility:"hidden"}} className="left-align">10,000</td>  
                                        <td className="left-align">0</td>  
                                        <td className="left-align">0</td>  
                                        <td className="left-align">0</td>  
                                        <td className="left-align">10,000</td>  
                            
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
