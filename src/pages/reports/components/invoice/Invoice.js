import React from 'react';
import { Page, Document, Image, StyleSheet } from '@react-pdf/renderer';
import InvoiceTitle from './InvoiceTitle'
import BillTo from './BillTo'
import InvoiceNo from './InvoiceNo'
import InvoiceItemsTable from './InvoiceItemsTable'
import InvoiceFooter from './InvoiceFooter';
// import logo from '../../../src/logo.png'

const styles = StyleSheet.create({
    page: {
        fontFamily: 'Times-Roman',
        fontSize: 10,
        paddingTop: 30,
        paddingLeft:60,
        paddingRight:60,
        lineHeight: 1,
        flexDirection: 'column',
    }, 
    logo: {
        width: 74,
        height: 66,
        marginLeft: 'auto',
        marginRight: 'auto'
    }
  });
  
  const Invoice = ({invoice}) => (
            <Document>
                <Page size="A4" style={styles.page}>
                    {/* <Image style={styles.logo} src={logo} /> */}
                    <InvoiceTitle title='Sales Invoice'/>
                    <InvoiceNo invoice={invoice}/>
                    <BillTo invoice={invoice}/>
                    <InvoiceItemsTable invoice={invoice} />
                    <InvoiceFooter />
                </Page>
            </Document>
        );
  
  export default Invoice