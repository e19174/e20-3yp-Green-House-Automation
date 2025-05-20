import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useState } from 'react';
import Page from './app/index';
import login from './app/Components/Authentication/login';
import register from './app/Components/Authentication/register';
// import { AppProvider } from './app/Contexts/UserContext';
import { Stack } from 'expo-router';

// const Stack = createStackNavigator();

export default function App() {
  const [isLogin, setisLogin] = useState(false);
  
  return (
    // <NavigationContainer>
    //   <Stack.Navigator initialRouteName={isLogin? "page": "login"}>
    //     <Stack.Screen name="login" component={login} />
    //     <Stack.Screen name="page" component={Page} />
    //     <Stack.Screen name="register" component={register} />
    //   </Stack.Navigator>
    // </NavigationContainer>
    // <AppProvider>
    //   <Stack
    //     initialRouteName="Componenets/Authentication/login"
    //   />
    // </AppProvider>
  );
}
