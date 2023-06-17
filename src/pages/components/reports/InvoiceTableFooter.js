import React from 'react';
import {Text, View, StyleSheet } from '@react-pdf/renderer';

const borderColor = '#90e5fc'
const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        borderBottomColor: '#bff0fd',
        borderBottomWidth: 1,
        alignItems: 'center',
        height: 24,
        fontSize: 12,
        fontStyle: 'bold',
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


const InvoiceTableFooter = ({items}) => {
    const total = items.map(item => item.qty * item.rate)
        .reduce((accumulator, currentValue) => accumulator + currentValue , 0)
    return(    
        <View style={styles.row}>
            <Text style={styles.description}>TOTAL</Text>
            <Text style={styles.total}>{ Number.parseFloat(total).toFixed(2)}</Text>
            <table class="table table-borderless">
                      <tbody>
                          <tr class="add">
                              <td>Description</td>
                              <td>Days</td>
                              <td>Price</td>
                              <td class="text-center">Total</td>
                          </tr>
                          <tr class="content">
                              <td>Website Redesign</td>
                              <td>15</td>
                              <td>$1,500</td>
                              <td class="text-center">$22,500</td>
                          </tr>
                          <tr class="content">
                              <td>Logo & Identity</td>
                              <td>10</td>
                              <td>$1,500</td>
                              <td class="text-center">$15,000</td>
                          </tr>
                          <tr class="content">
                              <td>Marketing Collateral</td>
                              <td>3</td>
                              <td>$1,500</td>
                              <td class="text-center">$4,500</td>
                          </tr>
                      </tbody>
                  </table>
        </View>
    )
};
  
  export default InvoiceTableFooter