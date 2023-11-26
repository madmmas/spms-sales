import React, { useEffect, useState, Fragment } from 'react';
import { useParams } from 'react-router-dom';
import { PDFViewer } from '@react-pdf/renderer'
import Ledger from './components/ledger/common/Ledger'

import { TransactionService } from '../../services/TransactionService';
import { MasterDataService } from '../../services/MasterDataService';

import { 
    PURCHASE_MODEL,
    SALES_MODEL,
    ACC_PAYABLE,
    ACC_RECEIVABLE,
    CASH_MODEL,
    BANK_MODEL,
    SUPPLIER_MODEL,
    CUSTOMER_MODEL
} from '../../constants/models';

const ReportLedger = ({ type, header }) => {

    let { id } = useParams();

    const [ledger, setLedger] = useState(null);

    const transactionService = new TransactionService();
    const masterDataService = new MasterDataService();

    useEffect(() => {
        let partyType = getPartyModel(type);
        if (id != null) {
            if(partyType === ACC_PAYABLE || partyType === ACC_RECEIVABLE){
                transactionService.getLedgerByPartyTypeAndId(partyType, id).then(data => {
                    // get party info
                    let modelName = partyType === ACC_PAYABLE ? SUPPLIER_MODEL : CUSTOMER_MODEL;
                    masterDataService.getById(modelName, id).then(party => {
                        let ledger = {
                            "party": {
                                "line1": party.name||party.name,
                                "line2": party.address,
                                "line3": party.phone,
                            },
                            "data": data.rows
                        };
                        setLedger( ledger );
                        console.log(ledger);
                    });
                });
            } else {
                transactionService.getLedgerByPartyId(id).then(data => {
                    masterDataService.getById(partyType, id).then(party => {
                        let ledger = {
                            "party": {
                                "line1": party.name||party.name,
                                "line2": party.address,
                                "line3": party.phone,
                            },
                            "data": data.rows
                        };
                        setLedger( ledger );
                        console.log(ledger);
                    });
                });
            }
            return;
        } else {
            transactionService.getLedgerByParty(partyType).then(data => {
                let ledger = {
                    "data": data.rows
                };
                setLedger( ledger );
                console.log(ledger);
            });
        }
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
                return ACC_RECEIVABLE;
            case 'cash':
                return CASH_MODEL;
            case 'bank':
                return BANK_MODEL;
            case 'customer':
                return CUSTOMER_MODEL;
            case 'supplier':
                return SUPPLIER_MODEL;
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