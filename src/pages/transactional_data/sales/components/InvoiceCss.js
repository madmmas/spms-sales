
const InvoiceCss = () => {

    return (
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
                text-align: left;
                -webkit-align-content: left;
                align-content: left;
                vertical-align: left;
            }

            header p{
                color: #000 !important;
                font-weight: bold;
            }
            header p i{
                border-style: solid;
                padding: 2px;
                margin: 2px;
            }
    
            .lineitems thead {
                text-align: left;
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
    
            .lineitems .heading {
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
                 content: "\\09F3";
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
                content: "\\09F3"; 
            }
            .line {
                border-top:1px solid black !important;
            }
            .heading.qty {
                width: 5% !important;
            }
            .heading.name {
                width: 30%;
            }
            .heading.brand {
                width: 10%;
            }
            .heading.amount {
                width: 15%;
            }
            .left-align {
                text-align: left;
                vertical-align: top;
            }
            .right-align {
                text-align: right;
                vertical-align: top;
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
    );
}

export default InvoiceCss;