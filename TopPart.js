import React, { Component } from "react";
import { Text, StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { NavigationEvents } from "react-navigation";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

export default class TopPart extends Component {
  constructor() {
    super();
  }
    
  render() {
    return (
        // display logo and profile, onpress navigates to right page
      <View style={styles.topView}>
        <TouchableOpacity style={styles.logo} onPress={this.props.handle1}>
          <Image
            style={styles.logo}
            // display profile picture logo
            source={require("./assets/Images/Leidos-Holdings-Logo.jpg")} 
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.profilePicTouch} onPress={this.props.handle2}>
          <Image
            style={styles.profilePic}
            source={require("./assets/Images/profilePic.jpg")}
          />
        </TouchableOpacity>
        {/* <Text>{this.props.navigate.navigation.getParam(currUser, '')}</Text> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  logo: { width: 190, height: 90 },
  profilePic: {
    width: 75,
    height: 75,
    left: 50,
    top: 10
  },
  profilePicTouch: {
    width: 125,
    height: 75,
    left: 90,
    top: 10
  },
  topView: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    flex: 1,
    top: 25
  }
});