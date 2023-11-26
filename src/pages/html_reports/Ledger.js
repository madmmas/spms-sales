import * as moment from 'moment';
import React, {useEffect, useRef, useState} from 'react'
import { useParams } from 'react-router-dom';
import { getDateFormatted, getFormattedNumber } from '../../utils';

import ReportCss from './ReportCss'
import { ComponentToPrint } from './ComponentToPrint'

import { MasterDataService } from '../../services/MasterDataService';
import { TransactionService } from '../../services/TransactionService';

import { 
    BANK_MODEL,
    MFS_MODEL,
    SUPPLIER_MODEL,
    CUSTOMER_MODEL
} from '../../constants/models';
import { set } from 'react-hook-form';

export const HtmlLedger = ({type, header}) => {
    
    let { id } = useParams();

    const [ledgerData, setLedgerData] = useState([]);
    const [partyData, setPartyData] = useState(null);
    const [trigger, setTrigger] = useState(0);

    const [closingBalance, setClosingBalance] = useState(0);
    const [drTotal, setDrTotal] = useState(0);
    const [crTotal, setCrTotal] = useState(0);

    const transactionService = new TransactionService();
    const masterDataService = new MasterDataService();

    useEffect(() => {
        let cacode = getCACode(type);
        if(cacode === null || cacode === ""){
            return;
        }
        console.log("TYPE CHANGED::", type)
        let params = {
            code: cacode,
        }
        if(id != null){
            console.log("ID CHANGED::", id)
            let partyType = getPartyModel(type);
            console.log("PARTY TYPE::", type, partyType)
            if(partyType === null || partyType === ""){
                return;
            }                
            masterDataService.getById(partyType, id).then(party => {
                setPartyData({
                    "line1": party.name||party.name,
                    "line2": party.address,
                    "line3": party.phone,
                });
            });
            params["partyid"] = id;
            params["partytype"] = partyType;
            transactionService.getReportBy('ledger', params).then(data => {
                let dataWithBalance = calculateBalance(data);
                setLedgerData(dataWithBalance);
                console.log("LEDGER DATA::=>>>", dataWithBalance);
            });
        } else {
            transactionService.getReportBy('ledger', params).then(data => {
                let dataWithBalance = calculateBalance(data);
                setLedgerData(dataWithBalance);
                console.log("LEDGER DATA::=>>>", dataWithBalance);
            });
        }
    }, [type, id]);

    useEffect(() => {
        if(trigger>0){
            window.print();
        }
    }, [trigger]);

    const calculateBalance = (data) => {
        let dataMap = new Map();
        let drTotal = 0;
        let crTotal = 0;
        data.forEach(item => {
            drTotal = drTotal + Number.parseFloat(item.dr_amount);
            crTotal = crTotal + Number.parseFloat(item.cr_amount);
            let balance = Number.parseFloat(item.dr_amount) - Number.parseFloat(item.cr_amount);
            item.balance = balance;
            dataMap.set(item.sl, {balance: balance});
        });
        console.log("DR TOTAL::=>>>", drTotal);
        console.log("CR TOTAL::=>>>", crTotal);
        // console.log("DATA MAP - 1::=>>>", dataMap);
        let balance = 0;
        for(let i=1; i<=data.length; i++){
            let dataItem = dataMap.get(i);
            // console.log("DATA ITEM::=>>>", i, dataItem);
            balance = Number.parseFloat(balance) + Number.parseFloat(dataItem.balance);
            dataMap.set(i, {balance: balance});
        }
        // console.log("DATA MAP - 2 ::=>>>", dataMap);
        for(let i=0; i<data.length; i++){
            let dataItem = dataMap.get(i+1);
            for(let j=0; j<data.length; j++){
                if(data[j].sl === i+1){
                    data[j].balance = dataItem.balance;
                    break;
                }
            }
        }
        console.log("DATA MAP - 3 ::=>>>", data);
        setDrTotal(drTotal);
        setCrTotal(crTotal);
        setClosingBalance(balance);
        return data;
    }

    const getCACode = (type) => {
        switch (type) {
            case 'sales':
                return '2001';
            case 'purchase':
                return '2002';
            case 'accreceivable':
                return '3001';
            case 'accpayable':
                return '3002';
            case 'cash':
                return "4001";
            case 'bank':
                return "4002";
            case 'mfs':
                return "4003";
            case 'suppliers':
                return "3001,3002";
            case 'customers':
                return "3001,3002";
        }
        return "";
    }

    const getPartyModel = (type) => {
        switch (type) {
            case 'bank':
                return BANK_MODEL;
            case 'mfs':
                return MFS_MODEL;
            case 'accreceivable':
            case 'customers':
                return CUSTOMER_MODEL;
            case 'accpayable':
            case 'suppliers':
                return SUPPLIER_MODEL;
            default:
                return null;
        }
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

    const getParticular = (item) => {

        if(item === null || item === undefined){
            return "";
        }
        let particular = item.particular;
        
        // if(item.reg_type !== null && item.reg_type !== undefined && item.reg_type !== ""){
        //     particular = particular + " (" + item.reg_type + ")";
        // }
        // if(item.shortname !== null && item.shortname !== undefined && item.shortname !== ""){
        //     particular = particular + " (" + item.shortname + ")";
        // }
            
        return particular;
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
            {partyData && <header class="line">
                <p>{partyData["line1"]}</p>
                <p>{partyData["line2"]}</p>
                <p>{partyData["line3"]}</p>
            </header>}
            <p class="line">Date : {getDateFormatted(new Date())}</p>
            <table className="bill-details">
                <tbody>
                    <tr>
                        <th className="center-align line" colSpan="2"><span className="receipt">{header}</span></th>
                    </tr>
                </tbody>
            </table>
            <table className="lineitems">
                <thead>
                    <tr>
                        <th className="heading qty left-align">Sl</th>
                        <th className="heading qty left-align">Date</th>
                        <th className="heading brand left-align">Voucher No</th>
                        <th className="heading name left-align">Description</th>
                        <th className="heading brand left-align">Dr</th>
                        <th className="heading brand left-align">Cr</th>
                        <th className="heading brand left-align">Balance</th>
                    </tr>
                </thead>
            
                <tbody>
                {ledgerData.map( item => 
                    <tr>
                        <td className="left-align">{Number.parseFloat(item.sl).toFixed(0)}</td>
                        <td className="left-align">{getDateFormatted(item.created_at)}</td>
                        <td className="left-align">{item.voucher_no}</td>
                        <td className="left-align">{getParticular(item)}</td>
                        <td className="right-align"><b>{getFormattedNumber(item.dr_amount)}</b></td>
                        <td className="right-align"><b>{getFormattedNumber(item.cr_amount)}</b></td>
                        <td className="right-align"><b>{getFormattedNumber(item.balance)}</b></td>
                    </tr>)}
                {ledgerData.length === 0 && <tr>
                        <td className="left-align" colSpan="7">No Data Found</td>
                    </tr>}

                    <tr>
                        <th colSpan="4" className="text right-align line">Closing Balance:</th>
                        <th className="total price right-align line">{ getFormattedNumber(drTotal)}</th>
                        <th className="total price right-align line">{ getFormattedNumber(crTotal)}</th>
                        <th className="total price right-align line">{ getFormattedNumber(closingBalance)}</th>
                    </tr>
                </tbody>
            </table>
            
            {/* <section>
                <p> 
                    <b>Remarks :</b> <span>{ledgerData.notes}</span>
                </p>
            </section> */}
        </div>
      </div>
    )
}
