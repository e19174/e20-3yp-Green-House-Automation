import { Stack } from 'expo-router';
import { UserProvider } from '../Contexts/UserContext';

export default function RootLayout() {
  return (
    <UserProvider>
      <Stack 
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'rgb(4, 38, 28)' },
        }}
      />
    </UserProvider>
  );
}
