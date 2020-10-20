import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, Button, DeviceEventEmitter } from 'react-native';
import { Table, TableWrapper, Row } from 'react-native-table-component';
import * as firebase from 'firebase';

// this pressableRow component is used for the homepage table (TableComponent.js). When you press on a row you are given the 
// option to free your space to the market of just free it to your group. 

// This pressableRow should handle freeing a space to group and freeing a space to all

export default class PressableRow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isPressed: false,
            isVisible: this.props.visible
        }
    }

    
    handleLongPress() {
        this.setState({
            isPressed: true
        });
        
     setTimeout(() => { this.setState({
            isPressed: false
        });}, 4000);

    }

    handleFreeToGroup = (rowData) => {
        this.setState({ 
            isPressed: false,
            
        });
        this.handleGroupFree(rowData)
    }

        
    // Function to handle freeing a space to the group. This function queries the firebase database. 
    handleGroupFree=async(rowData)=>{
        var array = []
        let getSpaceFreedDoc = await firebase.firestore().collection('spaceFreed').doc(rowData[1].toString()).get().then(doc=>{
            array = doc.data().publicDates
        })
        array.push(rowData[0])
        var user =  firebase.auth().currentUser

        let getUserGroup = await firebase.firestore().collection('users').doc(user.uid).get().then(doc => {
            var groupID = doc.data().groupID;   
        });
        console.log(user.email)
        console.log(rowData[0].toString())
    
        // Delete the selected space from the 'spaceAssigned' collection (collection of user's spaces) 
        let deleteDoc = await firebase.firestore().collection('spaceAssigned').doc(user.uid)
        .collection('Dates').doc(rowData[0].toString()).delete().then(function() {
            console.log("Document successfully deleted!");
        }).catch(function(error) {
            console.error("Error removing document: ", error);
        });
        ;
        
        // Add selected space to the 'spaceFreed' collection (the collection of free group spaces)
        let spaceFreedSetDoc = await firebase.firestore().collection('spaceFreed').doc(rowData[1].toString()).update({
            publicDates:array
        });
        this.props.handler(rowData)
    }


    handleFreeToAll = (rowData) => {
        this.setState({
            isPressed: false,
        });
        this.handleAllFree(rowData)
    }

    // Function to handle freeing a space to everyone (the market) by quering the firebase database.
    handleAllFree=async(rowData)=>{
        var array = []
        let getMarketSpaceDoc = await firebase.firestore().collection('marketSpaces').doc(rowData[1].toString()).get().then(doc=>{
            array = doc.data().Dates
        })
        array.push(rowData[0])
        var user =  firebase.auth().currentUser

        let getUserGroup = await firebase.firestore().collection('users').doc(user.uid).get().then(doc => {
            var groupID = doc.data().groupID;   
        });
        console.log(user.email)
        console.log(rowData[0].toString())
        console.log(array)
    
         // Delete the selected space from 'spaceAssigned' (your spaces) and adds it
        let deleteDoc = await firebase.firestore().collection('spaceAssigned').doc(user.uid)
        .collection('Dates').doc(rowData[0]).delete().then(function() {
            console.log("Document successfully deleted!");
        }).catch(function(error) {
            console.error("Error removing document: ", error);
        });
        ;
        
        // Add selected space to 'marketSpaces' (the collection of free market spaces)
        let spaceFreedSetDoc = await firebase.firestore().collection('marketSpaces').doc(rowData[1].toString()).update({
            Dates:array
        });
        this.props.handler(rowData)
    }

    

    render() {
        return (
            <View>
                {this.state.isVisible &&
                    <TouchableOpacity onLongPress={() => this.handleLongPress()}>
                        <Row
                            key={this.props.key}
                            data={this.props.rowData}
                            style={[styles.row, this.props.index % 2 && { backgroundColor: '#DDDDDD' }]}
                            textStyle={styles.text}
                        />
                    </TouchableOpacity>}
                {this.state.isVisible && this.state.isPressed &&
                    <View style={styles.redRow} >
                        <TouchableOpacity style={styles.redGroup} onPress={() => this.handleFreeToGroup(this.props.rowData)} ><Text style={styles.freeButton}>Free to group</Text></TouchableOpacity>
                        <TouchableOpacity style={styles.redAll} onPress={() => this.handleFreeToAll(this.props.rowData)} ><Text style={styles.freeButton}>Free to all</Text></TouchableOpacity>
                    </View>}
            </View>
        )
    }
}


const styles = StyleSheet.create({
    row: { height: 55, backgroundColor: '#EEEEEE', width: 330 },
    text: { textAlign: 'center', fontWeight: 'normal', fontSize: 20, color: '#201648' },
    redRow: { height: 55, backgroundColor: '#9B243A', width: 330, flexDirection: 'row', position: 'absolute', opacity: .8, flex: 1, flexDirection: 'row' },
    touch: { position: 'absolute',  height: 55, width: 300 },
    freeButton: { fontSize: 20, alignSelf: 'center', color: '#FFFFFF' },
    redAll: { width: '40%', alignSelf: 'center' },
    redGroup: { width: '60%', alignSelf: 'center' }
})