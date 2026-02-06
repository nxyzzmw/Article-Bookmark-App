import { StatusBar, Text, View, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import MyTabs from './src/Navigations/AppStack';
import { NavigationContainer } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SearchProvider } from './src/context/SearchContext';
import { useContext } from 'react';
import { SearchContext } from './src/context/SearchContext';
import { TextInput, TouchableOpacity } from 'react-native';


function MainApp({ activeTab }: { activeTab: string }) {
 
const {
  homeSearchText,
  setHomeSearchText,
  readingSearchText,
  setReadingSearchText,
} = useContext(SearchContext);

const isHome = activeTab === 'Home';
const isReading = activeTab === 'Readings';

const activeSearchText = isHome
  ? homeSearchText
  : isReading
  ? readingSearchText
  : '';

const setActiveSearchText = (text: string) => {
  if (isHome) setHomeSearchText(text);
  else if (isReading) setReadingSearchText(text);
};

useEffect(() => {
  if (isHome) setHomeSearchText('');
  if (isReading) setReadingSearchText('');
}, [activeTab]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#F9F3E9',
      }}
    >
      <View
        style={{
          backgroundColor: '#E7CBA3',
          paddingTop: 14,
          paddingBottom: 12,
          paddingHorizontal: 16,
          gap: 12,
          borderBottomWidth: 1,
          borderBottomColor: '#E7CBA3',
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View>
            <Text
              style={{
                fontSize: 12,
                letterSpacing: 2,
                color: '#8B7E6D',
                fontWeight: '700',
              }}
            >
              MY LIBRARY
            </Text>
            <Text
              style={{
                fontWeight: '800',
                fontSize: 26,
                color: '#2E241A',
              }}
            >
              Bookmarks
            </Text>
          </View>

          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              backgroundColor: '#FFF6E8',
              alignItems: 'center',
              justifyContent: 'center',
              elevation: 3,
            }}
          >
            <MaterialIcons
              name="bookmark"
              size={22}
              color="#D08B2A"
            />
          </View>
        </View>

        {(isHome || isReading) && (
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 999,
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 14,
              paddingVertical: 8,
              elevation: 2,
            }}
          >
            <MaterialIcons
              name="search"
              size={20}
              color="#D08B2A"
              style={{ marginRight: 8 }}
            />
            <TextInput
              placeholder={
                isHome
                  ? 'Search bookmarks...'
                  : 'Search reading...'
              }
              placeholderTextColor="grey"
              value={activeSearchText}
              onChangeText={setActiveSearchText}
              style={{ flex: 1, fontSize: 16 }}
            />
            {!!activeSearchText && (
              <TouchableOpacity
                onPress={() => {
                  setActiveSearchText('');
                  Keyboard.dismiss();
                }}
              >
                <MaterialIcons
                  name="close"
                  size={20}
                  color="black"
                />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
      {/*  Screens below */}
      <View style={{ flex: 1 }}>
        <MyTabs />
      </View>
    </View>
  );
}
export default function App() {
  const [activeTab, setActiveTab] =
    useState('Home');

  const getActiveRouteName = (state: any): string => {
    if (!state) return 'Home';
    const route = state.routes[state.index];
    if (route.state) {
      return getActiveRouteName(route.state);
    }
    return route.name;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9F3E9' }}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F9F3E9"
        translucent={false}
      />
      <NavigationContainer
        onStateChange={state => {
          const name = getActiveRouteName(state);
          setActiveTab(name);
        }}
      >
        <SearchProvider>
          <MainApp activeTab={activeTab} />
        </SearchProvider>
      </NavigationContainer>

    </SafeAreaView>
  );
}
