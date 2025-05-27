import { Stack } from 'expo-router';
import { UserProvider } from '../Contexts/UserContext';
import { ThemeProvider } from '../Contexts/ThemeContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
    <UserProvider>
      <Stack 
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'rgb(4, 38, 28)' },
        }}
        />
    </UserProvider>
    </ThemeProvider>
  );
}
