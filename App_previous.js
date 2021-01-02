import React from 'react';
import { View, Text } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Favorites from "./components/Favorites";
import Login from './components/Login';
import Chat from './components/Chat';
import CreateAccount from "./components/CreateAccount";
import  { NavigationContainer } from 'react-navigation-drawer'
const AppNavigator = createStackNavigator({

  Login: Login,
  Chat: Chat,
  CreateAccount: CreateAccount,
  Favorites: Favorites
});


export default createAppContainer(AppNavigator);