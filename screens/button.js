import React from 'react';
import AwesomeButtonRick from "react-native-really-awesome-button/src/themes/rick";

export function Progress(props){
return <AwesomeButtonRick progress width={150} style={{margin: 10}} onPress={async (next)=>{
    const finish = await props.onPress()
    if (finish){
        next()
    }
}}>{props.title}</AwesomeButtonRick>
}
export function Button(props){
return <AwesomeButtonRick type='primary'  width={150} style={{margin: 10}} onPress={props.onPress} >
    {props.title}
    </AwesomeButtonRick>
}