import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { Table, TableWrapper, Row } from 'react-native-table-component';
import PressableRow3 from './pressableRow3.js'
import * as firebase from "firebase";

export default class MarketSpaceTableComponent extends Component {


    //   INITIALISE STATE AND GET CURRENT USER //
    constructor(props) {
        super(props);
        this.state = {
            tableData: [],
            tableHead: ["Date", "Space ID"],
            currentUser: firebase.auth().currentUser,
        };
        this.handler = this.handler.bind(this)

    }
    state = {
        trig: false,
        index: 0
    }

    //    ALLOWS THE CHILD COMPONENT PRESSABLE ROW TO UPDATE STATE   //
    handler(row) {
        var tableData = this.state.tableData
        var array = tableData.filter(function (item) { return item[0] != row[0] })
        this.setState({
            tableData: array
        })
    }


    handleLongPress = (indexTaken) => {
        console.log(indexTaken);
        this.setState({
            trig: true,
            index: indexTaken

        })
    }

    querySpaces = async () => {
        var testingData = [];
        var GID

        //    INITIALISE MOMENT   //
        var moment = require('moment')
        moment().format()

        //    GET THE USERS GROUP ID FROM THE USER DOC   //
        let getUser = await firebase.firestore().collection('users').doc(this.state.currentUser.uid).get().then(doc => {
            GID = doc.data().groupID
        })

        //    GET ALL THE SPACES FROM marketSpaces  //
        let getTableData = await firebase
            .firestore()
            .collection('marketSpaces')
            .get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    let spaceID = doc.data().spaceID
                    let spaceArray = doc.data().Dates

                    for (var i = 0; i < spaceArray.length; i++) {
                        testingData.push([spaceArray[i], spaceID])
                    }
                })
            })

        //  REMOVE EXPIRED DATES //
        //  ADD VALID ONES TO SEPERATE ARRAY //
        var spaceArray = []
        for (var index = 0; index < testingData.length; index++) {
            var dateSplitUp = testingData[index][0].split("-")
            let day = parseInt(dateSplitUp[0])
            let month = parseInt(dateSplitUp[1])
            let year = parseInt(dateSplitUp[2])
            var compareDate = moment().year(year).month(month - 1).date(day)
            if (moment().isAfter(compareDate)) {
                var deleteString = compareDate.format("DD-MM-YYYY")
                var newArray = []
                let getSpaceFreed = await firebase.firestore().collection('marketSpaces').doc(parseInt(testingData[index][1]).toString())
                    .get().then(doc => {
                        newArray = doc.data().Dates
                    })
                    var spindex = newArray.indexOf(deleteString);
                        newArray.splice(spindex, 1);
                let updateSpaceFreed = await firebase.firestore().collection('marketSpaces').doc(parseInt(testingData[index][1]).toString()).update({
                    Dates: newArray
                })
            } else {
                spaceArray.push([testingData[index][0], testingData[index][1]])
            }
        }
        
        //CONVERT EACH DATE STRING IN ARRAY TO Date OBJECT AND ADD TO SEPERATE ARRAY //
        var sortArray = []
        for (var j = 0; j < spaceArray.length; j++) {
            var dateParts = spaceArray[j][0].split("-")
            // month is 0-based, that's why we need dataParts[1] - 1
            var dateToAdd = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
            sortArray.push([dateToAdd, spaceArray[j][1]])
        }
        
        //SORT SEPERATE ARRAY //
        sortArray.sort(this.sortFunction)

        //CONVERT EACH DATE OBJECT BACK TO STRING AND ADD TO finalArray TO BE SET IN STATE //
        var finalArray = []
        for (var k = 0; k < sortArray.length; k++) {
            var dateMoment = moment(sortArray[k][0])
            var dateString = dateMoment.format("DD-MM-YYYY")
            finalArray.push([dateString, sortArray[k][1]])
        }

        //   SET IN STATE   //
        this.setState({ tableData: finalArray })
    }


    //    SORT FUNCTION FOR SORTING THE ARRAY   //
    sortFunction = function (a, b) {
        if (a[0] === b[0]) {
            return 0;
        }
        else {
            return (a[0] < b[0]) ? -1 : 1;
        }
    }

    //    CALLED WHEN THE COMPONENT IS LOADED  //
    componentDidMount() {
        this.querySpaces();
    }
    render() {
        console.disableYellowBox = true;
        console.ignoredYellowBox = [
            'Setting a timer'
        ];
        return (
            <View style={styles.container} >
                <View style={styles.titleView}>
                    <Text style={styles.titleText}>Free Spaces</Text>
                </View>
                <ScrollView horizontal={true}>
                    <View style={styles.table}>
                        <Table style={styles.table}>
                            <Row data={this.state.tableHead} style={styles.header} textStyle={styles.textHeader} />
                        </Table>
                        <ScrollView style={styles.dataWrapper}>
                            <Table >
                                {
                                    this.state.tableData.map((rowData, index) => (
                                        <PressableRow3 handler={this.handler} rowData={rowData} key={index} index={index} />
                                    ))
                                }
                            </Table>
                        </ScrollView>
                    </View>
                </ScrollView>
            </View >
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