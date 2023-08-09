import React from 'react';
import {Text, Svg, Line, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    pageNumber: {
        position: 'absolute',
        fontSize: 12,
        bottom: 30,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: 'grey',
      },
    table: { 
        bottom: 30,
        position: 'absolute',
        display: "table", 
        width: "600", 
        // borderStyle: "none", 
        // borderWidth: 1, 
        borderRightWidth: 0, 
        borderBottomWidth: 0,
        paddingLeft:60,
        paddingRight:60,
        textAlign: 'center',
    }, 
    tableRow: { 
      margin: "auto", 
      flexDirection: "row" 
    }, 
    tableCol: { 
        width: "33%", 
        textAlign: 'center',
        borderLeftWidth: 0, 
        borderTopWidth: 0 
    }, 
    tableColTop: { 
        width: "33%", 
      borderStyle: "solid", 
      borderWidth: 1, 
      left: 10,
      flexDirection: "column", 
        // borderTop: 1,
    // borderWidth: 1,
        textAlign: 'center',
        borderLeftWidth: 0, 
        borderTopWidth: 0 
    }, 
    tableCell: { 
      margin: "auto", 
      marginTop: 5, 
      width: "100%", 
      paddingLeft: 5,
      fontSize: 10,
      textAlign: 'center',
    }
  });


  const ReportFooter = () => (
    <View style={styles.table}> 
        <View style={styles.tableRow}> 
          <View style={styles.tableCol}> 
          <Svg height="10" width="140">
            <Line x1="20" y1="5" x2="140" y2="5" strokeWidth={1} stroke="rgb(0,0,0)" />
       </Svg>
            <Text style={styles.tableCell}>CUSTOMER</Text> 
            <Text style={styles.tableCell}>SIGNATURE</Text> 
          </View> 
          <View style={styles.tableCol}> 
          <Svg height="10" width="140">
            <Line x1="20" y1="5" x2="140" y2="5" strokeWidth={1} stroke="rgb(0,0,0)" />
       </Svg>
            <Text style={styles.tableCell}>ACCOUNTANT</Text> 
            <Text style={styles.tableCell}>SIGNATURE</Text> 
          </View> 
          <View style={styles.tableCol}> 
          <Svg height="10" width="140">
            <Line x1="20" y1="5" x2="140" y2="5" strokeWidth={1} stroke="rgb(0,0,0)" />
       </Svg>
            <Text style={styles.tableCell}>AUTHORISED</Text> 
            <Text style={styles.tableCell}>SIGNATURE</Text> 
          </View> 
        </View>
        {/* <View style={styles.tableRow}> 
          <View style={styles.tableCol}> 
            <Text style={styles.tableCell}>3 User </Text> 
          </View> 
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>2019-02-20 - 2020-02-19</Text> 
          </View>
          <View style={styles.tableCol}> 
            <Text style={styles.tableCell}>5€</Text> 
          </View> 
        </View>  */}
      </View>
  );
  
  export default ReportFooter