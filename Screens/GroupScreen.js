import React, { Component } from "react";
import { Text, View, Button, Alert, StyleSheet } from "react-native";
import * as firebase from "firebase";


export default class LookForSpace extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    
    
  queryGroupSpaces() {
     let group = firebase.firestore().collection('groups').doc("1");
     
  }
    
    render() {
        return (
        <View style={styles.mainView}>
        </View>
        );
    }    
}