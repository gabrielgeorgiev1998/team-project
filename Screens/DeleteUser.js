import React, { Component } from "react";
import { StyleSheet, Text, View, Button, TextInput } from "react-native";
import *  as firebase from "firebase";

export default class HomePage extends Component {
  constructor(props){
    super(props);
    //store a user information in the state
    //it can be used as sql index to do many stuff
    this.state = {
        userToDelete: '', 
    }
  }

  handleDeleteUser = () =>{
    let deleteDoc = firebase.firestore().collection("users").doc(this.state.userToDelete).delete()
    this.setState({
      userToDelete: "Deleted"
    })
  }


 
  render() {
    return (
      <View style={styles.mainView}>
        <View style={styles.weeMessage}>
            <Text>Enter email to delete:</Text>
        </View>
        <View style={styles.weeBit}>
            <TextInput 
              value = {this.state.userToDelete}
              style={styles.textBox}
              onChangeText={text => this.setState({ userToDelete: text })}
            />
        </View>
        <View style={styles.weeBit}>
        <Button
            title="Delete user"
            color="#391961"
            onPress={this.handleDeleteUser}
          />
        </View>
        <View style={styles.weeBit}>
          <Text style={{color:'red'}}>This will only delete the user from the database, to completely remove the user, sign into firebase -> authentication -> search by email and delete account.</Text>
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
  
  textStyle: {
    textAlign: "center",
    color: "#FFFFFF",
    top: "25%",
    fontSize: 20,
    flex:1
  },
  
  textBox: {
    height: 30,
    borderColor: "gray",
    borderWidth: 2,
    borderRadius: 10,
    paddingLeft: 5,
    flex: 1
  },
  weeBit: {
    flex:1
  },
  weeMessage:{
    fontSize: 70,

  }
});