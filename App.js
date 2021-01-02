import React from 'react';
import { View, Text } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Favorites from "./components/Favorites";
import Login from './components/Login';
import Chat from './components/Chat';
import CreateAccount from "./components/CreateAccount";
import  { NavigationContainer, createDrawerNavigator } from 'react-navigation-drawer'
const AppNavigator = createStackNavigator({

  Login: Login,
  Chat: Chat,
  CreateAccount: CreateAccount,
  Favorites: Favorites
});

export default createAppContainer(createDrawerNavigator({
  Login: Login,
  Favorites: Favorites,
  Chat: Chat,
  CreateAccount: CreateAccount
}, {
  initialRouteName: 'Login',
  contentOptions: {
    activeTintColor: '#e91e63',
  },

}));

