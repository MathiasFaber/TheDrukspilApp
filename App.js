import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Game from './src/components/Game';
import Welcome from './src/components/Welcome';
import CreateProfile from './src/components/CreateProfile';
import Lobby from './src/components/Lobby';
// this works, connecting to devices. Now try, instead of awesome channel, pass in an id from a "login" page, which will be the channel, so that multiple channels can be used at the same time. 

const Stack = createNativeStackNavigator();


function App() {

  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: 'white',
      background: '#319CAC',
      card: '#319CAC'
    },
  };

  
  // when joining or creating a game, a uuid should be generated to be used for this user 
  return (
    <NavigationContainer theme={MyTheme}>
      <Stack.Navigator initialRouteName='Welcome'>
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="CreateProfile" component={CreateProfile} />
        <Stack.Screen name="Lobby" component={Lobby} />
        <Stack.Screen name="Game" component={Game} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App
