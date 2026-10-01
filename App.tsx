import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  StatusBar,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import * as Location from 'expo-location';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// --- CẤU HÌNH & HẰNG SỐ (THEO FLUTTER LAB 9 CLIMA) ---
const OPEN_WEATHER_API_KEY = 'b6907d289e10d714a6e88b30761fae22'; // Demo API key
const OPEN_WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Bảng màu giao diện hiện đại phong cách Clima Dark Sky
const THEME = {
  background: '#0F172A', // Nền xanh đêm đậm
  cardBg: '#1E293B',     // Card xám đen xanh
  cardBorder: '#334155',
  accent: '#38BDF8',     // Xanh dương sáng (Sky Blue)
  accentGlow: 'rgba(56, 189, 248, 0.15)',
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  warning: '#F59E0B',
};

// Cấu trúc dữ liệu thời tiết
interface WeatherData {
  cityName: string;
  country: string;
  temp: number;
  condition: number;
  description: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  iconEmoji: string;
  message: string;
  isMock?: boolean;
}

// Dữ liệu mô phỏng dự phòng khi offline hoặc không có GPS/API key
const MOCK_WEATHER_DATABASE: Record<string, WeatherData> = {
  hanoi: {
    cityName: 'Hà Nội',
    country: 'VN',
    temp: 28,
    condition: 801,
    description: 'Có mây nhẹ',
    humidity: 75,
    windSpeed: 3.6,
    feelsLike: 30,
    iconEmoji: '⛅',
    message: 'Thời tiết ấm áp, thích hợp ăn 🍦 tại Hà Nội',
    isMock: true,
  },
  'tp. hồ chí minh': {
    cityName: 'TP. Hồ Chí Minh',
    country: 'VN',
    temp: 33,
    condition: 800,
    description: 'Trời nắng đẹp',
    humidity: 65,
    windSpeed: 4.2,
    feelsLike: 37,
    iconEmoji: '☀️',
    message: 'Trời nắng nóng, hãy uống nhiều nước và thưởng thức 🍦 ở Sài Gòn',
    isMock: true,
  },
  'đà nẵng': {
    cityName: 'Đà Nẵng',
    country: 'VN',
    temp: 29,
    condition: 500,
    description: 'Mưa rào nhẹ',
    humidity: 82,
    windSpeed: 4.8,
    feelsLike: 32,
    iconEmoji: '🌧️',
    message: 'Có thể có mưa, hãy mang theo ☔ khi ra ngoài',
    isMock: true,
  },
  tokyo: {
    cityName: 'Tokyo',
    country: 'JP',
    temp: 18,
    condition: 802,
    description: 'Nhiều mây',
    humidity: 62,
    windSpeed: 3.1,
    feelsLike: 18,
    iconEmoji: '☁️',
    message: 'Thời tiết mát mẻ, mang theo áo khoác nhẹ 🧥 nhé',
    isMock: true,
  },
  london: {
    cityName: 'London',
    country: 'GB',
    temp: 13,
    condition: 300,
    description: 'Mưa phùn sương mù',
    humidity: 88,
    windSpeed: 5.5,
    feelsLike: 11,
    iconEmoji: '🌧️',
    message: 'Trời se lạnh, nhớ mang theo 🧥 và ☔ tại London',
    isMock: true,
  },
  paris: {
    cityName: 'Paris',
    country: 'FR',
    temp: 16,
    condition: 800,
    description: 'Nắng nhẹ dịu mát',
    humidity: 58,
    windSpeed: 2.9,
    feelsLike: 16,
    iconEmoji: '☀️',
    message: 'Thời tiết mùa thu lãng mạn tại Paris 🥖',
    isMock: true,
  },
  'new york': {
    cityName: 'New York',
    country: 'US',
    temp: 22,
    condition: 803,
    description: 'Mây rải rác',
    humidity: 50,
    windSpeed: 6.2,
    feelsLike: 22,
    iconEmoji: '⛅',
    message: 'Nhiệt độ dễ chịu để dạo phố 👕',
    isMock: true,
  },
};

// --- CLASS WEATHER MODEL (TƯƠNG ĐƯƠNG VỚI WEATHER_MODEL.DART TRONG FLUTTER) ---
class WeatherModel {
  static getWeatherIcon(condition: number): string {
    if (condition < 300) return '🌩️'; // Dông bão
    if (condition < 400) return '🌧️'; // Mưa phùn
    if (condition < 600) return '☔';  // Mưa rào
    if (condition < 700) return '☃️';  // Tuyết rơi
    if (condition < 800) return '🌫️'; // Sương mù / khói bụi
    if (condition === 800) return '☀️'; // Trời quang đãng
    if (condition <= 804) return '☁️'; // Nhiều mây
    return '🤷‍';
  }

  static getMessage(temp: number, cityName: string): string {
    if (temp > 28) {
      return `Trời nóng bức, thưởng thức 🍦 cực đã ở ${cityName}`;
    } else if (temp > 20) {
      return `Thời tiết ấm áp, thích hợp mặc áo cộc 👕 tại ${cityName}`;
    } else if (temp < 15) {
      return `Trời lạnh, nhớ mang 🧣 và găng tay 🧤 khi ở ${cityName}`;
    } else {
      return `Thời tiết mát mẻ, mang theo áo khoác nhẹ 🧥 nhé`;
    }
  }

  static parseWeatherData(data: any): WeatherData {
    const temp = Math.round(data.main?.temp ?? 25);
    const condition = data.weather?.[0]?.id ?? 800;
    const cityName = data.name || 'Không xác định';
    const country = data.sys?.country || '';
    const description =
      data.weather?.[0]?.description?.toUpperCase() || 'BÌNH THƯỜNG';
    const humidity = data.main?.humidity ?? 70;
    const windSpeed = data.wind?.speed ?? 3.5;
    const feelsLike = Math.round(data.main?.feels_like ?? temp);

    return {
      cityName,
      country,
      temp,
      condition,
      description,
      humidity,
      windSpeed,
      feelsLike,
      iconEmoji: this.getWeatherIcon(condition),
      message: this.getMessage(temp, cityName),
      isMock: false,
    };
  }
}

// --- APP CHÍNH ---
export default function App() {
  // Trạng thái màn hình: 'loading' | 'location' | 'city'
  const [currentScreen, setCurrentScreen] = useState<'loading' | 'location' | 'city'>('loading');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [cityInput, setCityInput] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [statusNote, setStatusNote] = useState<string>('Đang định vị GPS...');

  // Lấy dữ liệu thời tiết ban đầu khi mở app (tương đương initState trong Flutter)
  useEffect(() => {
    fetchCurrentLocationWeather();
  }, []);

  // 1. LẤY THỜI TIẾT TỪ VỊ TRÍ HIỆN TẠI (GPS / GEOLOCATION)
  const fetchCurrentLocationWeather = async () => {
    setCurrentScreen('loading');
    setStatusNote('Đang yêu cầu quyền định vị GPS...');

    try {
      // Yêu cầu quyền truy cập vị trí
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setStatusNote('Không có quyền GPS, sử dụng dữ liệu mặc định...');
        loadFallbackCity('hanoi');
        return;
      }

      setStatusNote('Đang xác định tọa độ GPS...');
      // Lấy tọa độ GPS thiết bị với timeout an toàn
      const locationPromise = Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const timeoutPromise = new Promise<null>((resolve) =>
        setTimeout(() => resolve(null), 6000)
      );

      const location = await Promise.race([locationPromise, timeoutPromise]);

      if (!location) {
        setStatusNote('GPS quá hạn, chuyển sang chế độ mẫu...');
        loadFallbackCity('hanoi');
        return;
      }

      const { latitude, longitude } = location.coords;
      setStatusNote(`Đang tải thời tiết (${latitude.toFixed(2)}, ${longitude.toFixed(2)})...`);

      // Gọi OpenWeatherMap API
      const url = `${OPEN_WEATHER_BASE_URL}?lat=${latitude}&lon=${longitude}&appid=${OPEN_WEATHER_API_KEY}&units=metric&lang=vi`;
      const response = await fetch(url);

      if (response.ok) {
        const json = await response.json();
        setWeatherData(WeatherModel.parseWeatherData(json));
        setCurrentScreen('location');
      } else {
        // Fallback nếu API key chưa active hoặc lỗi 401
        loadFallbackCity('hanoi');
      }
    } catch (err) {
      console.log('Location/Weather fetch error:', err);
      loadFallbackCity('hanoi');
    }
  };

  // 2. LẤY THỜI TIẾT THEO TÊN THÀNH PHỐ
  const fetchCityWeather = async (cityNameToFetch: string) => {
    const trimmed = cityNameToFetch.trim().toLowerCase();
    if (!trimmed) {
      Alert.alert('Thông báo', 'Vui lòng nhập tên thành phố cần tra cứu.');
      return;
    }

    setIsSearching(true);

    try {
      const url = `${OPEN_WEATHER_BASE_URL}?q=${encodeURIComponent(
        trimmed
      )}&appid=${OPEN_WEATHER_API_KEY}&units=metric&lang=vi`;
      const response = await fetch(url);

      if (response.ok) {
        const json = await response.json();
        setWeatherData(WeatherModel.parseWeatherData(json));
        setCurrentScreen('location');
        setCityInput('');
      } else {
        // Nếu API lỗi, kiểm tra trong Mock Database
        if (MOCK_WEATHER_DATABASE[trimmed]) {
          setWeatherData(MOCK_WEATHER_DATABASE[trimmed]);
          setCurrentScreen('location');
          setCityInput('');
        } else {
          // Tạo dữ liệu ngẫu nhiên hợp lý cho thành phố người dùng tìm
          const fallbackData: WeatherData = {
            cityName: cityNameToFetch.charAt(0).toUpperCase() + cityNameToFetch.slice(1),
            country: '🌐',
            temp: Math.floor(Math.random() * 15) + 20, // 20 - 35°C
            condition: 800,
            description: 'TRỜI NẮNG ĐẸP',
            humidity: Math.floor(Math.random() * 30) + 50,
            windSpeed: Number((Math.random() * 4 + 2).toFixed(1)),
            feelsLike: Math.floor(Math.random() * 15) + 22,
            iconEmoji: '☀️',
            message: WeatherModel.getMessage(25, cityNameToFetch),
            isMock: true,
          };
          setWeatherData(fallbackData);
          setCurrentScreen('location');
          setCityInput('');
        }
      }
    } catch (error) {
      if (MOCK_WEATHER_DATABASE[trimmed]) {
        setWeatherData(MOCK_WEATHER_DATABASE[trimmed]);
      } else {
        Alert.alert('Lỗi', 'Không thể kết nối mạng. Đang mở dữ liệu mô phỏng.');
        loadFallbackCity('hanoi');
      }
      setCurrentScreen('location');
    } finally {
      setIsSearching(false);
    }
  };

  // Nạp dữ liệu thành phố dự phòng
  const loadFallbackCity = (cityKey: string) => {
    const mock = MOCK_WEATHER_DATABASE[cityKey] || MOCK_WEATHER_DATABASE['hanoi'];
    setWeatherData(mock);
    setCurrentScreen('location');
  };

  // ================= 1. MÀN HÌNH LOADING (LOADING SCREEN) =================
  if (currentScreen === 'loading') {
    return (
      <View style={styles.centerContainer}>
        <StatusBar barStyle="light-content" backgroundColor={THEME.background} />
        <ActivityIndicator size="large" color={THEME.accent} style={{ transform: [{ scale: 1.4 }] }} />
        <Text style={styles.loadingTitle}>🌦️ Clima Weather</Text>
        <Text style={styles.loadingSubtext}>{statusNote}</Text>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => loadFallbackCity('hanoi')}
          activeOpacity={0.8}
        >
          <Text style={styles.skipButtonText}>Vào thẳng ứng dụng ➔</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ================= 2. MÀN HÌNH TÌM KIẾM THÀNH PHỐ (CITY SCREEN) =================
  if (currentScreen === 'city') {
    const popularCities = ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Tokyo', 'London', 'Paris', 'New York'];

    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <StatusBar barStyle="light-content" backgroundColor={THEME.background} />

        {/* Thanh AppBar */}
        <View style={styles.appBar}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setCurrentScreen('location')}
          >
            <Ionicons name="arrow-back" size={28} color={THEME.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.appBarTitle}>Tìm kiếm thành phố</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.cityScreenContent} keyboardShouldPersistTaps="handled">
          {/* Ô nhập tên thành phố */}
          <View style={styles.searchBoxContainer}>
            <Ionicons name="search" size={22} color={THEME.accent} style={styles.searchIcon} />
            <TextInput
              style={styles.cityTextInput}
              placeholder="Nhập tên thành phố (vd: Hanoi, Tokyo...)"
              placeholderTextColor={THEME.textMuted}
              value={cityInput}
              onChangeText={setCityInput}
              onSubmitEditing={() => fetchCityWeather(cityInput)}
              returnKeyType="search"
              autoFocus={true}
            />
            {cityInput.length > 0 && (
              <TouchableOpacity onPress={() => setCityInput('')}>
                <Ionicons name="close-circle" size={20} color={THEME.textMuted} />
              </TouchableOpacity>
            )}
          </View>

          {/* Nút Tìm kiếm */}
          <TouchableOpacity
            style={styles.searchActionButton}
            onPress={() => fetchCityWeather(cityInput)}
            disabled={isSearching}
            activeOpacity={0.8}
          >
            {isSearching ? (
              <ActivityIndicator color="#0F172A" />
            ) : (
              <Text style={styles.searchActionText}>🔍 LẤY THỜI TIẾT</Text>
            )}
          </TouchableOpacity>

          {/* Gợi ý các thành phố phổ biến */}
          <Text style={styles.suggestionTitle}>Thành phố phổ biến:</Text>
          <View style={styles.chipsContainer}>
            {popularCities.map((city) => (
              <TouchableOpacity
                key={city}
                style={styles.chipButton}
                onPress={() => fetchCityWeather(city)}
                activeOpacity={0.7}
              >
                <Text style={styles.chipText}>{city}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  // ================= 3. MÀN HÌNH CHÍNH (LOCATION SCREEN) =================
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.background} />

      {/* Top Header Bar */}
      <View style={styles.appBar}>
        {/* Nút cập nhật lại vị trí GPS */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={fetchCurrentLocationWeather}
          activeOpacity={0.7}
        >
          <Ionicons name="navigate" size={26} color={THEME.accent} />
        </TouchableOpacity>

        {/* Tên thành phố */}
        <View style={styles.headerCityBox}>
          <Text style={styles.headerCityName}>
            📍 {weatherData?.cityName} {weatherData?.country ? `(${weatherData.country})` : ''}
          </Text>
          {weatherData?.isMock && (
            <Text style={styles.mockTag}>Chế độ mô phỏng</Text>
          )}
        </View>

        {/* Nút chuyển sang màn hình tìm kiếm thành phố */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setCurrentScreen('city')}
          activeOpacity={0.7}
        >
          <Ionicons name="search" size={26} color={THEME.accent} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.weatherContent} bounces={false}>
        {/* Khối hiển thị Nhiệt độ & Biểu tượng chính */}
        <View style={styles.heroWeatherBox}>
          <Text style={styles.heroEmoji}>{weatherData?.iconEmoji}</Text>
          <Text style={styles.heroTemp}>{weatherData?.temp}°</Text>
          <Text style={styles.heroDesc}>{weatherData?.description}</Text>
        </View>

        {/* Khối thông số chi tiết (Độ ẩm, Gió, Cảm nhận) */}
        <View style={styles.detailsRow}>
          {/* Cảm nhận */}
          <View style={styles.detailCard}>
            <MaterialCommunityIcons name="thermometer" size={24} color={THEME.accent} />
            <Text style={styles.detailLabel}>Cảm giác như</Text>
            <Text style={styles.detailValue}>{weatherData?.feelsLike}°C</Text>
          </View>

          {/* Độ ẩm */}
          <View style={styles.detailCard}>
            <Ionicons name="water-outline" size={24} color={THEME.accent} />
            <Text style={styles.detailLabel}>Độ ẩm</Text>
            <Text style={styles.detailValue}>{weatherData?.humidity}%</Text>
          </View>

          {/* Tốc độ gió */}
          <View style={styles.detailCard}>
            <MaterialCommunityIcons name="weather-windy" size={24} color={THEME.accent} />
            <Text style={styles.detailLabel}>Tốc độ gió</Text>
            <Text style={styles.detailValue}>{weatherData?.windSpeed} m/s</Text>
          </View>
        </View>

        {/* Khối lời khuyên thời tiết Clima Message */}
        <View style={styles.messageCard}>
          <Text style={styles.messageQuote}>“</Text>
          <Text style={styles.messageText}>{weatherData?.message}</Text>
        </View>
      </ScrollView>

      {/* Nút chuyển thành phố nhanh ở chân màn hình */}
      <View style={styles.footerContainer}>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => setCurrentScreen('city')}
          activeOpacity={0.85}
        >
          <Ionicons name="business-outline" size={20} color="#0F172A" style={{ marginRight: 8 }} />
          <Text style={styles.footerButtonText}>CHỌN THÀNH PHỐ KHÁC</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// --- STYLESHEET (GIAO DIỆN HIỆN ĐẠI, KHÔNG CẢNH BÁO DEPRECATED) ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 44,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: THEME.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  loadingTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: THEME.textPrimary,
    marginTop: 24,
    letterSpacing: 1,
  },
  loadingSubtext: {
    fontSize: 15,
    color: THEME.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  skipButton: {
    marginTop: 36,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: THEME.cardBg,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
  },
  skipButtonText: {
    color: THEME.accent,
    fontWeight: '600',
    fontSize: 14,
  },

  // App Bar Top
  appBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: THEME.cardBorder,
  },
  iconButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: THEME.cardBg,
  },
  headerCityBox: {
    alignItems: 'center',
  },
  headerCityName: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME.textPrimary,
  },
  mockTag: {
    fontSize: 11,
    color: THEME.warning,
    fontWeight: '600',
    marginTop: 2,
  },
  appBarTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME.textPrimary,
  },

  // Weather Screen Body
  weatherContent: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'center',
  },
  heroWeatherBox: {
    alignItems: 'center',
    marginVertical: 18,
  },
  heroEmoji: {
    fontSize: 78,
    marginBottom: 6,
  },
  heroTemp: {
    fontSize: 88,
    fontWeight: '900',
    color: THEME.textPrimary,
    letterSpacing: -2,
  },
  heroDesc: {
    fontSize: 18,
    fontWeight: '600',
    color: THEME.accent,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },

  // Details Row
  detailsRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 10,
    marginVertical: 18,
  },
  detailCard: {
    flex: 1,
    backgroundColor: THEME.cardBg,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.cardBorder,
  },
  detailLabel: {
    fontSize: 12,
    color: THEME.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.textPrimary,
    marginTop: 4,
  },

  // Message Card (Clima Quote)
  messageCard: {
    width: '100%',
    backgroundColor: THEME.cardBg,
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
    borderLeftWidth: 4,
    borderLeftColor: THEME.accent,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
  },
  messageQuote: {
    fontSize: 32,
    color: THEME.accent,
    lineHeight: 28,
    fontWeight: '900',
  },
  messageText: {
    fontSize: 18,
    color: THEME.textPrimary,
    lineHeight: 28,
    fontWeight: '500',
  },

  // Footer Button
  footerContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: THEME.cardBorder,
    backgroundColor: THEME.background,
  },
  footerButton: {
    backgroundColor: THEME.accent,
    height: 54,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: THEME.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  footerButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 1,
  },

  // City Screen Styles
  cityScreenContent: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  searchBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.cardBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    paddingHorizontal: 14,
    height: 52,
  },
  searchIcon: {
    marginRight: 10,
  },
  cityTextInput: {
    flex: 1,
    color: THEME.textPrimary,
    fontSize: 16,
  },
  searchActionButton: {
    backgroundColor: THEME.accent,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  searchActionText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 1,
  },
  suggestionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: THEME.textSecondary,
    marginTop: 28,
    marginBottom: 12,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chipButton: {
    backgroundColor: THEME.cardBg,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
  },
  chipText: {
    color: THEME.textPrimary,
    fontSize: 14,
    fontWeight: '500',
  },
});
