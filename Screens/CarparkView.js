import React, { Component } from "react";
import { ScrollView, Image, Text, StyleSheet, Dimensions } from "react-native";
import * as firebase from "firebase";

export default class CarparkView extends Component {
  static navigationOptions = { headerShown: false };
  render() {
    return (
      <ScrollView style={styles.mainView}
      vertical={true}>
            <Image style={styles.map} source={require("../assets/carparkMap.png")}
        resizeMode="contain" />
      </ScrollView>
    );
  }
}
const dim = Dimensions.get('window');

const styles = StyleSheet.create({
  mainView: {
    flexDirection: "column",
    width: null,
      height: null,
      backgroundColor: '#FFFFFF'
  },
    map: {
	width: dim.width,
/*	height: dim.height*/
    }
});
