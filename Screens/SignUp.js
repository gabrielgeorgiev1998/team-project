import React from 'react'
import { StyleSheet, Text, TextInput, View, Button, TouchableOpacity  } from 'react-native'
import * as firebase from 'firebase';


export default class signUp extends React.Component {
  constructor(props){
    super(props);
}

  state = { email: '', password: '', errorMessage: null }
  
  handleSignUp = () => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => this.props.navigation.navigate('ThanksForSigningUp'))
      .catch(error => this.setState({ errorMessage: error.message }))
  }
  handleGoToLogin = () => {
    this.props.navigation.navigate('LogIn')
  }

render() {
    return (
      <View style={styles.container}>
      <Text style={{color:'#391961', fontSize: 40}}>Sign Up</Text>
        {this.state.errorMessage &&
          <Text style={{ color: '#391961' }}>
            {this.state.errorMessage}
          </Text>}
        <TextInput
          placeholder="Email"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={(email) => this.setState({email})}
          value={this.state.email}
        />
        <TextInput
          secureTextEntry
          placeholder="Password"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={(password) => this.setState({password})}
          value={this.state.password}
        />
        <Button title="Sign Up" color="#391961" onPress = {this.handleSignUp}/>
        <View>
        <Text> Already have an account? <Text onPress = {this.handleGoToLogin} style={{color:'#391961', fontSize: 18}}> Log In </Text></Text>
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
});