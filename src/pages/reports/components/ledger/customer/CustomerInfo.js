import React, { Fragment } from 'react';
import {Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    entry: {
        fontSize: 10,
        flexDirection: 'row',
    },
    label: {
        justifyContent: 'flex-end',
        width: 100
    },

    headerContainer: {
        marginTop: 0
    },
    billTo: {
        marginTop: 10,
        paddingBottom: 3,
        fontFamily: 'Helvetica-Oblique'
    },
  });

  const CustomerInfo = ({customer}) => (
    <Fragment>
        <View style={styles.entry}>
            <Text style={styles.label}>Customer ID: </Text>
            <Text>{customer.code}</Text>
        </View >
        <View style={styles.entry}>
            <Text style={styles.label}>Customer Name: </Text>
            <Text>{customer.name}</Text>
        </View >
        <View style={styles.entry}>
            <Text style={styles.label}>Customer Address: </Text>
            <Text>{customer.address}</Text>
        </View >
    </Fragment>
  );
  
  export default CustomerInfo