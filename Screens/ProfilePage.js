import React, { Component } from "react";
import { StyleSheet, Text, View, Button, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, ScrollView } from "react-native";
import { createAppContainer } from "react-navigation";
import { createStackNavigator, CardStyleInterpolators } from "react-navigation-stack";
import TopPart from "../TopPart";
import * as firebase from "firebase";

//config for firebase initialization
const firebaseConfig = {
    apiKey: "AIzaSyBP8QSkr00xWRxyheCu8eBQT6BmanZ5T8k",
    authDomain: "expo-carpark.firebaseapp.com",
    databaseURL: "https://expo-carpark.firebaseio.com",
    projectId: "expo-carpark",
    storageBucket: "expo-carpark.appspot.com",
    messagingSenderId: "628696735344",
    appId: "1:628696735344:web:699842d748b9306e9fdeb5"
};

//checks if a firebase app has been initialized, and initializes one if it hasn't
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export default class ProfilePage extends Component {
    constructor(props) {
        super(props);

        //no nesting in state because nested objects in a react native state behave in unfortunate ways
        this.state = {
            currUser: this.props.navigation.state.params.user,
            name: '',
            email: '',
            phone: '',
            car1: '',
            car2: '',
            newpass: '',
            confirmpass: '',
            currpass: '',
            changeFlag: false,
            emailChangeFlag: false
        };
    }

    static navigationOptions = { headerShown: false };

    //this gets ran when the profile page is loaded and sets the state variables to be equal to values queried
    //from the user doc in the database
    setUserState() {
        let userRef = firebase.firestore().collection('users').doc(this.state.currUser.uid.toString());
        let userDoc = userRef.get().then(doc => {
            if (!doc.exists) {
                console.log('No such document!');
            } else {
                this.setState({
                    name: doc.get('name'),
                    email: doc.get('email'),
                    phone: doc.get('phone'),
                    car1: doc.get('Car 1'),
                    car2: doc.get('Car 2'),
                });
            }
        }).catch(err => {
            console.log('Error getting document', err);
        });
    }

    componentDidMount() {
        this.setUserState();
    }

    //navigation handlers for the top part
    handleHome = () => {
        this.props.navigation.navigate("Home");
    };
    handleProfile = () => {
        this.props.navigation.navigate("Profile");
    };

    //log out handler for the log out button
    handleLogOut = () => {
        firebase.auth().signOut();
        Alert.alert('You have successfully logged out.')
        this.props.navigation.navigate("LogIn");
    }

    //gets ran when save changes button is pressed
    saveChanges() {
        //firebase's api requires that reauthentication happens before updating the database
        this.state.currUser.reauthenticateWithCredential(
            firebase.auth.EmailAuthProvider.credential(
                this.state.currUser.email.toString(),
                this.state.currpass
            )
        ).then(() => {
            //if both the password fields are non-empty, then changePassword() is ran
            if(this.state.newpass!='' && this.state.confirmpass!='') {
                this.changePassword();
            }

            //changeFlag is set to false on initialization, and set to true if any of the text fields corresponding to
            //values stored in the user document, so that the user document is updated only if some of the text fields
            //are changed
            if(this.state.changeFlag==true) {
                let userDocData = {
                    'name': this.state.name,
                    'phone': this.state.phone,
                    'Car 1': this.state.car1,
                    'Car 2': this.state.car2
                }

                firebase.firestore().collection('users').doc(this.state.currUser.uid.toString()).update(userDocData);
            }

            //email has a separate changeFlag because both the user document and the user account need to be updated,
            //since they both store the email
            if(this.state.emailChangeFlag==true) {
                let emailDoc = { 'email': this.state.email };
                this.state.currUser.updateEmail(this.state.email).then(() => {
                    firebase.firestore().collection('users').doc(this.state.currUser.uid.toString()).update(emailDoc);
                }).catch(function(error) {
                    Alert.alert('Invalid email.');
                });
            }
            Alert.alert('Profile details changed successfully.')
        }).catch(function (error) {
            Alert.alert('Wrong password.');
            console.log(error.message);
        });
    }

    changePassword() {
        //compares the strings in the password fields, and updates the passwords if they match, alerts if they don't
        if(this.state.newpass==this.state.confirmpass) {
            this.state.currUser.updatePassword(this.state.newpass);
            Alert.alert('Password changed successfully.');
        }
        else {
            Alert.alert('Passwords don\'t match.');
        }
    }

    render() {
        return (
            <View style={styles.mainView}>
                <TopPart handle1={this.handleHome} handle2={this.handleProfile} />
                <View style={{ height: '80%' }}>
                    <ScrollView style={styles.scrollView}>

                        <Text style={styles.title}>Name:</Text>
                        <TextInput
                            style={styles.textBox}
                            onChangeText={text => this.setState({
                                name: text,
                                changeFlag: true
                            })}
                            defaultValue={this.state.name}
                            selectTextOnFocus={true}
                        />

                        <Text style={styles.title}>Email:</Text>
                        <TextInput
                            style={styles.textBox}
                            onChangeText={text => this.setState({
                                email: text,
                                changeFlag: true,
                                emailChangeFlag: true
                            })}
                            defaultValue={this.state.email}
                            selectTextOnFocus={true}
                        />

                        <Text style={styles.title}>Phone:</Text>
                        <TextInput
                            style={styles.textBox}
                            onChangeText={text => this.setState({
                                phone: text,
                                changeFlag: true
                            })}
                            defaultValue={this.state.phone}
                            selectTextOnFocus={true}
                        />

                        <Text style={styles.title}>Car 1:</Text>
                        <TextInput
                            style={styles.textBox}
                            onChangeText={text => this.setState({
                                car1: text,
                                changeFlag: true
                            })}
                            defaultValue={this.state.car1}
                            selectTextOnFocus={true}
                        />

                        <Text style={styles.title}>Car 2:</Text>
                        <TextInput
                            style={styles.textBox}
                            onChangeText={text => this.setState({
                                car2: text,
                                changeFlag: true
                            })}
                            defaultValue={this.state.car2}
                            selectTextOnFocus={true}
                        />

                        <View style={{ height: 30 }} />

                        <Text style={styles.title}>New password:</Text>
                        <TextInput
                            style={styles.textBox}
                            secureTextEntry={true}
                            onChangeText={text => this.setState({ newpass: text })}
                            autoCapitalize='none'
                        />

                        <Text style={styles.title}>Confirm password:</Text>
                        <TextInput
                            style={styles.textBox}
                            secureTextEntry={true}
                            onChangeText={text => this.setState({ confirmpass: text })}
                            autoCapitalize='none'
                        />

                        <View style={{ height: 30 }} />

                        <Text style={styles.title}>Current password:</Text>
                        <TextInput
                            style={styles.textBox}
                            secureTextEntry={true}
                            onChangeText={text => this.setState({ currpass: text })}
                            autoCapitalize='none'
                        />

                        <View style={{ height: 10 }} />
                        <Button
                            title="Save changes"
                            onPress={() => this.saveChanges()}
                            style={styles.button}
			                color="#391961"
                        />

                        <View style={{ height: 50 }} />

                        <Button
                            title="Log out"
                            onPress={() => this.handleLogOut()}
                            style={styles.button}
			                color="#AAAAAA"
                        />

                        <View style={{ height: 250 }} />
                    </ScrollView>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    scrollView: {
        width: '90%',
        alignSelf: 'center',
        paddingBottom: 300
    },
    mainView: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: "#FFFFFF",
    },
    title: {
        fontSize: 17,
        height: '6%',
        flex: 1
    },
    textBox: {
        height: 30,
        borderColor: "gray",
        borderWidth: 2,
        borderRadius: 10,
        paddingLeft: 5,
        flex: 1
    },
    button: {
        height: 30,
    }
});
