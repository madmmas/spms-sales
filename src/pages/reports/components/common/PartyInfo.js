import React from 'react';
import {Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    headerContainer: {
        marginTop: 10
    },
  });

  const PartyInfo = ({party}) => (
    <View style={styles.headerContainer}>
        <Text>{party.line1}</Text>
        <Text>{party.line2}</Text>
        <Text>{party.line3}</Text>
    </View>
  );
  
  export default PartyInfo