import React from 'react';
import { SafeAreaView, View, SectionList, StyleSheet, Text, StatusBar } from 'react-native';
///Here, you want to change the state, and you want to have the dat apulled from firebase during componentdIdMount()
//
import firebase from 'firebase'; // 4.8.0


function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

const privacy = "Shared with: Only me";

const Item = ({ title, name, date }) => (
  <View  style={styles.itemAll}>
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
    </View>
    <Text style={styles.name}> {name}</Text>
    <Text style={styles.name}> {date}</Text>
  </View>
);

export default class Favorites extends React.Component<Props> {

  constructor(props) {
    super(props);
  }

 state = {
    loading: false,
    friends: []
  }
  componentDidMount() {
   var userf = firebase.auth().currentUser;
    firebase.database().ref("Saved/" + userf.photoURL +"/messages")
      .on('value', snapshot => {

        var friends = [{"title": "Favorites", "data": []}]
        snapshot.forEach(function(childSnapshot) {
        console.log(childSnapshot.val());
        console.log("wee")
        console.log(childSnapshot.val())
        // Create a random date for now, TODO: Pull and store date as well.
        var date = randomDate(new Date(2020, 10, 12), new Date())
        console.log("date")
        console.log(date);
        friends[0]["data"].push({"text": childSnapshot.val().text, "date": date.toDateString(), "name": childSnapshot.val().user.name});
  });
       console.log(friends);
       this.setState({friends, loading: false})
      })
  }


renderItem = ({ item }) => (
    <Item title={item.text} name={item.name} date={item.date}/>
  );

 render() {
    if (this.state.loading) {
      return (
        <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
          <ActivityIndicator size="large" color="dodgerblue" />
        </View>
      )
    }
    return (
      <View style={styles.container}>
        <SectionList
          sections={this.state.friends}
          keyExtractor={(item, index) => item + index}
           renderItem={this.renderItem}
          renderSectionHeader={({ section: { title } }) => (
        <Text style={styles.header}>{title}
         <Text style={{fontSize: 20,}} >{"\n"}{"\n"}Shared with: Only You
         </Text>
           </Text>
      )}
        />
      </View>
    );
  }

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: '#1982FC',
    padding: 20,
    width: 300,
    fontSize: 20,
    borderRadius: 10,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  name: {
  paddingLeft: 20
  },
    header: {
    backgroundColor: '#1982FC',
    fontSize: 32,
   textAlign: "center",
   paddingBottom: 20,
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    backgroundColor: "#fff"
  },
  itemAll: {
     borderBottomColor: 'black',
    borderBottomWidth: 1,
    paddingBottom: 10
    },
  title: {
    fontSize: 20,
  },
});