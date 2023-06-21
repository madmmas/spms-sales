import React from 'react';
import {Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    headerContainer: {
        marginTop: 0
    },
    billTo: {
        marginTop: 10,
        paddingBottom: 3,
        fontFamily: 'Helvetica-Oblique'
    },
  });

  const BillTo = ({invoice}) => (
    <View style={styles.headerContainer}>
        <Text style={styles.billTo}>Bill To:</Text>
        <Text>{invoice.partyCode?invoice.partyCode:'NA'}</Text>
        <Text>{invoice.customerName}</Text>
        <Text>{invoice.customerAddress?invoice.customerAddress:''}</Text>
        <Text>{invoice.customerMobileNumber}</Text>
    </View>
  );
  
  export default BillTo