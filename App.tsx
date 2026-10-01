import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  ImageBackground,
} from 'react-native';

// Cấu trúc dữ liệu cho câu chuyện
interface StoryNode {
  storyText: string;
  choice1: string;
  choice1Destination: number;
  choice2: string;
  choice2Destination: number;
}

// Dữ liệu câu chuyện - "Choose Your Own Adventure"
const storyData: (StoryNode | { storyText: string })[] = [
  {
    // Story 0
    storyText:
      'Your car has blown a tire on a winding road in the middle of nowhere with no cell phone reception. You decide to hitchhike. A rusty pickup truck rumbles to a stop next to you. A man with a bytes of chewing tobacco hops out.',
    choice1: 'I\'ll hop in the back.',
    choice1Destination: 2,
    choice2: 'I\'ll push my car to the nearest town.',
    choice2Destination: 1,
  },
  {
    // Story 1
    storyText:
      'You start pushing your car. After a few hours, you see a town in the distance. As you get closer, you notice it seems abandoned. A cold wind blows through the empty streets.',
    choice1: 'Explore the ghost town.',
    choice1Destination: 3,
    choice2: 'Keep pushing to the next town.',
    choice2Destination: 4,
  },
  {
    // Story 2
    storyText:
      'You jump in the back of the truck. The man drives you to a fork in the road. He tells you he can take you to the left where there\'s a small town, or to the right where there\'s a shortcut through the woods.',
    choice1: 'Go left to the town.',
    choice1Destination: 5,
    choice2: 'Go right through the woods.',
    choice2Destination: 3,
  },
  {
    // Story 3 - ENDING
    storyText:
      '💀 You find yourself lost in a dark and eerie place. Strange noises surround you. You never find your way back. THE END.',
  },
  {
    // Story 4 - ENDING
    storyText:
      '🏆 After hours of walking, you finally reach a friendly town. The locals help you fix your tire and you continue your journey safely. Congratulations! THE END.',
  },
  {
    // Story 5
    storyText:
      'You arrive at a small town. A kind old lady offers you a place to stay for the night. In the morning, she gives you two options for getting back to your car.',
    choice1: 'Call a tow truck.',
    choice1Destination: 6,
    choice2: 'Walk back with a spare tire she offers.',
    choice2Destination: 4,
  },
  {
    // Story 6 - ENDING
    storyText:
      '🚗 The tow truck arrives and fixes your car on the spot. You thank the old lady and drive off into the sunset. What a great adventure! THE END.',
  },
];

// Kiểm tra xem story có phải là ending không
const isEnding = (index: number): boolean => {
  const story = storyData[index];
  return !('choice1' in story);
};

export default function App() {
  const [storyIndex, setStoryIndex] = useState(0);

  const currentStory = storyData[storyIndex];

  // Xử lý khi người dùng chọn lựa chọn
  const makeChoice = (destination: number) => {
    setStoryIndex(destination);
  };

  // Restart lại câu chuyện
  const restart = () => {
    setStoryIndex(0);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Tiêu đề */}
      <Text style={styles.title}>📖 Destini</Text>
      <Text style={styles.subtitle}>Choose Your Own Adventure</Text>

      {/* Nội dung câu chuyện */}
      <View style={styles.storyCard}>
        <Text style={styles.storyText}>{currentStory.storyText}</Text>
      </View>

      {/* Các lựa chọn hoặc nút Restart */}
      {isEnding(storyIndex) ? (
        <TouchableOpacity
          style={styles.restartBtn}
          onPress={restart}
          activeOpacity={0.8}
        >
          <Text style={styles.btnText}>🔄 Restart Story</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.choicesContainer}>
          <TouchableOpacity
            style={[styles.choiceBtn, styles.choice1Btn]}
            onPress={() =>
              makeChoice((currentStory as StoryNode).choice1Destination)
            }
            activeOpacity={0.8}
          >
            <Text style={styles.choiceBtnText}>
              {(currentStory as StoryNode).choice1}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.choiceBtn, styles.choice2Btn]}
            onPress={() =>
              makeChoice((currentStory as StoryNode).choice2Destination)
            }
            activeOpacity={0.8}
          >
            <Text style={styles.choiceBtnText}>
              {(currentStory as StoryNode).choice2}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B1B2F',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#E43F5A',
    marginBottom: 4,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    color: '#E43F5A',
    opacity: 0.7,
    marginBottom: 36,
  },
  storyCard: {
    backgroundColor: '#162447',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    minHeight: 200,
    justifyContent: 'center',
    marginBottom: 32,
    borderLeftWidth: 4,
    borderLeftColor: '#E43F5A',
    shadowColor: '#E43F5A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  storyText: {
    fontSize: 18,
    color: '#FFFFFF',
    lineHeight: 28,
    fontWeight: '400',
  },
  choicesContainer: {
    width: '100%',
    gap: 12,
  },
  choiceBtn: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  choice1Btn: {
    backgroundColor: '#E43F5A',
  },
  choice2Btn: {
    backgroundColor: '#1F4068',
    borderWidth: 2,
    borderColor: '#E43F5A',
  },
  choiceBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  btnText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  restartBtn: {
    backgroundColor: '#E43F5A',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 50,
    shadowColor: '#E43F5A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
});
