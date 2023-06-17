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
    },
    product_name: {
        width: '20%',
        textAlign: 'left',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        paddingLeft: 4,
        wrap: false,
    },
    brand: {
        width: '10%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        textAlign: 'left',
        paddingLeft: 4,
    },
    sno: {
        width: '5%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        textAlign: 'right',
        paddingRight: 8,
    },
    qty: {
        width: '10%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        textAlign: 'right',
        paddingRight: 8,
    },
    part_no: {
        width: '10%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        textAlign: 'left',
        paddingLeft: 4,
    },
    model: {
        width: '10%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        textAlign: 'left',
        paddingLeft: 4,
    },
    rate: {
        width: '15%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        textAlign: 'right',
        paddingRight: 8,
    },
    discount: {
        width: '5%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        textAlign: 'right',
        paddingRight: 8,
    },
    amount: {
        width: '15%',
        textAlign: 'right',
        paddingRight: 8,
    },
  });


const InvoiceTableRow = ({items}) => {
    const rows = items.map( item => 
        <View wrap={false} style={styles.row} key={item.sno.toString()}>
            <Text wrap={false} style={styles.sno}>{item.sno}</Text>
            <Text wrap={false} style={styles.qty}>{item.qty} {item.measure}</Text>
            <Text wrap={false} style={styles.product_name}>{item.product_name}</Text>
            <Text wrap={false} style={styles.brand}>{item.brand}</Text>
            <Text wrap={false} style={styles.part_no}>{item.part_no}</Text>
            <Text wrap={false} style={styles.model}>{item.model}</Text>
            <Text wrap={false} style={styles.rate}>{item.rate}</Text>
            <Text wrap={false} style={styles.discount}>{item.discount}</Text>
            <Text wrap={false} style={styles.amount}>{item.amount}</Text>
        </View>
    )
    return (<Fragment>{rows}</Fragment> )
};
  
  export default InvoiceTableRow