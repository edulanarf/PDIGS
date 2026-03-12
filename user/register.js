
import { createUserWithEmailAndPassword } from "firebase/auth";
import {auth} from '../db/firebase.js'
import { useState } from "react";
import { View, TextInput, Text, Button, StyleSheet } from "react-native";

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
        <View style={styles.container}>
            <Text>Register</Text>
            <TextInput placeholder="Email" value={email} onChangeText={setEmail}></TextInput>
            <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry={true}></TextInput>
            <Button title="Register" onPress={handleRegister} ></Button>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

