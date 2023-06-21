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
        fontSize: 10,
    },
    product_name: {
        width: '20%',
        textAlign: 'left',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        paddingLeft: 4,
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        wordWrap: false,
        wordBreak: 'break-all',
        overflowWrap: 'break-word',
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
        fontWeight: 'bold',
    },
  });


const InvoiceTableRow = ({items}) => {
    const rows = items.map( item => 
        <View style={styles.row} key={item.index.toString()}>
            <Text wrap={false} style={styles.sno}>{item.index}</Text>
            <Text wrap={false} style={styles.qty}>{item.quantity}</Text>
            <Text wordWrap={false} style={styles.product_name}>{item.productName}</Text>
            <Text wrap={false} style={styles.brand}>{item.brandName}</Text>
            <Text wrap={false} style={styles.part_no}>{item.partNumber}</Text>
            <Text wrap={false} style={styles.model}>{item.modelNo}</Text>
            <Text wrap={false} style={styles.rate}>{Number.parseFloat(item.unitTradePrice).toFixed(2)}</Text>
            <Text wrap={false} style={styles.discount}>{item.discount}</Text>
            <Text wrap={false} style={styles.amount}>{Number.parseFloat(item.netPrice).toFixed(2) }</Text>
        </View>
    )
    return (<Fragment>{rows}</Fragment> )
};
  
  export default InvoiceTableRow