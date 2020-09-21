import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, View, TextInput, KeyboardAvoidingView, Alert, Text } from 'react-native';
import {Progress} from './button';
import * as SecureStore from 'expo-secure-store';


export default class Login extends React.Component{
    state = {
        badg: '',
        code: '',
        MacAddress: null,
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
              <KeyboardAvoidingView keyboardVerticalOffset='500'>
                  <Text style={styles.textStyle}>رقم الباج</Text>
                <TextInput style={styles.input} placeholder="يرجى ادخال الرقم بالانكليزية" keyboardType='numeric' value={this.state.badg} onChangeText={this.handelbadg} />
                <Text style={styles.textStyle}>رمز التحقق</Text>
                <TextInput style={styles.input} placeholder="يؤخذ من ضابط الامن" keyboardType='numeric' value={this.state.code} onChangeText={this.handelcode} />
              </KeyboardAvoidingView>
              <Progress onPress={this.onpress} title='تسجيل دخول'/>
              </View>
          )
    }
    
  }

  const styles = StyleSheet.create({
    screen: {flex: 1, alignItems: 'center', justifyContent: 'center'},
    butn: {marginVertical: 10, marginHorizontal: 10, backgroundColor: '#8cb2ed', padding: 20, borderRadius: 5},
    input: {borderWidth: 1, margin: 15, height: 40, width: 300, padding: 10, borderRadius: 10, textAlign: 'right'},
    logo: {width: 200, height: 200, margin: 20},
    textStyle: {fontSize: 18, textAlign: 'right'},
  });
