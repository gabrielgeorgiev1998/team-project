import React, { Component } from "react";
import { Text, View, StyleSheet, ScrollView, Button, Alert } from "react-native";
import * as firebase from "firebase";
import { ListItem, CheckBox } from 'react-native-elements'
import MessageNotification from "../notification.js"


export default class GroupManage extends Component {

    constructor(props) {
        super(props);
        // INITIALISE STATE  //
        this.state = {
            usersNoGroup: [],
            groups: [],
            users: [],
            modalVisibility: false
        };
    }


    getUsersWithoutGroup =()=>{
        //     GET USERS NOT ASSIGNED TO A GROUP    //
        //     GROUP ID WILL BE -1 IN THIS CASE     //
        let usersNaeGroup = []
        console.log(parseInt("-1"))
        firebase.firestore().collection('users').get().then(snapshot => {
            snapshot.forEach(doc=>{
                if(parseInt(doc.data().groupID)==-1){
                    let name = doc.data().name;
                    let email = doc.data().email;
                    usersNaeGroup.push([name, email,doc.id])
                }
            })
            console.log(usersNaeGroup)
            this.setState({usersNoGroup:usersNaeGroup})
        })
    }

    getGroups=()=>{
        //      GET ALL GROUPS    //
        let groupArray = []
        firebase.firestore().collection('groups').get().then(snapshot => {
            snapshot.forEach(doc=>{
                let groupID = doc.data().groupID;
                let numUsers = doc.data().numUsers;
                let name = doc.data().name;
                let array = doc.data().assignList;
                groupArray.push([groupID, numUsers, name,array])
            })
            this.setState({groups:groupArray})
        })
    }

    handleAssignUser=(uid)=>{
        //     ASSIGN USER TO GROUP    //
        // TAKES PARAM uid WHICH IS THE USER ID  //
        var nuGroupID
        var newCapacity
        let groups = this.state.groups

                        //     SEARCH THROUGH GROUPS    //
        //    TAKE GROUP ID OF FIRST GROUP WHOSE CURRENT CAPACITY IS LESS THAN 5  //
        var i
        for (i = 0; i < groups.length; i++) {
            if (groups[i][1] < 5) {
                nuGroupID = groups[i][0]
                newCapacity = groups[i][1] + 1
                groups[i][1] = newCapacity
                break
            }
        }
        //     UPDATE GROUPS IN STATE   //
        groups[i][3].push(uid)
        this.setState({
            groups:groups
        })
        //  UPDATE USER DOC   //
        let setUserDoc = firebase.firestore().collection('users').doc(uid).update({
            groupID:nuGroupID
        })
        //   UPDATE GROUP DOC   //
        let setGroupDoc = firebase.firestore().collection('groups').doc(nuGroupID.toString()).update({
            numUsers:newCapacity,
            assignList:groups[i][3]
        })

        //    REMOVE USER FROM USERS WITH NO GROUP IN STATE   //
        let users = this.state.usersNoGroup
        for( var i = 0; i < users.length; i++){
             if ( users[i][1] === uid) {
                  users.splice(i, 1); }
        }
        this.setState({usersNoGroup:users})
        alert("Added to group " + nuGroupID)
    }


    //   RUNS WHEN THE SCREEN LOADS   //
    componentDidMount() {
        this.getUsersWithoutGroup();
        this.getGroups();
    }

    render() {
        return (
            <View style={styles.mainView}>
                <ScrollView>

                    {this.state.usersNoGroup.map((userData,index) => (
                        <Button
                            style={styles.button}
                            key={index}
                            title={userData[1]}
                            onPress={()=>
                                Alert.alert(
                                    'Confirm',
                                    'Press OK to add '+userData[0] +' to a group',
                                    [
                                      {
                                        text: 'Cancel',
                                        onPress: () => console.log('Cancel Pressed'),
                                        style: 'cancel',
                                      },
                                      {text: 'OK', onPress: () => this.handleAssignUser(userData[2])},
                                    ],
                                    {cancelable: false},
                                  )
                            }
                        ></Button>
                    ))}
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainView: {
        flex:1,
        width: null,
        height: null,
        backgroundColor: '#FFFFFF'
    },
     button:{
        flex:1,
        borderRadius:4
     }
});