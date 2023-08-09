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
    twenty: {
        width: '20%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
    },
    last: {
        width: '15%',
    }
  });

  const TableHeader = () => (
    <View style={styles.container}>
        <Text style={styles.fifteen}>Date</Text>
        <Text style={styles.twenty}>Voucher No</Text>
        <Text style={styles.twenty}>Description</Text>
        <Text style={styles.twenty}>Note</Text>
        <Text style={styles.ten}>Dr.</Text>
        <Text style={styles.ten}>Cr.</Text>
        <Text style={styles.last}>Balance</Text>
    </View>
  );
  
  export default TableHeader