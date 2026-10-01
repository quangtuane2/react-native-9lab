import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { FontAwesome, Ionicons } from '@expo/vector-icons';

const COLORS = {
  primary: '#0A0E21',
  activeCard: '#1D1E33',
  inactiveCard: '#111328',
  accentPink: '#EB1555',
  accentPinkAlpha: 'rgba(235, 21, 85, 0.2)',
  textSecondary: '#8D8E98',
  textWhite: '#FFFFFF',
  roundBtn: '#4C4F5E',
  roundBtnPressed: '#5C5F6E',
  successGreen: '#24D876',
  warningOrange: '#FF9F1A',
  dangerRed: '#FF4D4D',
};

// Enum giới tính
enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

// Logic tính toán BMI (Mô phỏng class CalculatorBrain trong Flutter)
interface BMIResult {
  bmi: string;
  result: string;
  resultColor: string;
  interpretation: string;
}

class CalculatorBrain {
  height: number; // cm
  weight: number; // kg

  constructor(height: number, weight: number) {
    this.height = height;
    this.weight = weight;
  }

  calculate(): BMIResult {
    const heightInMeters = this.height / 100;
    const bmiValue = this.weight / (heightInMeters * heightInMeters);
    const bmiStr = bmiValue.toFixed(1);

    if (bmiValue >= 30) {
      return {
        bmi: bmiStr,
        result: 'BÉO PHÌ (OBESE)',
        resultColor: COLORS.dangerRed,
        interpretation:
          'Chỉ số BMI của bạn ở mức béo phì. Hãy điều chỉnh chế độ ăn uống khoa học và tăng cường tập luyện thể dục thường xuyên!',
      };
    } else if (bmiValue >= 25) {
      return {
        bmi: bmiStr,
        result: 'THỪA CÂN (OVERWEIGHT)',
        resultColor: COLORS.warningOrange,
        interpretation:
          'Chỉ số khối cơ thể của bạn cao hơn bình thường. Bạn nên tăng cường vận động thể thao và kiểm soát lượng calo nạp vào.',
      };
    } else if (bmiValue >= 18.5) {
      return {
        bmi: bmiStr,
        result: 'BÌNH THƯỜNG (NORMAL)',
        resultColor: COLORS.successGreen,
        interpretation:
          'Tuyệt vời! Bạn đang có chỉ số khối cơ thể lý tưởng. Hãy tiếp tục duy trì lối sống lành mạnh này nhé!',
      };
    } else {
      return {
        bmi: bmiStr,
        result: 'GẦY (UNDERWEIGHT)',
        resultColor: COLORS.warningOrange,
        interpretation:
          'Chỉ số BMI của bạn thấp hơn mức bình thường. Bạn nên bổ sung dinh dưỡng đầy đủ và có kế hoạch tăng cân hợp lý.',
      };
    }
  }
}

// COMPONENT TÁI SỬ DỤNG: Nút bấm tròn (+ / -) 
interface RoundIconButtonProps {
  icon: 'plus' | 'minus';
  onPress: () => void;
}

const RoundIconButton = ({ icon, onPress }: RoundIconButtonProps) => {
  return (
    <TouchableOpacity
      style={styles.roundButton}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <FontAwesome name={icon} size={20} color={COLORS.textWhite} />
    </TouchableOpacity>
  );
};

// COMPONENT TÁI SỬ DỤNG: Nút lớn đáy màn hình
interface BottomButtonProps {
  title: string;
  onPress: () => void;
}

const BottomButton = ({ title, onPress }: BottomButtonProps) => {
  return (
    <TouchableOpacity
      style={styles.bottomButton}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Text style={styles.bottomButtonText}>{title}</Text>
    </TouchableOpacity>
  );
};

//  APP CHÍNH
export default function App() {
  const [gender, setGender] = useState<Gender>(Gender.MALE);
  const [height, setHeight] = useState<number>(175);
  const [weight, setWeight] = useState<number>(65);
  const [age, setAge] = useState<number>(22);

  // Điều hướng màn hình: false = InputScreen, true = ResultScreen
  const [showResult, setShowResult] = useState<boolean>(false);
  const [resultData, setResultData] = useState<BMIResult | null>(null);

  // Xử lý tính toán
  const handleCalculate = () => {
    const calc = new CalculatorBrain(height, weight);
    setResultData(calc.calculate());
    setShowResult(true);
  };

  // Quay lại màn hình nhập liệu
  const handleRecalculate = () => {
    setShowResult(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Header Top Bar */}
      <View style={styles.appBar}>
        {showResult && (
          <TouchableOpacity
            onPress={handleRecalculate}
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.textWhite} />
          </TouchableOpacity>
        )}
        <Text style={styles.appBarTitle}>BMI CALCULATOR</Text>
      </View>

      {!showResult ? (
        /* MÀN HÌNH NHẬP LIỆU (INPUT SCREEN)  */
        <View style={styles.contentContainer}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            bounces={false}
          >
            {/* ROW 1: Giới tính Nam / Nữ */}
            <View style={styles.row}>
              {/* Thẻ Nam */}
              <TouchableOpacity
                style={[
                  styles.card,
                  styles.halfCard,
                  {
                    backgroundColor:
                      gender === Gender.MALE
                        ? COLORS.activeCard
                        : COLORS.inactiveCard,
                    borderColor:
                      gender === Gender.MALE
                        ? COLORS.accentPink
                        : 'transparent',
                    borderWidth: gender === Gender.MALE ? 1.5 : 0,
                  },
                ]}
                onPress={() => setGender(Gender.MALE)}
                activeOpacity={0.8}
              >
                <FontAwesome
                  name="mars"
                  size={65}
                  color={
                    gender === Gender.MALE
                      ? COLORS.accentPink
                      : COLORS.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.cardLabel,
                    gender === Gender.MALE && styles.cardLabelActive,
                  ]}
                >
                  MALE
                </Text>
              </TouchableOpacity>

              {/* Thẻ Nữ */}
              <TouchableOpacity
                style={[
                  styles.card,
                  styles.halfCard,
                  {
                    backgroundColor:
                      gender === Gender.FEMALE
                        ? COLORS.activeCard
                        : COLORS.inactiveCard,
                    borderColor:
                      gender === Gender.FEMALE
                        ? COLORS.accentPink
                        : 'transparent',
                    borderWidth: gender === Gender.FEMALE ? 1.5 : 0,
                  },
                ]}
                onPress={() => setGender(Gender.FEMALE)}
                activeOpacity={0.8}
              >
                <FontAwesome
                  name="venus"
                  size={65}
                  color={
                    gender === Gender.FEMALE
                      ? COLORS.accentPink
                      : COLORS.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.cardLabel,
                    gender === Gender.FEMALE && styles.cardLabelActive,
                  ]}
                >
                  FEMALE
                </Text>
              </TouchableOpacity>
            </View>

            {/* ROW 2: Chiều cao với Slider */}
            <View style={[styles.card, styles.fullCard]}>
              <Text style={styles.cardLabel}>HEIGHT</Text>
              <View style={styles.numberRow}>
                <Text style={styles.bigNumber}>{height}</Text>
                <Text style={styles.unitText}>cm</Text>
              </View>

              <View style={styles.sliderContainer}>
                <Slider
                  style={styles.slider}
                  minimumValue={120}
                  maximumValue={220}
                  step={1}
                  value={height}
                  onValueChange={(val) => setHeight(val)}
                  minimumTrackTintColor={COLORS.accentPink}
                  maximumTrackTintColor={COLORS.textSecondary}
                  thumbTintColor={COLORS.accentPink}
                />
              </View>
            </View>

            {/* ROW 3: Cân nặng & Tuổi */}
            <View style={styles.row}>
              {/* Thẻ Cân nặng */}
              <View style={[styles.card, styles.halfCard]}>
                <Text style={styles.cardLabel}>WEIGHT</Text>
                <View style={styles.numberRow}>
                  <Text style={styles.bigNumber}>{weight}</Text>
                  <Text style={styles.unitText}>kg</Text>
                </View>
                <View style={styles.buttonRow}>
                  <RoundIconButton
                    icon="minus"
                    onPress={() => setWeight((prev) => Math.max(30, prev - 1))}
                  />
                  <RoundIconButton
                    icon="plus"
                    onPress={() => setWeight((prev) => Math.min(200, prev + 1))}
                  />
                </View>
              </View>

              {/* Thẻ Tuổi */}
              <View style={[styles.card, styles.halfCard]}>
                <Text style={styles.cardLabel}>AGE</Text>
                <Text style={styles.bigNumber}>{age}</Text>
                <View style={styles.buttonRow}>
                  <RoundIconButton
                    icon="minus"
                    onPress={() => setAge((prev) => Math.max(5, prev - 1))}
                  />
                  <RoundIconButton
                    icon="plus"
                    onPress={() => setAge((prev) => Math.min(120, prev + 1))}
                  />
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Nút Tính Toán */}
          <BottomButton title="CALCULATE YOUR BMI" onPress={handleCalculate} />
        </View>
      ) : (
        /* MÀN HÌNH KẾT QUẢ (RESULTS SCREEN) */
        <View style={styles.contentContainer}>
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>Your Result</Text>

            <View style={styles.resultCard}>
              {/* Trạng thái phân loại BMI */}
              <Text
                style={[
                  styles.resultCategory,
                  { color: resultData?.resultColor },
                ]}
              >
                {resultData?.result}
              </Text>

              <Text style={styles.bmiValueText}>{resultData?.bmi}</Text>

              <View style={styles.standardRangeBox}>
                <Text style={styles.standardRangeTitle}>
                  Khoảng BMI chuẩn (Normal):
                </Text>
                <Text style={styles.standardRangeValue}>18.5 - 24.9 kg/m²</Text>
              </View>

              {/* Lời khuyên diễn giải */}
              <Text style={styles.interpretationText}>
                {resultData?.interpretation}
              </Text>
            </View>
          </View>

          {/* Nút Tính Lại */}
          <BottomButton title="RE-CALCULATE" onPress={handleRecalculate} />
        </View>
      )}
    </SafeAreaView>
  );
}

// STYLESHEET (CHUẨN MATERIAL DARK DESIGN CỦA FLUTTER LAB 8)
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  appBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderBottomWidth: 1,
    borderBottomColor: '#161A33',
    paddingHorizontal: 16,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    zIndex: 10,
    padding: 6,
  },
  appBarTitle: {
    color: COLORS.textWhite,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
  },
  row: {
    flexDirection: 'row',
    gap: 14,
  },
  card: {
    backgroundColor: COLORS.activeCard,
    borderRadius: 14,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  halfCard: {
    flex: 1,
    minHeight: 155,
  },
  fullCard: {
    width: '100%',
    paddingVertical: 22,
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textSecondary,
    letterSpacing: 1.1,
    marginTop: 10,
  },
  cardLabelActive: {
    color: COLORS.textWhite,
  },
  numberRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 6,
    marginBottom: 4,
  },
  bigNumber: {
    fontSize: 52,
    fontWeight: '900',
    color: COLORS.textWhite,
  },
  unitText: {
    fontSize: 18,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginLeft: 4,
  },
  sliderContainer: {
    width: '100%',
    marginTop: 8,
    paddingHorizontal: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 12,
  },
  roundButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.roundBtn,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  bottomButton: {
    backgroundColor: COLORS.accentPink,
    height: 68,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomButtonText: {
    color: COLORS.textWhite,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 1.5,
  },

  // Style cho màn hình kết quả
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  resultsTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: COLORS.textWhite,
    marginBottom: 18,
  },
  resultCard: {
    flex: 1,
    backgroundColor: COLORS.activeCard,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  resultCategory: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 1.8,
  },
  bmiValueText: {
    fontSize: 84,
    fontWeight: '900',
    color: COLORS.textWhite,
    letterSpacing: -1,
  },
  standardRangeBox: {
    alignItems: 'center',
    gap: 4,
  },
  standardRangeTitle: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontWeight: '500',
  },
  standardRangeValue: {
    color: COLORS.textWhite,
    fontSize: 18,
    fontWeight: '700',
  },
  interpretationText: {
    color: '#D0D2E0',
    fontSize: 17,
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: 12,
  },
});
