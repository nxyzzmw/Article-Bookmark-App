import { StatusBar, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import MyTabs from './src/Navigations/AppStack';
import { NavigationContainer } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


function MainApp() {
 

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#F9F3E9',
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#E7CBA3',
          paddingVertical: 12,
          paddingHorizontal: 16,
          gap: 8,
          borderBottomWidth: 1,
          borderBottomColor: '#E7CBA3',
        }}
      >
        <Text
          style={{
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: 28,
            color: '#3A2A1A',
          }}
        >
          My Bookmarks
        </Text>
        <View style={[{ position: 'absolute', right: 20, backgroundColor:"#ffffff", padding:5, borderRadius:20, elevation:8 }]}>
          <MaterialIcons name="search" size={22} color="#D08B2A" />
        </View>
      </View>
      {/*  Screens below */}
      <View style={{ flex: 1 }}>
        <MyTabs />
      </View>
    </View>
  );
}
export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9F3E9' }}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F9F3E9"
        translucent={false}
      />
          <NavigationContainer>
            <MainApp />
          </NavigationContainer>  
    </SafeAreaView>
  );
}
