import { StyleSheet, Text, View, Image, TouchableOpacity, Linking, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const handlePhone = () => Linking.openURL('tel:0976781028');
  const handleEmail = () => Linking.openURL('mailto:quangtuan.e2@gmail.com');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Avatar */}
      <View style={styles.avatarWrapper}>
        <Image
          source={require('./assets/avatar.png')}
          style={styles.avatar}
        />
      </View>

      {/* Tên */}
      <Text style={styles.name}>QuangTuan E2</Text>

      {/* Chức danh */}
      <Text style={styles.title}>React Native Developer</Text>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Nút điện thoại */}
      <TouchableOpacity style={styles.contactBtn} onPress={handlePhone} activeOpacity={0.8}>
        <Text style={styles.contactIcon}>📞</Text>
        <Text style={styles.contactText}>0976 781 028</Text>
      </TouchableOpacity>

      {/* Nút email */}
      <TouchableOpacity style={styles.contactBtn} onPress={handleEmail} activeOpacity={0.8}>
        <Text style={styles.contactIcon}>✉️</Text>
        <Text style={styles.contactText}>quangtuan.e2@gmail.com</Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#46a1deff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  avatarWrapper: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 3,
    borderColor: '#7B61FF',
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#7B61FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 10,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  name: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    color: '#f86714ff',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 32,
  },
  divider: {
    width: '80%',
    height: 1,
    backgroundColor: '#2D2D4E',
    marginBottom: 32,
  },
  contactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16213E',
    borderWidth: 1,
    borderColor: '#2D2D4E',
    borderRadius: 50,
    paddingVertical: 14,
    paddingHorizontal: 28,
    width: '100%',
    marginBottom: 16,
  },
  contactIcon: {
    fontSize: 20,
    marginRight: 16,
  },
  contactText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
});
