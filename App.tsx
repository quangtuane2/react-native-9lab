import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
} from 'react-native';

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />

      {/* Header / AppBar */}
      <View style={styles.appBar}>
        <Text style={styles.appBarTitle}>I Am Rich</Text>
      </View>

      {/* Body */}
      <View style={styles.body}>
        <Image
          source={require('./assets/diamond.jpg')}
          style={styles.diamond}
          resizeMode="contain"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#eeeeecff',
  },
  appBar: {
    height: 56,
    backgroundColor: '#FF9500',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  appBarTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  body: {
    flex: 1,
    backgroundColor: '#3ab7dcff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  diamond: {
    width: 400,
    height: 400,
  },
});
