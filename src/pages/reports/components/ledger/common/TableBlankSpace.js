import React, {Fragment} from 'react';
import {Text, View, StyleSheet } from '@react-pdf/renderer';

const borderColor = '#000'
const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        // borderBottomColor: '#000',
        // borderBottomWidth: 1,
        fontSize: 6,
        size: 6,
        alignItems: 'center',
        height: 16,
        fontStyle: 'bold',
        color: 'white'
    },
    five: {
        width: '5%',
        fontSize: 6,
        // borderRightColor: borderColor,
        // borderRightWidth: 1,
    },
    ten: {
        width: '10%',
        // borderRightColor: borderColor,
        // borderRightWidth: 1,
    },
    fifteen: {
        width: '15%',
        fontSize: 6,
        size: 6,
        // borderRightColor: borderColor,
        // borderRightWidth: 1,
    },
    twenty: {
        width: '20%',
        // borderRightColor: borderColor,
        // borderRightWidth: 1,
    },
    last: {
        width: '15%',
    }
});

const TableBlankSpace = ({rowsCount}) => {
    const blankRows = Array(rowsCount).fill(0)
    const rows = blankRows.map( (x, i) => 
        <View style={styles.row} key={`BR${i}`}>
            <Text style={styles.fifteen}>-</Text>
            <Text style={styles.fifteen}>-</Text>
            <Text style={styles.twenty}>-</Text>
            <Text style={styles.twenty}>-</Text>
            <Text style={styles.ten}>-</Text>
            <Text style={styles.ten}>-</Text>
            <Text style={styles.last}>-</Text>
        </View>
    )
    return (<Fragment>{rows}</Fragment> )
};
  
export default TableBlankSpace

