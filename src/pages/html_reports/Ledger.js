import * as moment from 'moment';
import React, {useEffect, useRef, useState} from 'react'
import { useForm, Controller } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { getDateFormatted, getFormattedNumber, getLedgerFormattedNumber } from '../../utils';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { classNames } from 'primereact/utils';

import ReportCss from './ReportCss'
import { ComponentToPrint } from './ComponentToPrint'
import { TransactionService } from '../../services/TransactionService';
import { MasterDataDBService } from '../../services/MasterDataDBService';

import { 
    BANK_ACCOUNT_MODEL,
    MFS_ACCOUNT_MODEL,
    SUPPLIER_MODEL,
    CUSTOMER_MODEL
} from '../../constants/models';

export const HtmlLedger = ({type, header}) => {
    
    let { id } = useParams();

    const {
        control,
        formState: { errors },
        handleSubmit
    } = useForm({
        defaultValues: {}
    });

    const [openingData, setOpeningData] = useState({});
    const [datesData, setDatesData] = useState({});
    const [ledgerData, setLedgerData] = useState([]);
    const [partyData, setPartyData] = useState(null);
    const [trigger, setTrigger] = useState(0);

    const [closingBalance, setClosingBalance] = useState(0);
    const [drTotal, setDrTotal] = useState(0);
    const [crTotal, setCrTotal] = useState(0);

    // local date state mm/dd/yyyy
    const [fromDate, setFromDate] = useState()
    const [toDate, setToDate] = useState(new Date())

    const transactionService = new TransactionService();
    const masterDataDBService = new MasterDataDBService();

    useEffect(() => {
        // console.log("TYPE CHANGED::", type)
        if(id != null){
            // console.log("ID CHANGED::", id)
            let partyType = getPartyModel(type);
            // console.log("PARTY TYPE::", type, partyType)
            if(partyType === null || partyType === ""){
                return;
            }                
            masterDataDBService.getById(partyType, id).then(party => {
                setPartyData({
                    "line1": party.name||party.contact_name||party.accName,
                    "line2": party.address||party.branch,
                    "line3": party.accNumber||party.refNumber||party.phone,
                    "line4": masterDataDBService.getShortnameById("dtBank", party.dtBank_id)
                });
            });
        }
        refreshLedger(fromDate, toDate);
    }, [type, id]);

    // useEffect(() => {
    //     refreshLedger();
    // }, [fromDate, toDate]);

    useEffect(() => {
        if(trigger>0){
            window.print();
        }
    }, [trigger]);

    const refreshLedger = (from_date, to_date) => {
        let cacode = getCACode(type);
        if(cacode === null || cacode === ""){
            return;
        }
        let params = {}

        console.log("FROM DATE::=>>>", from_date)
        if(from_date != null){
            params["from_date"] = moment(from_date).format('YYYY-MM-DD');
        }
        console.log("TO DATE::=>>>", to_date)
        if(to_date != null){
            params["to_date"] = moment(to_date).format('YYYY-MM-DD');
        } else {
            params["to_date"] = moment().format('YYYY-MM-DD');
            // setToDate(new Date());
        }

        console.log("PARAMS::=>>>", params)
        if(id != null){
            // console.log("ID CHANGED::", id)
            let partyType = getPartyModel(type);
            // console.log("PARTY TYPE::", type, partyType)
            if(partyType === null || partyType === ""){
                return;
            }                
            params["party_id"] = id;
            params["party_type"] = partyType;
        }
        console.log("PARAMS::=>>>", params)
        transactionService.getLedgerReport(cacode, params).then(data => {
            let ledgerData = data.ledger
            let openingDr = Number.parseFloat(data.opening.dr_amount?data.opening.dr_amount:0);
            let openingCr = Number.parseFloat(data.opening.cr_amount?data.opening.cr_amount:0);
            setOpeningData({
                "dr_amount": openingDr,
                "cr_amount": openingCr,
                "balance": openingDr-openingCr,
            });
            setDatesData({
                "from_date": data.dates.from_date,
                "to_date": data.dates.to_date,
            });
            let dataWithBalance = calculateBalance(openingData, ledgerData);
            setLedgerData(dataWithBalance);
            // console.log("LEDGER DATA::=>>>", openingData, dataWithBalance);
        });
    }

    const calculateBalance = (opening, data) => {
        let dataMap = new Map();
        let drTotal = 0;
        let crTotal = 0;
        data.forEach(item => {
            // console.log("ITEM::=>>>", item);
            drTotal = drTotal + Number.parseFloat(item.dr_amount);
            crTotal = crTotal + Number.parseFloat(item.cr_amount);
            let balance = Number.parseFloat(item.dr_amount) - Number.parseFloat(item.cr_amount);
            item.balance = balance;
            dataMap.set(item.sl, {balance: balance});
        });
        // console.log("DR TOTAL::=>>>", drTotal);
        // console.log("CR TOTAL::=>>>", crTotal);
        // console.log("DATA MAP - 1::=>>>", dataMap);
        let balance = 0;
        for(let i=1; i<=data.length; i++){
            let dataItem = dataMap.get(i);
            console.log("DATA ITEM::=>>>", i, dataItem);
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
        // console.log("DATA MAP - 3 ::=>>>", data);
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
                return BANK_ACCOUNT_MODEL;
            case 'mfs':
                return MFS_ACCOUNT_MODEL;
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

    const handlePrint = () => {
        setTrigger(trigger+1);
    }

    const getParticular = (item) => {

        if(item === null || item === undefined){
            return "";
        }
        let particular = item.particular;
            
        return particular;
    }

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };
    const onSubmit = (data) => {
        console.log("FORM-DATA::=>>>", data);
        setFromDate(data.from_date);
        setToDate(data.to_date);
        refreshLedger(data.from_date, data.to_date);
    }
    
    return (
        <div className="grid">     
        <ReportCss />
        <div className="card col-12 md:col-12 no-printme">
        <div className="p-fluid formgrid grid">
            <div className="field col-12 md:col-2">
            <Controller
                name="from_date"
                control={control}
                render={({ field, fieldState }) => (
                <>
                    <label htmlFor={field.name}>From Date</label>
                    <Calendar inputId={field.name} value={field.value} onChange={field.onChange} 
                        dateFormat="dd/mm/yy" className={classNames({ 'p-invalid': fieldState.error })} />
                    {getFormErrorMessage(field.name)}
                </>                                
            )}/>
            </div>
            <div className="field col-12 md:col-2">
            <Controller
                name="to_date"
                control={control}
                render={({ field, fieldState }) => (
                <>
                    <label htmlFor={field.name}>To Date</label>
                    <Calendar inputId={field.name} value={field.value} onChange={field.onChange} 
                        dateFormat="dd/mm/yy" className={classNames({ 'p-invalid': fieldState.error })} />
                    {getFormErrorMessage(field.name)}
                </>                                
            )}/>
            </div>
            <div className="field col-12 md:col-2">
                <Button type="submit" label="Submit" className="mt-2"
                    onClick={handleSubmit((d) => onSubmit(d))}
                    />    
                <Button label="Print" className="p-button-outlined p-button-warning mt-2" 
                    onClick={() => handlePrint()} />
            </div>
        </div>
        </div>
    
        <ComponentToPrint />
        
        <div className='card p-fluid grid printme' id='printme'>
            <header>
                <p>M/S JONONI MOTORS</p>
                <p>R.N ROAD,JASHORE,BANGLADESH</p>
                <p>MOBILE NO - 01712202310, 01913959501</p>
            </header>
            {partyData && <header class="line">
                {type === "bank" && <p>{partyData["line4"]}</p>}
                <p>{partyData["line1"]}</p>
                <p>{partyData["line2"]}</p>
                <p>{partyData["line3"]}</p>
            </header>}
            <p class="line">
                <b>From Date :</b> {datesData['from_date']}
                , <b>To Date :</b> {datesData['to_date']}
            </p>
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
                    <tr>
                        <td className="left-align">0</td>
                        <td className="left-align">{getDateFormatted(datesData['from_date'])}</td>
                        <td className="left-align"></td>
                        <td className="left-align">Opening Balance</td>
                        <td className="right-align"><b>{getFormattedNumber(openingData.dr_amount)}</b></td>
                        <td className="right-align"><b>{getFormattedNumber(openingData.cr_amount)}</b></td>
                        <td className="right-align"><b>{getLedgerFormattedNumber(openingData.balance)}</b></td>
                    </tr>
                {ledgerData.map( item => 
                    <tr>
                        <td className="left-align">{Number.parseFloat(item.sl).toFixed(0)}</td>
                        <td className="left-align">{getDateFormatted(item.created_at)}</td>
                        <td className="left-align">{item.voucher_no}</td>
                        <td className="left-align">{getParticular(item)}</td>
                        <td className="right-align"><b>{getFormattedNumber(item.dr_amount)}</b></td>
                        <td className="right-align"><b>{getFormattedNumber(item.cr_amount)}</b></td>
                        <td className="right-align"><b>{getLedgerFormattedNumber(item.balance)}</b></td>
                    </tr>)}
                {ledgerData.length === 0 && <tr>
                        <td className="left-align" colSpan="7">No Data Found</td>
                    </tr>}

                    <tr>
                        <th colSpan="4" className="text right-align line">Closing Balance:</th>
                        <th className="total price right-align line">{ getFormattedNumber(drTotal)}</th>
                        <th className="total price right-align line">{ getFormattedNumber(crTotal)}</th>
                        <th className="total price right-align line">{ getLedgerFormattedNumber(closingBalance)}</th>
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
