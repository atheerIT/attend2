import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import User from './screens/user';
import Register from './screens/register';
import HomeScreen from './screens/homeScreen';
import Login from './screens/login';

const Stack = createStackNavigator(); 

export default class App extends React.Component {
  
  render(){
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} options={{title: 'My home', headerShown: false}}/>
          <Stack.Screen name="Login" component={Login} options={{title: "تسجيل دخول"}} />
          <Stack.Screen name="Register" component={Register} options={{title: "انشاء حساب"}}/>
          <Stack.Screen name="User" component={User} options={{title: "QRC"}}/>
        </Stack.Navigator>
        <StatusBar style="auto"/>
    </NavigationContainer>
    )
  }
}


