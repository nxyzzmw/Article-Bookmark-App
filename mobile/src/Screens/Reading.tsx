import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

export default function Reading() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Readings</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F3E9',
    padding: 16,
  },
  title: {
    color: '#3A2A1A',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
});
