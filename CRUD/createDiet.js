import { View, TextInput, Text, Button, StyleSheet } from "react-native";
import { useState } from "react";
import {db, auth} from "../db/firebase.js";
import { collection, setDoc, doc } from "firebase/firestore";

export function CreateDiet(){
    const [name, setName] = useState("");
    const user = auth.currentUser;
    const create = async () =>{
        try{
            if (!name){
                console.log("Ingresa un nombre")
                return
            }
            const docRef = await setDoc(doc(db, `users/${user.uid}/dietas/${name}`),{name: name});
        } catch(error){
            console.log(error)
        }
    }
    return(
    <View>
        <TextInput placeholder="Diet Name" value={name} onChangeText={setName}></TextInput>
        <Button title="Create" onPress={create}></Button>
    </View>
    )
}