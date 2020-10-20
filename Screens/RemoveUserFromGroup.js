import React, { Component } from "react";
import { TextInput, Text, Alert, View, Button, StyleSheet } from "react-native";
import * as firebase from "firebase";

export default class CarparkView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            userFound: false,
            assignList: [],
            groupID: ''
        }
    }

    handleRemoveFromGroup = async () => {
        var groupID
        let user = await firebase.firestore().collection('users').doc(this.state.email).get().then(doc => {
            if (!doc.exists) {
                Alert.alert(
                    'Error',
                    this.state.email + ' is not a recognised email',
                    [
                        { text: 'OK' },
                    ],
                    { cancelable: false },
                )
            } else {
                //console.log(doc.data().groupID)
                groupID = doc.data().groupID
            }
        }).catch(error => {

        });

        if (groupID === undefined) {
            console.log("Undefined groupID - user didn't exist most likely")
        } else {
            let updateUser = await firebase.firestore().collection('users').doc(this.state.email).update({
                groupID: -1
            })
            if (groupID === -1) {
                console.log("User already not in a group")
            }else {
                var assignmentArray = []
                var capacity
                let getGroup = await firebase.firestore().collection('groups').doc(groupID.toString()).get().then(doc => {
                    assignmentArray = doc.data().assignList,
                        capacity = doc.data().numUsers
                })
                for (var i = 0; i < assignmentArray.length; i++) {
                    if (assignmentArray[i] === this.state.email) {
                        assignmentArray.splice(i, 1);
                    }
                }
                capacity -= 1
                let updateGroup = firebase.firestore().collection('groups').doc(groupID.toString()).update({
                    assignList: assignmentArray,
                    numUsers: capacity
                })
            }
        }
        this.setState({
            email:'removed'
        })
    }

    render() {
        return (
            <View style={styles.mainView}>
                <Text>Enter the users email which you want to remove from a group</Text>

                <TextInput
                    style={styles.textBox}
                    value={this.state.text}
                    onChangeText={text => this.setState({ email: text })}>
                </TextInput>
                <Button
                    title="Submit"
                    onPress={() =>
                        Alert.alert(
                            'Confirm',
                            'Press OK to remove ' + this.state.email + ' from their group',
                            [
                                {
                                    text: 'Cancel',
                                    onPress: () => console.log('Cancel Pressed'),
                                    style: 'cancel',
                                },
                                { text: 'OK', onPress: () => this.handleRemoveFromGroup() },
                            ],
                            { cancelable: false },
                        )
                    }
                />

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
    textBox: {
        height: 30,
        borderColor: "gray",
        borderWidth: 2,
        borderRadius: 10,
        paddingLeft: 5,

    },
    flexi: {
        flex: 1
    }
})

