import React, { Component } from 'react'

export class PrintInvoice extends Component {
    
  render() {

    return (
      <div>
        <style>{`
            @page { margin: 10px 5px 10px 5px !important; }
            .printme-none { display: none;}
            .printme{
                background-color: white;
                color: black;
                margin: 20px !important;
                padding: 20px !important;
            }
            @media print { 
                .no-printme  { display: none;}
                .printme  { display: block; margin: 0px !important; padding: 0px !important; }
                body {
                    margin: 0;
                    padding: 0;
                    font-family: 'PT Sans', sans-serif;
                }
        
                @page {
                    // size: 2.8in 11in;
                    size: 58mm 200mm;
                    margin-top: 0cm;
                    margin-left: 0cm;
                    margin-right: 0cm;
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
            }
        `}</style>
        <button className = "no-printme" onClick={() => window.print()}>PRINT</button>
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
                <p style={{"textAlign": "center"}}>
                    Thank you for your visit!
                </p>
            </section>
            <footer style={{"textAlign": "center"}}>
                <p>Technology Partner Dotworld Technologies</p>
                <p>www.dotworld.in</p>
            </footer>
        </div>
      </div>
    )
  }
}
