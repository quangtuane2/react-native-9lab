import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useAudioPlayer } from 'expo-audio';

// Cấu hình 7 nốt nhạc xylophone
const noteConfigs = [
  { label: 'C', color: '#FF1744', sound: require('./assets/sounds/note1.wav') },
  { label: 'D', color: '#FF9100', sound: require('./assets/sounds/note2.wav') },
  { label: 'E', color: '#FFEA00', sound: require('./assets/sounds/note3.wav') },
  { label: 'F', color: '#76FF03', sound: require('./assets/sounds/note4.wav') },
  { label: 'G', color: '#00E5FF', sound: require('./assets/sounds/note5.wav') },
  { label: 'A', color: '#2979FF', sound: require('./assets/sounds/note6.wav') },
  { label: 'B', color: '#D500F9', sound: require('./assets/sounds/note7.wav') },
];

// Component cho từng phím đàn
const XylophoneKey = ({
  label,
  color,
  sound,
  width,
}: {
  label: string;
  color: string;
  sound: ReturnType<typeof require>;
  width: number;
}) => {
  const player = useAudioPlayer(sound);

  const playSound = () => {
    player.seekTo(0);
    player.play();
  };

  return (
    <TouchableOpacity
      style={[styles.key, { backgroundColor: color, width }]}
      onPress={playSound}
      activeOpacity={0.7}
    >
      <Text style={styles.keyText}>{label}</Text>
    </TouchableOpacity>
  );
};

const { width: screenWidth } = Dimensions.get('window');

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Tiêu đề */}
      <Text style={styles.title}>🎵 Xylophone</Text>

      {/* Các phím đàn */}
      <View style={styles.keysContainer}>
        {noteConfigs.map((note, index) => {
          // Phím dài nhất ở trên, ngắn dần xuống dưới (giống xylophone thật)
          const keyWidth = screenWidth * 0.85 - index * 20;
          return (
            <XylophoneKey
              key={note.label}
              label={note.label}
              color={note.color}
              sound={note.sound}
              width={keyWidth}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 40,
    letterSpacing: 2,
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  keysContainer: {
    alignItems: 'center',
    gap: 8,
  },
  key: {
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  keyText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
