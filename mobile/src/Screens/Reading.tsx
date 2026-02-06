import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { SegmentedButtons } from 'react-native-paper';

export default function Reading() {
  const [value, setValue] = React.useState('unread');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Readings</Text>

      <SegmentedButtons
        value={value}
        onValueChange={setValue}
        buttons={[
          {
            value: 'unread',
            label: 'Unread',
               checkedColor: '#3A2A1A',
                 style: value === 'unread' && { backgroundColor: '#E7CBA3' },
          },
          {
            value: 'finished',
            label: 'Finished',
               checkedColor: '#3A2A1A',
                 style: value === 'finished' && { backgroundColor: '#E7CBA3'},
          },
        ]}
        style={styles.segment}
      />
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
    marginBottom: 16,
  },
  segment: {
    borderRadius: 12,
  },
});
