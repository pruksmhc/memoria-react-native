import React from 'react';
import { Text, TextInput, View, Image, Button, StyleSheet, ImageBackground, TouchableOpacity} from 'react-native';
import firebaseSvc from '../FirebaseSvc';
import firebase from 'firebase';
import { auth, initializeApp, storage } from 'firebase';
import uuid from 'uuid';

class Login extends React.Component {
  static navigationOptions = {
    title: 'Log In',
  };

  state = {
    email: 'test3@gmail.com',
    password: 'test123',
    avatar: '',
  };

  // using Fire.js
  onPressLogin = async () => {
    console.log('pressing login... email:' + this.state.email);
    console.log("Name " + this.state.name)
    const user = {
      email: this.state.email,
      password: this.state.password,
      avatar: this.state.avatar,
    };

    const response = firebaseSvc.login(
      user,
      this.loginSuccess,
      this.loginFailed
    );
  };

  loginSuccess = () => {
    console.log('login successful, navigate to chat.');
    var user = firebase.auth().currentUser;
    console.log("saved list key" + user.photoURL)
    this.props.navigation.navigate('Chat', {
      name: user.displayName,
      saved_key: user.photoURL,
      email: this.state.email,
      avatar: this.state.avatar,
    });
  };
  loginFailed = () => {
    console.log('login failed ***');
    alert('Login failure. Please tried again.');
  };


  onChangeTextEmail = email => this.setState({ email });
  onChangeTextPassword = password => this.setState({ password });


  render() {

    return (
       <ImageBackground
        source={require('../assets/background.png')}
        style={styles.background}
      >
          <Image
            source={require('../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          >
          </Image>
      <View style={styles.loginAsset}>

        <Text style={styles.title}>Email:</Text>
        <TextInput
          style={styles.nameInput}
          placeHolder="test3@gmail.com"
          onChangeText={this.onChangeTextEmail}
          value={this.state.email}
        />
        <Text style={styles.title}>Password:</Text>
        <TextInput
          style={styles.nameInput}
          onChangeText={this.onChangeTextPassword}
          value={this.state.password}
        />
        <Button
          title="Log Int"
          style={styles.buttonText}
          onPress={this.onPressLogin}
        />
        <Button
          title="Go to create new account"
          style={styles.buttonText}
          onPress={() => this.props.navigation.navigate("CreateAccount")}
        />

      </View></ImageBackground>
    );
  }
}

const offset = 16;
const styles = StyleSheet.create({
  title: {
    marginTop: offset,
    marginLeft: offset,
    fontSize: offset,
  },
  nameInput: {
  backgroundColor: "white",
    height: offset * 2,
    margin: offset,
    paddingHorizontal: offset,
    borderColor: '#111111',
    borderWidth: 1,
    fontSize: offset,
  },
  buttonText: {
    marginLeft: offset,
    fontSize: 42,
  },
  loginAsset: {
  backgroundColor: "white",
  marginTop:0,
  borderRadius: 10,
  },
 background: {
      width: '100%',
      height: '100%'
    },
      logo:{
      width: 250,
      height: 250,
      marginLeft: '19%',
      marginTop: '10%'
    },
});

export default Login;
