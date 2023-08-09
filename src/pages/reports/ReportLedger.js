import React, { useEffect, useState, Fragment } from 'react';
import { PDFViewer } from '@react-pdf/renderer'
import Ledger from './components/ledger/common/Ledger'

import { TransactionService } from '../../services/TransactionService';

import { 
    PURCHASE_MODEL,
    SALES_MODEL,
    ACC_PAYABLE,
    ACC_RECIEVABLE,
    CASH_MODEL,
    BANK_MODEL
} from '../../constants/models';

const ReportLedger = ({ type, header }) => {

    const [ledger, setLedger] = useState(null);

    const transactionService = new TransactionService();

    useEffect(() => {
        let partyType = getPartyModel(type);
        transactionService.getLedgerByParty(partyType).then(data => {
            setLedger( data.rows );
            console.log(ledger);
        });
    }, [type]);

    const getPartyModel = (type) => {
        switch (type) {
            case 'purchase':
                return PURCHASE_MODEL
            case 'sales':
                return SALES_MODEL;
            case 'accpayable':
                return ACC_PAYABLE;
            case 'accreceivable':
                return ACC_RECIEVABLE;
            case 'cash':
                return CASH_MODEL;
            case 'bank':
                return BANK_MODEL;
            default:
                return PURCHASE_MODEL;
        }
    }
    return (
        <div className="grid h-screen">
            <Fragment >
                {ledger!=null && (<PDFViewer className='card col-12' >
                    <Ledger data={ledger} header={header} />
                </PDFViewer>)}
            </Fragment>
        </div>
    )
};

export default ReportLedger;