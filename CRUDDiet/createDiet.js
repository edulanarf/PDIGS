import { View, TextInput, Text, Button, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useState } from "react";
import {db} from "../db/firebase.js";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";

export function CreateDiet(){

    const uid = "Nn8A81GXWYdmdLVWkGYReqb5Kl92";

    const [name, setName] = useState("");
    const [calorias, setCalorias] = useState("");
    const [proteinas, setProteinas] = useState("");
    const [grasas, setGrasas] = useState("");
    const [carbohidratos, setCarbohidratos] = useState("");

    const [restricciones, setRestricciones] = useState("");
    const [prohibidos, setProhibidos] = useState("");
    const [recomendados, setRecomendados] = useState("");

    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");

    const [objetivo, setObjetivo] = useState("");

    const create = async () =>{
        try{

            if (!name){
                console.log("Introduce un nombre para la dieta");
                return;
            }

            const dieta = {
                name,
                userId: uid,
                calorias: Number(calorias),
                proteinas: Number(proteinas),
                grasas: Number(grasas),
                carbohidratos: Number(carbohidratos),
                restricciones: restricciones.split(",").map(x=>x.trim()),
                alimentosProhibidos: prohibidos.split(",").map(x=>x.trim()),
                alimentosRecomendados: recomendados.split(",").map(x=>x.trim()),
                fechaInicio,
                fechaFin,
                objetivo,
                createdAt: serverTimestamp()
            };

            await setDoc(
                doc(db, `users/${uid}/dietas/${name}`),
                dieta
            );

            console.log("Dieta creada");

        } catch(error){
            console.log(error);
        }
    }

    return(

    <ScrollView contentContainerStyle={styles.container}>

        <Text style={styles.title}>Crear dieta</Text>

        <TextInput
        style={styles.input}
        placeholder="Nombre de la dieta"
        value={name}
        onChangeText={setName}
        />

        <TextInput
        style={styles.input}
        placeholder="Calorías diarias"
        value={calorias}
        onChangeText={setCalorias}
        keyboardType="numeric"
        />

        <TextInput
        style={styles.input}
        placeholder="Proteínas (g)"
        value={proteinas}
        onChangeText={setProteinas}
        keyboardType="numeric"
        />

        <TextInput
        style={styles.input}
        placeholder="Grasas (g)"
        value={grasas}
        onChangeText={setGrasas}
        keyboardType="numeric"
        />

        <TextInput
        style={styles.input}
        placeholder="Carbohidratos (g)"
        value={carbohidratos}
        onChangeText={setCarbohidratos}
        keyboardType="numeric"
        />

        <TextInput
        style={styles.input}
        placeholder="Restricciones (coma)"
        value={restricciones}
        onChangeText={setRestricciones}
        />

        <TextInput
        style={styles.input}
        placeholder="Alimentos prohibidos (coma)"
        value={prohibidos}
        onChangeText={setProhibidos}
        />

        <TextInput
        style={styles.input}
        placeholder="Alimentos recomendados (coma)"
        value={recomendados}
        onChangeText={setRecomendados}
        />

        <TextInput
        style={styles.input}
        placeholder="Fecha inicio (YYYY-MM-DD)"
        value={fechaInicio}
        onChangeText={setFechaInicio}
        />

        <TextInput
        style={styles.input}
        placeholder="Fecha fin (YYYY-MM-DD)"
        value={fechaFin}
        onChangeText={setFechaFin}
        />

        <Text style={styles.subtitle}>Objetivo</Text>

        <View style={styles.buttonRow}>

            <TouchableOpacity style={styles.optionBtn} onPress={()=>setObjetivo("ganar_masa")}>
                <Text style={styles.btnText}>Ganar masa</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionBtn} onPress={()=>setObjetivo("perder_peso")}>
                <Text style={styles.btnText}>Perder peso</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionBtn} onPress={()=>setObjetivo("mantener")}>
                <Text style={styles.btnText}>Mantener</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionBtn} onPress={()=>setObjetivo("definicion")}>
                <Text style={styles.btnText}>Definición</Text>
            </TouchableOpacity>

        </View>

        <TouchableOpacity style={styles.createBtn} onPress={create}>
            <Text style={styles.createText}>Crear dieta</Text>
        </TouchableOpacity>

    </ScrollView>

    )
}

const styles = StyleSheet.create({

container:{
padding:20,
backgroundColor:"#000",
minHeight:"100%"
},

title:{
fontSize:24,
fontWeight:"bold",
marginBottom:20,
color:"#ffffff"
},

subtitle:{
marginTop:10,
marginBottom:10,
fontSize:16,
fontWeight:"600",
color:"#ffffff"
},

input:{
backgroundColor:"#1e3a8a",
borderWidth:1,
borderColor:"#3b82f6",
padding:10,
marginBottom:10,
borderRadius:8,
color:"#ffffff"
},

buttonRow:{
flexDirection:"row",
flexWrap:"wrap",
gap:10,
marginBottom:20
},

optionBtn:{
backgroundColor:"#2563eb",
padding:10,
borderRadius:8
},

btnText:{
fontWeight:"500",
color:"#ffffff"
},

createBtn:{
backgroundColor:"#3b82f6",
padding:15,
borderRadius:10,
alignItems:"center"
},

createText:{
color:"#ffffff",
fontWeight:"bold"
}

});