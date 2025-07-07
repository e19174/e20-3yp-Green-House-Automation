import { Stack } from 'expo-router';
import { UserProvider } from '../Contexts/UserContext';
import { ThemeProvider } from '../Contexts/ThemeContext';
import { DeviceContextProvider } from '../Contexts/DeviceContext';
import { PlantContextProvider } from '../Contexts/PlantContext';
// import { ClerkProvider } from '@clerk/clerk-expo';

export default function RootLayout() {
  return (
    // <ClerkProvider  publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}>
    <PlantContextProvider>
    <DeviceContextProvider>
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
    </DeviceContextProvider>
    </PlantContextProvider>
    // </ClerkProvider>
  );
}
