import Home from '../Screens/Home';
import Add from '../Screens/Add';
import Reading from '../Screens/Reading';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';

const Tab = createBottomTabNavigator();

const HomeIcon = ({ color, size }: { color: string; size: number }) => (
  <MaterialIcons name="home" color={color} size={size} />
);

const ProfileIcon = ({ color, size }: { color: string; size: number }) => (
  <MaterialIcons name="add" color={color} size={size} />
);

const SettingsIcon = ({ color, size }: { color: string; size: number }) => (
  <MaterialIcons name="book" color={color} size={size} />
);

export default function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#E7CBA3',
          borderTopWidth: 0,
          elevation: 5,
          borderRadius: 999,
          width: 300,
          alignSelf: 'center',
          overflow: 'hidden',
        },
        tabBarActiveTintColor: '#dd8d1dff',
        tabBarInactiveTintColor: '#8B6E4A',
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: HomeIcon,
          tabBarLabel: 'Home',
          tabBarItemStyle: { borderRadius: 999 },
          tabBarActiveBackgroundColor: '#ffffffff',
        }}
      />

      <Tab.Screen
        name="Add"
        component={Add}
        options={{
          tabBarIcon: ProfileIcon,
          tabBarLabel: 'Add',
          tabBarItemStyle: { borderRadius: 999 },
          tabBarActiveBackgroundColor: '#ffffffff',
        }}
      />

      <Tab.Screen
        name="Readings"
        component={Reading}
        options={{
          tabBarIcon: SettingsIcon,
          tabBarLabel: 'Readings',
          tabBarItemStyle: { borderRadius: 50 },
          tabBarActiveBackgroundColor: '#ffffffff',
        }}
      />
    </Tab.Navigator>
  );
}
