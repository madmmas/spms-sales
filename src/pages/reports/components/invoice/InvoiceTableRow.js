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
        <View style={styles.row} key={item.id}>
            <Text wrap={false} style={styles.sno}></Text>
            <Text wrap={false} style={styles.qty}>{item.qty}</Text>
            <Text wordWrap={false} style={styles.product_name}>{item.product_name}</Text>
            <Text wrap={false} style={styles.brand}>{item.product_brand_name}</Text>
            <Text wrap={false} style={styles.part_no}>{item.product_part_number}</Text>
            <Text wrap={false} style={styles.model}>{item.product_model_no}</Text>
            <Text wrap={false} style={styles.rate}>{Number.parseFloat(item.trade_price).toFixed(2)}</Text>
            <Text wrap={false} style={styles.discount}>{item.discount_profit}</Text>
            <Text wrap={false} style={styles.amount}>{Number.parseFloat(item.qty*(item.trade_price-(item.trade_price*item.discount_profit/100))).toFixed(2) }</Text>
        </View>
    )
    return (<Fragment>{rows}</Fragment> )
};
  
  export default InvoiceTableRow