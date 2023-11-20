import * as moment from 'moment';
import React, {useEffect, useRef, useState} from 'react'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';

import { getDateWithFormat, getDateFormatted } from '../../utils';

import ReportCss from './ReportCss';
import { ComponentToPrint } from './ComponentToPrint'

import { TransactionService } from '../../services/TransactionService';

export const PurchaseReport = () => {

    const arrayOfObjects = [
        {code:1, voucher:"PR.121", supplier:"Sup. 1", cnf:" - ", total_amount:10000, foreign_currency:30000, cur_unit:"INR", duty:0, dis:0, transport:0, net_amount:10000},
        {code:2, voucher:"PR.122", supplier:"Sup. 2", cnf:" - ", total_amount:30000, foreign_currency:10000, cur_unit:"INR", duty:0, dis:0, transport:0, net_amount:50000},
        {code:3, voucher:"PR.123", supplier:"Raihan", cnf:" - ", total_amount:10000, foreign_currency:30000, cur_unit:"USD", duty:0, dis:0, transport:0, net_amount:30000},
        {code:4, voucher:"PR.124", supplier:"Sup. 4", cnf:" - ", total_amount:40000, foreign_currency:50000, cur_unit:"INR", duty:0, dis:0, transport:0, net_amount:10000},
        {code:5, voucher:"PR.125", supplier:"Sup. 1", cnf:" - ", total_amount:10000, foreign_currency:30000, cur_unit:"INR", duty:0, dis:0, transport:0, net_amount:10000},
    ]
    
    const [cashFlowData, setCashFlowData] = useState([]);
    const [trigger, setTrigger] = useState(0);
    const [purchaseInfo] = useState(arrayOfObjects);

    const [dailyTotalAmount, setDailyTotalAmount] = useState('');
    const [dailyForeignCurrency, setDailyForeignCurrency] = useState('');
    const [dailyDuty, setDailyDuty] = useState('');
    const [dailyDis, setDailyDis] = useState('');
    const [dailyTransport, setDailyTransport] = useState('');
    const [dailyNetAmount, setDailyNetAmount] = useState('');

    const [grandTotalAmount, setGrandTotalAmount] = useState('');
    const [grandForeignCurrency, setGrandForeignCurrency] = useState('');
    const [grandDuty, setGrandDuty] = useState('');
    const [grandDis, setGrandDis] = useState('');
    const [grandTransport, setGrandTransport] = useState('');
    const [grandNetAmount, setGrandNetAmount] = useState('');

    const [voucherFilterValue, setVoucherFilterValue] = useState('');
    const [supplierFilterValue, setSupplierFilterValue] = useState('');
    const [codeFilterValue, setCodeFilterValue] = useState('');
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        voucher: { value: null, matchMode: FilterMatchMode.CONTAINS },
        supplier: { value: null, matchMode: FilterMatchMode.CONTAINS },
        code: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const onVoucherChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['voucher'].value = value;

        setFilters(_filters);
        setVoucherFilterValue(value);
    };

    const onSupplierChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['supplier'].value = value;

        setFilters(_filters);
        setSupplierFilterValue(value);
    };

    const onCodeChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['code'].value = value;

        setFilters(_filters);
        setCodeFilterValue(value);
    };

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const renderHeader = () => {
        return (
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div className="">
                    <span className="">
                        
                        <InputText style={{width:"5rem", backgroundColor:"white", color:"black"}} value={voucherFilterValue} onChange={onVoucherChange} placeholder="Voucher" />
                    </span>
                </div>
                <div className="">
                    <span className="">
                        
                        <InputText style={{width:"5rem", backgroundColor:"white", color:"black"}} value={supplierFilterValue} onChange={onSupplierChange} placeholder="Supplier" />
                    </span>
                </div>
                <div className="">
                    <span className="">
                        
                        <InputText style={{width:"5rem", backgroundColor:"white", color:"black"}} value={codeFilterValue} onChange={onCodeChange} placeholder="Code" />
                    </span>
                </div>
                <div className="">
                    <span className="">
                        
                        <InputText style={{width:"5rem", backgroundColor:"white", color:"black"}} value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Global" />
                    </span>
                </div>
                <div className="">
                    <span className="">
                        
                        <InputText style={{width:"5rem", backgroundColor:"white", color:"black"}} value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="demo1" />
                    </span>
                </div>
                <div className="">
                    <span className="">
                        
                        <InputText style={{width:"5rem", backgroundColor:"white", color:"black"}} value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="demo2" />
                    </span>
                </div>
            </div>
        );
    };

    const header = renderHeader();

    

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

    useEffect(()=>{
             let dailyTotalAmountLocal = 0;
             let dailyForeignCurrencyLocal  = 0;
             let dailyDutyLocal = 0;
             let dailyDisLocal = 0;
             let dailyTransportLocal = 0;
             let dailyNetAmountLocal = 0;

             let grandTotalAmountLocal = 0;
             let grandForeignCurrencyLocal  = 0;
             let grandDutyLocal = 0;
             let grandDisLocal = 0;
             let grandTransportLocal = 0;
             let grandNetAmountLocal = 0;

             for(let i = 0; i<purchaseInfo.length; i++){
                dailyTotalAmountLocal = dailyTotalAmountLocal + purchaseInfo[i].total_amount;
                dailyForeignCurrencyLocal = dailyForeignCurrencyLocal + purchaseInfo[i].foreign_currency;
                dailyDutyLocal = dailyDutyLocal + purchaseInfo[i].duty;
                dailyDisLocal = dailyDisLocal + purchaseInfo[i].dis;
                dailyTransportLocal = dailyTransportLocal + purchaseInfo[i].transport;
                dailyNetAmountLocal = dailyNetAmountLocal + purchaseInfo[i].net_amount;

                grandTotalAmountLocal = grandTotalAmountLocal + purchaseInfo[i].total_amount;
                grandForeignCurrencyLocal = grandForeignCurrencyLocal + purchaseInfo[i].foreign_currency;
                grandDutyLocal = grandDutyLocal + purchaseInfo[i].duty;
                grandDisLocal = grandDisLocal + purchaseInfo[i].dis;
                grandTransportLocal = grandTransportLocal + purchaseInfo[i].transport;
                grandNetAmountLocal = grandNetAmountLocal + purchaseInfo[i].net_amount;

                
             }

             setDailyTotalAmount(dailyTotalAmountLocal);
             setDailyForeignCurrency(dailyForeignCurrencyLocal);
             setDailyDuty(dailyDutyLocal);
             setDailyDis(dailyDisLocal);
             setDailyTransport(dailyTransportLocal);
             setDailyNetAmount(dailyNetAmountLocal);

             setGrandTotalAmount(grandTotalAmountLocal);
             setGrandForeignCurrency(grandForeignCurrencyLocal);
             setGrandDuty(grandDutyLocal);
             setGrandDis(grandDisLocal);
             setGrandTransport(grandTransportLocal);
             setGrandNetAmount(grandNetAmountLocal);


    },[])

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
                   
                    {/* <tr>
                        <th className="center-align line" colSpan="2"><span className="receipt"></span></th>
                    </tr> */}
                </tbody>
            </table>

            <DataTable value={purchaseInfo} size="small"  
                       showGridlines 
                       dataKey="id"
                       header={header}
                       filters={filters}
                       emptyMessage="Not found"
                       >
                <Column field="voucher" header="Voucher" style={{ maxWidth: '5rem', textAlign:"center",backgroundColor:"white",color:"black" }} alignHeader={'center'} />
                <Column field="supplier" header="Supplier" style={{ maxWidth: '5rem', textAlign:"center",backgroundColor:"white",color:"black" }} alignHeader={'center'} />
                <Column field="cnf" header="CNF" style={{ maxWidth: '5rem', textAlign:"center",backgroundColor:"white",color:"black" }} alignHeader={'center'} />
                <Column field="total_amount" header="Total Amount" style={{ maxWidth: '5rem', textAlign:"center",backgroundColor:"white",color:"black" }} alignHeader={'center'} />
                <Column field="foreign_currency" header="Foreign Currency" style={{ maxWidth: '5rem', textAlign:"center",backgroundColor:"white",color:"black" }} alignHeader={'center'} />
                <Column field="cur_unit" header="Cur. Unit" style={{ maxWidth: '5rem', textAlign:"center",backgroundColor:"white",color:"black" }} alignHeader={'center'} />
                <Column field="duty" header="Duty" style={{ maxWidth: '5rem', textAlign:"center",backgroundColor:"white",color:"black" }} alignHeader={'center'} />
                <Column field="dis" header="Dis." style={{ maxWidth: '5rem', textAlign:"center",backgroundColor:"white",color:"black" }} alignHeader={'center'} />
                <Column field="transport" header="Transport" style={{ maxWidth: '5rem', textAlign:"center",backgroundColor:"white",color:"black" }} alignHeader={'center'} />
                <Column field="net_amount" header="Net Amount" style={{ maxWidth: '5rem', textAlign:"center",backgroundColor:"white",color:"black" }} alignHeader={'center'} />
            </DataTable>
            <br></br>
            <p><b><u>Daily Total</u></b></p>
            <div style={{display:"flex",justifyContent:"space-between"}}>
                <div style={{display:"flex",flexDirection:"column"}}>
                    <label>Total Amount</label>
                    <InputText value={dailyTotalAmount} style={{width:"8rem",backgroundColor:"white", color:"black"}}/>
                </div>
                <div style={{display:"flex",flexDirection:"column"}}>
                    <label>Foreign Currency</label>
                    <InputText value={dailyForeignCurrency} style={{width:"8rem",backgroundColor:"white", color:"black"}}/>
                </div>
                <div style={{display:"flex",flexDirection:"column"}}>
                    <label>Duty</label>
                    <InputText value={dailyDuty} style={{width:"8rem",backgroundColor:"white", color:"black"}}/>
                </div>
                <div style={{display:"flex",flexDirection:"column"}}>
                    <label>Dis.</label>
                    <InputText value={dailyDis} style={{width:"8rem",backgroundColor:"white", color:"black"}}/>
                </div>
                <div style={{display:"flex",flexDirection:"column"}}>
                    <label>Transport</label>
                    <InputText value={dailyTransport} style={{width:"8rem",backgroundColor:"white", color:"black"}}/>
                </div>
                <div style={{display:"flex",flexDirection:"column"}}>
                    <label>Net Amount</label>
                    <InputText value={dailyNetAmount} style={{width:"8rem",backgroundColor:"white", color:"black"}}/>
                </div>
            </div>
            <br></br>
            <p><b><u>Grand Total</u></b></p>
            <div style={{display:"flex",justifyContent:"space-between"}}>
                <div style={{display:"flex",flexDirection:"column"}}>
                    <label>Total Amount</label>
                    <InputText value={dailyTotalAmount} style={{width:"8rem",backgroundColor:"white", color:"black"}}/>
                </div>
                <div style={{display:"flex",flexDirection:"column"}}>
                    <label>Foreign Currency</label>
                    <InputText value={dailyForeignCurrency} style={{width:"8rem",backgroundColor:"white", color:"black"}}/>
                </div>
                <div style={{display:"flex",flexDirection:"column"}}>
                    <label>Duty</label>
                    <InputText value={dailyDuty} style={{width:"8rem",backgroundColor:"white", color:"black"}}/>
                </div>
                <div style={{display:"flex",flexDirection:"column"}}>
                    <label>Dis.</label>
                    <InputText value={dailyDis} style={{width:"8rem",backgroundColor:"white", color:"black"}}/>
                </div>
                <div style={{display:"flex",flexDirection:"column"}}>
                    <label>Transport</label>
                    <InputText value={dailyTransport} style={{width:"8rem",backgroundColor:"white", color:"black"}}/>
                </div>
                <div style={{display:"flex",flexDirection:"column"}}>
                    <label>Net Amount</label>
                    <InputText value={dailyNetAmount} style={{width:"8rem",backgroundColor:"white", color:"black"}}/>
                </div>
            </div>
            
                       
        </div>
      </div>
    )
}
