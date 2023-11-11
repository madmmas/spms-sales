import React from 'react';
const marginTop="10px"
const marginRight="5px"
const marginBottom="10px"
const marginLeft="5px"
const getPageMargins = () => {
  return `@page { margin: ${marginTop} ${marginRight} ${marginBottom} ${marginLeft} !important; }`;
};
export class PrintPOS extends React.PureComponent {
  
  render() {
    return (
      <div>
        <style>{`
            @media print { 
                html, body {
                    height: auto !important;    
                }
                .layout-topbar, .layout-footer { display: none; }
                .no-printme  { display: none;}
                .printme  { display: block; margin: 0px !important; padding: 0px !important; }
        
                @page {
                    // size: 2.8in 11in;
                    size: 58mm 200mm;
                    margin-top: 0cm;
                    margin-left: 0cm;
                    margin-right: 0cm;
                }
                footer {page-break-after: always;}
        `}</style>
        
      </div>
    );
  }
}