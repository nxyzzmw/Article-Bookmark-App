import React, { useState } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';

export default function Dice() {
  const [value, setValue] = useState<number>(1);

  const roll = () => {
    const next = Math.floor(Math.random() * 6) + 1;
    setValue(next);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dice</Text>
      <View style={styles.dice}>
        {renderDots(value)}
      </View>
      <TouchableOpacity style={styles.button} onPress={roll}>
        <Text style={styles.buttonText}>Roll</Text>
      </TouchableOpacity>
    </View>
  );
}

const dotMap: Record<number, number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

const renderDots = (value: number | null) => {
  if (!value) {
    return (
      <View style={styles.grid}>
        {Array.from({ length: 9 }).map((_, i) => (
          <View key={i} style={styles.cell}  />
        ))}
      </View>
    );
  }

  const active = new Set(dotMap[value]);
  return (
    <View style={styles.grid}>
      {Array.from({ length: 9 }).map((_, i) => (
        <View key={i} style={styles.cell}>
          {active.has(i) && <View style={styles.dot} />}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  dice: {
    width: 150,
    height: 150,
    backgroundColor: '#B8A38A',
    borderRadius: 15,
    padding: 12,
    elevation: 20,
    borderWidth: 2,
    borderColor: '#2E241A',
  },
  grid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: '33.3333%',
    height: '33.3333%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#2E241A',
  },
  button: {
    backgroundColor: '#2E241A',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
