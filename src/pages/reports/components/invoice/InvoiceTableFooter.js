import React from 'react';
import {Text, View, StyleSheet } from '@react-pdf/renderer';

const borderColor = '#000'
const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        borderBottomColor: '#000',
        borderBottomWidth: 1,
        alignItems: 'center',
        height: 14,
        fontSize: 10,
    },
    row2: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 14,
        fontSize: 10,
    },
    description: {
        width: '85%',
        textAlign: 'right',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        paddingRight: 8,
    },
    total: {
        width: '15%',
        textAlign: 'right',
        paddingRight: 8,
    },
  });


const InvoiceTableFooter = ({invoice}) => {
    return(    
        <View>
            <View style={styles.row}>
                <Text style={styles.description}>Total Amount</Text>
                <Text style={styles.total}>{ Number.parseFloat(invoice.totalPrice).toFixed(2)}</Text>
            </View>
            {(invoice.totalDiscountedAmount>0) && (<View style={styles.row}>
                <Text style={styles.description}>Discount</Text>
                <Text style={styles.total}>{ Number.parseFloat(invoice.totalDiscountedAmount).toFixed(2)}</Text>
            </View>)}
            <View style={styles.row}>
                <Text style={styles.description}>Net Amount</Text>
                <Text style={styles.total}>{ Number.parseFloat(invoice.netAmount).toFixed(2)}</Text>
            </View>
            {(invoice.customer_category!=="WALKIN") && (<View>
            <View style={styles.row2}>
                <Text style={styles.description}>(+) B/F Balance</Text>
                <Text style={styles.total}>{ Number.parseFloat(invoice.balanceForward).toFixed(2)}</Text>
            </View>
            <View style={styles.row2}>
                <Text style={styles.description}>(-) Received Amount</Text>
                <Text style={styles.total}>{ Number.parseFloat(invoice.payment?invoice.payment.paidAmount:0.00).toFixed(2)}</Text>
            </View>
            <View style={styles.row2}>
                <Text style={styles.description}>Net Balance</Text>
                <Text style={styles.total}>{ Number.parseFloat(invoice.netBalance).toFixed(2)}</Text>
            </View>
            </View>)}
            {(invoice.customer_category==="WALKIN") && (
            <View style={styles.row2}>
                <Text style={styles.description}>Paid Amount</Text>
                <Text style={styles.total}>{ Number.parseFloat(invoice.payment?invoice.payment.paidAmount:0.00).toFixed(2)}</Text>
            </View>)}
        </View>
    )
};
  
  export default InvoiceTableFooter