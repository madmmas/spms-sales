import React, { Fragment } from 'react';
import {Text, View, StyleSheet } from '@react-pdf/renderer';
import { getDate, getDatetime } from '../../../utils';

const styles = StyleSheet.create({
    invoiceNoContainer: {
        flexDirection: 'row',
        marginTop: 10,
        justifyContent: 'flex-end'
    },
    invoiceDateContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    invoiceNo: {
        fontSize: 12,
        fontStyle: 'bold',
    },
    entry: {
        fontSize: 10,
        flexDirection: 'row',
    },
    label: {
        width: 60
    }
    
  });

  const InvoiceNo = ({invoice}) => (
        <Fragment>
            <View style={styles.entry}>
                <Text style={styles.label}>Served By: </Text>
                <Text >{invoice.serverBy?invoice.server_by:''}</Text>
            </View >
            <View style={styles.entry}>
                <Text style={styles.label}>Entry Time: </Text>
                <Text >{getDatetime(invoice.entryTime)}</Text>
            </View >
            <View style={styles.invoiceNoContainer}>
                <Text style={styles.label}>Invoice No:</Text>
                <Text style={styles.invoiceNo}>{invoice.voucherNo}</Text>
            </View >
            <View style={styles.invoiceDateContainer}>
                <Text style={styles.label}>Date: </Text>
                <Text >{getDate(invoice.invoiceDate)}</Text>
            </View >
        </Fragment>
  );
  
  export default InvoiceNo