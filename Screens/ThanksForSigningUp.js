import React, { Component } from "react";
import { StyleSheet, Text, View, Button, Alert, TextInput } from "react-native";
import * as firebase from 'firebase';

export default class ThanksForSigningUp extends Component{
    constructor(props){
        super(props);
        this.state = {
                    name: '',
                    carReg: '',
                    groupNumber: '',
                    userID: '',
                    email: '',
        };
    const firebase = require('firebase'); 

    }
    


    render() {
        return (
            <View style={styles.detailCell}>
                <Text>Complete your sign up pls :P</Text>
                <Text style={styles.title}>Name:</Text>
                <TextInput
                    style={
                        (styles.detailCell,
                            { height: 40, borderColor: "gray", borderWidth: 2 })
                    }
                    onChangeText={name => this.setState({ name })}
                    value={this.state.name}
                />
                <Text style={styles.title}>Car Reg:</Text>

                <TextInput
                    style={{ height: 40, borderColor: "gray", borderWidth: 2 }}
                    onChangeText={carReg => this.setState({ carReg })}
                    value={this.state.carReg}
                />
                <Text style={styles.title}>Group Number:</Text>

                <TextInput
                    style={{ height: 40, borderColor: "gray", borderWidth: 2 }}
                    onChangeText={groupNumber => this.setState({ groupNumber })}
                    value={this.state.groupNumber}
                />
                <Button title = "OK!" onPress={this.handleAddtoDB}>Complete sign up!!</Button>
            </View>
        );
      }

      
      handleAddtoDB = () =>{
        var user = firebase.auth().currentUser;
        if(!user){
            console.log("How did this happen!")
        }

        let setDoc = firebase.firestore().collection('users').doc(user.uid).set({
            name: this.state.name,
            email: user.email,
            groupNumber: this.state.groupNumber,
            carReg : this.state.carReg
          });
          this.props.navigation.navigate("MainNavigator");
      }
}
const styles = StyleSheet.create({
    mainView: {
      flex: 1,
      flexDirection: "column",
    },
    detailCell: {
        flex: 5,
        flexDirection: "column",
        padding: 20,
      },
      
      mainView: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: "#FFFFFF",
        alignItems: "stretch",
        width: null,
        height: null
      },
      columnEntry: {
        backgroundColor: "#BBBBBB",
        flex: 1
      },
      backText: { fontSize: 20, paddingTop: 10 },
      backButton: {
        borderRadius: 10,
        borderColor: "#BBBBBB",
        backgroundColor: "#FFFFFF",
        top: 40,
        left: 20
      },
      title: {
        fontSize: 24,
      },
      button: {
        marginRight: 10
      }
  });
