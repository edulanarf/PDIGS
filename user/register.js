
import { createUserWithEmailAndPassword } from "firebase/auth";
import {auth} from '../db/firebase.js'
import { useState } from "react";
import { Button, TextInput, Text } from "react-native-web";

export function Register(){
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleRegister = async()=> {
        if(!email||!password){
            console.log("Faltan campos por rellenar")
            return
        }
        
        try{
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            const user = userCredential.user
            console.log(`se ha registrado el usuario ${user.email}`)
            setEmail("")
            setPassword("")
        }
        catch(error){
            console.error(error)
        }
    }

    return (
        <view>
            <Text>Register</Text>
            <TextInput placeholder="Email" value={email}></TextInput>
            <TextInput placeholder="Password" value={password}></TextInput>
            <Button title="Register" onPress={handleRegister}></Button>
        </view>
    );
}

