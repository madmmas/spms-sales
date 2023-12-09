import React, { useEffect, useState, Fragment } from 'react';
import { PDFViewer } from '@react-pdf/renderer'
import Ledger from '../../reports/components/ledger/customer/Ledger'

import { TransactionService } from '../../../services/TransactionService';

import { CUSTOMER_MODEL } from '../../../constants/models';

const MyDocument = ({ customerProfile }) => {

    const partyType = CUSTOMER_MODEL;

    const [ledger, setLedger] = useState({});

    const transactionService = new TransactionService();

    useEffect(() => {
        // transactionService.getLedgerByParty(partyType, customerProfile.id).then(data => {
        //     setLedger(data);
        // });
    }, []);

    return (
        <div className="grid h-screen">
            <Fragment >
                {ledger!=null && (<PDFViewer className='card col-12' >
                    <Ledger customer={customerProfile} data={ledger} />
                </PDFViewer>)}
            </Fragment>
        </div>
    )
};

export default MyDocument;