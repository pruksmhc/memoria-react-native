import React from 'react';
import { Constants} from 'expo';
import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'
import {
  StyleSheet, Text,
  TextInput, View,Image,
  Button, ImageEditor,ImageBackground
} from 'react-native';
import firebaseSvc from '../FirebaseSvc';

class CreateAccount extends React.Component {
  static navigationOptions = {
    title: 'Sign Up',
  };

  state = {
    name: 'no name',
    email: 'test3@gmail.com',
    password: 'test123',
    avatar: '',
  };

  onPressCreate = async () => {
    try {
      const user = {
        name: this.state.name,
        email: this.state.email,
        password: this.state.password,
      };
      console.log("Creating favorites list")
      var saved_key = firebaseSvc.createFavorites(user)
      await firebaseSvc.createAccount(user, saved_key);
    } catch ({ message }) {
      console.log('create account failed. catch error:' + message);
    }
  };

  onChangeTextEmail = email => this.setState({ email });
  onChangeTextPassword = password => this.setState({ password });
  onChangeTextName = name => this.setState({ name });

  onImageUpload = async () => {
    const { status: cameraRollPerm } = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );
    try {
      // only if user allows permission to camera roll
      if (cameraRollPerm === 'granted') {
        let pickerResult = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          aspect: [4, 3],
        });
        console.log(
          'ready to upload... pickerResult json:' + JSON.stringify(pickerResult)
        );

        var wantedMaxSize = 150;
        var rawheight = pickerResult.height;
        var rawwidth = pickerResult.width;
        var ratio = rawwidth / rawheight;
        var wantedwidth = wantedMaxSize;
        var wantedheight = wantedMaxSize/ratio;
        // check vertical or horizontal
        if(rawheight > rawwidth){
            wantedwidth = wantedMaxSize*ratio;
            wantedheight = wantedMaxSize;
        }
        let resizedUri = await new Promise((resolve, reject) => {
          ImageEditor.cropImage(pickerResult.uri,
          {
              offset: { x: 0, y: 0 },
              size: { width: pickerResult.width, height: pickerResult.height },
              displaySize: { width: wantedwidth, height: wantedheight },
              resizeMode: 'contain',
          },
          (uri) => resolve(uri),
          () => reject(),
          );
        });
        let uploadUrl = await firebaseSvc.uploadImage(resizedUri);
        this.setState({avatar: uploadUrl});
        await firebaseSvc.updateAvatar(uploadUrl);
      }
    } catch (err) {
      console.log('onImageUpload error:' + err.message);
      alert('Upload image error:' + err.message);
    }
  };

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
        <Text style={styles.title}>Name:</Text>
        <TextInput
          style={styles.nameInput}
          onChangeText={this.onChangeTextName}
          value={this.state.name}
        />

        <Button
          title="Create Account"
          style={styles.buttonText}
          onPress={this.onPressCreate}
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

export default CreateAccount;