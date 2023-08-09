import React, { Fragment } from 'react';
import {Text, View, StyleSheet } from '@react-pdf/renderer';
import { getDate, getDatetime } from '../../../../utils';

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
                <Text >{invoice.servedBy?invoice.servedBy:''}</Text>
            </View >
            <View style={styles.entry}>
                <Text style={styles.label}>Entry Time: </Text>
                <Text >{getDatetime(invoice.entryTime)}</Text>
            </View >
            <View style={styles.invoiceContainer}>
                <Text style={styles.label}>Invoice Date:</Text>
                <Text >{getDate(invoice.invoiceDate)}</Text>
            </View >
            <View style={styles.invoiceContainer}>
                <Text style={styles.label}>Invoice No:</Text>
                <Text style={styles.invoiceNo}>{invoice.voucherNo}</Text>
            </View >
        </Fragment>
  );
  
  export default InvoiceNo