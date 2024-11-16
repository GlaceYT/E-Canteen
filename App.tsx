import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { OrderProvider } from './src/context/OrderContext';
import { AuthProvider } from './src/context/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import AdminScreen from './src/screens/AdminScreen';
import StudentScreen from './src/screens/StudentScreen';
import { CartProvider } from './src/context/CartContext';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

const Stack = createStackNavigator();
SplashScreen.preventAutoHideAsync();

const theme = (fontLoaded: boolean) => ({
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#FF5722',
    accent: '#FFC107',
  },
  fonts: {
    ...DefaultTheme.fonts,
    displayLarge: {
      fontFamily: fontLoaded ? 'LeagueSpartan-Regular' : 'System',
      fontSize: 57,
      fontWeight: "400" as "400", // Ensure the type matches expected
      letterSpacing: 0,
      lineHeight: 64,
    },
    displayMedium: {
      fontFamily: fontLoaded ? 'LeagueSpartan-Regular' : 'System',
      fontSize: 45,
      fontWeight: "400" as "400",
      letterSpacing: 0,
      lineHeight: 52,
    },
    displaySmall: {
      fontFamily: fontLoaded ? 'LeagueSpartan-Regular' : 'System',
      fontSize: 36,
      fontWeight: "400" as "400",
      letterSpacing: 0,
      lineHeight: 44,
    },
    headlineLarge: {
      fontFamily: fontLoaded ? 'LeagueSpartan-Regular' : 'System',
      fontSize: 32,
      fontWeight: "400" as "400",
      letterSpacing: 0,
      lineHeight: 40,
    },
    headlineMedium: {
      fontFamily: fontLoaded ? 'LeagueSpartan-Regular' : 'System',
      fontSize: 28,
      fontWeight: "400" as "400",
      letterSpacing: 0,
      lineHeight: 36,
    },
    headlineSmall: {
      fontFamily: fontLoaded ? 'LeagueSpartan-Regular' : 'System',
      fontSize: 24,
      fontWeight: "400" as "400",
      letterSpacing: 0,
      lineHeight: 32,
    },
    titleLarge: {
      fontFamily: fontLoaded ? 'LeagueSpartan-Regular' : 'System',
      fontSize: 22,
      fontWeight: "400" as "400",
      letterSpacing: 0,
      lineHeight: 28,
    },
    titleMedium: {
      fontFamily: fontLoaded ? 'LeagueSpartan-Regular' : 'System',
      fontSize: 16,
      fontWeight: "500" as "500",
      letterSpacing: 0.15,
      lineHeight: 24,
    },
    titleSmall: {
      fontFamily: fontLoaded ? 'LeagueSpartan-Regular' : 'System',
      fontSize: 14,
      fontWeight: "500" as "500",
      letterSpacing: 0.1,
      lineHeight: 20,
    },
    labelLarge: {
      fontFamily: fontLoaded ? 'LeagueSpartan-Regular' : 'System',
      fontSize: 14,
      fontWeight: "500" as "500",
      letterSpacing: 0.1,
      lineHeight: 20,
    },
    labelMedium: {
      fontFamily: fontLoaded ? 'LeagueSpartan-Regular' : 'System',
      fontSize: 12,
      fontWeight: "500" as "500",
      letterSpacing: 0.5,
      lineHeight: 16,
    },
    labelSmall: {
      fontFamily: fontLoaded ? 'LeagueSpartan-Regular' : 'System',
      fontSize: 11,
      fontWeight: "500" as "500",
      letterSpacing: 0.5,
      lineHeight: 16,
    },
    bodyLarge: {
      fontFamily: fontLoaded ? 'LeagueSpartan-Regular' : 'System',
      fontSize: 16,
      fontWeight: "400" as "400",
      letterSpacing: 0.15,
      lineHeight: 24,
    },
    bodyMedium: {
      fontFamily: fontLoaded ? 'LeagueSpartan-Regular' : 'System',
      fontSize: 14,
      fontWeight: "400" as "400",
      letterSpacing: 0.25,
      lineHeight: 20,
    },
    bodySmall: {
      fontFamily: fontLoaded ? 'LeagueSpartan-Regular' : 'System',
      fontSize: 12,
      fontWeight: "400" as "400",
      letterSpacing: 0.4,
      lineHeight: 16,
    },
    default: {
      fontFamily: fontLoaded ? 'LeagueSpartan-Regular' : DefaultTheme.fonts.default.fontFamily,
      fontWeight: "400" as "400",
      letterSpacing: 0,
    },
  },
});



export default function App() {
  const [fontsLoaded] = useFonts({
    'LeagueSpartan-Regular': require('./assets/fonts/LeagueSpartan-Regular.ttf'),
  });

  React.useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // Render nothing while fonts are loading
  }

  return (
    <PaperProvider theme={theme(fontsLoaded)}>
    <CartProvider>
      <AuthProvider>
        <OrderProvider>
          
            <NavigationContainer>
              <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Admin" component={AdminScreen} />
                <Stack.Screen name="Student" component={StudentScreen} />
              </Stack.Navigator>
            </NavigationContainer>

        </OrderProvider>
      </AuthProvider>
    </CartProvider>
    </PaperProvider>
  );
}
