import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, Image, View, Alert, Animated} from 'react-native';

export default class User extends React.Component{
  state = {
    registerId: null,
    QRcode: null,
    width: new Animated.Value(1),
  }
  animation = ()=>{
    Animated.timing(this.state.width, {
      toValue: 0,
      duration: 60000,
      useNativeDriver: true
    }).start()
  }
  componentDidMount(){
    this.setState({registerId: this.props.route.params.registerId})
    this.getQR()
    this.timer = setInterval(this.getQR, 60000)
  }
  componentWillUnmount(){
    clearInterval(this.timer)
  }
  getQR = async ()=>{
    this.setState({QRcode: null})
    try{
      const data = new FormData()
      data.append('registerId', this.state.registerId)
      const response = await fetch('http://95.217.118.111/api/employees/GetQRCode', {
          method: 'POST',
          headers: {'content-type': 'multipart/form-data'},
          body: data,
      })
      const result = await response.json()
      if (result.code===200){
        this.setState({QRcode: result.data})
        this.animation()
      }else{
        Alert.alert(result.message)
      }
  }catch (err){
      Alert.alert(err.message)
  }           
  }
  
    render(){
        return(
            <View style={styles.screen}>
             {this.state.QRcode===null ?(
             <Image source={require('../img/Curve-Loading.gif')} style={{width: 500, height: 500}}/>
             ):(
              <>
              <Animated.View style={[{width: 310, height: 310, backgroundColor: '#0086b3', borderRadius: 5},{
                transform: [{ scaleX: this.state.width }]
              } ]} />
             <Image source={{uri: 'data:image/jpeg;base64,'+ this.state.QRcode}} style={{width: 300, height: 300, position: 'absolute'}}/>
             </>
             )}
            </View>
          )
    }
    
  }

  const styles = StyleSheet.create({
    screen: {flex: 1, alignItems: 'center', justifyContent: 'center'},
    butn: {marginVertical: 10, marginHorizontal: 10, backgroundColor: '#8cb2ed', padding: 20, borderRadius: 5},
  });
