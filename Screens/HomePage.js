import React, { Component } from "react";
import { StyleSheet, Text, View, Button, Alert } from "react-native";
import TableComponent from "../TableComponent.js";
import TopPart from "../TopPart.js";
import *  as firebase from "firebase";

export default class HomePage extends Component {
  _isMounted=false;
  constructor(props) {
    super(props);
    //   INITIALISE STATE  //
    this.state = {
      user: firebase.auth().currentUser,
      groupID: 0,
      spaceArray:[]
    }

    //this prop is to store the assigned position status
    //it's initialized with the data from login page, which should come from the database
    this.tableData = [
      ["404", "404", "404"],
      ["404", "404", "404"],
      ["404", "404", "404"],
      ["404", "404", "404"]
    ];
  }

  

 // navigation to admin page
  handleGoToAdmin = () => {
    this.props.navigation.navigate("Admin")
  }
  getForPopulateUserSpaces = async() => {
    var spaceArray = [];
    //    GET ALL SPACES ASSIGNED TO THE USER  //
    let assigned = await firebase.firestore().collection("spaceAssigned").doc(this.state.user.uid).collection("Dates")
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          var spaceID = doc.data().spaceID;
          var date = doc.data().date;
          spaceArray.push([date, spaceID]);
        });
      })
      .catch(err => {
        console.log("Error getting documents", err);
      });
      return spaceArray
  }
  

  updateUserSpaces = async() => {
    var spaceArrayX=[]
    spaceArrayX = await this.getForPopulateUserSpaces();
    var groupID
    var userSpaceDay

    //    INITIALISE MOMENT   //
    var moment = require('moment')
    moment().format()


    //   GET USER INFO FROM FIREBASE  //
    let getUser = await firebase.firestore().collection('users').doc(this.state.user.uid).get().then(doc=>{
        groupID = doc.data().groupID,
        userSpaceDay = doc.data().spaceDay
    })

    //   GET FREED GROUP SPACES  //
    var spaceFreedArray=[]
    let spaceFreed = await firebase.firestore().collection('spaceFreed').doc(groupID).get().then(doc=>{
        spaceFreedArray=doc.data().publicDates
    })

    
    //  REMOVE EXPIRED DATES //
    var spaceArray = []
    for(var index=0;index<spaceArrayX.length;index++){
      var dateSplitUp = spaceArrayX[index][0].split("-")
      let day = parseInt(dateSplitUp[0])
      let month = parseInt(dateSplitUp[1])
      let year = parseInt(dateSplitUp[2])
      var compareDate = moment().year(year).month(month-1).date(day)
      if(moment().isAfter(compareDate)){
        var deleteString = compareDate.format("DD-MM-YYYY")
        let deletedoc = await firebase.firestore().collection('spaceAssigned').doc(this.state.user.uid).collection('Dates').doc(deleteString).delete()
      }else{
        spaceArray.push([spaceArrayX[index][0],spaceArrayX[index][1]])
      }
    }

    //   USER HAS ENOUGH DATES  //
    var length = spaceArray.length
    if (length >= 10) {
      return;
    }      

    //   GET LATEST DATE USER HAS BEEN ASSIGNED  //
    var DD = 0
    var MM = 0
    var YY = 0
    if (spaceArray.length < 10) {
      for (var i = 0; i < length; i = i + 1) {
        if (spaceArray[i][1] !== groupID) { continue }
        var dateSplit = spaceArray[i][0].split("-")
        if (parseInt(dateSplit[2]) >= YY) {
          YY = parseInt(dateSplit[2])
          if (parseInt(dateSplit[1]) >= MM) {
            MM = parseInt(dateSplit[1])
            if (parseInt(dateSplit[0]) >= DD) {
              DD = parseInt(dateSplit[0])
            }
          }
        }
      }
    }
    
    //   GET MOST RECENT DATE IN MOMENT FORMAT  //
    var year = parseInt(YY)
    var month = parseInt(MM)
    var day = parseInt(DD)
    var mostRecentDate = moment().year(year).month(month-1).date(day)
    var datesToAdd = 10-spaceArray.length
    
    //  UPDATE USER SPACES  //
    for(var j=0;j<datesToAdd;j++){
      var dateCounter = userSpaceDay+7
      var dateToAdd = mostRecentDate.day(dateCounter)
      mostRecentDate = dateToAdd
     
      var stringToAdd = dateToAdd.format("DD-MM-YYYY")
      //  IF DATE HAS BEEN FREED BY USER DON'T ADD IT //
      if(spaceFreedArray.indexOf(stringToAdd) > -1){
        datesToAdd++
        continue;
      }else{
        var stringToAdd = dateToAdd.format("DD-MM-YYYY")
        console.log(stringToAdd)
        let setdoc = await firebase.firestore().collection("spaceAssigned")
        .doc(this.state.user.uid).collection('Dates').doc(stringToAdd).set({
          spaceID:groupID,
          date:stringToAdd
      })
    }
    }
  }

  // GETS CALLED WHEN THE COMPONENT LOADS //
  componentDidMount = () =>{
    this.updateUserSpaces()
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleProfile = () => {
    this.props.navigation.navigate("Profile", {user:this.state.user});//and send the information to the next page might use that ---   ,{user:this.state.user}
  };
  handleHome = () => {
    this.props.navigation.navigate("Home", {user:this.state.user});
  };
  handleCarparkView = () => {
    this.props.navigation.navigate("CarPark");
  };
  handleBarCode = () => {
    this.props.navigation.navigate("BarCode");
  };
  handleFreeSpace = () => {
    this.props.navigation.navigate("SignUp");
  };
  handleLookForSpace = () => {
    this.props.navigation.navigate("LookForSpace");
  };
  handleMarketSpaces = () => {
    this.props.navigation.navigate("MarketSpaces")
  }
  handleGroupAssign = () => {
    this.props.navigation.navigate("GroupManage");
  };
  static navigationOptions = { headerShown: false };


  test = () => {
    var moment = require('moment');
    moment().format();
    console.log(parseInt("05"))
    var consolelog = moment().date(parseInt("05")).day(7 + 5)
    console.log(consolelog)
    // console.log(this.state.tableData)
  };


  render() {
    return (
      <View style={styles.mainView}>
        <TopPart handle1={this.handleHome} handle2={this.handleProfile} />
        <TableComponent ref="assignTable" user={this.state.user}/>
        <View style={styles.buttons}>
          <Button
            title="Group Spaces"
            color="#391961"
            onPress={this.handleLookForSpace}
          />
        </View>
        <View style={styles.buttons}>
          <Button
            title="View carpark"
            color="#391961"
            onPress={this.handleCarparkView}
          />
        </View>
        <View style={styles.buttons}>
          <Button
            title="Search for space"
            color="#391961"
            onPress={this.handleMarketSpaces}
          />
        </View>
        <View style={styles.buttons}>
          <Button
            title="report"
            color="#391961"
            onPress={this.handleBarCode}
          />
        </View>
        <View style={styles.buttons}>
          <Button
            title="admin"
            color="#391961"
            onPress={this.handleGoToAdmin}
          />
        </View>
        <View style={styles.buttons}>
          <Button
            title="test"
            color="#391961"
            onPress={this.updateUserSpaces}
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
  },
  reportButton: {
    alignItems: "center",
    padding: 10,
    height: "30%",
    width: "40%",
    alignSelf: "flex-end",
    top: "20%"
  }
});