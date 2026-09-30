import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';

// Component vẽ 1 chấm tròn
const Dot = ({ style }: { style?: object }) => (
  <View style={[styles.dot, style]} />
);

// Component vẽ mặt xúc xắc theo số
const DieFace = ({ value }: { value: number }) => {
  const faces: Record<number, React.ReactElement> = {
    1: (
      <View style={styles.faceGrid}>
        <Dot style={styles.center} />
      </View>
    ),
    2: (
      <View style={styles.faceGrid}>
        <Dot style={styles.topRight} />
        <Dot style={styles.bottomLeft} />
      </View>
    ),
    3: (
      <View style={styles.faceGrid}>
        <Dot style={styles.topRight} />
        <Dot style={styles.center} />
        <Dot style={styles.bottomLeft} />
      </View>
    ),
    4: (
      <View style={styles.faceGrid}>
        <Dot style={styles.topLeft} />
        <Dot style={styles.topRight} />
        <Dot style={styles.bottomLeft} />
        <Dot style={styles.bottomRight} />
      </View>
    ),
    5: (
      <View style={styles.faceGrid}>
        <Dot style={styles.topLeft} />
        <Dot style={styles.topRight} />
        <Dot style={styles.center} />
        <Dot style={styles.bottomLeft} />
        <Dot style={styles.bottomRight} />
      </View>
    ),
    6: (
      <View style={styles.faceGrid}>
        <Dot style={styles.topLeft} />
        <Dot style={styles.topRight} />
        <Dot style={styles.midLeft} />
        <Dot style={styles.midRight} />
        <Dot style={styles.bottomLeft} />
        <Dot style={styles.bottomRight} />
      </View>
    ),
  };

  return <View style={styles.die}>{faces[value]}</View>;
};

// App chính
export default function App() {
  const [die1, setDie1] = useState(1);
  const [die2, setDie2] = useState(1);

  const rollDice = () => {
    setDie1(Math.floor(Math.random() * 6) + 1);
    setDie2(Math.floor(Math.random() * 6) + 1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Text style={styles.title}>🎲 Dicee</Text>

      {/* Hai con xúc xắc */}
      <View style={styles.diceRow}>
        <TouchableOpacity onPress={rollDice} activeOpacity={0.8}>
          <DieFace value={die1} />
        </TouchableOpacity>
        <TouchableOpacity onPress={rollDice} activeOpacity={0.8}>
          <DieFace value={die2} />
        </TouchableOpacity>
      </View>

      {/* Nút Roll */}
      <TouchableOpacity style={styles.rollBtn} onPress={rollDice} activeOpacity={0.85}>
        <Text style={styles.rollText}>Roll !</Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
}

const DOT = 14;  // kích thước chấm
const DIE_SIZE = 120;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F3460',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: '800',
    color: '#E94560',
    marginBottom: 60,
    letterSpacing: 2,
  },
  diceRow: {
    flexDirection: 'row',
    gap: 32,
    marginBottom: 64,
  },
  die: {
    width: DIE_SIZE,
    height: DIE_SIZE,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    shadowColor: '#E94560',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
  },
  faceGrid: {
    flex: 1,
    position: 'relative',
  },
  dot: {
    width: DOT,
    height: DOT,
    borderRadius: DOT / 2,
    backgroundColor: '#0F3460',
    position: 'absolute',
  },
  // Vị trí các chấm
  center: { top: '50%', left: '50%', marginTop: -DOT / 2, marginLeft: -DOT / 2 },
  topLeft: { top: 2, left: 2 },
  topRight: { top: 2, right: 2 },
  midLeft: { top: '50%', left: 2, marginTop: -DOT / 2 },
  midRight: { top: '50%', right: 2, marginTop: -DOT / 2 },
  bottomLeft: { bottom: 2, left: 2 },
  bottomRight: { bottom: 2, right: 2 },

  rollBtn: {
    backgroundColor: '#E94560',
    paddingVertical: 16,
    paddingHorizontal: 64,
    borderRadius: 50,
    shadowColor: '#E94560',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  rollText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
