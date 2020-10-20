


import React, { Component } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import HomePage from "./Screens/HomePage.js";
import Admin from "./Screens/Admin.js";
import DeleteUser from "./Screens/DeleteUser";
import ProfilePage from "./Screens/ProfilePage.js";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import * as firebase from 'firebase';
import { disableExpoCliLogging } from "expo/build/logs/Logs";
import firestore from '@firebase/firestore';
import LogIn from './Screens/LogIn.js';
import SignUp from './Screens/SignUp.js';
import Loading from './Screens/Loading.js';
import * as Facebook from 'expo-facebook';
import CarparkView from "./Screens/CarparkView.js";
import BarCodeScanner from "./BarCodeScanner.js";
import LookForSpace from "./Screens/LookForSpace.js";
import ThanksForSigningUp from "./Screens/ThanksForSigningUp.js";
import GroupManage from "./Screens/GroupManage.js"
import RemoveUserFromGroup from "./Screens/RemoveUserFromGroup.js";
import GroupTuning from "./Screens/GroupTuning.js";
import Populate from "./Screens/Populate.js";
import MarketSpaces from "./Screens/MarketSpaces.js";
import {decode, encode} from 'base-64'
// i change this line into comment, and the bug disappears
// just as a test
//Facebook.initializeAsync('183404566102890', 'expo-carpark');


//  all config files are setup for firebase


const firebaseConfig = {
  apiKey: "AIzaSyBP8QSkr00xWRxyheCu8eBQT6BmanZ5T8k",
  authDomain: "expo-carpark.firebaseapp.com",
  databaseURL: "https://expo-carpark.firebaseio.com",
  projectId: "expo-carpark",
  storageBucket: "expo-carpark.appspot.com",
  messagingSenderId: "628696735344",
  appId: "1:628696735344:web:699842d748b9306e9fdeb5"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
if (!global.btoa) {  global.btoa = encode }

if (!global.atob) { global.atob = decode }
//  setup navigators 

const MainNavigator = createStackNavigator({
  Home: { screen: HomePage },
  Profile: { screen: ProfilePage },
  CarPark: {screen: CarparkView},
  BarCode: {screen: BarCodeScanner},
  LookForSpace : {screen: LookForSpace},
  Loading: {screen: Loading},
  ThanksForSigningUp: {screen: ThanksForSigningUp},
  GroupManage: {screen: GroupManage},
  Admin: {screen: Admin},
  DeleteUser: {screen: DeleteUser},
  RemoveUserFromGroup: {screen:RemoveUserFromGroup},
  GroupTuning: {screen:GroupTuning},
  Populate: {screen:Populate},
  MarketSpaces: {screen:MarketSpaces},
},
{ initialRouteName: 'Home'});

const startUpNavigator = createSwitchNavigator({
    Loading: {screen: Loading},
    SignUp: {screen: SignUp},
    LogIn: {screen: LogIn},
    ThanksForSigningUp: {screen: ThanksForSigningUp},
    MainNavigator: {screen: MainNavigator}
},
{ initialRouteName: 'Loading'});
// and start the app
const App = createAppContainer(startUpNavigator);

export default App;
