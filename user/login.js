
import { signInWithEmailAndPassword  } from "firebase/auth";
import {auth} from '../db/firebase.js'
import { useState } from "react";
import { View, TextInput, Text, Button, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";


export function Login({navigation}){
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleRegister = async()=> {
        if(!email||!password){
            console.log("Faltan campos por rellenar")
            return
        }
        
        try{
            const userCredential = await signInWithEmailAndPassword (auth, email, password)
            const user = userCredential.user
            console.log(`el usuario ${user.email} ha iniciado sesion`)
            setEmail("")
            setPassword("")
            navigation.navigate("Home");
        }
        catch(error){
            console.error(error)
        }
    }

    return (
        <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <View style={styles.container}>
                <Text>Login</Text>
                <TextInput placeholder="Email" value={email} onChangeText={setEmail}></TextInput>
                <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry={true}></TextInput>
                <Button title="Login" onPress={handleRegister} ></Button>
            </View>
        </KeyboardAvoidingView>
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