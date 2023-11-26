import React, { Fragment, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PDFViewer } from '@react-pdf/renderer'
import Invoice from '../../reports/components/invoice/Invoice'

import { SALES_MODEL, CUSTOMER_MODEL } from '../../../constants/models';
import { OrderService } from '../../../services/OrderService';
import { MasterDataService } from '../../../services/MasterDataService';

const MyDocument = () => {

    let { id } = useParams();
    
    const orderService = new OrderService();
    const masterDataService = new MasterDataService();
    const [sales, setSales] = useState(null);

    useEffect(() => {
        if(id=="new"){
            setSales(null);
        }else{
            orderService.getById(SALES_MODEL, id).then(data => {
                if(data && data.customer_category!=="WALKIN"){
                    masterDataService.getById(CUSTOMER_MODEL, data.party_id).then(party => {
                        data.party = {
                            "line1": party.name,
                            "line2": party.address,
                            "line3": party.phone,
                        };
                        orderService.getLedgerBalance("dtCustomer", data.party_id).then(party_balance => {
                            let dr_amount = Number(party_balance.dr_amount)||0;
                            let cr_amount = Number(party_balance.cr_amount)||0;
                            let balance = dr_amount - cr_amount;
                            console.log("balance::", party_balance);
                            data.balance = balance;
                            setSales(data);
                        });
                    }); 
                }else{
                    setSales(data);
                }
            });    
        }
    }, []);

    useEffect(() => {
        console.log("sales::", sales);
    }, [sales]);

    return (
        <div className="grid h-screen">
            <Fragment >
                {sales!=null && (<PDFViewer className='card col-12' >
                    <Invoice invoice={sales} />
                </PDFViewer>)}
            </Fragment>
        </div>
    )
};

export default MyDocument;