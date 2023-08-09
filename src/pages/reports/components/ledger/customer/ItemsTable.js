import React from 'react';
import { View, StyleSheet } from '@react-pdf/renderer';
import TableHeader from '../../common/TableHeader'
// import InvoiceTableRow from './InvoiceTableRow'
import TableBlankSpace from '../../common/TableBlankSpace'

const tableRowsCount = 25;

const styles = StyleSheet.create({
    tableContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#000',
    },
});

  const InvoiceItemsTable = ({ledger}) => (
    <View style={styles.tableContainer}>
        <TableHeader />
        {/* <InvoiceTableRow items={ledger.items} /> */}
        <TableBlankSpace rowsCount={ tableRowsCount} />
        {/* <TableBlankSpace rowsCount={ tableRowsCount - ledger.items.length} /> */}
    </View>
  );
  
export default InvoiceItemsTable