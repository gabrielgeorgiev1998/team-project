import React, { Component } from "react";
import { Text, View, Button, Alert, StyleSheet } from "react-native";
import FreeSpaceTable from "../BookSpaceTable.js";
import * as firebase from "firebase";


export default class LookForSpace extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            date : new Date().getDate()
        };
    }
    
    render() {
        return (
        <View style={styles.mainView}>
        <FreeSpaceTable />
        </View>
        );
    }    
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-evenly",
    width: null,
    height: null
  },
  textStyle: {
    textAlign: "center",
    color: "#FFFFFF",
    top: "25%",
    fontSize: 20
  },
  viewContainer: {
    backgroundColor: "#391961",
    height: "100%",
    width: "100%",
    borderRadius: 15,
    borderColor: "#BBBBBB",
    borderWidth: 3
  }
});