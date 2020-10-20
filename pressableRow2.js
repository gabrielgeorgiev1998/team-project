import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, DeviceEventEmitter } from 'react-native';
import * as firebase from 'firebase';
import { Row } from 'react-native-table-component';

// pressableRow2 component is used for the group spaces (BookSpaceTable.js). When you press down on a row in
// group spaces should have the option to book spaces

export default class PressableRow extends Component {

    state = {
        isPressed: false,
        isVisible: true,
    }

    handleLongPress() {
        this.setState({
            isPressed: true
        });
        
    setTimeout(() => { this.setState({
            isPressed: false
        });}, 4000);
    }


    
    // function to handle selecting/booking a space by quering the firebase database. 
    handleSelectSpace=async(rowData)=> {
        this.setState({
            isPressed: false,
        });
        var user = firebase.auth().currentUser
        
        // remove space from free spaces in database and assign to user
        console.log(rowData[0]) //date
        console.log(rowData[1]) //space id
       var docExists = false
       let getDoc = await firebase.firestore().collection('spaceAssigned')
       .doc(user.uid).collection('Dates').doc(rowData[0]).get().then(doc=>{
        console.log(doc.exists)
        if(doc.exists){
            
             // Checks to make sure you don't double book. So it'll send an alert if you try to book a space on a day you already have a space.
            alert("You already have a space on this day on "+rowData[0]+" at "+rowData[1].toString())
            docExists=true
            return 
        }
       })

          console.log(docExists)
       if(docExists===false)
       { var spaceArray = []
         console.log("HG")
        
        // query 'spaceFreed' collection (collection of free group spaces) in database and delete selected space from that collection
        let getSpaceFreed =  await firebase.firestore().collection('spaceFreed').doc(rowData[1].toString()).get().then(doc=>{
            spaceArray = doc.data().publicDates
        });
        var index = spaceArray.indexOf(rowData[1]);
        spaceArray.splice(index, 1);
        let updateDoc = await firebase.firestore().collection('spaceFreed').doc(rowData[1].toString()).update({
            publicDates:spaceArray
        })
        
        // query 'spaceAssigned' collection (collection of user's spaces) in database and add selected space from that collection
        let setDoc = await firebase.firestore().collection('spaceAssigned').doc(user.uid).collection('Dates').doc(rowData[0].toString()).set({
            spaceID: rowData[1].toString(),
            date: rowData[0].toString()
        });

        this.props.handler(rowData)}
    }


    render() {
        return (
            <View>
                {this.state.isVisible &&
                    <TouchableOpacity onLongPress={() => this.handleLongPress()}>
                        <Row
                            key={this.props.index}
                            data={this.props.rowData}
                            style={[styles.row, this.props.index % 2 && { backgroundColor: '#DDDDDD' }]}
                            textStyle={styles.text}
                        />
                    </TouchableOpacity>}
                {this.state.isPressed &&
                    <View style={styles.redRow} >
                        <TouchableOpacity style={styles.redGroup} onPress={() => this.handleSelectSpace(this.props.rowData)} ><Text style={styles.freeButton}>Book this space</Text></TouchableOpacity>
                    </View>}
            </View>
        )
    }
}


const styles = StyleSheet.create({
    row: { height: 55, backgroundColor: '#EEEEEE', width: 330 },
    text: { textAlign: 'center', fontWeight: 'normal', fontSize: 20, color: '#201648' },
    redRow: { height: 55, backgroundColor: '#9B243A', width: 330, flexDirection: 'row', position: 'absolute', opacity: .8, flex: 1, flexDirection: 'row' },
    touch: { position: 'absolute', height: 55, width: 300 },
    freeButton: { fontSize: 20, alignSelf: 'center', color: '#FFFFFF' },
    redGroup: { width: '60%', alignSelf: 'center' }
})