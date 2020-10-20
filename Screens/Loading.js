import React, { Component } from "react";
import { ScrollView, Image, Text, StyleSheet, Button, View, ActivityIndicator } from "react-native";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import * as firebase from 'firebase';
export default class Loading extends Component {
  constructor(props){
    super(props);
  }

  static navigationOptions = { headerShown: false };

  //checks if the user has logged in previously on this device, and redirects to LogIn if they haven't, and
  //MainNavigator if they have(MainNavigator then redirects them to Home)
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      this.props.navigation.navigate(user ? 'MainNavigator' : 'LogIn' )
    })
  }

  render() {
    return (
    <View style = {styles.mainView}>
      <Image
        source={require("../assets/Images/Leidos-Holdings-Logo.jpg")}
        style={styles.logo}
      />
      <View style={{height: '30%'}} />
      <ActivityIndicator size='large' color='#391961' style={styles.spinner} />
    </View>
    );
  }
}
const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    flexDirection: "column",
    width: null,
    height: null,
    alignContent: 'center',
    backgroundColor: '#FFFFFF'
  },
  logo: {
    resizeMode: "contain",
    width: '50%',
    height: '50%',
    alignSelf: 'center'
  },
  spinner: {
    alignSelf: 'center'
  }
});
