import React from 'react';
import { View, StyleSheet } from '@react-pdf/renderer';
import TableHeader from './TableHeader'
import InvoiceTableRow from './InvoiceTableRow'
import TableBlankSpace from './TableBlankSpace'

const tableRowsCount = 38;

const styles = StyleSheet.create({
    tableContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#000',
    },
});

  const InvoiceItemsTable = ({data}) => (
    console.log("INVOICE ITEMS :::", data),
    <View style={styles.tableContainer}>
        <TableHeader />
        <InvoiceTableRow items={data} />
        <TableBlankSpace rowsCount={ tableRowsCount} />
        {/* <TableBlankSpace rowsCount={ tableRowsCount - data.length} /> */}
    </View>
  );
  
export default InvoiceItemsTable