import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, Image, View, TouchableOpacity, Text, Alert} from 'react-native';

export default class User extends React.Component{
  state = {
    img: null,
  }
  componentDidMount(){
    this.setState(prevStat=>({img: prevStat.img, ...this.props.route.params}))
    this.getQR()
    this.timer = setInterval(this.getQR, 60000)
  }
  componentWillUnmount(){
    clearInterval(this.timer)
  }
  getQR = async ()=>{
    this.setState({img: null})
    try{
      const data = new FormData()
      data.append('MacAddress', this.state.MacAddress)
      data.append('CardId', this.state.badg)
      const response = await fetch('http://95.217.118.111/api/employees/GetQRCode', {
          method: 'POST',
          headers: {'content-type': 'multipart/form-data'},
          body: data,
      })
      const result = await response.json()
      if (result.code===200){
        console.log(result)
          //this.setState({img: result.registerId})
      }else{
        console.log(result)
        //this.props.navigation.navigate('User', {...this.state})
          //Alert.alert(result.message)
      }
  }catch (err){
      Alert.alert(err.message)
  }           
  }
  onLogout = ()=>{
    console.log(this.state)
  }
    render(){
        return(
            <View style={styles.screen}>
             {this.state.img===null ?(<Image source={require('../img/Curve-Loading.gif')} style={{width: 300, height: 300}}/>):(<Image source={{uri: 'data:image/jpg;base64,'+ this.state.img}} style={{width: 300, height: 300}}/>)}
            </View>
          )
    }
    
  }

  const styles = StyleSheet.create({
    screen: {flex: 1, alignItems: 'center', justifyContent: 'center'},
    butn: {marginVertical: 10, marginHorizontal: 10, backgroundColor: '#8cb2ed', padding: 20, borderRadius: 5},
  });
