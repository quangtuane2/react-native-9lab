import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Alert,
  ScrollView,
} from 'react-native';

// Danh sách câu hỏi True/False
const quizData = [
  { question: 'The Great Wall of China is visible from space.', answer: false },
  { question: 'The human body has 206 bones.', answer: true },
  { question: 'Lightning never strikes the same place twice.', answer: false },
  { question: 'The Earth is approximately 4.5 billion years old.', answer: true },
  { question: 'Sharks are mammals.', answer: false },
  { question: 'Mount Everest is the tallest mountain in the world.', answer: true },
  { question: 'The Pacific Ocean is the largest ocean on Earth.', answer: true },
  { question: 'Humans use only 10% of their brain.', answer: false },
  { question: 'Venus is the hottest planet in our solar system.', answer: true },
  { question: 'Octopuses have three hearts.', answer: true },
  { question: 'Sound travels faster than light.', answer: false },
  { question: 'A group of flamingos is called a "flamboyance".', answer: true },
  { question: 'The Sahara is the largest desert in the world.', answer: false },
];

export default function App() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [scoreHistory, setScoreHistory] = useState<boolean[]>([]);

  const currentQuestion = quizData[questionIndex];

  // Xử lý logic khi người dùng chọn đáp án
  const checkAnswer = (userAnswer: boolean) => {
    const isCorrect = userAnswer === currentQuestion.answer;

    setScoreHistory([...scoreHistory, isCorrect]);

    if (isCorrect) {
      setScore(score + 1);
    }

    // Chuyển sang câu hỏi tiếp theo
    if (questionIndex + 1 < quizData.length) {
      setQuestionIndex(questionIndex + 1);
    } else {
      // Hết câu hỏi → hiển thị kết quả
      const finalScore = isCorrect ? score + 1 : score;
      Alert.alert(
        '🎉 Quiz Completed!',
        `Your score: ${finalScore}/${quizData.length}`,
        [
          {
            text: 'Restart',
            onPress: () => {
              setQuestionIndex(0);
              setScore(0);
              setScoreHistory([]);
            },
          },
        ],
      );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Tiêu đề */}
      <Text style={styles.title}>❓ Quizzler</Text>

      {/* Số thứ tự câu hỏi */}
      <Text style={styles.progress}>
        Question {questionIndex + 1}/{quizData.length}
      </Text>

      {/* Câu hỏi */}
      <View style={styles.questionCard}>
        <Text style={styles.questionText}>{currentQuestion.question}</Text>
      </View>

      {/* Nút True / False */}
      <TouchableOpacity
        style={[styles.answerBtn, styles.trueBtn]}
        onPress={() => checkAnswer(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.answerText}>✅ True</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.answerBtn, styles.falseBtn]}
        onPress={() => checkAnswer(false)}
        activeOpacity={0.8}
      >
        <Text style={styles.answerText}>❌ False</Text>
      </TouchableOpacity>

      {/* Điểm số */}
      <Text style={styles.scoreText}>Score: {score}</Text>

      {/* Lịch sử trả lời */}
      <ScrollView horizontal style={styles.historyRow} showsHorizontalScrollIndicator={false}>
        {scoreHistory.map((isCorrect, index) => (
          <Text key={index} style={styles.historyIcon}>
            {isCorrect ? '✅' : '❌'}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C003E',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#E040FB',
    marginBottom: 8,
    letterSpacing: 1,
  },
  progress: {
    fontSize: 16,
    color: '#CE93D8',
    marginBottom: 32,
    opacity: 0.8,
  },
  questionCard: {
    backgroundColor: '#4A0072',
    borderRadius: 16,
    padding: 28,
    width: '100%',
    minHeight: 160,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    shadowColor: '#E040FB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  questionText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 32,
  },
  answerBtn: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  trueBtn: {
    backgroundColor: '#00C853',
  },
  falseBtn: {
    backgroundColor: '#FF1744',
  },
  answerText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#E040FB',
    marginTop: 16,
    marginBottom: 8,
  },
  historyRow: {
    flexDirection: 'row',
    maxHeight: 30,
    marginTop: 4,
  },
  historyIcon: {
    fontSize: 18,
    marginHorizontal: 2,
  },
});
