import firebase from 'firebase';
import {Text} from 'react-native'

const config = {
    apiKey: "AIzaSyDmzSF8TVwmz4Wlax1a2Ysm3PQ8k2RlPlw",
    authDomain: "chatapp-8d631.firebaseapp.com",
    projectId: "chatapp-8d631",
    storageBucket: "chatapp-8d631.appspot.com",
    messagingSenderId: "1082247815866",
    appId: "1:1082247815866:web:31b1c9533e080cfc8b5883",
    measurementId: "G-6KFHHXDCBY",
    databaseURL: "https://chatapp-8d631-default-rtdb.firebaseio.com/",
}


class FirebaseSvc {
  constructor() {
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    } else {
      console.log("firebase apps already running...")
    }
  }

  login = async(user, success_callback, failed_callback) => {
    console.log("logging in");
    const output = await firebase.auth().signInWithEmailAndPassword(user.email, user.password)
    .then(success_callback, failed_callback);
  }

  observeAuth = () =>
    firebase.auth().onAuthStateChanged(this.onAuthStateChanged);

  onAuthStateChanged = user => {
    if (!user) {
      try {
        this.login(user);
      } catch ({ message }) {
        console.log("Failed:" + message);
      }
    } else {
      console.log("Reusing auth...");
    }
  };

  createFavorites = user => {
     const saved_list = {
        user: user,
        createdAt: this.timestamp,
        messages: []
        }
      console.log(saved_list)
      return this.list_ref.push(saved_list).key;
  };


  createAccount = async (user, saved_key) => {
    firebase.auth()
      .createUserWithEmailAndPassword(user.email, user.password)
      .then(function() {
        console.log("created user successfully. User email:" + user.email + " name:" + user.name);
        var userf = firebase.auth().currentUser;
        userf.updateProfile({ displayName: user.name, photoURL: saved_key})
        .then(function() {
          console.log("Updated displayName successfully. name:" + user.name);
          alert("User " + user.name + " was created successfully. Please login.");
        }, function(error) {
          console.warn("Error update displayName.");
        });
      }, function(error) {
        console.error("got error:" + typeof(error) + " string:" + error.message);
        alert("Create account failed. Error: "+error.message);
      });

  }

  uploadImage = async uri => {
    console.log('got image to upload. uri:' + uri);
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const ref = firebase
        .storage()
        .ref('avatar')
        .child(uuid.v4());
      const task = ref.put(blob);

      return new Promise((resolve, reject) => {
        task.on(
          'state_changed',
          () => {
              /* noop but you can track the progress here */
          },
          reject /* this is where you would put an error callback! */,
          () => resolve(task.snapshot.downloadURL)
        );
      });
    } catch (err) {
      console.log('uploadImage try/catch error: ' + err.message); //Cannot load an empty url
    }
  }

  updateAvatar = (url) => {
    //await this.setState({ avatar: url });
    var userf = firebase.auth().currentUser;
    if (userf != null) {
      userf.updateProfile({ avatar: url})
      .then(function() {
        console.log("Updated avatar successfully. url:" + url);
        alert("Avatar image is saved successfully.");
      }, function(error) {
        console.warn("Error update avatar.");
        alert("Error update avatar. Error:" + error.message);
      });
    } else {
      console.log("can't update avatar, user is not login.");
      alert("Unable to update avatar. You must login first.");
    }
  }

  onLogout = user => {
    firebase.auth().signOut().then(function() {
      console.log("Sign-out successful.");
    }).catch(function(error) {
      console.log("An error happened when signing out");
    });
  }

  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }

  get message_ref() {
    return firebase.database().ref('Messages');
  }
   get list_ref() {
    return firebase.database().ref('Saved');
  }

  parse = snapshot => {
    const { timestamp: numberStamp, text, user } = snapshot.val();
    const { key: id } = snapshot;
    const { key: _id } = snapshot; //needed for giftedchat
    const timestamp = new Date(numberStamp);

    const message = {
      id,
      _id,
      timestamp,
      text,
      user,
    };
    return message;
  };

  refOn = callback => {
    this.message_ref
      .limitToLast(20)
      .on('child_added', snapshot => callback(this.parse(snapshot)));
  }

  get timestamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }

  // send the message to the Backend
  send = messages => {
    for (let i = 0; i < messages.length; i++) {
      const { text, user } = messages[i];
      console.log(messages);
      const message = {
        text: text,
        user: user,
        createdAt: this.timestamp,
      };
      this.message_ref.push(message);
    }
  };

 addFavorites = (message, saved_key) => {
    var update = {}
    var timestamp = this.timestamp;
    var child_path = firebase.database().ref('Saved/'+saved_key + "/messages");
    // Here, you basically create a new row, and then populate it. That's how Firebase works.
    var new_child = child_path.push()
     const { text, user } = message;
    console.log("Adding message to saved")
      const new_message = {
        text: text,
        user: user,
        createdAt: timestamp};
     new_child.set(new_message);
     alert("Added to favorites");
  };

  refOff() {
    this.message_ref.off();
    this.list_ref.off()
  }
}

const firebaseSvc = new FirebaseSvc();
export default firebaseSvc;
