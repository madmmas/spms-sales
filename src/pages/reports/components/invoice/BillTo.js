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
    <>
    {invoice.party && 
        <View style={styles.headerContainer}>
            <Text style={styles.billTo}>Bill To:</Text>
            <Text>{invoice.party.line1}</Text>
            <Text>{invoice.party.line2}</Text>
            <Text>{invoice.party.line3}</Text>
        </View>
    }
    {!invoice.party && 
        <View style={styles.headerContainer}>
            <Text style={styles.billTo}>Bill To:</Text>
            <Text>{invoice.customer_name}</Text>
            <Text>{invoice.customer_phone}</Text>
        </View>
    }
    </>
  );
  
  export default BillTo