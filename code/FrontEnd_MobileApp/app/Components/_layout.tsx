import { Slot, Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import Header from '../common/Header';
import Footer from '../common/Footer';

export default function RootLayout() {
  return (
     <View style={styles.container}>
      <Header />
      
      <View style={styles.content}>
        <Stack 
          screenOptions={{
            headerShown: false,
          }}
        />
      </View>
      
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    marginTop: 60,
    marginBottom: 55,
    flex: 1
  }
});
