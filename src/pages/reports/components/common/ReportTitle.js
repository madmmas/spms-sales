import React from 'react';
import {Text, Svg, Line, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
   
    titleContainer:{
        flexDirection: 'column',
        marginTop: 24,
    },
    reportTitle:{
        letterSpacing: 4,
        fontSize: 13,
        textTransform: 'uppercase',
    },
    orgTitle:{
        fontSize: 14,
    },
    orgDetail:{
        fontSize: 11,
    },
    lineStyle:{
        borderWidth: 0.5,
        borderColor:'black',
        margin:10,
    }
  });


  const ReportTitle = ({title}) => (
    <View style={styles.titleContainer}>
        <Text style={styles.orgTitle}>M/S JONONI MOTORS</Text>
        <Text style={styles.orgDetail}>R.N ROAD,JASHORE,BANGLADESH</Text>
        <Text style={styles.orgDetail}>MOBILE NO - 01712202310, 01913959501</Text>
        <Svg height="10" width="450">
            <Line x1="0" y1="5" x2="250" y2="5" strokeWidth={1} stroke="rgb(0,0,0)" />
       </Svg>
        <Text style={styles.reportTitle}>{title}</Text>
    </View>
  );
  
  export default ReportTitle