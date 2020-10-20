import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Text, DeviceEventEmitter } from 'react-native';
import { Table, Row } from 'react-native-table-component';
import PressableRow from './pressableRow.js'
import * as firebase from "firebase";

export default class TableComponent extends Component {
  constructor(props) {
    super(props);
    //the state tabledata has been changed to match the format from parent component
    this.state = {
      currentUser: this.props.user,
      // get all of users spaces from database and put it in  table

      tableHead: ["Date", "Space ID"],
      //date data must be stored like this
      // DD-MM-YYYY
      tableData: []
    };
    this.handler = this.handler.bind(this)
    this.querySpaces = this.querySpaces.bind(this)
  }

  //    ALLOWS THE CHILD COMPONENT PRESSABLE ROW TO UPDATE STATE   //
  handler(row) {
    var tableData = this.state.tableData
    var array = tableData.filter(function(item){ return item[0] != row[0] })  
    this.setState({
      tableData: array
    })
  }


  querySpaces = async () => {
    var testingData = [];

    //   INITIALISE MOMENT   //
    var moment = require('moment');
    moment().format();

    //   GET ALL SPACES AND ADD THEM TO ARRAY testingData TO LATER BE CONVERTED TO AN ARRAY OF Date OBJECTS  //
    let getspaces = await firebase
      .firestore()
      .collection("spaceAssigned")
      .doc(this.state.currentUser.uid)
      .collection('Dates')
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          var spaceID = doc.data().spaceID;
          var date = doc.data().date;
          testingData.push([date, spaceID])
        });
      })
      .catch(err => {
        console.log("Error getting documents", err);
      });

    //CONVERT EACH DATE STRING IN ARRAY TO Date OBJECT AND ADD TO SEPERATE ARRAY //
    var sortArray = []
    for (var j = 0; j < testingData.length; j++) {
      var dateParts = testingData[j][0].split("-")
      // month is 0-based, that's why we need dataParts[1] - 1
      var dateToAdd = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
      sortArray.push([dateToAdd,testingData[j][1]])
    }
    //SORT SEPERATE ARRAY //
    sortArray.sort(this.sortFunction)

    //CONVERT EACH DATE OBJECT BACK TO STRING AND ADD TO finalArray TO BE SET IN STATE //
    var finalArray = []
    for(var k = 0; k < sortArray.length; k++){
      let dateMoment = moment(sortArray[k][0])
      var dateString = dateMoment.format("DD-MM-YYYY")
      finalArray.push([dateString,sortArray[k][1]])
    }
    this.setState({ tableData: finalArray })
  }


//   FUNCTION FOR SORTING THE DATE ARRAY  //
sortFunction=function(a, b) {
  if (a[0] === b[0]) {
      return 0;
  }
  else {
      return (a[0] < b[0]) ? -1 : 1;
  }
}


  state = {
    trig: false,
    index: 0
  }

  //  GETS RUN WHEN THE COMPONENT IS LOADED   //
  componentDidMount() {
    this.querySpaces();
  }

  render() {
    console.disableYellowBox = true;
    console.ignoredYellowBox = [
      "Setting a timer"
    ];
    return (
      <View style={styles.container}>
        <View style={styles.titleView}>
          <Text style={styles.titleText}>Assigned spaces</Text>
        </View>
        <ScrollView horizontal={true}>
          <View style={styles.table}>
            <Table style={styles.table}>
              <Row data={this.state.tableHead} style={styles.header} textStyle={styles.textHeader} />
            </Table>
            <ScrollView style={styles.dataWrapper}>
              <Table >
                {this.state.tableData.map((rowData, index) => (
                  <PressableRow handler = {this.handler} visible={true} rowData={rowData} key={Date.now() + index} index={index} />
                ))
                }
              </Table>
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: { flex: 2.7, backgroundColor: '#FFFFFF', alignItems: 'center', height: '100%', flexDirection: "column" },
  header: { height: 50, backgroundColor: '#5B4A71', width: 330 },
  text: { textAlign: 'center', fontWeight: 'normal', fontSize: 20, color: '#201648' },
  dataWrapper: { marginTop: -1, flex: 1 },
  row: { height: 55, backgroundColor: '#EEEEEE', width: 330 },
  titleView: { backgroundColor: '#391961', width: '100%', height: 40, alignSelf: 'center' },
  titleText: { textAlign: 'center', fontWeight: 'normal', fontSize: 27, color: '#FFFFFF' },
  textHeader: { textAlign: 'center', fontWeight: 'normal', fontSize: 20, color: '#FFFFFF' },
  removeScreen: { backgroundColor: 'red', width: '100%', height: '100%' },
  table: { borderRadius: 1, borderColor: '#BBBBBB' }
});