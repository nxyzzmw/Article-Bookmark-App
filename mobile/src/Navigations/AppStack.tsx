import Home from '../Screens/Home';
import Add from '../Screens/Add';
import Reading from '../Screens/Reading';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';

const Tab = createBottomTabNavigator();

const HomeIcon = ({ color, size }: any) => (
  <MaterialIcons name="home" color={color} size={size + 8} />
);

const AddIcon = ({ color, size }: any) => (
  <MaterialIcons name="control-point" color={color} size={size + 6} />
);

const ReadingIcon = ({ color, size }: any) => (
  <MaterialIcons name="book" color={color} size={size + 8} />
);

export default function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#2E241A',
        tabBarInactiveTintColor: '#B8A38A',

        tabBarStyle: {
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          height: 50,
          position: 'absolute',
          marginHorizontal: 50,
          bottom: 10,
        },

        tabBarBackground: () => (
          <View
            style={{
              flex: 1,
              backgroundColor: '#FDF7EE',
              borderRadius: 40,
              elevation: 6,
            }}
          />
        ),
      }}
    >
      <Tab.Screen name="Home" component={Home} options={{ tabBarIcon: HomeIcon }} />

      <Tab.Screen name="Add" component={Add} options={{ tabBarIcon: AddIcon }} />

      <Tab.Screen name="Readings" component={Reading} options={{ tabBarIcon: ReadingIcon }} />
    </Tab.Navigator>
  );
}
