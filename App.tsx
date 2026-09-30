import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Animated,
  StatusBar,
} from 'react-native';

// Danh sách câu trả lời Magic 8 Ball kinh điển
const answers: string[] = [
  'It is certain',
  'It is decidedly so',
  'Without a doubt',
  'Yes definitely',
  'You may rely on it',
  'As I see it, yes',
  'Most likely',
  'Outlook good',
  'Yes',
  'Signs point to yes',
  'Reply hazy, try again',
  'Ask again later',
  'Better not tell you now',
  'Cannot predict now',
  'Concentrate and ask again',
  "Don't count on it",
  'My reply is no',
  'My sources say no',
  'Outlook not so good',
  'Very doubtful',
];

export default function App() {
  const [answer, setAnswer] = useState('Tap the ball to ask!');
  const shakeAnim = useRef(new Animated.Value(0)).current;

  // Hiệu ứng lắc quả cầu
  const shakeBall = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  // Xử lý logic ngẫu nhiên
  const getAnswer = () => {
    shakeBall();
    const randomIndex = Math.floor(Math.random() * answers.length);
    setAnswer(answers[randomIndex]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Tiêu đề */}
      <Text style={styles.title}>🔮 Magic 8 Ball</Text>
      <Text style={styles.subtitle}>Ask a yes/no question, then tap!</Text>

      {/* Quả cầu Magic 8 Ball */}
      <TouchableOpacity onPress={getAnswer} activeOpacity={0.85}>
        <Animated.View style={[styles.ballContainer, { transform: [{ translateX: shakeAnim }] }]}>
          <Image
            source={require('./assets/magic8ball.jpg')}
            style={styles.ballImage}
          />
          {/* Hình tam giác hiển thị câu trả lời */}
          <View style={styles.answerOverlay}>
            <View style={styles.triangle}>
              <Text style={styles.answerText}>{answer}</Text>
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>

      {/* Nút Ask */}
      <TouchableOpacity style={styles.askBtn} onPress={getAnswer} activeOpacity={0.85}>
        <Text style={styles.askBtnText}>🎱 Ask the Ball</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>Tap the ball or press the button</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A0A2E',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#B794F6',
    marginBottom: 8,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: '#9F7AEA',
    marginBottom: 48,
    opacity: 0.8,
  },
  ballContainer: {
    width: 260,
    height: 260,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 48,
  },
  ballImage: {
    width: 260,
    height: 260,
    borderRadius: 130,
  },
  answerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  triangle: {
    width: 120,
    height: 100,
    backgroundColor: 'rgba(0, 0, 80, 0.85)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  answerText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    textShadowColor: '#B794F6',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  askBtn: {
    backgroundColor: '#6B46C1',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 50,
    shadowColor: '#B794F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  askBtnText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 1,
  },
  footer: {
    marginTop: 24,
    fontSize: 13,
    color: '#9F7AEA',
    opacity: 0.6,
  },
});
