import React, {Fragment} from 'react';
import {Text, View, StyleSheet } from '@react-pdf/renderer';

const borderColor = '#000'
const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        borderBottomColor: '#000',
        borderBottomWidth: 1,
        alignItems: 'center',
        height: 24,
        fontStyle: 'bold',
        color: 'white'
    },
    product_name: {
        width: '20%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
    },
    brand: {
        width: '10%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
    },
    sno: {
        width: '5%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
    },
    qty: {
        width: '10%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
    },
    part_no: {
        width: '10%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
    },
    model: {
        width: '10%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
    },
    rate: {
        width: '15%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
    },
    discount: {
        width: '5%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
    },
    amount: {
        width: '15%',
    },
   
  });

const InvoiceTableBlankSpace = ({rowsCount}) => {
    const blankRows = Array(rowsCount).fill(0)
    const rows = blankRows.map( (x, i) => 
        <View style={styles.row} key={`BR${i}`}>
            <Text style={styles.sno}>-</Text>
            <Text style={styles.qty}>-</Text>
            <Text style={styles.product_name}>-</Text>
            <Text style={styles.brand}>-</Text>
            <Text style={styles.part_no}>-</Text>
            <Text style={styles.model}>-</Text>
            <Text style={styles.rate}>-</Text>
            <Text style={styles.discount}>-</Text>
            <Text style={styles.amount}>-</Text>
        </View>
    )
    return (<Fragment>{rows}</Fragment> )
};
  
export default InvoiceTableBlankSpace

