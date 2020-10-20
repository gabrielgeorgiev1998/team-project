import React, { Component } from "react";
import { StyleSheet, Text, View, Button, Alert } from "react-native";
import *  as firebase from "firebase";


export default class HomePage extends Component {
  constructor(props){
    super(props);

    this.state = {
    }
  }

  
  handleNavToGroupManagement=()=>{
    this.props.navigation.navigate("GroupManage")
  }

  //NOT CURRENTLY WORKING
  handleDeleteUser=()=>{
      this.props.navigation.navigate("DeleteUser")
  }
  
  //NOT CURRENTLY WORKING
  handleNavToGroupRemove=()=>{
    this.props.navigation.navigate("RemoveUserFromGroup")
  }

  handleNavToPopulate=()=>{
    this.props.navigation.navigate("Populate")
  }

  render() {
    return (
      <View style={styles.mainView}>
        <View style={styles.buttons}>
          <Button
            title="Populate user database"
            color="#391961"
            onPress={this.handleNavToPopulate}
          />
        </View>
        <View style={styles.buttons}>
          <Button
            title="Delete user"
            color="#391961"
            onPress={this.handleDeleteUser}
          />
        </View>
        <View style={styles.buttons}>
          <Button
            title="Add users to a group"
            color="#391961"
            onPress={this.handleNavToGroupManagement}
          />
        </View>
        <View style={styles.buttons}>
          <Button
            title="Remove users from group"
            color="#391961"
            onPress={this.handleNavToGroupRemove}
          />
        </View>
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
  buttons: {
    padding: 10,
    flex:0.3,
    
  },
});