import React, {useEffect, useState} from 'react'
import { PrintPOS } from './PrintPOS'
import { ComponentToPrint } from './ComponentToPrint'
import { set } from 'react-hook-form'

const invoice = {
    "invoice_no": "201906-28",
    "date": "2019-06-28",
    "served_by": "John Doe",
    "entry_date": "2019-06-28T12:24:00.000Z",
    "company": {
        "name": "Company Name",
        "address": "13th Street, Home Town, 43200, Country",
        "phone": "(123) 456-7890",
    },
    "client": {
        "name": "Client Name",
        "address": "44 Shirley Ave. West Chicago, IL 60185",
    },
    "items": [
        {
            "sr_no": 1,
            "desc": "Website Design",
            "qty": 2,
            "unit_price": 100,
            "amount": 200
        },
        {
            "sr_no": 2,
            "desc": "Website Development",
            "qty": 1,
            "unit_price": 200,
            "amount": 200
        },
        {
            "sr_no": 3,
            "desc": "Graphic Design",
            "qty": 2,
            "unit_price": 50,
            "amount": 100
        }
    ],
    "payment_details": {
        "bank_payment": {
            "name": "Bank Name",
            "amount": 500,
        },
        "cash_payment": {
            "amount": 500,
        },
        "mfs_payment": {
            "reference": "Bkash",
            "amount": 500,
        },
    },
    "amount": 500,
    "discount": 0,
    "total": 500,
    "amount_paid": 0,
    "amount_due": 500,
    "status": "paid",
    "due": "",
    "notes": "Thank you for your business.",
}
    

export const PrintInvoice = () => {
    
    const [printme, setPrintme] = useState(false)
    const [printmePos, setPrintmePos] = useState(false)
    const [trigger, setTrigger] = useState(0)

    useEffect(() => {
        if(trigger>0){
            window.print();
        }
    }, [trigger]);

    const handlePrint = () => {
        setPrintme(true);
        setPrintmePos(false);
        setTrigger(trigger+1);
    }

    const handlePrintPOS = () => {
        setPrintme(false);
        setPrintmePos(true);
        setTrigger(trigger+1);
    }
    
    return (
      <div>
        <style>{`
            html,body
            {
                height: auto !important;
                margin: 0px;
            }
            .printme-none { display: none;}
            .printme{
                background-color: white;
                color: black;
                margin: 20px !important;
                padding: 20px !important;
            }
            table {
                width: 100%;
            }
    
            tr {
                width: 100%;
    
            }
    
            h1 {
                text-align: center;
                vertical-align: middle;
            }
    
            #logo {
                width: 60%;
                text-align: center;
                -webkit-align-content: center;
                align-content: center;
                padding: 5px;
                margin: 2px;
                display: block;
                margin: 0 auto;
            }
    
            header {
                width: 100%;
                text-align: center;
                -webkit-align-content: center;
                align-content: center;
                vertical-align: middle;
            }
    
            .items thead {
                text-align: center;
            }
    
            .center-align {
                text-align: center;
            }
    
            .bill-details td {
                font-size: 12px;
            }
    
            .receipt {
                font-size: medium;
            }
    
            .items .heading {
                font-size: 12.5px;
                text-transform: uppercase;
                border-top:1px solid black;
                margin-bottom: 4px;
                border-bottom: 1px solid black;
                vertical-align: middle;
            }
    
            .items thead tr th:first-child,
            .items tbody tr td:first-child {
                width: 47%;
                min-width: 47%;
                max-width: 47%;
                word-break: break-all;
                text-align: left;
            }
    
            .items td {
                font-size: 12px;
                text-align: right;
                vertical-align: bottom;
            }
    
            .price::before {
                 content: "\\20B9";
                font-family: Arial;
                text-align: right;
            }
    
            .sum-up {
                text-align: right !important;
            }
            .total {
                font-size: 13px;
                border-top:1px dashed black !important;
                border-bottom:1px dashed black !important;
            }
            .total.text, .total.price {
                text-align: right;
            }
            .total.price::before {
                content: "\\20B9"; 
            }
            .line {
                border-top:1px solid black !important;
            }
            .heading.rate {
                width: 20%;
            }
            .heading.amount {
                width: 25%;
            }
            .heading.qty {
                width: 5%
            }
            p {
                padding: 1px;
                margin: 0;
            }
            section, footer {
                font-size: 12px;
            }
            footer {
                position: absolute;
                bottom: 40px;
                height: 10px;
                width: 100%;
            }
        `}</style>
        <button className = "no-printme" onClick={() =>handlePrint()}>PRINT</button>
        <button className = "no-printme" onClick={() =>handlePrintPOS()}>PRINT-POS</button>
        {printmePos && <PrintPOS />}
        {printme && <ComponentToPrint />}
        <div className='printme'>
            <p>Invoice Number : 4910487129047124</p>
            <table className="bill-details">
                <tbody>
                    <tr>
                        <td>Date : <span>1</span></td>
                        <td>Time : <span>2</span></td>
                    </tr>
                    <tr>
                        <td>Table #: <span>3</span></td>
                        <td>Bill # : <span>4</span></td>
                    </tr>
                    <tr>
                        <th className="center-align" colSpan="2"><span className="receipt">Original Receipt</span></th>
                    </tr>
                </tbody>
            </table>
            <table className="items">
                <thead>
                    <tr>
                        <th className="heading name">Item</th>
                        <th className="heading qty">Qty</th>
                        <th className="heading rate">Rate</th>
                        <th className="heading amount">Amount</th>
                    </tr>
                </thead>
            
                <tbody>
                    <tr>
                        <td>Chocolate milkshake frappe</td>
                        <td>1</td>
                        <td className="price">200.00</td>
                        <td className="price">200.00</td>
                    </tr>
                    <tr>
                        <td>Non-Veg Focaccoa S/W</td>
                        <td>2</td>
                        <td className="price">300.00</td>
                        <td className="price">600.00</td>
                    </tr>
                    <tr>
                        <td>Classic mojito</td>
                        <td>1</td>
                        <td className="price">800.00</td>
                        <td className="price">800.00</td>
                    </tr>
                    <tr>
                        <td>Non-Veg Ciabatta S/W</td>
                        <td>1</td>
                        <td className="price">500.00</td>
                        <td className="price">500.00</td>
                    </tr>
                    <tr>
                        <td colSpan="3" className="sum-up line">Subtotal</td>
                        <td className="line price">12112.00</td>
                    </tr>
                    <tr>
                        <td colSpan="3" className="sum-up">CGST</td>
                        <td className="price">10.00</td>
                    </tr>
                    <tr>
                        <td colSpan="3" className="sum-up">SGST</td>
                        <td className="price">10.00</td>
                    </tr>
                    <tr>
                        <th colSpan="3" className="total text">Total</th>
                        <th className="total price">12132.00</th>
                    </tr>
                </tbody>
            </table>
            <section>
                <p>
                    Paid by : <span>CASH</span>
                </p>
            </section>
            <footer>
                <table style={{"textAlign": "center"}}>
                    <tbody>
                        <tr>
                            <td>Customer Signature</td>
                            <td>Account Signature</td>
                            <td>Authorised Signature</td>
                        </tr>
                    </tbody>
                </table>
            </footer>
        </div>
        
      </div>
    )
}
