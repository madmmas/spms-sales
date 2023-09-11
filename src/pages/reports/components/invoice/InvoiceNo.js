import React, { Fragment } from 'react';
import {Text, View, StyleSheet } from '@react-pdf/renderer';
import { getDateFormatted, getTimeFormatted } from '../../../../utils';

const styles = StyleSheet.create({
    invoiceContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    invoiceDateContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    invoiceNo: {
        fontSize: 11,
        fontStyle: 'bold',
    },
    entry: {
        fontSize: 10,
        flexDirection: 'row',
    },
    label: {
        justifyContent: 'flex-end',
        width: 60
    }
    
  });

  const InvoiceNo = ({invoice}) => (
        <Fragment>
            <View style={styles.entry}>
                <Text style={styles.label}>Served By: </Text>
                <Text >{invoice.created_by?invoice.created_by:''}</Text>
            </View >
            <View style={styles.entry}>
                <Text style={styles.label}>Entry Time: </Text>
                <Text >{getTimeFormatted(invoice.created_at)}</Text>
            </View >
            <View style={styles.invoiceContainer}>
                <Text style={styles.label}>Invoice Date:</Text>
                <Text >{getDateFormatted(invoice.created_at)}</Text>
            </View >
            <View style={styles.invoiceContainer}>
                <Text style={styles.label}>Invoice No:</Text>
                <Text style={styles.invoiceNo}>{invoice.voucher_no}</Text>
            </View >
        </Fragment>
  );
  
  export default InvoiceNo