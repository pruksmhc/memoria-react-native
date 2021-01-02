import React from 'react';
import { Button, View, Text, StyleSheet, Image} from 'react-native';
import {Container} from 'native-base'
import { GiftedChat } from 'react-native-gifted-chat';
import firebaseSvc from '../FirebaseSvc';

type Props = {
  name?: string,
  email?: string,
  avatar?: string,
};
const styles = StyleSheet.create({
      logo:{
      width: 200,
      height: 200,
       marginTop: -50,
       marginBottom: -50,
     marginLeft: 90,
    },
});

export default class Chat extends React.Component<Props> {

  constructor(props) {
    super(props);
  }
  static navigationOptions = {
    title: 'Chat',
  };

  state = {
    messages: [],
  };

  get user() {
    return {
      name: this.props.navigation.state.params.name,
      email: this.props.navigation.state.params.email,
      avatar: this.props.navigation.state.params.avatar,
      _id: firebaseSvc.uid,
    };
  }

    onLongPress(context, message) {
        const options = ['Delete Message', 'Save to Favorite List'];
        const cancelButtonIndex = options.length - 1;
        context.actionSheet().showActionSheetWithOptions({
            options,
            cancelButtonIndex
        }, (buttonIndex) => {
            switch (buttonIndex) {
                case 0:
                    // Your delete logic
                    break;
                case 1:
                   firebaseSvc.addFavorites(message, this.props.navigation.state.params.saved_key)
            }
        });
    }

  render() {
    return (
    <View style={{flex: 1}}>
    <View style={{backgroundColor: "#090e3d"}}>
       <Image
            source={require('../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          ></Image></View>
      <GiftedChat
        messages={this.state.messages}
        onSend={firebaseSvc.send}
        user={this.user}
        onLongPress={this.onLongPress.bind(this)}
      />
      </View>
    );
  }

  componentDidMount() {
    firebaseSvc.refOn(message =>
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message),
      }))
    );
  }
  componentWillUnmount() {
    firebaseSvc.refOff();
  }
}
