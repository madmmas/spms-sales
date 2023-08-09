import React from 'react';
import { Page, Document, Text, StyleSheet } from '@react-pdf/renderer';
import ReportTitle from '../../common/ReportTitle'
import ItemsTable from '../common/ItemsTable'

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
    pageNumber: {
        position: 'absolute',
        fontSize: 12,
        bottom: 30,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: 'grey',
    }
  });
  
  const Ledger = ({data}) => (
            <Document>
                <Page size="A4" style={styles.page}>
                    <ReportTitle title='Bank Ledger' />
                    <ItemsTable data={data} />
                    <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
                        `Page No: ${pageNumber} / ${totalPages}`
                    )} fixed />
                </Page>
            </Document>
        );
  
  export default Ledger