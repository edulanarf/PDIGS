
import { createUserWithEmailAndPassword} from "firebase/auth";
import { setDoc, doc } from 'firebase/firestore';
import {auth, db} from '../db/firebase.js'
import { useState } from "react";
import { View, TextInput, Text, Button, StyleSheet, KeyboardAvoidingView, Platform  } from "react-native";

export function Register({navigation}){
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")

    const handleRegister = async()=> {
        if(!email||!password){
            console.log("Faltan campos por rellenar")
            return
        }
        
        try{
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            const user = userCredential.user

            await setDoc(doc(db, "users", user.uid), {
                name: name,
                email: email
            })
            console.log(`se ha registrado el usuario ${user.email}`)
            setEmail("")
            setPassword("")
            navigation.navigate("Home")
        }
        catch(error){
            console.error(error)
        }
    }

    return (
        <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <View style={styles.container}>
                <Text>Register</Text>
                <TextInput placeholder="Username" value={name} onChangeText={setName}></TextInput>
                <TextInput placeholder="Email" value={email} onChangeText={setEmail}></TextInput>
                <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry={true}></TextInput>
                <Button title="Register" onPress={handleRegister} ></Button>
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

