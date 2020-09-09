import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, Text, View, Image, Alert, Platform} from 'react-native';
import * as Permissions from 'expo-permissions';
import {Button} from './button';
import * as Application from 'expo-application';
import * as Network from 'expo-network';
import * as SecureStore from 'expo-secure-store';


export default class HomeScreen extends React.Component {
  state = {
    MacAddress: null,
    
  }
  getPermission = async ()=>{
    const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL)
    if(status === 'granted'){
      if(Platform.OS === 'ios'){
        const {status} = await Permissions.askAsync(Permissions.CAMERA)
        if (status !== 'granted'){
          Alert.alert('يرجى السماح للبرنامج باستخدام الكامرة والشبكة لكي يعمل البرنامج بصورة صحيحة')
        }
      }
    }
  }
  
  getIOSID = async ()=>{
      const MacAddress = await Application.getIosIdForVendorAsync()
      this.setState({MacAddress})
  }
  getAndroidMAC = async ()=>{
      const MacAddress = await Network.getMacAddressAsync()
      this.setState({MacAddress})
  }
  componentDidMount(){
    if(Platform.OS === 'ios'){
        this.getIOSID()
    }
    else{
        this.getAndroidMAC()
    }
    this.getPermission()
    
}
    onlogin = ()=>{
        return this.props.navigation.navigate('Login', {MacAddress: this.state.MacAddress})
    }
    onRegister = ()=>{
      this.props.navigation.navigate('Register', {MacAddress: this.state.MacAddress})
    }
    render(){
        return (
            <View style={styles.screen}>
             
              <View style={styles.screen}>
              <Image style={styles.logo} source={require('../img/INSSLogo.jpg')}/>
              <Text style={styles.space}>برنامج تسجيل حضور الموظفين</Text>
              <View style={styles.row}>
                <Button onPress={this.onlogin} title='تسجيل دخول'/>
                <Button onPress={this.onRegister} title='انشاء حساب'/>
              </View>
              </View>
            </View>
          )
    }
    
  }

  const styles = StyleSheet.create({
    screen: {flex: 1, alignItems: 'center', justifyContent: 'center'},
    logo: {width: 200, height: 200, margin: 20},
    space:{marginVertical: 20},
    row: {flexDirection: 'row', justifyContent: 'space-between'},
    butn: {marginVertical: 10, marginHorizontal: 10, backgroundColor: '#8cb2ed', padding: 20, borderRadius: 5},
    input: {borderWidth: 1, margin: 15, height: 40, width: 300, padding: 10}
  });
