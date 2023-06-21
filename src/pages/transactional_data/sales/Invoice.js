import React, { Fragment } from 'react';
import { PDFViewer } from '@react-pdf/renderer'
import Invoice from '../../components/reports/Invoice'

const MyDocument = ({ sales }) => {
    return (
        <div className="grid h-screen">
            <Fragment >
                <PDFViewer className='card col-12' >
                    <Invoice invoice={sales} />
                </PDFViewer>
            </Fragment>
        </div>
    )
};

export default MyDocument;