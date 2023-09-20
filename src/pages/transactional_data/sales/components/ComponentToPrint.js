import React from 'react';
const marginTop="10px"
const marginRight="5px"
const marginBottom="10px"
const marginLeft="5px"
const getPageMargins = () => {
  return `@page { margin: ${marginTop} ${marginRight} ${marginBottom} ${marginLeft} !important; }`;
};
export class ComponentToPrint extends React.PureComponent {
  
  render() {
    return (
      <div>
        <style>{`
            @media print { 
              html, body {
                  height: auto !important;    
              }
              
              @page {
                size: A4;
                margin: 0;
              }
              .no-printme  { display: none;}
              .printme  { 
                display: block; 
                margin: .5in !important; 
                padding: 0px !important; 
              }
            }
        `}</style>
        
      </div>
    );
  }
}