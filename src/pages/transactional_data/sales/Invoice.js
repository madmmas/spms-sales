import React, { Component, Fragment } from 'react';
import {PDFViewer} from '@react-pdf/renderer'
import Invoice from '../../components/reports/Invoice'

// const invoice = {
//     "id": "5df3180a09ea16dc4b95f910",
//     "invoice_no": "201906-28",
//     "balance": "$2,283.74",
//     "company": "MANTRIX",
//     "email": "susanafuentes@mantrix.com",
//     "phone": "+1 (872) 588-3809",
//     "address": "922 Campus Road, Drytown, Wisconsin, 1986",
//     "trans_date": "2019-09-12",
//     "due_date": "2019-10-12",
//     "items": [
//       {
//         "sno": 1,
//         "desc": "ad sunt culpa occaecat qui",
//         "qty": 5,
//         "rate": 405.89
//       },
//       {
//         "sno": 2,
//         "desc": "cillum quis sunt qui aute",
//         "qty": 5,
//         "rate": 373.11
//       },
//       {
//         "sno": 3,
//         "desc": "ea commodo labore culpa irure",
//         "qty": 5,
//         "rate": 458.61
//       },
//       {
//         "sno": 4,
//         "desc": "nisi consequat et adipisicing dolor",
//         "qty": 10,
//         "rate": 725.24
//       },
//       {
//         "sno": 5,
//         "desc": "proident cillum anim elit esse",
//         "qty": 4,
//         "rate": 141.02
//       }
//     ]
//   }

const invoice = {
    "invoice_no": "201906-28",
    "invoice_date": "2019-09-12",
    "server_by": "test",
    "entry_time": "2019-09-12T10:00:00.000Z",
    "party_code": "MANTRIX",
    "party_name": "MANTRIX",
    "party_address": "922 Campus Road, Drytown, Wisconsin, 1986",
    "party_phone": "+1 (872) 588-3809",
    "items": [
        {
            "sno": 1,
            "product_name": "ad sunt culpa occaecat qui",
            "brand": "test",
            "part_no": "test",
            "model": "test",
            "qty": 5,
            "measure": "kg",
            "rate": 405.89,
            "discount": 0,
            "amount": 2029.45
        },
        {
            "sno": 2,
            "product_name": "cillum quis sunt qui aute",
            "brand": "test",
            "part_no": "test",
            "model": "test",
            "qty": 5,
            "measure": "kg",
            "rate": 373.11,
            "discount": 0,
            "amount": 1865.55
        }
    ],
    "total_amount": 3895,
    "net_amount": 3895,
    "b_f_amount": 0,
    "reveived_amount": 0,
    "balance_amount": 3895,
    "remarks": "test",
}

const MyDocument = () => (
  <div className="grid h-screen">
    <Fragment >
        <PDFViewer className='card col-12' >
            <Invoice invoice={invoice}/>
        </PDFViewer>
    </Fragment>
  </div>
);

export default MyDocument;