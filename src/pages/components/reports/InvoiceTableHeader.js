import React from 'react';
import {Text, View, StyleSheet } from '@react-pdf/renderer';

const borderColor = '#000'
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderBottomColor: '#000',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        alignItems: 'center',
        height: 24,
        textAlign: 'center',
        // fontStyle: 'bold',
        flexGrow: 1,
    },
    five: {
        width: '5%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
    },
    ten: {
        width: '10%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
    },
    fifteen: {
        width: '15%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
    },
    last: {
        width: '15%',
    },
    twenty: {
        width: '20%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
    },
  });

  const InvoiceTableHeader = () => (
    <View style={styles.container}>
        <Text style={styles.five}>Sl</Text>
        <Text style={styles.ten}>Qty</Text>
        <Text style={styles.twenty}>Product Name</Text>
        <Text style={styles.ten}>Brand</Text>
        <Text style={styles.ten}>Part No</Text>
        <Text style={styles.ten}>Model</Text>
        <Text style={styles.fifteen}>Unit Price</Text>
        <Text style={styles.five}>D %</Text>
        <Text style={styles.last}>Total Price</Text>
    </View>
  );
  
  export default InvoiceTableHeader