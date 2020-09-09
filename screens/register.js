import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, Text, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, View, Modal, Alert, Picker, Platform, PickerIOS} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import {Progress, Button} from './button';


export default class Register extends React.Component{
    state = {
        name: "",
        phone: null,
        badg: null, 
        selectedValue: null,
        label: 'القسم',
        code: '',
        MacAddress: null,
        modalVisibal: false,
        pickerIOS: false,
        departments: [],
        image: null,
    }
    addKeys = (val, key)=>({key: key, ...val})
    getDep = async ()=>{
        try {
            const response = await fetch('http://95.217.118.111/api/Departments/GetDepartments')
            const result = await response.json()
            if (result.code ===200){
                const departments = result.data.result.map(this.addKeys)
                this.setState({departments})
            }
            else{
                Alert.alert(result.message)
            }
        } catch (err){
            Alert.alert('خطاء بالشبكة')
        }
    }
    componentDidMount(){
        this.setState({MacAddress: this.props.route.params.MacAddress})
        this.getDep()
    }
    getPermission = async ()=>{
        const {status} = await Permissions.getAsync(Permissions.CAMERA_ROLL)
        if (status !== 'granted'){
            Alert.alert('يرجى السماح للبرنامج باستخدام الكامرة')
        }
    }
    pickImage = async () => {
        try {
          let result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [3, 4],
              quality: 1,
              base64: true,
          });
          if (!result.cancelled) {
            this.setState({ image: result.base64 });
            this.showModal()
          }
        } catch (E) {
            Alert.alert(E.message)
        }
      };
    pickCamera = async () => {
        try {
          let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [3, 4],
            quality: 1,
            base64: true,
          });
          if (!result.cancelled) {
            this.setState({ image: result.base64 });
            this.showModal()
          }
        } catch (E) {
          Alert.alert(E.message)
        }
      };
    handelname = name =>{
        this.setState({name})
    }
    handelphone = phone=>{
        if (+phone>=0 && phone.length <=11){
            this.setState({phone})
        }
    }
    handelbadg = badg=>{
        if(+badg>=0 && badg.length <= 5){
            this.setState({badg})
        }
    }
    handeldep = selectedValue=>{
        this.setState({selectedValue})
    }
    handelcode = code=>{
        if(+code >=0 && code.length <= 6){
            this.setState({code})
        }
    }
    onSave = async ()=>{
        if(this.state.name != null && this.state.name.length >=2){
                if(this.state.phone.length===11){
                    if(this.state.badg.length ===5){
                        if(this.state.selectedValue !== null){
                            if (this.state.code.length === 6){
                                this.setState({loading: true})
                                try{        
                                    const data = JSON.stringify({
                                        "DepartmentId":this.state.selectedValue,
                                        "FullName":this.state.name,
                                        "PhoneNumber":this.state.phone,
                                        "CardId":this.state.badg,
                                        "OTPCode":this.state.code,
                                        "MacAddress":this.state.MacAddress,
                                        "ImageBase64":"data:image/jpeg;base64,"+this.state.image
                                    }) 

                                    const response = await fetch("http://95.217.118.111/api/Employees/AddEmployee", {
                                        method: 'POST',
                                        headers: {"Content-Type": "application/json"},                            
                                        body: data                             
                                    })
                                    const result = await response.json()
                                    if (result.code === 200){
                                        this.props.navigation.navigate('User', {registerId: result.data.registerId})
                                        return true
                                    }else{
                                        Alert.alert(result.message)
                                    }
                                    
                                }
                                catch (err){
                                    Alert.alert(err.message)
                                }
                            }else{
                                Alert.alert('يرجى ادخال رمز تحقق صحيح')
                            }

                        }else{
                            Alert.alert('يرجى اختيار القسم')
                        }

                    }else{
                        Alert.alert('يرجى ادخال رقم باج صحيح')
                    }
                }else{
                    Alert.alert('يرجى ادخال رقم الهاتف بصورة صحيحة')
                }

        }else{
         Alert.alert('يرجى ادخال الاسم بصورة صحيحة')
        }
         return true       
    }
    showModal = ()=>{
        this.getPermission()
        this.setState(prevState=>({modalVisibal: !prevState.modalVisibal}))
    }
    showPicker = ()=>{
        this.setState(prevState=>({pickerIOS: !prevState.pickerIOS}))
    }
    cancelIOS = ()=>{
        this.setState({label: 'القسم', selectedValue: null})
        this.showPicker()
    }
    setLabel = val =>{
        this.setState({selectedValue: val})
        const lable = this.state.departments.filter(dep=> dep.departmentId === val)
        if (lable.length !==0) {
            this.setState({lable: lable[0].departmentName})
        }
    }
    render(){
        return(
            <ScrollView style={{flex: 1, marginTop:20}} contentContainerStyle={[styles.screen]}>
            <Modal animationType='slide' transparent={true} visible={this.state.modalVisibal} onRequestClose={this.showModal}>
                <View style={styles.modalScreen}>
                    <View style={[styles.modalView, {alignItems: 'center'}]}>
                        <Button onPress={this.pickCamera} title='كامرة'/>
                        <Button onPress={this.pickImage} title='مكتبة الصور'/>
                        <Button onPress={this.showModal} title='الغاء'/>
                    </View>
                </View>
            </Modal>
            <Modal animationType='fade' transparent={true} visible={this.state.pickerIOS} onRequestClose={this.showPicker}>
                <View style={styles.modalScreen}>
                    <View style={styles.modalView}>
                        <PickerIOS itemStyle={{fontSize: 20}} selectedValue={this.state.selectedValue} onValueChange={itemValue=>this.setLabel(itemValue)}>
                            <Picker.Item label="القسم" value={null} />
                            {this.state.departments.map(dep=>(
                            <Picker.Item label={dep.departmentName} value={dep.departmentId} key={dep.key} />
                        ))}
                        </PickerIOS>
                        <Button onPress={this.showPicker} title='حفظ'/>
                        <Button onPress={this.cancelIOS} title='الغاء'/>
                    </View>
                </View>
            </Modal>
              <KeyboardAvoidingView>
                  <TextInput style={styles.input} placeholder="الاسم الكامل" value={this.state.name} onChangeText={this.handelname} />
                  <TextInput style={styles.input} placeholder="رقم الهاتف" keyboardType='numeric' value={this.state.phone} onChangeText={this.handelphone} />
                  <TextInput style={styles.input} placeholder="رقم الباج" keyboardType='numeric' value={this.state.badg} onChangeText={this.handelbadg} />
                    {Platform.OS === 'ios'? (
                        <TouchableOpacity style={styles.butn} onPress={this.showPicker}><Text>{this.state.label}</Text></TouchableOpacity>
                    ):(
                        <Picker
                        mode='dropdown'
                        itemStyle={{fontSize: 20}}
                        selectedValue={this.state.selectedValue}
                        onValueChange={itemValue=>this.setState({selectedValue: itemValue})
                        }>
                        <Picker.Item label="القسم" value="القسم" />
                        {this.state.departments.map(dep=>(
                            <Picker.Item label={dep.departmentName} value={dep.departmentId} key={dep.key} />
                        ))}
                    </Picker> 
                    )}
                  <TextInput style={styles.input} placeholder="رمز التحقق" keyboardType='numeric' value={this.state.code} onChangeText={this.handelcode} />
                  <View style={{alignItems: 'center'}}>
                    <Button onPress={this.showModal} title='صورة'/>
                    <Progress onPress={this.onSave} title='حفظ البيانات'/>
                  </View>
              </KeyboardAvoidingView>
            </ScrollView>
            
          )
    }
    
  }

  const styles = StyleSheet.create({
    screen: {
        alignItems: 'center', 
        justifyContent: 'center'
    },
    modalScreen:{
        flex:1, 
        alignItems: 'center', 
        justifyContent: 'center',
    },
    butn: {
        marginVertical: 5, 
        marginHorizontal: 5, 
        backgroundColor: '#8cb2ed', 
        padding: 20, 
        borderRadius: 5
    },
    input: {
        borderWidth: 1, 
        margin: 5, 
        height: 40, 
        width: 300, 
        padding: 10
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        width: 300,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
    }
  });
