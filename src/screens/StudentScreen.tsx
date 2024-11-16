import React, { useRef, useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Animated, Dimensions, StyleSheet, Text } from 'react-native';
import { useTheme, IconButton } from 'react-native-paper';
import MenuList from '../components/student/MenuList';
import Cart from '../components/student/Cart';
import Profile from '../components/Profile';
import Orders from '../components/student/Order';

const Tab = createBottomTabNavigator();
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function StudentScreen() {
  const theme = useTheme();
  const translateX = useRef(new Animated.Value(0)).current;
  const tabWidth = SCREEN_WIDTH / 4;

  // Track the active tab index
  const [activeTab, setActiveTab] = useState(0);

  // Function to animate bubble to selected tab
  const handleTabPress = (index: number) => {
    Animated.spring(translateX, {
      toValue: index * tabWidth,
      useNativeDriver: true,
      bounciness: 10,
    }).start();
    setActiveTab(index);  // Set active tab index
  };

  const getIconName = (routeName: string) => {
    switch (routeName) {
      case 'Menu':
        return 'home';
      case 'Cart':
        return 'cart';
      case 'Order':
        return 'format-list-bulleted'; 
      case 'Profile':
        return 'account';
      default:
        return 'help';
    }
  };

  useEffect(() => {
    // Reset translation when active tab changes
    Animated.spring(translateX, {
      toValue: activeTab * tabWidth,
      useNativeDriver: true,
      bounciness: 10,
    }).start();
  }, [activeTab]);

  return (
    <Tab.Navigator
      initialRouteName="Menu"
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBarStyle,
        tabBarIcon: ({ focused }) => {
          const iconName = getIconName(route.name);
          const iconColor = focused ? theme.colors.onPrimary : theme.colors.onSurface;
          return (
            <IconButton
              icon={iconName as string}
              size={24}
              iconColor={iconColor}
            />
          );
        },
        headerShown: false,
      })}
      tabBar={({ state, navigation }) => (
        <View style={styles.tabBarContainer}>
          {/* Bubble Animation */}
          <Animated.View
            style={[ 
              styles.bubble,
              { backgroundColor: theme.colors.primary, transform: [{ translateX }] },
            ]}
          />

          {/* Tab Icons and Labels */}
          {state.routes.map((route, index) => {
            const focused = state.index === index;
            const iconName = getIconName(route.name); // Use the icon mapping function

            return (
              <View key={route.key} style={styles.tabItem}>
                <IconButton
                  icon={iconName as string}
                  size={focused ? 28 : 24}
                  iconColor={focused ? theme.colors.onPrimary : theme.colors.onSurface}
                  onPress={() => {
                    handleTabPress(index);
                    navigation.navigate(route.name);
                  }}
                />
                {!focused && (
                  <Text style={styles.tabLabel}>{route.name}</Text>
                )}
              </View>
            );
          })}
        </View>
      )}
    >
      {/* Tab Screens with Animated View */}
      <Tab.Screen 
        name="Menu" 
        component={MenuList} 
        listeners={{
          focus: () => setActiveTab(0),
        }}
      />
      <Tab.Screen 
        name="Cart" 
        component={Cart} 
        listeners={{
          focus: () => setActiveTab(1),
        }}
      />
      <Tab.Screen 
        name="Order" 
        component={Orders} 
        listeners={{
          focus: () => setActiveTab(2),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={Profile} 
        listeners={{
          focus: () => setActiveTab(3),
        }}
      />
    </Tab.Navigator>
  );
}

// Stylesheet
const styles = StyleSheet.create({
  tabBarStyle: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    height: 60,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#FF00FF',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    overflow: 'hidden',
  },
  tabBarContainer: {
    position: 'relative',
    flexDirection: 'row',
    height: 60,
  },
  bubble: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    top: 5,
    left: 27,
    elevation: 3,
    zIndex: 0,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    zIndex: 1,
  },
  tabLabel: {
    fontSize: 12,
    color: '#fff',
    marginTop: 5,
  },
});
