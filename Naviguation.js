// Navigation.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import Dashboard from './Dashboard';
import QuickCheck from './QuickCheck';
import Settings from './Settings';

const Tab = createBottomTabNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            position: 'absolute',
            bottom: 16,
            left: 16,
            right: 16,
            elevation: 5,
            backgroundColor: '#fff',
            borderRadius: 16,
            height: 64,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.12,
            shadowRadius: 5,
          },
        })}
      >
        <Tab.Screen
          name="Dashboard"
          component={Dashboard}
          options={{ tabBarIcon: ({ focused }) => (
            <Icon name="home" size={28} color={focused ? '#6200ee' : '#748c94'} />
          ) }}
        />
        <Tab.Screen
          name="QuickCheck"
          component={QuickCheck}
          options={{ tabBarIcon: () => (
            <Icon name="flash" size={32} color="#6200ee" style={{ marginBottom: 30 }} />
          ) }}
        />
        <Tab.Screen
          name="Settings"
          component={Settings}
          options={{ tabBarIcon: ({ focused }) => (
            <Icon name="settings" size={28} color={focused ? '#6200ee' : '#748c94'} />
          ) }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}