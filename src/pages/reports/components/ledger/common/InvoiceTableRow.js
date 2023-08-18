import React, {Fragment} from 'react';
import {Text, View, StyleSheet } from '@react-pdf/renderer';
import { getDateFormatted } from '../../../../../utils';

const borderColor = '#000'
const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        // borderBottomColor: '#000',
        // borderBottomWidth: 1,
        alignItems: 'center',
        height: 16,
        fontSize: 8,
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
    ten: {
        width: '10%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        textAlign: 'left',
        paddingLeft: 4,
    },
    fifteen: {
        width: '15%',
        fontSize: 8,
        // borderRightColor: borderColor,
        // borderRightWidth: 1,
        textAlign: 'center',
        // paddingRight: 4,
    },
    twenty: {
        width: '20%',
        fontSize: 8,
        // borderRightColor: borderColor,
        // borderRightWidth: 1,
        textAlign: 'center',
        // paddingRight: 8,
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
        textAlign: 'center',
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
        width: '10%',
        fontSize: 8,
        textAlign: 'center',
        // paddingRight: 8,
        // fontWeight: 'bold',
    },
  });


const InvoiceTableRow = ({items}) => {
    console.log('InvoiceTableRow:::', items)
    const rows = items.map( (item, index) => 
        <View style={styles.row} key={index.toString()}>
            <Text wrap={false} style={styles.fifteen}>{getDateFormatted(item.created_at)}</Text>
            <Text wrap={false} style={styles.fifteen}>{item.voucher_no}</Text>
            <Text wrap={false} style={styles.twenty}>{item.particular}</Text>
            <Text wrap={false} style={styles.twenty}>{item.shortname}</Text>
            <Text wrap={false} style={styles.amount}>{Number.parseFloat(item.dr_amount).toFixed(2)}</Text>
            <Text wrap={false} style={styles.amount}>{Number.parseFloat(item.cr_amount).toFixed(2)}</Text>
            <Text wrap={false} style={styles.amount}>{Number.parseFloat(0).toFixed(2) }</Text>
        </View>
    )
    return (<Fragment>{rows}</Fragment> )
};
  
  export default InvoiceTableRow