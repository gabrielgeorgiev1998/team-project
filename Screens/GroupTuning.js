import React, { Component } from "react";
import { Text, View, StyleSheet, ScrollView, Button, Alert } from "react-native";
import * as firebase from "firebase";
import { ListItem, CheckBox } from 'react-native-elements'
import MessageNotification from "../notification.js"


export default class GroupTuning extends Component {

    constructor(props) {
        super(props);
        this.state = {
            usersNoGroup: [],
            groups: [],
            users: [],
            selectedUser: '',
            assignMap: {},
            title: '',
            message: '',
            modalVisibility: false
        };
    }

    // toggle group assign

    getUsersWithoutGroup =()=>{
        let usersNaeGroup = []
        firebase.firestore().collection('users').get().then(snapshot => {
            snapshot.forEach(doc=>{
                if(doc.data().groupID==-1){
                    let name = doc.data().name;
                    let email = doc.data().email;
                    usersNaeGroup.push([name, email])
                }
            })
            this.setState({usersNoGroup:usersNaeGroup})
        })
    }

    getGroups=()=>{
        let groupArray = []
        firebase.firestore().collection('groups').get().then(snapshot => {
            snapshot.forEach(doc=>{
                let groupID = doc.data().groupID;
                let numUsers = doc.data().numUsers;
                let name = doc.data().name;
                let array = doc.data().defaultAssignment;
                groupArray.push([groupID, numUsers, name,array])
            })
            this.setState({groups:groupArray})
        })
    }

    handleAssignUser=(userEmail, index)=>{
        console.log("HELLO")
        var nuGroupID
        var newCapacity
        let groups = this.state.groups
        var i
        for (i = 0; i < groups.length; i++) {
            if (groups[i][1] < 5) {
                nuGroupID = groups[i][0]
                newCapacity = groups[i][1] + 1
                groups[i][1] = newCapacity
                break
            }
        }
        console.log(groups)
        groups[i][3].push(userEmail)

        this.setState({
            groups:groups
        })
        let setUserDoc = firebase.firestore().collection('users').doc(userEmail).update({
            groupID:nuGroupID
        })
        let setGroupDoc = firebase.firestore().collection('groups').doc(nuGroupID.toString()).update({
            numUsers:newCapacity,
            defaultAssignment:groups[i][3]
        })

        let users = this.state.usersNoGroup
        for( var i = 0; i < users.length; i++){
             if ( users[i][1] === userEmail) {
                  users.splice(i, 1); }
        }
        this.setState({usersNoGroup:users})
        alert(userEmail + " has been added to group " + groups[i][0])
    }
    


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
                                      {text: 'OK', onPress: () => this.handleAssignUser(userData[1], index)},
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