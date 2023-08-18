import React, { Fragment, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PDFViewer } from '@react-pdf/renderer'
import Invoice from '../../reports/components/invoice/Invoice'

import { SALES_MODEL } from '../../../constants/models';
import { OrderService } from '../../../services/OrderService';

const MyDocument = () => {

    let { id } = useParams();
    
    const orderService = new OrderService();
    const [sales, setSales] = useState(null);

    useEffect(() => {
        if(id=="new"){
            setSales(null);
        }else{
            orderService.getById(SALES_MODEL, id).then(data => {
                calculateInvoice(data);
            });    
        }
    }, []);

    const calculateInvoice = (data) => {
        let total = 0;
        let totalDiscountedAmount = 0;
        let netAmount = 0;

        data.items.forEach(item => {
            total += item.quantity * item.price;
            totalDiscountedAmount += item.quantity * item.discountedPrice;
        });
        netAmount = total - totalDiscountedAmount;

        setSales(sales);
    }

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