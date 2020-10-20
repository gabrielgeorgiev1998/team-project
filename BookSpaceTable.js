import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, DeviceEventEmitter } from 'react-native';
import { Table, TableWrapper, Row } from 'react-native-table-component';
import PressableRow2 from './pressableRow2.js'
import * as firebase from "firebase";

export default class BookTableComponent extends Component {

    //   INITIALISE STATE AND GET CURRENT USER  //
    constructor(props) {
        super(props);
        this.state = {
            tableData: [],
            tableHead: ["Date", "Space ID"],
            currentUser: firebase.auth().currentUser,
        };
        this.handler = this.handler.bind(this)
        this.querySpaces = this.querySpaces.bind(this);

    }
    state = {
        trig: false,
        index: 0
    }

    //   FOR THE CHILD COMPONENT row TO ACCESS THE PARENT STATE //
    handler(row) {
        var tableData = this.state.tableData
        var array = tableData.filter(function (item) { return item[0] != row[0] })
        this.setState({
            tableData: array
        })
    }


    handleLongPress = (indexTaken) => {
        this.setState({
            trig: true,
            index: indexTaken

        })
    }

    querySpaces = async () => {
        var testingData = [];
        var GID

        //  INITIALISE MOMENT  //
        var moment = require('moment')
        moment().format()

        //  GET USER GROUP ID  //
        let getUser = await firebase.firestore().collection('users').doc(this.state.currentUser.uid).get().then(doc => {
            GID = doc.data().groupID
        })

        // GET ALL SPACES FROM SPACE FREED, ADD TO testingData //
        let getTableData = await firebase
            .firestore()
            .collection('spaceFreed')
            .doc(GID)
            .get()
            .then(doc => {
                console.log(doc.data());
                var spaceID = doc.data().spaceID;
                var datesArray = [];
                datesArray = (doc.data().publicDates);
                var length = parseInt(datesArray.length)
                for (var i = 0; i < length; i = i + 1) {
                    testingData.push([datesArray[i], spaceID])
                }
            })
            .catch(err => {
                console.log("Error getting documents", err);
            });


        //   REMOVE EXPIRED SPACES  //
        //   KEEP NON EXPIRED SPACES IN NEW ARRAY  //
        console.log("Remove expired date started.")
        var spaceArray = []
        for (var index = 0; index < testingData.length; index++) {
            var dateSplitUp = testingData[index][0].split("-")
            let day = parseInt(dateSplitUp[0])
            let month = parseInt(dateSplitUp[1])
            let year = parseInt(dateSplitUp[2])
            var compareDate = moment().year(year).month(month - 1).date(day)
            if (moment().isAfter(compareDate)) {
                var deleteString = compareDate.format("DD-MM-YYYY")
                console.log(deleteString + " EXPIRED")
                var newArray = []
                let getSpaceFreed = await firebase.firestore().collection('spaceFreed').doc(testingData[index][1].toString())
                    .get().then(doc => {
                        newArray = doc.data().publicDates
                        
                    })
                    var spindex = newArray.indexOf(deleteString);
                    if(spindex>-1){
                        newArray.splice(spindex, 1);
                    }
                let updateSpaceFreed = await firebase.firestore().collection('spaceFreed').doc(testingData[index][1].toString()).update({
                    publicDates:newArray
                })
            } else {
                spaceArray.push([testingData[index][0], testingData[index][1]])
            }
        }
        console.log("spaceArray: "+spaceArray)
    
        //CONVERT EACH DATE STRING IN ARRAY TO Date OBJECT AND ADD TO SEPERATE ARRAY //
        var sortArray = []
        for (var j = 0; j < spaceArray.length; j++) {
            var dateParts = spaceArray[j][0].split("-")
            var dateToAdd = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
            sortArray.push([dateToAdd, spaceArray[j][1]])
        }
        //  SORT ARRAY  //
        sortArray.sort(this.sortFunction)
        
        //CONVERT EACH DATE OBJECT BACK TO STRING AND ADD TO finalArray TO BE SET IN STATE //
        var finalArray = []
        for (var k = 0; k < sortArray.length; k++) {
            var dateMoment = moment(sortArray[k][0])
            var dateString = dateMoment.format("DD-MM-YYYY")
            finalArray.push([dateString, sortArray[k][1]])
        }

        this.setState({ tableData: finalArray })
    }

    // SORT FUNCTION FOR COMPARING DATES  //
    sortFunction = function (a, b) {
        if (a[0] === b[0]) {
            return 0;
        }
        else {
            return (a[0] < b[0]) ? -1 : 1;
        }
    }

    //  CALLED WHEN COMPONENT LOADS   //
    componentDidMount() {
        this.querySpaces();
        this.subscription = DeviceEventEmitter.addListener("refreshTable", this.querySpaces);
    }

    componentWillUnmount() {
        this.subscription.remove()
    }

    render() {
        console.disableYellowBox = true;
        console.ignoredYellowBox = [
            'Setting a timer'
        ];
        return (
            <View style={styles.container}>
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
                                        <PressableRow2 handler={this.handler} rowData={rowData} key={index} index={index} />
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