import React from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'
import * as firebase from 'firebase';
import { TextInput } from "react-native-paper";

export default class Login extends React.Component {
  constructor(props){
    super(props);
  }
    
  state = { email: '', password: '', errorMessage: null }

  handleLogin = () => {
    firebase
     .auth()
     .signInWithEmailAndPassword(this.state.email, this.state.password)
     .then(() => this.props.navigation.navigate('MainNavigator'))
     .catch(error => this.setState({ errorMessage: error.message }))
  }

  handleVerifyUser = async() =>{
      var user = await firebase.auth().currentUser
      if(user.email === "admin@email.com"){
        this.props.navigation.navigate("Admin")
      }else{
        this.props.navigation.navigate("Home")
      }
  }


  render() {
    return (
      <View style={styles.container}>
        <Text style={{color:'#391961', fontSize: 40}}>Login</Text>
        {this.state.errorMessage &&
          <Text style={{ color: '#391961' }}>
            {this.state.errorMessage}
          </Text>}
        <TextInput
          style={styles.textInput}
          autoCapitalize="none"
          placeholder="Email"
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />
        <TextInput
          secureTextEntry
          style={styles.textInput}
          autoCapitalize="none"
          placeholder="Password"
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />
        <Button title="Login" color="#391961" onPress={this.handleLogin} />
        <View>
        <Text> Don't have an account? <Text onPress={() => this.props.navigation.navigate('SignUp')} style={{color:'#391961', fontSize: 18}}> Sign Up </Text></Text>
        </View>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textInput: {
    height: 40,
    fontSize:20,
    width: '90%',
    borderColor: '#9b9b9b',
    borderBottomWidth: 1,
    marginTop: 8,
    marginVertical: 15
  }
})
