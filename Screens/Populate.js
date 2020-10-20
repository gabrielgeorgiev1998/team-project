import React, { Component } from "react";
import { StyleSheet, Text, View, Button, Alert } from "react-native";
import TableComponent from "../TableComponent.js";
import TopPart from "../TopPart.js";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import BarCodeScanner from "../BarCodeScanner.js";
import *  as firebase from "firebase";
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';


export default class HomePage extends Component {
  constructor(props) {
    super(props);
    //initialise state
    this.state = {
      file: '',
      groups: [], //information stored as[groupID, numUsers, name, assignmentArray]
    }
  }


  handleSelectFile = async () => {
    //Uses document picker api to natively select a document from the user's phone
    //the picker accesses the location of the file and this is then set in state

    try {
      const file = await DocumentPicker.getDocumentAsync();
      if (file.type === 'success') {
        this.setState({
          file: file.uri,
          fileSelected: file.name,
        });
        console.log(this.state.file)
      }
    } catch (err) {
      //error
    }
    }

  handleRunPop = async () => {
    //   GET ALL GROUPS 
    const groups = []
    await firebase.firestore().collection('groups').get().then(snapshot => {
      snapshot.forEach(doc => {
        let groupID = doc.data().groupID;
        let numUsers = doc.data().numUsers;
        let name = doc.data().name;
        let array = doc.data().assignList;
        groups.push([groupID, numUsers, name, array])
      })
    })
    var moment = require('moment');
    moment().format();

    //    READ POPULATION SCRIPT FILE AS STRING   //
    //  SPLIT BY NEWLINE TO GET INDIVIDUAL LINES  //
    const stringg = await FileSystem.readAsStringAsync(this.state.file)
    var splitByLines = stringg.split("\n");

               //     ITERATE OVER EACH LINE IN TEXT    //
           //    SPLIT BY NEWLINE TO GET INDIVIDUAL FIELDS   //
    //individualLine = [Name, Email, Password, Car Regi, groupID, phoneNumber] //
    var i
    for (i = 0; i < splitByLines.length; i++) {
      var individualLine = splitByLines[i].split(",");
      if (individualLine.length != 6) {
        console.log("inappropriate input line encountered")
        continue;
      } else {
        //    CREATE USER ON FIREBASE AUTHENTICATION SERVER    //
          //        (need to wait on it's completion)     //
         //       uid NEEDS TO BE DECLARED OUTSIDE THE FIREBASE FUNCTION   //
        var uid
        await firebase.auth().createUserWithEmailAndPassword(individualLine[1], individualLine[2]).then(data => {  
          console.log("User ID :- ", data.user.uid);
          uid = data.user.uid
       })
       .catch(error => {
          console.log(error);
       });

        //   CHECK IF THE USER HAS ALREADY BEEN GIVEN A GROUP   //
        //   UPDATE GROUP INFO LOCALLY BEFORE PUSHING TO FIREBASE  //
        var j
        var assignArray
        var nuCapacity
        if (individualLine[4] != -1) {
          console.log("CASH MO NEY")
          for (j = 0; j < groups.length; j++) {
            if (groups[j][0] === parseInt(individualLine[4])) {
              nuCapacity = groups[j][1]+1
              groups[j][1] = nuCapacity
              groups[j][3].push(uid)
              assignArray = groups[j][3]
              break;
            }
          }

          var userDay = assignArray.indexOf(uid)+1   //0 is sunday
          var assignmentDay = moment().day(7+userDay)
          var assignmentDayString = assignmentDay.format("DD-MM-YYYY")
          //  UPDATE THE GROUP DOC IN THE DATABASE   //broke
          console.log(individualLine[0] + "  -  "+uid)
          console.log(userDay)
          console.log(assignmentDayString)
          let updateGroupDoc = await firebase.firestore().collection('groups').doc(individualLine[4]).update({
            numUsers: nuCapacity,
            assignList: assignArray
          })
        }

        //    ASSIGN USER FIRST SPACE     //
        let setUserSpace = await firebase.firestore().collection('spaceAssigned')
        .doc(uid).collection('Dates').doc(assignmentDayString).set({
            date: assignmentDayString,
            spaceID: individualLine[4]
        })


        //   CREATE USER DOC IN THE DATABASE    //
        let setdoc = firebase.firestore().collection('users').doc(uid).set({
          name: individualLine[0],
          email: individualLine[1],
          car: individualLine[3],
          groupID: individualLine[4],
          phone: individualLine[5],
          spaceDay: userDay
        })

      }
    }
    //  NAV BACK TO ADMIN WHEN DONE   //
    this.props.navigation.navigate("Admin");
  }

  render() {
    return (
      <View style={styles.mainView}>
        <View style={styles.buttons}>
          <Button
            title="Select File"
            color="#391961"
            onPress={this.handleSelectFile}
          />
        </View>
        <View style={styles.buttons}>
          <Button
            title="Run population script"
            color="#391961"
            onPress={this.handleRunPop}
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
    flex: 0.3,
  },
});