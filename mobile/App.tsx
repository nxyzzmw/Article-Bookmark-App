import { StatusBar, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import MyTabs from './src/Navigations/AppStack';
import { NavigationContainer } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SearchProvider } from './src/context/SearchContext';
import { useContext, useState } from 'react';
import { SearchContext } from './src/context/SearchContext';
import { Modal, TextInput, TouchableOpacity } from 'react-native';


function MainApp() {
 
const { searchText, setSearchText } =
  useContext(SearchContext);

const [searchVisible, setSearchVisible] =
  useState(false);

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
        <TouchableOpacity
  onPress={() => setSearchVisible(true)}
  style={{
    position: 'absolute',
    right: 20,
    backgroundColor: '#ffffff',
    padding: 5,
    borderRadius: 20,
    elevation: 8,
  }}
>
  <MaterialIcons
    name="search"
    size={22}
    color="#D08B2A"
  />
</TouchableOpacity>
<Modal visible={searchVisible} transparent>
  <View
    style={{
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.4)',
      justifyContent: 'center',
      padding: 20,
    }}
  >
    <View
      style={{
        backgroundColor: 'white',
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
      }}
    >
      <TextInput
        placeholder="Search bookmarks..."
        placeholderTextColor={"grey"}
        value={searchText}
        onChangeText={setSearchText}
        style={{ flex: 1, fontSize: 16 }}
        autoFocus
      />

      <TouchableOpacity
        onPress={() => setSearchVisible(false)}
      >
        <MaterialIcons
          name="close"
          size={24}
          color="black"
        />
      </TouchableOpacity>
    </View>
  </View>
</Modal>

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
  <SearchProvider>
    <MainApp />
  </SearchProvider>
</NavigationContainer>

    </SafeAreaView>
  );
}
