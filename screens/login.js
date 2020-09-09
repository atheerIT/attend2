import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, View, TextInput, KeyboardAvoidingView, Alert, Image } from 'react-native';
import {Progress} from './button';
import * as SecureStore from 'expo-secure-store';


export default class Login extends React.Component{
    state = {
        badg: '',
        code: '',
        MacAddress: null,
        isValid: true,
    }
    checkStorge = async ()=>{
        try{
          const registerId = await SecureStore.getItemAsync('registerId')
          if (registerId !== null){
            this.props.navigation.navigate('User', {registerId: registerId})
          }else{
            this.setState(prevState =>({isValid: !prevState}))
          }
        }
        catch (err){
          Alert.alert(err.message)
        }
      }
    sStore = async (key, value)=>{
      try{
        await SecureStore.setItemAsync(key, value)
      } 
      catch (err){
          Alert.alert(err.message)
      }
    }
    handelbadg= badg=>{
        if(+badg>=0 && badg.length <= 5){
            this.setState({badg})
        }
    }
    handelcode = code => {
        if(+code >=0 && code.length <= 6){
            this.setState({code})
        }
    }
    componentDidMount(){
        this.setState({MacAddress: this.props.route.params.MacAddress})
        this.checkStorge()
    }
    
    onpress = async ()=>{
        if(this.state.badg.length===5 && this.state.code.length ===6){
            this.setState({loading: true})
            try{
                const data = new FormData()
                data.append('MacAddress', this.state.MacAddress)
                data.append('CardId', this.state.badg)
                data.append('OTPCode', this.state.code)
                const response = await fetch('http://95.217.118.111/api/employees/login', {
                    method: 'POST',
                    headers: {'content-type': 'multipart/form-data'},
                    body: data,
                })
                const result = await response.json()
                if (result.code===200){
                    //this.sStore('timeStamp', Date.now())
                    this.sStore('registerId', result.data.registerId)
                    this.props.navigation.navigate('User', {registerId: result.data.registerId})
                    return true
                }else{
                    Alert.alert(result.message)
                }
            }catch (err){
                Alert.alert(err.message)
            }            
        }else{
            Alert.alert('يرجى ادخال رقم باج او رمز تحقق صحيح')
        }
        return true
    }
    render(){
        return (
            <View style={styles.screen}>
            {this.state.isValid? (
              <Image style={styles.logo} source={require('../img/INSSLogo.jpg')}/>
              ):(
                <View style={styles.screen}>
              <KeyboardAvoidingView keyboardVerticalOffset='500'>
                <TextInput style={styles.input} placeholder="رقم الباج" keyboardType='numeric' value={this.state.badg} onChangeText={this.handelbadg} />
                <TextInput style={styles.input} placeholder="رمز التحقق" keyboardType='numeric' value={this.state.code} onChangeText={this.handelcode} />
              </KeyboardAvoidingView>
              <Progress onPress={this.onpress} title='تسجيل دخول'/>
              </View>
              )}
            </View>
          )
    }
    
  }

  const styles = StyleSheet.create({
    screen: {flex: 1, alignItems: 'center', justifyContent: 'center'},
    butn: {marginVertical: 10, marginHorizontal: 10, backgroundColor: '#8cb2ed', padding: 20, borderRadius: 5},
    input: {borderWidth: 1, margin: 15, height: 40, width: 300, padding: 10},
    logo: {width: 200, height: 200, margin: 20},
  });
